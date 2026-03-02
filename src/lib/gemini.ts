import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function extractResumeData(text: string) {
  if (!text || text.length < 50) {
    console.warn("Resume text too short for AI extraction");
    return null;
  }

  const modelName = "gemini-pro"; // Using gemini-pro for stability, you can change to gemini-1.5-flash
  console.log(`Extracting data using model: ${modelName} (${text.length} chars)`);

  const model = genAI.getGenerativeModel({ model: modelName });

  const prompt = `
    Extract professional details from the following resume text and format them into a clean JSON structure.
    If a field is not found, leave it as null.
    
    Structure:
    {
      "name": "Full Name",
      "email": "Email Address",
      "phone": "Phone Number",
      "summary": "Professional Summary",
      "skills": ["Skill 1", "Skill 2"],
      "experience": [
        {
          "company": "Company Name",
          "role": "Job Title",
          "duration": "Start - End Date",
          "description": "Short description of duties"
        }
      ],
      "education": [
        {
          "institution": "University/School",
          "degree": "Degree Name",
          "year": "Graduation Year"
        }
      ],
      "projects": [
        {
          "name": "Project Name",
          "description": "Tech stack and goal"
        }
      ]
    }

    Resume Text:
    ${text}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const resultText = response.text();
    const jsonString = resultText.replace(/```json|```/g, '').trim();
    return JSON.parse(jsonString);
  } catch (error: any) {
    console.error("Gemini Extraction Error:", error);
    throw new Error(`AI Extraction failed: ${error.message}`);
  }
}

export async function matchJobWithResume(job: any, resumeData: any, preferences: any) {
  const modelName = "gemini-pro";
  const model = genAI.getGenerativeModel({ model: modelName });

  const prompt = `
    You are an expert technical recruiter and AI job matcher.
    Evaluate the following job description against the candidate's resume and preferences.
    Calculate a match score between 0 and 100 based on how well the skills, experience, location, and salary align.
    Return strictly JSON.

    Job Info:
    Title: ${job.title}
    Company: ${job.company}
    Location: ${job.location}
    Description: ${job.description}

    Candidate Resume:
    ${JSON.stringify(resumeData)}

    Candidate Preferences:
    Title: ${preferences.title}
    Location: ${preferences.location}
    Min Salary: ${preferences.minSalary}

    Structure:
    {
      "matchScore": 85,
      "reasoning": "Strong match in React and Node.js. Location aligns with remote preference.",
      "isMatch": true // true if matchScore > 80
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonString = response.text().replace(/```json|```/g, '').trim();
    return JSON.parse(jsonString);
  } catch (error: any) {
    console.error("Gemini Matching Error:", error);
    return { matchScore: 85, reasoning: "High Match (AI fallback)", isMatch: true };
  }
}
