import Airtable from "airtable";

const base = new Airtable({
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_ACCESS_TOKEN,
}).base(process.env.NEXT_PUBLIC_BASE_ID || "");

export interface AboutData {
  logo: string;
}
export async function GET() {
  try {
    const records = await base("About")
      .select({ maxRecords: 1, view: "Grid view" })
      .all();

    // Get the first record's image field (should be an array of attachments)
    const imageField = records[0].get("image");
    let imageUrl = "";
    if (Array.isArray(imageField) && imageField.length > 0) {
      imageUrl = imageField[0].url;
    }

    return Response.json({
      image: imageUrl,
    });
  } catch (error) {
    console.error("Error fetching about image:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch about image" }),
      { status: 500 }
    );
  }
}
