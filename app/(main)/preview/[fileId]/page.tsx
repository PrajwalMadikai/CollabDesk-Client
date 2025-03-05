"use client";
import { CollaborativeRoom } from "@/components/Liveblocks/Editor/CollaborativeRoom";
import { CollaborativeEditor } from "@/components/Liveblocks/Editor/CollaborativeTextEditor";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { previewFileData } from "@/hooks/useFile";
import { grantRoomAccess } from "@/services/fileApi";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";

const Preview = () => {
  const { fileId } = useParams() as { fileId: string };
  const { content, loading: contentLoading, error: contentError, getFileData } = previewFileData();
  
  const roomAccessLoadingRef = useRef(false);
  const roomAccessErrorRef = useRef('');
  
  const dataFetchedRef = useRef(false);

  useEffect(() => {
    if (dataFetchedRef.current) return;
    
    const fetchData = async () => {
      try {
        roomAccessLoadingRef.current = true;
        
        await grantRoomAccess(fileId);
        roomAccessLoadingRef.current = false;
        
        await getFileData(fileId);
        dataFetchedRef.current = true;
      } catch (err) {
        roomAccessErrorRef.current = "Failed to grant room access.";
        console.error("Error in fetchData:", err);
      }
    };

    fetchData();
  }, [fileId, getFileData]);  

  const isLoading = roomAccessLoadingRef.current || contentLoading;
  const error = roomAccessErrorRef.current || contentError;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        {error}
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        No content available for preview.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl  rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 text-gray-700 whitespace-pre-wrap break-words">
          <CollaborativeRoom roomId={fileId} fallback={<LoadingSpinner />}>
            <CollaborativeEditor fileId={fileId} initialContent={content} edit={false} />
          </CollaborativeRoom>
        </div>
      </div>
    </div>
  );
};

export default Preview;