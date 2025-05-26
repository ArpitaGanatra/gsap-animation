import Airtable from "airtable";
import { NextRequest } from "next/server";

export interface EpisodeData {
  name: string;
  company: string;
  topic: string;
  thumbnail: string;
  link: string;
  mintLink?: string;
}

const base = new Airtable({
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_ACCESS_TOKEN,
}).base(process.env.NEXT_PUBLIC_BASE_ID || "");

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const company = searchParams.get("company");

  if (!company) {
    return new Response(JSON.stringify({ error: "Company is required" }), {
      status: 400,
    });
  }

  try {
    const records = await base("Playlist")
      .select({
        filterByFormula: `{company} = '${company}'`,
        sort: [{ field: "episode_id", direction: "asc" }],
      })
      .all();

    if (!records || records.length === 0) {
      console.log(`No records found for company: ${company}`);
      return [];
    }

    return Response.json(
      records.map((record) => ({
        name: record.get("name") as string,
        company: record.get("company") as string,
        topic: record.get("topic") as string,
        thumbnail: record.get("thumbnail") as string,
        link: record.get("link") as string,
        mintLink: record.get("mintLink") as string | undefined,
      }))
    );
  } catch (error) {
    console.error("Error fetching podcasts:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch podcasts" }), {
      status: 500,
    });
  }
}
