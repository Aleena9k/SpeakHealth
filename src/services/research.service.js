import axios from "axios";

export const fetchMedicalResearch = async (conditions = []) => {
  if (!Array.isArray(conditions) || conditions.length === 0) {
    return [];
  }

  try {
    const query = conditions.join(" OR ");

    const response = await axios.post(
      "https://google.serper.dev/search",
      {
        q: `medical information about ${query} site:nih.gov OR site:medlineplus.gov OR site:mayoclinic.org OR site:clevelandclinic.org`,
        num: 5,
      },
      {
        headers: {
          "X-API-KEY": process.env.SERPER_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const results = response.data?.organic || [];

    return results.map((r) => ({
      title: r.title || "Medical Reference",
      source: new URL(r.link).hostname,
      url: r.link,
    }));
  } catch (err) {
    console.warn("Research API unavailable — using fallback");

    return [
      {
        title: "General Symptom Assessment",
        source: "Mayo Clinic",
        url: "https://www.mayoclinic.org",
      },
      {
        title: "Understanding Viral Infections",
        source: "NIH",
        url: "https://www.nih.gov",
      },
    ];
  }
};
