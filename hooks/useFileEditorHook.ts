import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ResponseStatus } from "../enums/responseStatus";
import getResponseStatus from "../lib/responseStatus";
import { FileData, imageUpload } from "../services/fileApi";
import { publishDocument } from "./useFile";

interface FileData {
  id: string;
  name: string;
  content: string;
  coverImage?: string;
  published?: boolean;
  url?: string;
}

export const useFileEditor = (fileId: string) => {
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPublishMessage, setShowPublishMessage] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const fetchFileData = async () => {
    try {
      const response = await FileData(fileId)

     const responseStatus=getResponseStatus(response.status)
     if(responseStatus==ResponseStatus.SUCCESS){

      setFileData(response.data.file);

      if (response.data.file.published && response.data.file.url) {
        setShowPublishMessage(true);
      }
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
      toast.error("File is not selected!", {
        duration: 2000,
        position: "top-right",
      });
      return;
    }
    setIsUploadOpen(true)
    try {
      const formData = new FormData();
      formData.append("image", file);

    
      const response = await imageUpload(fileId,formData)

      const responseStatus = getResponseStatus(response.status);
     
      if (responseStatus === ResponseStatus.SUCCESS) {
        fetchFileData();
        toast.success("File uploaded.", {
          duration: 2000,
          position: "bottom-right",
          style: {
            background: '#166534',  
            color: '#d1fae5',    
            borderRadius: '8px',    
            padding: '12px',        
            fontSize: '14px',      
          },
        });
        setIsUploadOpen(false)
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image. Please try again.", {
        duration: 2000,
        position: "top-right",
      });
    }
  };

 

  const handlePublishClick = async () => {
    try {
      const { handleDocPublish } = publishDocument();
      const response = await handleDocPublish(fileId);
      if (!response) {
        throw new Error("Invalid response from server");
      }
      const responseStatus = getResponseStatus(response.status);

      if (responseStatus === ResponseStatus.SUCCESS) {

         await fetchFileData()
  
        setShowPublishMessage(true);

        setShowPublishMessage(true);
        toast.success("Published!", {
          position: "top-right",
          style: {
            background: '#166534',  
            color: '#d1fae5',    
            borderRadius: '8px',    
            padding: '12px',        
            fontSize: '14px',      
          },
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
          style: {
            background: '#166534',  
            color: '#d1fae5',    
            borderRadius: '8px',    
            padding: '12px',        
            fontSize: '14px',      
          },
        });
      });
    }
  };

  useEffect(() => {
    if (fileId) {
      fetchFileData();
    }
  }, [fileId]);

  return {
    fileData,
    loading,
    showPublishMessage,
    setShowPublishMessage,
    handleImageUpload,
    handlePublishClick,
    handleCopyLink,
    isUploadOpen, 
    setIsUploadOpen
  };
};