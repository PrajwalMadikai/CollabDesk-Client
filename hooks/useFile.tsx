import { ResponseStatus } from "@/enums/responseStatus";
import getResponseStatus from "@/lib/responseStatus";
import { fileCreateFunc, fileRestoreFunc, fileReviewFunc, makeDocPublish, moveFileToTrashFunc, renameFileFunc } from "@/services/fileApi";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export function useFile(
    selectedWorkspace: { workspaceId: string } | null,
    fetchFolders: (workspaceId: string) => Promise<void>
) {
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [editingFileId, setEditingFileId] = useState<string | null>(null);
    const [editingFileName, setEditingFileName] = useState<string>("");
    const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);

  const createFile = async (folderId: string) => {
    if (!folderId) {
      console.error("Missing folderId");
      return null;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");

      const response = await fileCreateFunc(folderId);
      const responseStatus = getResponseStatus(response.status);

      if (responseStatus === ResponseStatus.CREATED) {
        const newFile = response.data.file;
        
        const liveblockAuth=await fetch('/api/liveblocks-auth',{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }})

        if(!liveblockAuth)
        {
          console.log('liveblocks authentication failed');
          
        }
         console.log('liveblocks auth success:',liveblockAuth);
            
        const roomResponse = await fetch("/api/create-room", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            roomId: newFile.id,
            userId: user.id,
            email: user.email,
            title: "Untitled",
          }),
        });

        if (!roomResponse.ok) {
          throw new Error("Failed to create room");
        }

        // Refetch folders to update the UI
        if (selectedWorkspace?.workspaceId) {
          await fetchFolders(selectedWorkspace.workspaceId);
        }

        toast.success("File created successfully", {
          duration: 2000,
          position: "top-right",
        });

        return newFile;
      }
    } catch (error) {
      console.error("Error creating file and room:", error);
      toast.error("Failed to create file", {
        duration: 2000,
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }

    return null;
  };


  const openFile = async (fileId: string, workspaceId: string | undefined) => {
    if (!workspaceId || !user.email) {
      console.error("Missing workspace or user information");
      return false;
    }
    
    setSelectedFile(fileId);
    
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");

      //next js api call
      const response = await fetch("/api/room-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          roomId: fileId,
          userId: user.id,
          email: user.email
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to access room');
      }
  
      await response.json();
      router.push(`/dashboard/${workspaceId}/${fileId}`);
      return true;
    } catch (error) {
      console.error("Error accessing room:", error);
      toast.error("Failed to access file", {
        duration: 2000,
        position: "top-right"
      });
    } finally {
      setLoading(false);
    }
    
    return false;
  };

  const renameFile = async (fileId: string, folderId: string) => {
    if (editingFileName.trim()) {
      try {
        setLoading(true);
        
        const response = await renameFileFunc(fileId,editingFileName,folderId)

        const responseStatus = getResponseStatus(response.status);
  
        if (responseStatus === ResponseStatus.SUCCESS) {
          return true;
        }
      } catch (error) {
        console.error("Error updating file name:", error);
        toast.error("Failed to rename file", {
          duration: 1500,
          position: "top-right"
        });
      } finally {
        setLoading(false);
        setEditingFileId(null);
      }
    } else {
      setEditingFileId(null);
    }
    
    return false;
  };

  const moveToTrash = async (fileId: string, folderId: string, updateFolderFn?: () => Promise<void>) => {
    try {
      setLoading(true);
       
      const response = await moveFileToTrashFunc(fileId,folderId)

      const responseStatus = getResponseStatus(response.status);

      if (responseStatus === ResponseStatus.SUCCESS) {
        if (updateFolderFn) {
          await updateFolderFn();
        }
        
        toast.success("File has moved to trash", {
          duration: 3000,
          position: "bottom-right",
          style: {
            background: "white",
            color: "black",
            borderRadius: "8px",
            padding: "12px",
            fontSize: "14px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          },
        });
        
        return true;
      }
    } catch (error) {
      console.error("Error in file delete", error);
      toast.error("Failed to move file to trash", {
        duration: 2000,
        position: "top-right"
      });
    } finally {
      setLoading(false);
    }
    
    return false;
  };

  const restoreFile = async (fileId: string, updateFnCallback?: () => Promise<void>) => {
    try {
      setLoading(true);
      const response = await fileRestoreFunc(fileId)
      
      const responseStatus = getResponseStatus(response.status);

      if (responseStatus === ResponseStatus.SUCCESS) {
        if (updateFnCallback) {
          await updateFnCallback();
        }
        
        return true;
      }
    } catch (error) {
      console.error("Error during file restore", error);
      toast.error("Failed to restore file", {
        duration: 2000,
        position: "top-right"
      });
    } finally {
      setLoading(false);
    }
    
    return false;
  };

  const startEditingFile = (fileId: string, currentName: string) => {
    setEditingFileId(fileId);
    setEditingFileName(currentName);
  };

  return {
    selectedFile,
    editingFileId,
    editingFileName,
    setEditingFileName,
    loading,
    createFile,
    openFile,
    renameFile,
    moveToTrash,
    restoreFile,
    startEditingFile
  };
}


export const publishDocument=()=>{
    const handleDocPublish=async(fileId:string)=>{
        try {
            const response=await makeDocPublish(fileId)
            const responseStatus=getResponseStatus(response.status)

            if(responseStatus==ResponseStatus.SUCCESS)
            {
                return response
            }
            
        } catch (error) {
            toast.error("Unable to publish document",{
                position:'top-right'
            })
        }
    }
  
    return {
        handleDocPublish
    }
}


export const previewFileData = () => {

  const [content, setContent] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const [fetchedFileIds, setFetchedFileIds] = useState(new Set());

 
  const getFileData = useCallback(async (fileId:string) => {
    if (content && fetchedFileIds.has(fileId)) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);

      const response = await fileReviewFunc(fileId);
      const responseData = response.data;

      if (getResponseStatus(response.status) === ResponseStatus.SUCCESS && responseData.file) {
        setContent(responseData.file.content);
        setFetchedFileIds(prev => new Set([...prev, fileId]));
      } else {
        setError("Failed to fetch file content.");
      }
    } catch (err) {
      console.error("Error fetching or deserializing content:", err);
      setError("An error occurred while loading the content.");
    } finally {
      setLoading(false);
    }
  }, [content, fetchedFileIds]);  

  return {
    content,
    loading,
    error,
    getFileData,
  };
};