import { liveblocks } from "@/lib/liveblocks-server";
import { NextRequest, NextResponse } from "next/server";

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
    const backendResponse = await fetch(`http://localhost:5713/verify-user`, {
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
    console.log('user when auth:',user);
    
    
    const authResponse = await liveblocks.identifyUser(
      {
        userId: user.id,
        groupIds: [],
      },
      {
        userInfo: {
          id:user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar || "",
          color:'#000000'     
        },
      }
    );
    console.log('liveblocks auth SUCCESS');
    const parsedBody = JSON.parse(authResponse.body);
    return NextResponse.json({ token: parsedBody.token });
  } catch (error) {
    console.error("Liveblocks auth error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}