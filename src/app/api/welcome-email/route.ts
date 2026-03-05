import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
    try {
        const { email, name } = await req.json();

        if (!email || !name) {
            return NextResponse.json({ error: "Email and name are required." }, { status: 400 });
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"AI JobBot 🚀" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Welcome to AI JobBot! 🚀",
            html: `
                <div style="font-family: Arial, sans-serif; background-color: #f4f4f5; padding: 40px; color: #18181b;">
                    <div style="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                        <h1 style="color: #4f46e5; margin-bottom: 20px; font-size: 28px;">Welcome aboard, ${name}! 🎉</h1>
                        <p style="font-size: 16px; line-height: 1.6; color: #52525b;">
                            We are thrilled to have you join <strong>AI JobBot</strong>! Your intelligent career compass is ready to start scanning the market for the best opportunities tailored specifically to your resume.
                        </p>
                        <p style="font-size: 16px; line-height: 1.6; color: #52525b;">
                            To get started:
                            <ul style="padding-left: 20px;">
                                <li>Head over to your <strong>Profile Dashboard</strong>.</li>
                                <li><strong>Upload your Resume PDF</strong> so our AI can automatically fill your profile.</li>
                                <li>Set your target job roles, locations, and salary.</li>
                                <li>Sit back and let the AI bring the perfect jobs directly to your feed!</li>
                            </ul>
                        </p>
                        <br/>
                        <a href="http://localhost:3000/dashboard/profile" style="display: inline-block; background-color: #4f46e5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px;">Complete Your Profile Now</a>
                        <br/><br/><br/>
                        <p style="font-size: 14px; color: #a1a1aa; border-top: 1px solid #e4e4e7; padding-top: 20px;">
                            Cheers,<br/>
                            <strong>The AI JobBot Team</strong>
                        </p>
                    </div>
                </div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Welcome email sent: " + info.response);

        return NextResponse.json({ success: true, message: "Welcome email sent successfully." });
    } catch (error: any) {
        console.error("Email sending error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
