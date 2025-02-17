import { liveblocks } from "@/lib/liveblocks-server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roomId, userId, email } = body;
   
    if (!roomId || !userId || !email) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    try {
      const room = await liveblocks.getRoom(roomId);
      
      await liveblocks.updateRoom(roomId, {
        usersAccesses: {
          [email]: ["room:write"],
        },
      });

      return NextResponse.json({ success: true }, { status: 200 });
    } catch (roomError) {
      // If room doesn't exist, create it
      const newRoom = await liveblocks.createRoom(roomId, {
        metadata: {
          createdBy: userId,
        },
        defaultAccesses: ["room:write"],
        usersAccesses: {
          [email]: ["room:write"],
        },
      });
      console.log('room access SUCCESS');
      return NextResponse.json({ success: true, room: newRoom }, { status: 200 });
    }
  } catch (error) {
    console.error("Error managing room access:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}