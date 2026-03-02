async function run() {
    console.log("Starting fetch...");
    try {
        const response = await fetch("http://localhost:3000/api/search-jobs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                preferences: { title: "Software developer", location: "Bangalore, India", minSalary: "600000" },
                resumeData: { name: "Muthurasu", email: "test@gmail.com", phone: "123", summary: "Node React" }
            })
        });
        console.log("Response status:", response.status);
        const data = await response.text();
        console.log("Response data:", data);
    } catch (e) {
        console.error("Fetch error:", e.message);
    }
}
run();
