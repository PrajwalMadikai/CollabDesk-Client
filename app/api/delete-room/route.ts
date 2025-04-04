import { NextRequest, NextResponse } from "next/server";
import { liveblocks } from "../../../lib/liveblocks-server";

export async function POST(req:NextRequest)
{
    try {
        const body=await req.json()
        const roomId=body.roomId

       if(!roomId)
       {
        return NextResponse.json({ message: "Missing required fields" },
            { status: 400 })
       }

       await liveblocks.deleteRoom(roomId)

       return NextResponse.json( { message: "Room deleted successfully" },{status:200})
        
    } catch (error) {
        console.error("Error deleting room:", error);
        return NextResponse.json({error:'Error in room delete'},{status:500})
    }
}