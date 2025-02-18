'use client'
import { Canvas } from "@/components/Liveblocks/Canvas/Canvas"
import { CollaborativeRoom } from "@/components/Liveblocks/Editor/CollaborativeRoom"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { useParams } from "next/navigation"

const whiteboardLayout=()=>{
    const {fileId}= useParams() as {fileId:string}

    return (
        <>
        <CollaborativeRoom roomId={fileId} fallback={<LoadingSpinner />}>
        <Canvas boardId={fileId}/>
        </CollaborativeRoom>
        </>
    )
}

export default whiteboardLayout