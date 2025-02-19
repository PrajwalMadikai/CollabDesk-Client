'use client'
import { Canvas } from "@/components/Liveblocks/Canvas/Canvas"
import { CollaborativeRoom } from "@/components/Liveblocks/Editor/CollaborativeRoom"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { useParams } from "next/navigation"

const whiteboardLayout=()=>{
    const {workspaceId}= useParams() as {workspaceId:string}

    return (
        <>
        <CollaborativeRoom roomId={workspaceId} fallback={<LoadingSpinner />}>
        <Canvas boardId={workspaceId}/>
        </CollaborativeRoom>
        </>
    )
}

export default whiteboardLayout