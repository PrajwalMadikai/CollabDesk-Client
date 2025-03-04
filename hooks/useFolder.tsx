import { ResponseStatus } from "@/enums/responseStatus";
import getResponseStatus from "@/lib/responseStatus";
import { folderCreateFunc, folderFetchFunc, folderMovetoTrash, folderRestoreFunc, folderTrashFetchFun, folderUpdateFunc } from "@/services/folderApi";
import { AppDispatch, RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

interface Folder {
  id: string;
  name: string;
  files: { fileId: string; fileName: string }[];
  isExpanded?: boolean;
}

interface TrashItems {
  folders: Array<{ _id: string; name: string }>;
  files: Array<{ _id: string; name: string }>;
}

export function useFolder() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingFolderName, setEditingFolderName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [trashItems, setTrashItems] = useState<TrashItems>({ folders: [], files: [] });
  const [isTrashExpanded, setIsTrashExpanded] = useState(false);
  
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
 

  const fetchFolders = async (workspaceId: string | undefined) => {
    if (!workspaceId) return [];
    
    try {
      setLoading(true);
      const response = await folderFetchFunc(workspaceId)
      const responseStatus = getResponseStatus(response.status);
      
      if (responseStatus === ResponseStatus.SUCCESS) {
        const foldersWithFiles = response.data.folders.map((folder: any) => ({
          ...folder,
          files: folder.files || [],
        }));
        setFolders(foldersWithFiles);
        return foldersWithFiles;
      }
      return [];
    } catch (error) {
      console.error("Error fetching folders:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchTrashItems = async (workspaceId: string | undefined) => {
    if (!workspaceId) return;

    try {
      setLoading(true);
      const response = await folderTrashFetchFun(workspaceId)
      
      const responseStatus = getResponseStatus(response.status);
      
      if (responseStatus === ResponseStatus.SUCCESS) {
        setTrashItems(response.data.result);
        return response.data.result;
      }
    } catch (error) {
      console.error('Error in fetching trash items', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFolderExpansion = (folderId: string) => {
    setFolders(folders.map(folder => 
      folder.id === folderId 
        ? { ...folder, isExpanded: !folder.isExpanded }
        : folder
    ));
  };

  const createFolder = async (workspaceId: string | undefined) => {
    if (!workspaceId) return null;
    if(!user.id){
        console.log('no user id in redux create Folder');
        
        return
    }

    try {
      setLoading(true);
      
      const response= await folderCreateFunc(workspaceId,user.id)
      
      const responseStatus = getResponseStatus(response.status);

      if (responseStatus === ResponseStatus.CREATED) {
        const newFolder = response.data.folder;
        setFolders([...folders, { ...newFolder, files: [] }]);
        return newFolder;
      }
    } catch (error: any) {
      const responseStatus = getResponseStatus(error.response?.status);

      if (responseStatus === ResponseStatus.FORBIDDEN && error.response?.data?.message.includes("Folder limit exceeded")) {
        showLimitExceededToast("folder");
      } else if (responseStatus === ResponseStatus.FORBIDDEN && error.response?.data?.message.includes("Subscription")) {
        router.push('/subscription-ended');
      } else {
        console.error("Error creating folder:", error);
        toast.error("Failed to create folder. Please try again.", {
          duration: 3000,
          position: "top-right",
        });
      }
    } finally {
      setLoading(false);
    }
    
    return null;
  };

  const updateFolderName = async (folderId: string) => {
    if (editingFolderName.trim()) {
      try {
        setLoading(true);
       
        const response = await folderUpdateFunc(folderId,editingFolderName)
        const responseStatus = getResponseStatus(response.status);

        if (responseStatus === ResponseStatus.SUCCESS) {
          setFolders(folders.map(folder =>
            folder.id === folderId
              ? { ...folder, name: editingFolderName }
              : folder
          ));
          return true;
        }
      } catch (error) {
        console.error("Error updating folder name:", error);
        toast.error("Failed to rename folder", {
          duration: 1500,
          position: "top-right"
        });
      } finally {
        setLoading(false);
        setEditingFolderId(null);
      }
    } else {
      setEditingFolderId(null);
    }
    
    return false;
  };

  const moveToTrash = async (folderId: string, workspaceId: string | undefined) => {
    if (!workspaceId) return false;
    
    try {
      setLoading(true);
     
      const response = await folderMovetoTrash(folderId,workspaceId)
      
      const responseStatus = getResponseStatus(response.status);

      if (responseStatus === ResponseStatus.SUCCESS) {
        toast.success("Folder has moved to trash", {
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
        
        await fetchFolders(workspaceId);
        await fetchTrashItems(workspaceId);
        return true;
      }
    } catch (error) {
      console.error('Error in folder move to trash', error);
      toast.error("Failed to move folder to trash", {
        duration: 2000,
        position: "top-right"
      });
    } finally {
      setLoading(false);
    }
    
    return false;
  };

  const restoreFolder = async (folderId: string, workspaceId: string | undefined) => {
    try {
      setLoading(true);
      const response = await folderRestoreFunc(folderId)

      const responseStatus = getResponseStatus(response.status);

      if (responseStatus === ResponseStatus.SUCCESS) {
        setTrashItems((previousItems) => ({
          ...previousItems,
          folders: previousItems.folders.filter((folder) => folder._id !== folderId),
        }));
        
        if (workspaceId) {
          await fetchFolders(workspaceId);
        }
        
        return true;
      }
    } catch (error) {
      console.error("Error during folder restore", error);
      toast.error("Failed to restore folder", {
        duration: 2000,
        position: "top-right"
      });
    } finally {
      setLoading(false);
    }
    
    return false;
  };

  const startEditingFolder = (folderId: string, currentName: string) => {
    setEditingFolderId(folderId);
    setEditingFolderName(currentName);
  };

  const showLimitExceededToast = (resourceType: string) => {
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 overflow-hidden`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            {/* Icon */}
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-red-500 pr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
  
            {/* Content */}
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-black">
                Your subscription plan has reached the maximum number of {resourceType}s.
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Please upgrade your subscription to create more {resourceType}s.
              </p>
              {/* Upgrade Link */}
              <a
                href="/subscription"
                className="inline-block mt-2 text-black text-sm font-medium hover:underline focus:outline-none focus:ring-2 "
              >
               Click here for Upgrade Subscription
              </a>
            </div>
          </div>
        </div>
  
        {/* Close Button */}
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full text-red-500 border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Close
          </button>
        </div>
      </div>
    ));
  };

  return {
    folders,
    trashItems,
    isTrashExpanded,
    setIsTrashExpanded,
    loading,
    editingFolderId,
    editingFolderName,
    setEditingFolderName,
    fetchFolders,
    fetchTrashItems,
    toggleFolderExpansion,
    createFolder,
    updateFolderName,
    moveToTrash,
    restoreFolder,
    startEditingFolder
  };
}