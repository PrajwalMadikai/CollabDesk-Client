import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const room = url.searchParams.get("room");

  if (!room) {
    return NextResponse.json({ error: "Missing room parameter" }, { status: 400 });
  }

  try {
    const apiKey = process.env.NEXT_PUBLIC_LIVEKIT_API_KEY;
    const apiSecret = process.env.NEXT_PUBLIC_LIVEKIT_API_SECRET;
    const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

    if (!apiKey || !apiSecret || !wsUrl) {
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
    }

    const response = await axios.get(`${wsUrl}/room/${room}/participants`, {
      headers: {
        Authorization: `Bearer ${apiSecret}`,
      },
    });

    return NextResponse.json({ participants: response.data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching participants:", error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: "Failed to fetch participants" }, { status: 500 });
  }
}