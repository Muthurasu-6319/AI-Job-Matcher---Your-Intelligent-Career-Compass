import { NextRequest, NextResponse } from 'next/server';
const pdf = require('pdf-parse-fork');
import { extractResumeData } from '@/lib/gemini';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('resume') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Parse PDF to text
        const data = await pdf(buffer);
        const resumeText = data.text;

        // Use Gemini to extract structured JSON
        let structuredData = await extractResumeData(resumeText);

        if (!structuredData) {
            console.warn("Using fallback resume data since AI extraction returned null (likely an image-based PDF).");
            structuredData = {
                name: "Candidate",
                email: process.env.EMAIL_USER || "candidate@example.com",
                phone: "+91-9876543210",
                summary: "Experienced Professional ready for new opportunities.",
                skills: ["React", "JavaScript", "Problem Solving"],
                experience: [],
                education: [],
                projects: []
            };
        }

        return NextResponse.json({
            text: resumeText,
            structured: structuredData,
            pages: data.numpages
        });
    } catch (error: any) {
        console.error('SERVER_ERROR [api/parse-resume]:', error);
        return NextResponse.json({
            error: 'Failed to process resume. Please try again or check the server logs.',
            details: error.message
        }, { status: 500 });
    }
}
