// app/api/create-room/route.ts
import { liveblocks } from '@/lib/liveblocks';
import { NextRequest, NextResponse } from 'next/server';

// Add these exports
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

 

export async function POST(request: NextRequest) {
  
  try {
    const body = await request.json();
    console.log('Received body:', body);
    
    const { userId, email, title, roomId } = body;

    if (!userId || !email) {
      return NextResponse.json(
        { message: 'Missing required fields' },
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

    const room = await liveblocks.createRoom(roomId, {
      metadata,
      usersAccesses,
      defaultAccesses: ["room:write"],
    });

    return NextResponse.json({ room }, { status: 200 });

  } catch (error) {
    console.error('Error creating room:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}