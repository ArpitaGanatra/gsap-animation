import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { walletAddress } = await request.json();

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    // Validate Ethereum address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return NextResponse.json(
        { error: "Invalid wallet address format" },
        { status: 400 }
      );
    }

    const contractAddress = "0xb33df09374f80c1870766182f9ba70483e28b300";
    const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

    if (!alchemyApiKey) {
      console.error("ALCHEMY_API_KEY not found in environment variables");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Use Alchemy's NFT API for Base network - check if wallet holds NFTs from contract
    const url = `https://base-mainnet.g.alchemy.com/nft/v2/etQckx9wm2vjy_c98uVQ7nn-6kXG3jgi/isHolderOfContract?wallet=${walletAddress}&contractAddress=${contractAddress}`;

    console.log(
      `Checking if wallet holds NFTs from contract: ${contractAddress}`
    );
    console.log(`Wallet address: ${walletAddress}`);

    const options = { method: "GET" };
    const response = await fetch(url, options);
    const data = await response.json();

    console.log("Alchemy API response:", data);

    if (data.error) {
      console.error("Alchemy API Error:", data.error);
      return NextResponse.json(
        { error: "Failed to verify NFT ownership" },
        { status: 500 }
      );
    }

    // The API returns a boolean indicating if the wallet holds NFTs from the contract
    const hasNFT = data.isHolderOfContract;
    console.log(`NFT check result: ${hasNFT ? "Has NFT" : "No NFT found"}`);

    return NextResponse.json({
      hasNFT,
      walletAddress,
      contractAddress,
    });
  } catch (error) {
    console.error("Error checking NFT ownership:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
