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

// Interface for company data
export interface CompanyData {
  guest: string;
  company: string;
  category: string;
  image: string; // This will be the URL
  episode: string;
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
export async function getAllCompanies(): Promise<CompanyData[]> {
  try {
    const records = await base("Company")
      .select({
        sort: [{ field: "episode", direction: "asc" }],
      })
      .all();

    return records.map((record) => {
      // Handle image field as an array of attachments
      const imageField = record.get("image");
      let imageUrl = "";
      if (
        Array.isArray(imageField) &&
        imageField.length > 0 &&
        imageField[0].url
      ) {
        imageUrl = imageField[0].url;
      }
      return {
        guest: record.get("guest") as string,
        company: record.get("company") as string,
        category: record.get("category") as string,
        image: imageUrl,
        episode: record.get("episode")?.toString() || "",
      };
    });
  } catch (error) {
    console.error("Error fetching companies:", error);
    return [];
  }
}
