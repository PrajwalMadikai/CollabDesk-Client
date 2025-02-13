import { liveblocks } from "@/lib/liveblocks-server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Received data:", body);
    const { roomId, userId, email, title } = body;

    if (!roomId || !userId || !email) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const room = await liveblocks.createRoom(roomId, {
      metadata: {
        title: title || "Untitled",
        createdBy: userId,
      },
      defaultAccesses: ["room:write"],  
      usersAccesses: {
        [email]: ["room:write"]
      },
    });
console.log('room create SUCCESS');

    return NextResponse.json({ room }, { status: 200 });
  } catch (error) {
    console.error("Error creating room:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}