import Airtable from "airtable";

// Initialize Airtable
Airtable.configure({
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_ACCESS_TOKEN,
});

// Use the correct base ID from the Airtable URL
const base = Airtable.base("appCPvC7s1GSpL9YK");

// Interface for episode data
export interface EpisodeData {
  name: string;
  company: string;
  topic: string;
  thumbnail: string;
  link: string;
  mintLink?: string;
}

// Function to fetch episodes by company
export async function getEpisodesByCompany(
  company: string
): Promise<EpisodeData[]> {
  try {
    console.log("Fetching episodes for company:", company);

    const records = await base("Playlist")
      .select({
        filterByFormula: `{company} = '${company}'`,
        sort: [{ field: "episode_id", direction: "asc" }],
      })
      .all();

    console.log("Records found:", records.length);

    if (!records || records.length === 0) {
      console.log(`No records found for company: ${company}`);
      return [];
    }

    return records.map((record) => ({
      name: record.get("name") as string,
      company: record.get("company") as string,
      topic: record.get("topic") as string,
      thumbnail: record.get("thumbnail") as string,
      link: record.get("link") as string,
      mintLink: record.get("mintLink") as string | undefined,
    }));
  } catch (error) {
    console.error("Error fetching episodes:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
      console.error("Error stack:", error.stack);
    }
    return [];
  }
}

// Function to fetch all companies
export async function getAllCompanies(): Promise<string[]> {
  try {
    const records = await base("imported table")
      .select({
        fields: ["company"],
        sort: [{ field: "episode_id", direction: "asc" }],
      })
      .all();

    // Get unique companies
    const companies = new Set(
      records.map((record) => record.get("company") as string)
    );
    return Array.from(companies);
  } catch (error) {
    console.error("Error fetching companies:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
      console.error("Error stack:", error.stack);
    }
    return [];
  }
}
