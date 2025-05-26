import Airtable from "airtable";

const base = new Airtable({
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_ACCESS_TOKEN,
}).base(process.env.NEXT_PUBLIC_BASE_ID || "");

export interface CompanyData {
  guest: string;
  company: string;
  category: string;
  image: string; // This will be the URL
  episode: string;
}

export async function GET() {
  try {
    const records = await base("Company")
      .select({ sort: [{ field: "episode", direction: "asc" }] })
      .all();

    const companies = records.map((record) => {
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
        guest: record.get("guest"),
        company: record.get("company"),
        category: record.get("category"),
        image: imageUrl,
        episode: record.get("episode")?.toString() || "",
      };
    });

    return Response.json(companies);
  } catch (error) {
    console.error("Error fetching companies:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch companies" }),
      { status: 500 }
    );
  }
}
