"use client";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { CollaborativeRoom } from "../../../../components/Liveblocks/Editor/CollaborativeRoom";
import { CollaborativeEditor } from "../../../../components/Liveblocks/Editor/CollaborativeTextEditor";
import { previewFileData } from "../../../../hooks/useFile";
import { grantRoomAccess } from "../../../../services/fileApi";

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

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 text-gray-700 whitespace-pre-wrap break-words">
          {isLoading ? (
            <div className="flex  items-center justify-center py-10">
              <div className="min-h-screen flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-10">
              <p className="text-red-500">Error: {error}</p>
            </div>
          ) : !content ? (
            <div className="flex items-center justify-center py-10">
            <div className="min-h-screen flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
            </div>
          ) : (
            <CollaborativeRoom roomId={fileId} fallback={
              <div className="flex items-center justify-center py-10">
              <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
              </div>
            }>
              <CollaborativeEditor fileId={fileId} initialContent={content} edit={false} />
            </CollaborativeRoom>
          )}
        </div>
      </div>
    </div>
  );
};

export default Preview;