"use client";
import { CollaborativeRoom } from "@/components/Liveblocks/Editor/CollaborativeRoom";
import { CollaborativeEditor } from "@/components/Liveblocks/Editor/CollaborativeTextEditor";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import ThemeToggle from "@/components/toggleTheme";
import { useFileEditor } from "@/hooks/useFileEditorHook";
import { Button, Card, CardContent } from "@mui/material";
import { Copy, Image, Trash2, Upload } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function FileEditor() {
  const { workspaceId, fileId } = useParams() as { workspaceId: string; fileId: string };
  const {
    fileData,
    loading,
    showPublishMessage,
    setShowPublishMessage,
    handleImageUpload,
    handleRemoveCover,
    handlePublishClick,
    handleCopyLink,
  } = useFileEditor(fileId);

  const [isUploadOpen, setIsUploadOpen] = useState(false);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading file...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="flex justify-between items-center p-3 border-b">
        <button onClick={handlePublishClick} className="relative bg-white rounded-[2px] text-black px-3 py-1 text-sm">
          {fileData?.published ? "Published" : "Publish"}
          {showPublishMessage && fileData?.published && fileData?.url && (
            <div className="absolute top-full left-[165px] transform -translate-x-1/2 mt-2 bg-primary text-black p-4 rounded shadow-lg z-50 w-[270px]">
              <p className="text-sm mb-2">Your document has been published successfully!</p>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={fileData.url}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-100 rounded text-sm focus:outline-none"
                />
                <button
                  className="bg-black text-white p-2 rounded  transition-colors"
                  onClick={handleCopyLink}
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              <button
                className="mt-4 bg-black text-white px-2 py-1 rounded w-full hover:bg-gray-900 transition-colors"
                onClick={() => setShowPublishMessage(false)}
              >
                Close
              </button>
            </div>
          )}
        </button>
        <ThemeToggle />
      </div>

      <div className="relative h-48">
        {fileData?.coverImage ? (
          <>
            <img src={fileData?.coverImage} alt="Cover" className="w-full h-full object-cover" />
            <div className="absolute bottom-4 left-4 flex gap-2">
              <Button
                className="bg-white/70 hover:bg-white/90"
                onClick={() => setIsUploadOpen(true)}
              >
                <Image className="h-4 w-4 mr-2" />
                Change cover
              </Button>
              <Button
                className="bg-white/70 hover:bg-white/90"
                onClick={handleRemoveCover}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove
              </Button>
            </div>
          </>
        ) : (
          <div className="w-full h-full relative bg-black-500">
            <button
              className="absolute top-[160px] left-2 text-gray-500 text-[11px] font-semibold uppercase flex items-center gap-1"
              onClick={() => setIsUploadOpen(true)}
            >
              <Upload className="h-4 w-4" />
              Add cover
            </button>
          </div>
        )}

        {isUploadOpen && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <Card className="w-[600px]">
              <CardContent className="p-4 bg-gray-900">
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="image-upload"
                    onChange={handleImageUpload}
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="mx-auto h-12 w-12 text-white" />
                    <p className="mt-2 text-white">Click or drag file to this area to upload</p>
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      <CollaborativeRoom roomId={fileId} fallback={<LoadingSpinner />}>
        <CollaborativeEditor fileId={fileId} initialContent={fileData?.content} />
      </CollaborativeRoom>
    </div>
  );
}