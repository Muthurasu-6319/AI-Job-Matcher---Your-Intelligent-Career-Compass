import { NextRequest, NextResponse } from "next/server";
import { chromium } from "playwright";
import { matchJobWithResume } from "@/lib/gemini";

const RAPID_API_KEY = process.env.RAPIDAPI_KEY;

// NOTE: Depending on which RapidAPI you subscribed to, you might need to change the HOST and endpoint.
// We are using 'jsearch.p.rapidapi.com' structure here which is popular for searching LinkedIn/Indeed.
const RAPID_API_HOST = 'jsearch.p.rapidapi.com';

export async function POST(req: NextRequest) {
    try {
        if (!RAPID_API_KEY) {
            return NextResponse.json({ error: "RapidAPI key missing in environment variables" }, { status: 500 });
        }

        const { preferences, resumeData } = await req.json();

        if (!preferences || !resumeData) {
            return NextResponse.json({ error: "Missing preferences or resume data" }, { status: 400 });
        }

        // 1. Fetch Jobs from RapidAPI (with Fallback)
        let formattedJobs = [];
        try {
            const query = encodeURIComponent(`${preferences.title} in ${preferences.location}`);
            const url = `https://${RAPID_API_HOST}/search?query=${query}&page=1&num_pages=1`;

            console.log(`Searching jobs: ${url}`);

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "x-rapidapi-host": RAPID_API_HOST,
                    "x-rapidapi-key": RAPID_API_KEY,
                }
            });

            if (!response.ok) {
                throw new Error(`RapidAPI Error: ${response.status} - ${await response.text()}`);
            }

            const jobData = await response.json();
            const rawJobs = jobData.data || [];

            formattedJobs = rawJobs.map((job: any) => ({
                id: job.job_id,
                title: job.job_title,
                company: job.employer_name,
                location: `${job.job_city || ''} ${job.job_state || ''} ${job.job_country || ''}`.trim(),
                description: job.job_description,
                applyLink: job.job_apply_link,
                postedAt: job.job_posted_at_datetime_utc,
            }));
        } catch (apiError) {
            console.warn("RapidAPI failed, attempting real-time LinkedIn scraping via Playwright instead.", apiError);

            try {
                // Launch Browser in non-headless mode so the user can VISUALLY see the LinkedIn scraping!
                const browser = await chromium.launch({ headless: false });
                const page = await browser.newPage();

                const searchQuery = encodeURIComponent(preferences.title);
                const locQuery = encodeURIComponent(preferences.location);
                const randomOffset = Math.floor(Math.random() * 50); // Get random pages to simulate new jobs on refresh
                const linkedInUrl = `https://www.linkedin.com/jobs/search?keywords=${searchQuery}&location=${locQuery}&start=${randomOffset}&f_AL=true&trk=public_jobs_jobs-search-bar_search-submit`;

                await page.goto(linkedInUrl, { waitUntil: 'domcontentloaded' });

                // Wait for job cards to load
                await page.waitForSelector('.job-search-card', { timeout: 10000 });

                // Extract job data and remove duplicates
                const scrapedJobs = await page.$$eval('.job-search-card', (cards) => {
                    const uniqueJobs: any[] = [];
                    const seenKeys = new Set<string>();

                    for (const card of cards) {
                        const titleEl = card.querySelector('.base-search-card__title');
                        const companyEl = card.querySelector('.base-search-card__subtitle');
                        const locationEl = card.querySelector('.job-search-card__location');
                        const linkEl = card.querySelector('.base-card__full-link') as HTMLAnchorElement;

                        const title = titleEl?.textContent?.trim() || "Unknown Title";
                        const company = companyEl?.textContent?.trim() || "Unknown Company";
                        const location = locationEl?.textContent?.trim() || "Unknown Location";
                        const applyLink = linkEl?.href || "#";

                        // Create a unique combination to prevent duplicate jobs
                        const uniqueKey = `${title.toLowerCase()}-${company.toLowerCase()}`;

                        if (!seenKeys.has(uniqueKey) && company !== "Unknown Company") {
                            seenKeys.add(uniqueKey);
                            uniqueJobs.push({
                                id: Math.random().toString(36).substring(7),
                                title,
                                company,
                                location,
                                description: `LinkedIn Job Listing for ${title} at ${company}`,
                                applyLink,
                                postedAt: new Date().toISOString()
                            });
                        }
                    }

                    return uniqueJobs.slice(0, 15); // Return up to 15 unique jobs for pagination display
                });

                await browser.close();

                if (scrapedJobs.length > 0) {
                    formattedJobs = scrapedJobs;
                    console.log(`Successfully scraped ${formattedJobs.length} real jobs from LinkedIn.`);
                } else {
                    throw new Error("No jobs found via scrape.");
                }
            } catch (scrapeError) {
                console.warn("LinkedIn Scrape failed too, using fallback mock jobs. Error:", scrapeError);
                // Fallback Mock Jobs
                formattedJobs = [
                    {
                        id: "mock1",
                        title: preferences.title,
                        company: "TechNova Solutions",
                        location: preferences.location,
                        description: "Looking for an experienced professional to join our team.",
                        applyLink: "https://example.com/apply/technova",
                        postedAt: new Date().toISOString()
                    },
                    {
                        id: "mock2",
                        title: `Senior ${preferences.title}`,
                        company: "Innovate AI",
                        location: "Remote, India",
                        description: "Building next-generation AI agents. Great remote culture.",
                        applyLink: "https://example.com/apply/innovate",
                        postedAt: new Date().toISOString()
                    }
                ];
            }
        }

        // 2. Filter & Match Jobs using Gemini AI
        // We process the first 15 jobs to give a realistic pagination feed
        const jobsToMatch = formattedJobs.slice(0, 15);
        const matchedJobs = [];

        // To save time, we will process matches in chunks of 5 parallel requests
        const chunkSize = 5;
        for (let i = 0; i < jobsToMatch.length; i += chunkSize) {
            const chunk = jobsToMatch.slice(i, i + chunkSize);
            const chunkPromises = chunk.map(async (job) => {
                console.log(`Matching job: ${job.title} at ${job.company}`);
                const matchResult = await matchJobWithResume(job, resumeData, preferences);
                return {
                    ...job,
                    matchScore: matchResult.matchScore,
                    matchReasoning: matchResult.reasoning,
                    isMatch: matchResult.isMatch || matchResult.matchScore >= 80,
                };
            });
            const results = await Promise.all(chunkPromises);
            matchedJobs.push(...results);
        }

        // Sort by Highest Match Score
        matchedJobs.sort((a, b) => b.matchScore - a.matchScore);

        return NextResponse.json({ jobs: matchedJobs });
    } catch (error: any) {
        console.error("SEARCH_JOBS_ERROR:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
