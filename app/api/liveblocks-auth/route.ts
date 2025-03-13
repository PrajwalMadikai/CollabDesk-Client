import { NextRequest, NextResponse } from "next/server";
import { liveblocks } from "../../../lib/liveblocks-server";
import { baseUrl } from "../urlconfig";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized: Missing token" },
        { status: 401 }
      );
    }
    const token = authHeader.split(" ")[1];
    const backendResponse = await fetch(`${baseUrl}/verify-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!backendResponse.ok) {
      throw new Error("Failed to verify user");
    }

    const user = await backendResponse.json();
    console.log('User from verification:', user);
    
    const userColor = user.color || `#${Math.floor(Math.random()*16777215).toString(16)}`;
    
    const displayName = user.fullname || user.email.split('@')[0];
    
    const authResponse = await liveblocks.identifyUser(
      {
        userId: user.id,
        groupIds: [],  
      },
      {
        userInfo: {
          id: user.id,
          name: displayName,
          email: user.email,
          avatar: user.avatar || "", 
          color: userColor,
        },
      }
    );
    
    console.log('Liveblocks authentication successful for user:', displayName);
    const parsedBody = JSON.parse(authResponse.body);
    return NextResponse.json({ 
      token: parsedBody.token,
      user: {
        id: user.id,
        name: displayName,
        email: user.email,
        avatar: user.avatar || "",
        color: userColor
      }
    });
  } catch (error) {
    console.error("Liveblocks auth error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}