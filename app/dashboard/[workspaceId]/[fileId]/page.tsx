"use client";
import { API } from "@/app/api/handle-token-expire";
import { CollaborativeRoom } from "@/components/Liveblocks/Editor/CollaborativeRoom";
import { CollaborativeEditor } from "@/components/Liveblocks/Editor/CollaborativeTextEditor";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import ThemeToggle from "@/components/toggleTheme";
import { Button, Card, CardContent } from "@mui/material";
import { Image, Trash2, Upload } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface FileData {
  id: string;
  name: string;
  content: string;
  coverImage?: string;  
}
export default function FileEditor() {
  const { workspaceId, fileId } = useParams() as { workspaceId: string; fileId: string };
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  
  useEffect(() => {

    if (fileId) {
      fetchFileData();
    }
  }, [fileId]);


  const fetchFileData = async () => {
    try {
      const response = await API.get(`/file/${fileId}`, { withCredentials: true });
         console.log('content:',response.data.file);
         
      setFileData(response.data.file);
      console.log('file loca:',response.data.file.coverImage);
      
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
      if(response.data.status==200){
       fetchFileData()
       toast.success("File uploaded.",{
        duration:2000,
        position:'bottom-right'
       })

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

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading file...</div>;
  }

   

  return (
    <div className="min-h-screen  bg-gray-900">
      {/* Header */}
      <div className="flex justify-end items-center p-3 border-b">
        <ThemeToggle/>
      </div>

      <div className="relative h-48">
        {fileData?.coverImage ? (
          <>
            <img
              src={fileData?.coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
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
            <Upload className="h-4 w-4 " />  
            Add cover
          </button>
        </div>
        )}

        {isUploadOpen && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <Card className="w-[600px]">
              <CardContent className="p-4 bg-gray-900 ">
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

      {/* Collaborative Editor */}
      <CollaborativeRoom roomId={fileId} fallback={<LoadingSpinner/>}>
        <CollaborativeEditor fileId={fileId} initialContent={fileData?.content} />
      </CollaborativeRoom>
    </div>
  );
}