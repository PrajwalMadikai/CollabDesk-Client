import { RoomServiceClient } from 'livekit-server-sdk';
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const roomName = url.searchParams.get("room");

  if (!roomName) {
    return NextResponse.json({ error: "Missing room parameter" }, { status: 400 });
  }

  try {
    const apiKey = process.env.NEXT_PUBLIC_LIVEKIT_API_KEY;
    const apiSecret = process.env.NEXT_PUBLIC_LIVEKIT_API_SECRET;
    const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;
    const livekitHost = process.env.NEXT_PUBLIC_LIVEKIT_API

    if (!apiKey || !apiSecret || !wsUrl || !livekitHost) {
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
    }


    const roomService = new RoomServiceClient(livekitHost, apiKey, apiSecret);
    const participants = await roomService.listParticipants(roomName);
    console.log('participants:',participants);
    

    const formattedParticipants = participants.map(participant => ({
      sid: participant.sid,
      identity: participant.identity,
      state: participant.state,
      joinedAt: participant.joinedAt,
      name: participant.name,
    }));

    return NextResponse.json({ participants: formattedParticipants }, { status: 200 });
  } catch (error) {
    console.error("Error fetching participants:", error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Failed to fetch participants"
    }, { status: 500 });
  }
}
