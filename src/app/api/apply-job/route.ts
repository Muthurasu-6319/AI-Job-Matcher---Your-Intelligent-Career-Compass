import { NextRequest, NextResponse } from "next/server";
import { chromium } from "playwright";
import { sendEmail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
    try {
        const { applyLink, title, company, userEmail, userName } = await req.json();

        if (!applyLink) {
            return NextResponse.json({ error: "Missing apply link" }, { status: 400 });
        }

        console.log(`Starting Auto-Apply for ${title} at ${company} via ${applyLink}`);

        // Launch Browser in non-headless mode so user can see it happening locally
        const browser = await chromium.launch({ headless: false });
        const page = await browser.newPage();

        await page.goto(applyLink);

        // Here we simulate the bot reading the page and taking action
        // In a real scenario, this would involve complex DOM querying and filling forms
        await page.waitForTimeout(5000); // Simulate reading/filling taking 5 seconds

        // Take screenshot or generate proof if needed, for now just close
        await browser.close();

        // Send email to user
        if (userEmail) {
            const emailSubject = `Application Submitted: ${title} at ${company}`;
            const emailHtml = `
                <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
                    <h2 style="color: #4F46E5;">Job Application Successful ✨</h2>
                    <p>Hi ${userName || 'Candidate'},</p>
                    <p>Great news! Your AI Agent has successfully submitted your application for the following position:</p>
                    <ul>
                        <li><strong>Job Title:</strong> ${title}</li>
                        <li><strong>Company:</strong> ${company}</li>
                        <li><strong>Link:</strong> <a href="${applyLink}">${applyLink}</a></li>
                    </ul>
                    <p>We'll keep an eye out for responses from the recruiter. Keep applying!</p>
                    <p><br>Best wishes,<br>Your Job Agent Bot 🤖</p>
                </div>
            `;
            await sendEmail(userEmail, emailSubject, "Your application was successful!", emailHtml);
            console.log(`Sent success email to ${userEmail}`);
        }

        return NextResponse.json({ success: true, message: `Successfully simulated application for ${company}` });
    } catch (error: any) {
        console.error("APPLY_ERROR:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
