import { NextRequest, NextResponse } from "next/server";
import { chromium } from "playwright";

export async function POST(req: NextRequest) {
    try {
        const { link } = await req.json();

        if (!link) {
            return NextResponse.json({ error: "Missing job link" }, { status: 400 });
        }

        console.log(`Fetching full job details for: ${link}`);

        // Launch Browser in headless mode for quick scraping
        const browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();

        await page.goto(link, { waitUntil: 'domcontentloaded' });

        let fullDescription = "No full description available.";
        let seniority = "Not specified";
        let employmentType = "Not specified";

        try {
            // Wait a little bit for the content to render
            await page.waitForTimeout(2000);

            // Try clicking "Show more" if present (LinkedIn specific)
            const showMoreBtn = await page.$('button[data-tracking-control-name="public_jobs_show-more-html-btn"]');
            if (showMoreBtn) await showMoreBtn.click();
            await page.waitForTimeout(500);

            // Extract Description
            const descEl = await page.$('.show-more-less-html__markup, .description__text, .core-section-container__content');
            if (descEl) {
                fullDescription = (await descEl.innerText()) || fullDescription;
            }

            // Extract Criteria (Seniority, Employment Type)
            const criteriaList = await page.$$eval('.description__job-criteria-list .description__job-criteria-item', items => {
                return items.map(item => {
                    const header = item.querySelector('.description__job-criteria-subheader')?.textContent?.trim() || '';
                    const value = item.querySelector('.description__job-criteria-text')?.textContent?.trim() || '';
                    return { header, value };
                });
            });

            for (const item of criteriaList) {
                if (item.header.toLowerCase().includes('seniority')) seniority = item.value;
                if (item.header.toLowerCase().includes('employment')) employmentType = item.value;
            }

        } catch (e) {
            console.warn("Error extracting specific elements, returning partial data.");
        }

        await browser.close();

        return NextResponse.json({
            fullDescription,
            seniority,
            employmentType
        });
    } catch (error: any) {
        console.error("JOB_DETAILS_ERROR:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
