import { liveblocks } from "@/lib/liveblocks-server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Creating room with data:', body);
    
    const { userId, email, title, roomId } = body;
    
    if (!userId || !email || !roomId) {
      return NextResponse.json(
        { message: 'Missing required fields: userId, email, or roomId' },
        { status: 400 }
      );
    }

    const metadata = {
      userId,
      email,
      title: title || 'Untitled',
    };

    const usersAccesses = {
      [email]: ["room:write"] as ["room:write"]
    };

    console.log('Creating Liveblocks room with:', {
      roomId,
      metadata,
      usersAccesses
    });

    const room = await liveblocks.createRoom(roomId, {
      metadata,
      usersAccesses,
      defaultAccesses: ["room:write"],
    });

    console.log('Room created successfully:', room);

    return NextResponse.json({ room }, { status: 200 });
  } catch (error) {
    console.error('Error creating room:', error);
    // Return more detailed error information
    return NextResponse.json(
      { 
        message: 'Failed to create room',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}