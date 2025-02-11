import { getUserColor } from "@/lib/utils";
import { Liveblocks } from "@liveblocks/node";
import { NextRequest, NextResponse } from "next/server";
import { baseUrl } from "../urlconfig";

const secretKey = process.env.LIVEBLOCKS_SECRET_KEY;
if (!secretKey) {
  throw new Error("LIVEBLOCKS_SECRET_KEY is not set");
}

const liveblocks = new Liveblocks({ secret: secretKey });

export async function POST(req: NextRequest) {
  try {
    // Extract JWT token from headers
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized: Missing token" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    // Verify user with backend
    const backendResponse = await fetch(`${baseUrl}/verify-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!backendResponse.ok) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: backendResponse.status });
    }

    const user = await backendResponse.json();

    // Create user info object
    const userInfo = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || "",
      color: getUserColor(user.id),
    };

    // Identify user with Liveblocks
    const { status, body } = await liveblocks.identifyUser(
      {
        userId: userInfo.email,
        groupIds: [],  
      },
      { userInfo }
    );

    // Return the response
    return new Response(body, { status });

  } catch (error) {
    console.error("Liveblocks auth error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}