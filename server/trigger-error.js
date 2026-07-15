

async function testApi() {
  try {
    const formData = new FormData();
    // Provide enough characters for job description to pass validation
    formData.append('jobDescription', 'This is a valid job description with at least twenty characters to pass validation.');
    
    // Create a dummy PDF blob
    const pdfBlob = new Blob(['%PDF-1.4\n1 0 obj\n<<\n/Title (Dummy PDF)\n>>\nendobj\ntrailer\n<<\n/Root 1 0 R\n>>\n%%EOF'], { type: 'application/pdf' });
    formData.append('resume', pdfBlob, 'resume.pdf');

    const response = await fetch('http://localhost:5000/api/analyze', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Test script failed:", error);
  }
}

testApi();
