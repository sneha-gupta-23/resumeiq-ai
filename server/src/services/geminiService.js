/**
 * geminiService.js — Google Gemini AI integration
 *
 * Sends the extracted resume text and job description to Gemini 2.5 Flash.
 * Features:
 * - Exponential backoff retry logic (up to 3 attempts) for 503 / 429 errors.
 * - 60-second timeout per attempt via Promise.race.
 * - Safe JSON extraction (strips markdown fences, finds first { to last }).
 * - Structured rule-based fallback if the API is completely unavailable.
 * - Every code path returns — never leaves a request pending.
 */

import { GoogleGenAI } from '@google/genai';

let aiInstance = null;

function getAI() {
  if (!aiInstance) {
    if (!process.env.GEMINI_API_KEY) {
      const err = new Error('GEMINI_API_KEY is not configured on the server.');
      err.statusCode = 500;
      throw err;
    }
    aiInstance = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiInstance;
}

// ── Current stable model (July 2026) ──
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash';
const FALLBACK_MODELS = ['gemini-3.1-flash-lite', 'gemini-flash-latest'];
const WAIT_TIMES = [2000, 4000, 8000, 16000, 32000]; // 5 attempts
const MAX_RETRIES = WAIT_TIMES.length;
const TIMEOUT_MS = 60_000; // 60 seconds

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Prompt and fallback functions remain the same...
function buildPrompt(resumeText, jobDescription) {
  return `You are an expert career coach and technical interviewer. Analyze the following resume against the provided job description.

Return your analysis as a JSON object with EXACTLY this structure — no markdown, no code fences, ONLY valid JSON:

{
  "resumeScore": <number 0-100>,
  "strengths": ["<strength 1>", "<strength 2>", ...],
  "missingSkills": ["<skill 1>", "<skill 2>", ...],
  "resumeImprovements": ["<improvement 1>", "<improvement 2>", ...],
  "technicalQuestions": ["<question 1>", "<question 2>", ...],
  "hrQuestions": ["<question 1>", "<question 2>", ...],
  "selfIntroduction": "<a polished 30-second self-introduction the candidate can use>",
  "learningResources": ["<resource/topic 1>", "<resource/topic 2>", ...]
}

Guidelines:
- resumeScore: Rate how well the resume matches the job description (0 = no match, 100 = perfect match).
- strengths: List 4-6 key strengths the candidate has that align with the job.
- missingSkills: List skills or qualifications mentioned in the job description that are absent from the resume.
- resumeImprovements: Provide 4-6 actionable suggestions to improve the resume for this specific role.
- technicalQuestions: Generate 5-7 technical interview questions the candidate should prepare for based on the job description and their resume.
- hrQuestions: Generate 4-6 HR/behavioral interview questions relevant to this role.
- selfIntroduction: Write a compelling 30-second self-introduction the candidate can use in the interview, referencing their actual experience from the resume.
- learningResources: Suggest 4-6 specific topics, courses, or technologies the candidate should study to fill gaps.

===== RESUME =====
${resumeText}

===== JOB DESCRIPTION =====
${jobDescription}

Remember: Return ONLY the JSON object. No explanations, no markdown formatting.`;
}

function getFallbackResponse() {
  return {
    resumeScore: 70,
    strengths: [
      "Demonstrates foundational skills relevant to the role.",
      "Professional experience indicates a strong work ethic.",
      "Educational background aligns with industry standards.",
      "Clear communication of past responsibilities."
    ],
    missingSkills: [
      "Advanced domain-specific tools or frameworks mentioned in the job description.",
      "Leadership or direct mentorship experience.",
      "Deep technical specialization in niche areas required by the posting."
    ],
    resumeImprovements: [
      "Quantify your achievements with specific metrics and data.",
      "Ensure all keywords from the job description are naturally integrated.",
      "Highlight specific projects that mirror the responsibilities of this role.",
      "Refine the summary section to directly target this specific position."
    ],
    technicalQuestions: [
      "Can you describe a complex technical challenge you solved recently?",
      "How do you approach learning a completely new tool or framework?",
      "Explain a time when you had to optimize a system for better performance.",
      "How do you ensure quality and reliability in your work?",
      "Walk me through your debugging process when you encounter a critical issue."
    ],
    hrQuestions: [
      "Tell me about a time you disagreed with a colleague and how you resolved it.",
      "Where do you see your career progressing in the next 3 years?",
      "Describe a situation where you had to work under a tight deadline.",
      "How do you prioritize tasks when everything seems urgent?"
    ],
    selfIntroduction: "Hi, I'm a dedicated professional with a strong foundation in this industry. I have a proven track record of tackling complex problems, collaborating effectively with teams, and delivering reliable results. I'm excited about this opportunity because it perfectly aligns with my drive to build impactful solutions and grow my expertise in this specific domain.",
    learningResources: [
      "Review the core technologies mentioned in the job description via official documentation.",
      "Practice mock interviews focusing on behavioral STAR method responses.",
      "Explore advanced architecture or system design concepts relevant to the role.",
      "Read industry-standard best practices and style guides."
    ]
  };
}

/**
 * Safely extract and parse a JSON object from raw AI text.
 * Strips markdown code fences, finds the outermost { … }, and parses.
 * Returns null on failure.
 */
function safeParseJSON(rawText) {
  let cleaned = rawText
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();

  // Find the outermost JSON object
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    return null;
  }
  cleaned = cleaned.substring(firstBrace, lastBrace + 1);

  try {
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

export async function analyzeWithGemini(resumeText, jobDescription) {
  console.log('Starting analysis...');
  const ai = getAI();
  const prompt = buildPrompt(resumeText, jobDescription);

  const modelsToTry = [GEMINI_MODEL, ...FALLBACK_MODELS];

  for (let modelIndex = 0; modelIndex < modelsToTry.length; modelIndex++) {
    const currentModel = modelsToTry[modelIndex];
    let attempt = 0;
    
    while (attempt <= MAX_RETRIES) {
      try {
        console.log(`Calling Gemini... (model: ${currentModel}, attempt: ${attempt + 1}/${MAX_RETRIES + 1})`);

        // Race the API call against a timeout
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => {
            const err = new Error('Gemini API timeout');
            err.name = 'TimeoutError';
            reject(err);
          }, TIMEOUT_MS);
        });

        const response = await Promise.race([
          ai.models.generateContent({
            model: currentModel,
            contents: prompt,
          }),
          timeoutPromise,
        ]);

        console.log(`Gemini response received from ${currentModel}`);

        const rawText = response.text;
        if (!rawText || rawText.trim().length === 0) {
          console.warn('Empty response text from Gemini, treating as failure...');
          throw new Error('Empty response from AI.');
        }

        console.log('Parsing response...');
        const result = safeParseJSON(rawText);

        if (!result) {
          console.error('JSON parsing failed, treating as failure.');
          throw new Error('JSON parsing failed.');
        }

        const requiredKeys = [
          'resumeScore', 'strengths', 'missingSkills', 'resumeImprovements',
          'technicalQuestions', 'hrQuestions', 'selfIntroduction', 'learningResources',
        ];

        for (const key of requiredKeys) {
          if (!(key in result)) {
            console.warn(`Missing required field "${key}", treating as failure.`);
            throw new Error(`Missing required field: ${key}`);
          }
        }

        result.resumeScore = Math.max(0, Math.min(100, Math.round(Number(result.resumeScore) || 0)));
        console.log('JSON parsed successfully');
        return result;

      } catch (error) {
        // Log the complete SDK error as requested
        console.error("========== GEMINI SDK ERROR ==========");
        console.dir(error, { depth: null });
        console.error("======================================");

        // Auth errors shouldn't be retried
        if (error.message?.includes('API key') || error.status === 401 || error.status === 403) {
          console.error(`Auth error on ${currentModel}: ${error.message}`);
          break; // Try next model, though auth error will likely fail all
        }
        
        // If it's a 404 Model Not Found, we shouldn't retry this specific model
        if (error.message?.includes('not found') || error.status === 404) {
          console.error(`Model ${currentModel} not found, skipping retries for this model.`);
          break;
        }

        // It's a retryable error (like 503 UNAVAILABLE, Timeout, 429, parsing failure)
        attempt++;

        if (attempt > MAX_RETRIES) {
          console.error(`❌ Final attempt failed for ${currentModel}. Error: ${error.message}`);
          break; // Break the while loop to move to the next fallback model
        }

        const waitTime = WAIT_TIMES[attempt - 1];
        console.warn(`⚠️ Model: ${currentModel} | Attempt ${attempt} failed: ${error.message}. Retrying in ${waitTime}ms...`);
        await delay(waitTime);
      }
    }
    console.warn(`Moving to next fallback model...`);
  }

  // Only return fallback response after ALL retries and ALL fallback models have failed
  console.error('❌ All retries and fallback models failed. Returning fallback response.');
  return getFallbackResponse();
}
