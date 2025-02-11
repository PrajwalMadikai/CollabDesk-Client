// app/api/liveblocks-auth/route.ts
import { liveblocks } from "@/lib/liveblocks";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Log all headers for debugging
    console.log("Received headers:", Object.fromEntries(request.headers.entries()));

    const authHeader = request.headers.get("authorization");
    console.log("Auth header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Missing or invalid auth header");
      return NextResponse.json(
        { error: "Unauthorized: Missing token" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    console.log("Token extracted:", token.substring(0, 10) + "...");

    const backendResponse = await fetch(`http://localhost:5713/verify-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Backend response status:", backendResponse.status);

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      console.error("Backend verification error:", errorData);
      return NextResponse.json(
        { error: errorData.message || "Invalid or expired token" },
        { status: backendResponse.status }
      );
    }

    const user = await backendResponse.json();
    console.log("User verified:", { id: user.id, email: user.email });

    const userInfo = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || "",
      color: "#ff0000",
    };

    const liveblocksToken = await liveblocks.identifyUser(
      {
        userId: userInfo.id,
        groupIds: [], 
      },
      { userInfo }
    );

    return NextResponse.json({ token: liveblocksToken.body });
  } catch (error) {
    console.error("Liveblocks auth error:", error);
    return NextResponse.json(
      { error: "Authentication failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}