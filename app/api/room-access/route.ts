import { NextRequest, NextResponse } from "next/server";
import { liveblocks } from "../../../lib/liveblocks-server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roomId, userId, email, title } = body;
   
    if (!roomId || !userId || !email) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized: Missing token" },
        { status: 401 }
      );
    }
   
    
    try { 

      await liveblocks.getRoom(roomId);
      
      await liveblocks.updateRoom(roomId, {
        metadata: {
          title: title || "Untitled",
          createdBy: userId,
          lastUpdated: new Date().toISOString(),
        },
        usersAccesses: {
          [email]: ["room:write"],
        },
      });

      return NextResponse.json({ success: true }, { status: 200 });
    } catch (roomError) {
      console.log('Room Error:',roomError);
      
      const newRoom = await liveblocks.createRoom(roomId, {
        metadata: {
          title: title || "Untitled",
          createdBy: userId,
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
        },
        defaultAccesses: ["room:write"],
        usersAccesses: {
          [email]: ["room:write"],
        },
      });
      
      console.log('Room created successfully with ID:', roomId);
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