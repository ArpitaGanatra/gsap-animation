import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { name, telegram, twitter, walletAddress, proofOfWork } =
      await request.json();

    // Validate required fields
    if (!name || !telegram || !twitter || !walletAddress || !proofOfWork) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate wallet address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return NextResponse.json(
        { error: "Invalid wallet address format" },
        { status: 400 }
      );
    }

    const airtableApiKey = process.env.NEXT_PUBLIC_AIRTABLE_ACCESS_TOKEN;
    const baseId = process.env.NEXT_PUBLIC_BASE_ID;

    if (!airtableApiKey || !baseId) {
      console.error("Airtable configuration missing");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Prepare data for Airtable
    const airtableData = {
      records: [
        {
          fields: {
            name: name,
            telegram: telegram,
            twitter: twitter,
            wallet_address: walletAddress,
            pow: proofOfWork,
          },
        },
      ],
    };

    console.log("Submitting to Airtable:", airtableData);

    // Submit to Airtable
    const response = await fetch(
      `https://api.airtable.com/v0/${baseId}/rsdnts`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${airtableApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(airtableData),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("Airtable API Error:", result);
      return NextResponse.json(
        { error: "Failed to submit application" },
        { status: 500 }
      );
    }

    console.log("Application submitted successfully:", result);

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully",
      recordId: result.records?.[0]?.id,
    });
  } catch (error) {
    console.error("Error submitting application:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
