require('dotenv').config();

async function extractJDTopics(jdText) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.warn("No GEMINI_API_KEY found, returning mock data.");
        return getMockData();
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const prompt = `
    You are an expert technical recruiter and AI assistant. I will provide you with a Job Description (JD). 
    Your task is to extract the main technical topics, skills, and categories required for this job, and return the result in a STRICT JSON format.
    
    The JSON should have the following structure:
    {
      "job_title": "Extracted Job Title",
      "topics": [
        {
          "name": "Topic Name (e.g., React, Node.js, System Design, Soft Skills)",
          "description": "Short reason why this is needed based on JD",
          "keywords": ["keyword1", "keyword2"]
        }
      ]
    }
    
    Return ONLY the raw JSON object, without any markdown formatting like \`\`\`json.
    `;
    
    // Determine parts based on input type
    let requestParts = [{ text: prompt }];
    if (typeof jdText === 'object' && jdText.mimeType) {
        // It's an image
        requestParts.push({
            inlineData: {
                mimeType: jdText.mimeType,
                data: jdText.data
            }
        });
    } else {
        // It's text
        requestParts.push({ text: `\n\nHere is the JD:\n"""\n${jdText}\n"""` });
    }

    try {
        console.log(`[LOG] Đang gửi Request tới Gemini API (Model: gemini-2.5-flash)...`);
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: requestParts }],
                generationConfig: {
                    temperature: 0.1,
                    responseMimeType: "application/json"
                }
            })
        });

        const data = await response.json();
        if (data.error) {
            console.error(`[ERROR] Gemini API Error Details:`, JSON.stringify(data.error));
            return getMockData();
        }

        const jsonText = data.candidates[0].content.parts[0].text;
        console.log(`[LOG] Gemini xử lý thành công. Độ dài JSON nhận được: ${jsonText.length} ký tự.`);
        return JSON.parse(jsonText);
    } catch (error) {
        console.error(`[ERROR] Đã xảy ra lỗi mạng hoặc lỗi parse khi gọi Gemini API:`, error);
        return getMockData();
    }
}

function getMockData() {
    return {
        job_title: "Fullstack Developer (Mock)",
        topics: [
            {
                name: "JavaScript",
                description: "Core language for frontend and backend.",
                keywords: ["ES6", "async", "event loop"]
            },
            {
                name: "React",
                description: "Required for building the user interface.",
                keywords: ["hooks", "state", "components"]
            },
            {
                name: "Node.js",
                description: "Backend runtime environment.",
                keywords: ["express", "rest api"]
            }
        ]
    };
}

module.exports = {
    extractJDTopics
};
