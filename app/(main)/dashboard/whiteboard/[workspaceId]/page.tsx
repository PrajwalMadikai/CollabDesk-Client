'use client'
import { useParams } from "next/navigation"
import { Canvas } from "../../../../../components/Liveblocks/Canvas/Canvas"
import { CollaborativeRoom } from "../../../../../components/Liveblocks/Editor/CollaborativeRoom"
import { LoadingSpinner } from "../../../../../components/LoadingSpinner"

const WhiteboardLayout=()=>{
    const {workspaceId}= useParams() as {workspaceId:string}

    return (
        <>
        <CollaborativeRoom roomId={workspaceId} fallback={<LoadingSpinner />}>
        <Canvas />
        </CollaborativeRoom>
        </>
    )
}

export default WhiteboardLayout