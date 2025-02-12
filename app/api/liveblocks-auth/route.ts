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
      const errorData = await backendResponse.json();
      return NextResponse.json(
        { error: errorData.message || "Invalid or expired token" },
        { status: backendResponse.status }
      );
    }

    const user = await backendResponse.json();
    const userInfo = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || "",
      color: "#ff0000",
    };

    const authResponse = await liveblocks.identifyUser(
      {
        userId: userInfo.id,
        groupIds: [], 
      },
      { userInfo }
    );
    
    const parsedBody = JSON.parse(authResponse.body);
    console.log('parsed body:',parsedBody);
    
    
    // The key changes are here - return the exact format expected
    return NextResponse.json({
      token: parsedBody.token
    });
  } catch (error) {
    console.error("Liveblocks auth error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}