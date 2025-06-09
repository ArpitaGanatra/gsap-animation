import { NextResponse } from "next/server";
import Airtable from "airtable";

if (
  !process.env.NEXT_PUBLIC_AIRTABLE_ACCESS_TOKEN ||
  !process.env.NEXT_PUBLIC_BASE_ID
) {
  throw new Error("Missing Airtable credentials");
}

const base = new Airtable({
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_ACCESS_TOKEN,
}).base(process.env.NEXT_PUBLIC_BASE_ID || "");

export interface HighlightData {
  x_link: string;
}

export async function GET() {
  try {
    if (!base) {
      throw new Error("Airtable base not initialized");
    }

    const records = await base("Highlights")
      .select({
        view: "Grid view",
      })
      .all();

    console.log("records", records);

    if (!records || records.length === 0) {
      return NextResponse.json({ highlights: [] });
    }

    const highlights = records.map((record) => {
      return record.get("x_link") as string;
    });

    console.log("highlights", highlights);

    return NextResponse.json(highlights);
  } catch (error) {
    console.error("Error fetching highlights:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch highlights",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
