import { NextRequest, NextResponse } from "next/server";
import { liveblocks } from "../../../lib/liveblocks-server";


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roomId } = body;
    
    if (!roomId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

   

    try {
        await liveblocks.getRoom(roomId);
      
      await liveblocks.updateRoom(roomId, {
        defaultAccesses: ["room:read", "room:presence:write"],
      });
      
      return NextResponse.json({ success: true }, { status: 200 });
    } catch (roomError) {
      console.log('Room error:',roomError);
      
      const newRoom = await liveblocks.createRoom(roomId, {
        defaultAccesses: ["room:read", "room:presence:write"],
      });

      console.log("Room created with strict read-only access");
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