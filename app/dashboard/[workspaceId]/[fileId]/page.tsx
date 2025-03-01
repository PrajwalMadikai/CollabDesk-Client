"use client";
import { API } from "@/app/api/handle-token-expire";
import { CollaborativeRoom } from "@/components/Liveblocks/Editor/CollaborativeRoom";
import { CollaborativeEditor } from "@/components/Liveblocks/Editor/CollaborativeTextEditor";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import ThemeToggle from "@/components/toggleTheme";
import { ResponseStatus } from "@/enums/responseStatus";
import { publishDocument } from "@/hooks/useFile";
import getResponseStatus from "@/lib/responseStatus";
import { Button, Card, CardContent } from "@mui/material";
import { Copy, Image, Trash2, Upload } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface FileData {
  id: string;
  name: string;
  content: string;
  coverImage?: string;
  published?: boolean; // Add published property
  url?: string; // Add URL property for published file
}

export default function FileEditor() {
  const { workspaceId, fileId } = useParams() as { workspaceId: string; fileId: string };
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [showPublishMessage, setShowPublishMessage] = useState(false); // State for showing the message box

  const { handleDocPublish } = publishDocument();

  useEffect(() => {
    if (fileId) {
      fetchFileData();
    }
  }, [fileId]);

  const fetchFileData = async () => {
    try {
      const response = await API.get(`/file/${fileId}`, { withCredentials: true });
      console.log("content:", response.data.file);

      setFileData(response.data.file);
      console.log("file loca:", response.data.file.coverImage);

      // Show the message box if the file is already published
      if (response.data.file.published && response.data.file.url) {
        setShowPublishMessage(true);
      }
    } catch (error) {
      console.error("Error fetching file data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      console.log("No file selected");
      toast.error("File is not selected!", {
        duration: 2000,
        position: "top-right",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await API.put(`/file/uploadImage/${fileId}`, formData, {
        withCredentials: true,
      });
      setIsUploadOpen(false);

      const responseStatus = getResponseStatus(response.status);

      if (responseStatus == ResponseStatus.SUCCESS) {
        fetchFileData();
        toast.success("File uploaded.", {
          duration: 2000,
          position: "bottom-right",
        });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image. Please try again.", {
        duration: 2000,
        position: "top-right",
      });
    }
  };

  const handleRemoveCover = () => {
    if (fileData) {
      setFileData({ ...fileData, coverImage: undefined });
    }
  };

  const handlePublishClick = async () => {
    try {
      const response = await handleDocPublish(fileId);
      const responseStatus = getResponseStatus(response.status);

      if (responseStatus == ResponseStatus.SUCCESS) {
        setShowPublishMessage(true); // Show the message box
        toast.success("Published!", {
          position: "top-right",
        });
      }
    } catch (error) {
      toast.error("Unable to publish document", {
        position: "top-right",
      });
    }
  };

  const handleCopyLink = () => {
    if (fileData?.url) {
      navigator.clipboard.writeText(fileData.url).then(() => {
        toast.success("Link copied to clipboard!", {
          position: "top-right",
        });
      });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading file...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="flex justify-between items-center p-3 border-b">
        {/* Publish button */}
        <button onClick={handlePublishClick} className="relative">
          {fileData?.published ? 'Published':'Publish'}
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
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
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