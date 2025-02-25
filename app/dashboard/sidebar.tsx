import SettingsModal from "@/components/Settings";
import { addFolder, addWorkspace } from "@/store/slice/userSlice";
import { RootState } from "@/store/store";
import { ChevronRight, File, Folder, Menu, MessageSquare, Plus, RefreshCcw, Settings, Trash } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { API } from "../api/handle-token-expire";
interface Workspace {
  workspaceId: string;
  workspaceName: string;
}

interface SidebarProps {
  onWorkspaceUpdate?: (workspace: Workspace) => void;
  onToggle?: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onWorkspaceUpdate,onToggle }) => {
  
  const router = useRouter();
  const params = useParams();
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [folders, setFolders] = useState<{ id: string; name: string; files: { fileId: string; fileName: string }[]; isExpanded?: boolean }[]>([]);
  const [workspaces, setWorkspaces] = useState<{ workspaceId: string; workspaceName: string }[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<{ workspaceId: string; workspaceName: string } | null>(null);
  const [selectedFile,setSelectedFile]=useState<string|null>(null)
  const [showWorkspaceList, setShowWorkspaceList] = useState<boolean>(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState<string>("");
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingFolderName, setEditingFolderName] = useState<string>("");
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  const [editingFileName, setEditingFileName] = useState<string>("");
  const[isTrashExpanded,setIsTrashExpanded]=useState(false)
  const [trashItems, setTrashItems] = useState<{
    folders: Array<{ _id: string; name: string }>;
    files: Array<{ _id: string; name: string }>;
  }>({ folders: [], files: [] });

  const user = useSelector((state: RootState) => state.user);
  const plan = useSelector((state:RootState)=>state.plan)
  const userPlan = user.planType
  const plans = plan.plans;
  const userSelectedPlan = plans.find((p) => p.paymentType === userPlan);
console.log('user',user);


  const token = localStorage.getItem("accessToken");
  const userId: string | null = user.id;
  const dispatch=useDispatch()
  const handleToggle = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    onToggle?.(newIsOpen);
  };
  useEffect(() => {
    
    fetchSpace();
  }, [userId, token, params.workspaceId]);
  
  const handleWhiteboardClick = () => {
    if (!selectedWorkspace?.workspaceId) return;

    router.push(`/dashboard/whiteboard/${selectedWorkspace.workspaceId}`);
  };
  const fetchSpace = async () => {
    try {
      let response = await API.post("/workspace/fetch", { userId }, { withCredentials: true });
      const fetchedWorkspaces = response.data.workspace;
      setWorkspaces(fetchedWorkspaces);

      if (fetchedWorkspaces.length > 0) {
        const initialWorkspace = fetchedWorkspaces.find((w: { workspaceId: string | string[] | undefined }) => w.workspaceId === params.workspaceId) || fetchedWorkspaces[0];
       await setSelectedWorkspace(initialWorkspace);

      }
    } catch (error) {
      console.error("Error fetching workspaces:", error);
    }
  };

  const handleCreateWorkspace = async (e : React.KeyboardEvent<HTMLInputElement>) => {
    if(newWorkspaceName.trim().length<3)
    {
      toast.error("workspace name must be at least 3 characters",{
        position:'top-right',
        duration:2000
      })
      return
    }

    if(user.planType==null && user.workspaceCount>=1)
    {
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-center">
              {/* Replace image with an icon or text */}
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-red-500"
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
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Your subscription plan has reached the maximum number of workspaces.
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Please upgrade your subscription to create more workspaces.
                </p>
                {/* Add a link to the home page */}
                <Link href='/'>
                <p
                  onClick={() => toast.dismiss(t.id)}
                  className="inline-block mt-2 text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                >
                  Upgrade Subscription
                </p>
                </Link>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Close
            </button>
          </div>
        </div>
      ));
      return
    }
    if (user.workspaceCount === userSelectedPlan?.WorkspaceNum) {
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-center">
              {/* Replace image with an icon or text */}
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-red-500"
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
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Your subscription plan has reached the maximum number of workspaces.
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Please upgrade your subscription to create more workspaces.
                </p>
                {/* Add a link to the home page */}
                <Link href='/' >
                <p
                  
                  className="inline-block mt-2 text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                >
                  Upgrade Subscription
                </p>
                </Link>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Close
            </button>
          </div>
        </div>
      ));
      return;
    }

      try {
        const response = await API.post("/workspace/create", {
          spaceName: newWorkspaceName,
          userId
        }, { withCredentials: true });
        
        if (response.status === 201) {
          const newWorkspace = response.data.workspace;
         dispatch(addWorkspace(newWorkspace))

          const roomResponse = await fetch("/api/create-room", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`  
            },
            body: JSON.stringify({
              roomId: newWorkspace.id,
              userId: user.id,
              email: user.email,
              title: newWorkspace.name || "Untitled",
            }),
          });
    
          if (!roomResponse.ok) {
            throw new Error("Failed to create room");
          }
          setWorkspaces((prevWorkspaces) => [...prevWorkspaces, newWorkspace]);
          setNewWorkspaceName("");
        }
      } catch (error:any) {
        if (error.response?.status === 403 && error.response?.data?.message.includes("Subscription")) {
          router.push('/subscription-ended')
        } else {
          console.error("Error creating workspace:", error);
        }
      }
  };
  const fetchFolders = async () => {
    try {
      let response = await API.post("/folder/fetch", { workspaceId: selectedWorkspace?.workspaceId }, { withCredentials: true });
      if (response.data.folders) {
        const foldersWithFiles = response.data.folders.map((folder: any) => ({
          ...folder,
          files: folder.files || [],  
        }));
        setFolders(foldersWithFiles);
      }
    } catch (error) {
      console.error("Error fetching folders:", error);
    }
  };

  useEffect(() => {
     
    if (selectedWorkspace?.workspaceId) {
      fetchFolders()
      fetchTrashItems();
    }
  }, [selectedWorkspace?.workspaceId]);

  const handleWorkspaceSelect = (workspace: { workspaceId: string; workspaceName: string }) => {
    setSelectedWorkspace(workspace)
    setShowWorkspaceList(false);
    router.push(`/dashboard/${workspace.workspaceId}`);
  };

   
  const toggleFolderExpansion = (folderId: string) => {
    setFolders(folders.map(folder => 
      folder.id === folderId 
        ? { ...folder, isExpanded: !folder.isExpanded }
        : folder
    ));
  };
  const handleFolderNameEdit = (folderId: string, currentName: string) => {
    setEditingFolderId(folderId);
    setEditingFolderName(currentName);
  };
  const handleFolderNameSave = async (folderId: string) => {
    if (editingFolderName.trim()) {
      try {
        const response = await API.put(`/folder/update/${folderId}`, {
          name: editingFolderName
        }, { withCredentials: true });

        if (response.status === 200) {
          setFolders(folders.map(folder =>
            folder.id === folderId
              ? { ...folder, name: editingFolderName }
              : folder
          ));
        }
      } catch (error) {
        console.error("Error updating folder name:", error);
      }
    }
    setEditingFolderId(null);
  };

  const handleAddFolder = async () => {

    if (!selectedWorkspace?.workspaceId) return;
    if(user.planType==null && user.folderCount>=1)
      {
        toast.custom((t) => (
          <div
            className={`${
              t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-center">
                {/* Replace image with an icon or text */}
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-red-500"
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
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Your subscription plan has reached the maximum number of folders.
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Please upgrade your subscription to create more folders.
                  </p>
                  <Link href='/'>
                  <p
                    onClick={() => toast.dismiss(t.id)}
                    className="inline-block mt-2 text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                  >
                    Upgrade Subscription
                  </p>
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Close
              </button>
            </div>
          </div>
        ));
        return
      }
    if (user.folderCount === userSelectedPlan?.WorkspaceNum) {
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-center">
              {/* Replace image with an icon or text */}
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-red-500"
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
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Your subscription plan has reached the maximum number of folders.
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Please upgrade your subscription to create more folders.
                </p>
                {/* Add a link to the home page */}
                <Link href='/' >
                <p
                  
                  className="inline-block mt-2 text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                >
                  Upgrade Subscription
                </p>
                </Link>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Close
            </button>
          </div>
        </div>
      ));
      return;
    }
    try {
      const response = await API.post("/folder/create", {
        name: "Untitled",
        workspaceId: selectedWorkspace.workspaceId,
      }, { withCredentials: true });
      if (response.status === 200) {

        dispatch(addFolder(response.data.folder))
        setFolders([...folders, { ...response.data.folder, files: [] }]);
        
      }
    } catch (error:any) {
      if (error.response?.status === 403 && error.response?.data?.message.includes("Subscription")) {
        router.push('/subscription-ended')
      } else {
        console.error("Error creating workspace:", error);
      }
    }
  };

 
  const handleAddFile = async (folderId: string) => {
    try {
      if (!folderId) {
        console.error("Missing folderId");
        return;
      }
  
      const response = await API.post("/file/create", { 
        folderId 
      }, { withCredentials: true });
  
      if (response.status === 201) {
        const newFile = response.data.file;
        
        const roomResponse = await fetch("/api/create-room", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`  
          },
          body: JSON.stringify({
            roomId: newFile.id,
            userId: user.id,
            email: user.email,
            title:"Untitled",
          }),
        });
  
        if (!roomResponse.ok) {
          throw new Error("Failed to create room");
        }
  
        // setFolders((prevFolders) =>
        //   prevFolders.map((folder) =>
        //     folder.id === folderId 
        //       ? { 
        //           ...folder, 
        //           files: [...(folder.files || []), { 
        //             fileId: newFile.id,
        //             fileName: newFile.name
        //           }]
        //         } 
        //       : folder
        //   )
        // );
        toggleFolderExpansion(folderId)
        await fetchFolders();
      }
    } catch (error) {
      console.error("Error creating file and room:", error);
    }
  };
  
  
  const handleFileClick = async (fileId: string) => {
    if (!selectedWorkspace?.workspaceId || !user.email) {
      console.error("Missing workspace or user information");
      return;
    }
    setSelectedFile(fileId)
    try {
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
      
      router.push(`/dashboard/${selectedWorkspace.workspaceId}/${fileId}`);
    } catch (error) {
      console.error("Error accessing room:", error);
    }
  };

  const handleWorkspaceUpdate = (updatedWorkspace: Workspace) => {
    setWorkspaces(prevWorkspaces =>
      prevWorkspaces.map(workspace =>
        workspace.workspaceId === updatedWorkspace.workspaceId
          ? { ...workspace, workspaceName: updatedWorkspace.workspaceName }
          : workspace
      )
    );

    if (selectedWorkspace?.workspaceId === updatedWorkspace.workspaceId) {
      setSelectedWorkspace(updatedWorkspace);
    }
  };
  const handleFileNameEdit = (fileId: string, currentName: string) => {
    setEditingFileId(fileId);
    setEditingFileName(currentName);
  };
  const handleFileNameSave = async (fileId: string, folderId: string) => {
    if (editingFileName.trim()) {
      try {
        const response = await API.put(`/file/update/${fileId}`, {
          name: editingFileName,
          folderId
        }, { withCredentials: true });
  
        if (response.status === 200) {
          setFolders(folders.map(folder => {
            if (folder.id === folderId) {
              return {
                ...folder,
                files: folder.files.map(file => 
                  file.fileId === fileId
                    ? { ...file, fileName: editingFileName }
                    : file
                )
              };
            }
            return folder;
          }));
        }
      } catch (error) {
        console.error("Error updating file name:", error);
        toast.error("Failed to rename file", {
          duration: 1500,
          position: "top-right"
        });
      }
    }
    setEditingFileId(null);
  };

  const handleFileDelete=async(fileId:string,folderId:string)=>{
    try {

      const response=await API.post(`/file/move-to-trash`,{fileId,folderId},{withCredentials:true})
      if(response.status==200)
      {
        await fetchFolders()
        await fetchTrashItems()
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
      }
      
    } catch (error) {
      console.log("Error in file delete");
      
    }
  }

  const fetchTrashItems=async()=>{
     if(!selectedWorkspace?.workspaceId) return

    try {

      const response=await API.post("/folder/trash-fetch",
        { 
          workspaceId: selectedWorkspace?.workspaceId
        },
        {withCredentials:true}
      )
      
      if(response.data.result)
      {
        setTrashItems(response.data.result)
      }
      
    } catch (error) {
      console.log('error in fetching trash items',error);
      
    }
  }
  const handleFolderMovetoTrash=async(folderId:string)=>{
    try {
         const response=await API.post('/folder/move-to-trash',
          {folderId,workspaceId:selectedWorkspace?.workspaceId},
          {withCredentials:true})

         if(response.status==200)
         {
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
          fetchFolders()
          fetchTrashItems()
         }
    } catch (error) {
      console.log('error in folder move to trash');
      
    }
  }

  const handleRestoreFile=async(fileId:string)=>{
    try {
      const response=await API.post('/file/restore',{fileId},{withCredentials:true})
      if(response.status==200)
        {
          setTrashItems((prevTrashItems) => ({
            ...prevTrashItems,
            files: prevTrashItems.files.filter((file) => file._id !== fileId),
          }));
    
          fetchFolders();
        }
    } catch (error) {
      console.log("Error during file restore",error);
      
    }
  }

  const handleRestoreFolder=async(folderId:string)=>{
    try {

      const response=await API.post('/folder/restore',{folderId},{withCredentials:true})
      if(response.status==200)
      {
        setTrashItems((previousItems)=>({
          ...previousItems,
          folders:previousItems.folders.filter((folder)=>folder._id !== folderId),
        }))
        fetchFolders();
      }
     
    } catch (error) {
      console.log("Error during folder restore",error);
    }
  }
 
  return (
    <div className={`fixed inset-y-0 left-0 bg-black border-r border-gray-800 transition-all duration-300 ease-in-out ${isOpen ? "w-64" : "w-16"} flex flex-col`}>
      <div className="p-4 flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          {isOpen && (
            <div 
              className="flex items-center gap-2 text-white text-lg font-semibold cursor-pointer" 
              onClick={() => setShowWorkspaceList(!showWorkspaceList)}
            >
              <span>{selectedWorkspace?.workspaceName}</span>
              <ChevronRight 
                className={`h-4 w-4 transition-transform ${showWorkspaceList ? 'rotate-90' : ''}`}
              />
            </div>
          )}
          <button  onClick={handleToggle}  className="p-2 rounded-lg text-white hover:bg-gray-800">
            <Menu className="h-5 w-5" />
            
          </button>
        </div>

        {showWorkspaceList && isOpen && (
          <div className="bg-gray-900 rounded-lg text-white mb-4">
            {workspaces.map((workspace) => (
              <div
                key={workspace.workspaceId}
                className="px-3 py-2 hover:bg-gray-700 cursor-pointer rounded-md transition duration-200"
                onClick={() => handleWorkspaceSelect(workspace)}
              >
                {workspace.workspaceName}
              </div>
            ))}
            <div className="px-3 py-2 border-t border-gray-800">
              <input
                type="text"
                placeholder="New workspace..."
                className="w-full bg-transparent border-none focus:outline-none text-sm text-gray-300"
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
                onKeyPress={(e)=>{
                  if(e.key==="Enter") handleCreateWorkspace(e)
                }}
              />
            </div>
          </div>
        )}
        {isOpen&&(

       <div className="flex items-center justify-start my-4  text-[13px] uppercase font-semibold py-0">
        <button 
          onClick={() => setIsSettingsModalOpen(true)} 
          className="flex items-center text-white hover:text-white transition duration-200"
        >
          <Settings className="h-6 w-5" />
          <h5 className="text-sm ml-2">Settings</h5>
        </button>
      </div>
        )}
        {isOpen&&(
          
        <div className="flex items-center justify-between text-gray-400 text-[13px] uppercase font-semibold text-start px-2 py-2">
          <span className="text-white">Folders</span>
          <button onClick={handleAddFolder} className="text-gray-400 hover:text-white transition duration-200">
            <Plus className="h-4 w-4" />
          </button>
        </div>
        )}
       {isOpen&&(

        <div className="flex flex-col gap-1">
          {folders.map((folder) => (
            <div key={folder.id} className="group flex flex-col ">
              <div className="flex items-center justify-between px-4  text-white hover:bg-gray-800 cursor-pointer transition duration-200">
                <div className="flex items-center gap-2 flex-1">
                  <ChevronRight 
                    className={`h-4 w-4 transition-transform ${folder.isExpanded ? 'rotate-90' : ''}`}
                    onClick={() => toggleFolderExpansion(folder.id)}
                  />
                  <Folder className="h-5 w-5 text-gray-400" />
                  {editingFolderId === folder.id ? (
                    <input
                      type="text"
                      className="bg-transparent border-none focus:outline-none text-sm text-gray-300"
                      value={editingFolderName}
                      onChange={(e) => setEditingFolderName(e.target.value)}
                      onBlur={() => handleFolderNameSave(folder.id)}
                      onKeyPress={(e) => e.key === 'Enter' && handleFolderNameSave(folder.id)}
                      autoFocus
                    />
                  ) : (
                    <span 
                      className="text-[14px] text-gray-300"
                      onDoubleClick={() => handleFolderNameEdit(folder.id, folder.name)}
                    >
                      {folder.name}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                <button
                  className="hidden group-hover:block text-gray-400  hover:text-white transition duration-200"
                  onClick={(e) => {
                    e.stopPropagation();  
                    handleFolderMovetoTrash(folder.id);  
                  }}
                >
                  <Trash className="h-4 w-4" />  
                </button>

                <button
                  onClick={() => handleAddFile(folder.id)}
                  className="hidden group-hover:block text-gray-400 hover:text-white transition duration-200"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              </div>
              {folder.isExpanded && (
              <div className="ml-8">
                {(folder.files || []).map((file) => (
                 <div 
                 key={file.fileId} 
                 className={`flex items-center gap-2 px-4 py-1 text-gray-300  cursor-pointer transition duration-200 group ${
                   params.fileId === file.fileId ? 'bg-gray-700' : ''
                 }`}
                 onClick={() => handleFileClick(file.fileId)}
               >
                 <File className="h-4 w-4 text-gray-400" />
                 {editingFileId === file.fileId ? (
                   <input
                     type="text"
                     className="bg-transparent border-none focus:outline-none text-sm text-gray-300 w-full"
                     value={editingFileName}
                     onChange={(e) => setEditingFileName(e.target.value)}
                     onBlur={() => handleFileNameSave(file.fileId, folder.id)}
                     onKeyPress={(e) => e.key === 'Enter' && handleFileNameSave(file.fileId, folder.id)}
                     autoFocus
                   />
                 ) : (
                   <span 
                     className="text-[14px] flex-1"
                     onDoubleClick={(e) => {
                       e.stopPropagation(); 
                       handleFileNameEdit(file.fileId, file.fileName);
                     }}
                     onClick={() => handleFileClick(file.fileId)}
                   >
                     {file.fileName}
                   </span>
                 )}
               
                 <button
                   className="ml-auto hidden group-hover:block text-gray-400 hover:text-white transition duration-200"
                   onClick={(e) => {
                     e.stopPropagation();  
                     handleFileDelete(file.fileId, folder.id);  
                   }}
                 >
                    <Trash className="h-4 w-4" />
                 </button>
               </div>
                ))}
              </div>
            )}
            </div>
          ))}
          
        </div>
        
       )}
       {isOpen && (
          <div className="mt-[50px]">
          <div 
            className="flex items-center cursor-pointer text-primary   transition duration-200"
            onClick={() => setIsTrashExpanded(!isTrashExpanded)}  
          >
            <Trash className="h-4 w-4" />
            <span className="font-semibold text-primary text-[13px] ml-2">TRASH</span>
          </div>

          {isTrashExpanded && (
          <div className="ml-4 mt-2">
            {/* Folders Section */}
            {trashItems.folders.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-300">Folders</h4>
                {trashItems.folders.map((folder) => (
                  <div key={folder._id} className="flex items-center justify-between gap-2 text-gray-400">
                    <div className="flex items-center gap-2">
                      <Folder className="h-4 w-4" />
                      <span>{folder.name}</span>
                    </div>
                    {/* Restore Button for Folder */}
                    <button
                      onClick={() => handleRestoreFolder(folder._id)}
                      className="text-gray-400 hover:text-white transition duration-200"
                    >
                      <RefreshCcw className="h-4 w-4" />  
                    </button>
                  </div>
                ))}
              </div>
            )}

          {/* Files Section */}
          {trashItems.files.length > 0 && (
            <div className="mt-2">
              <h4 className="text-sm font-semibold text-gray-300">Files</h4>
              {trashItems.files.map((file) => (
                <div key={file._id} className="flex items-center justify-between gap-2 text-gray-400">
                  <div className="flex items-center gap-2">
                    <File className="h-4 w-4" />
                    <span>{file.name}</span>
                  </div>
                  {/* Restore Button for File */}
                  <button
                    onClick={() => handleRestoreFile(file._id)}
                    className="text-gray-400 hover:text-white transition duration-200"
                  >
                    <RefreshCcw className="h-4 w-4" /> 
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* No Items in Trash */}
          {trashItems.folders.length === 0 && trashItems.files.length === 0 && (
            <p className="text-sm text-gray-400">No items in trash.</p>
          )}
        </div>
      )}
          </div>
          )}
      </div>
      {isOpen && (
          <div className="p-4  border-gray-800 mt-auto">
            <button
              onClick={handleWhiteboardClick}
              className="flex items-center justify-center gap-2 w-full p-3 text-white hover:bg-gray-800 rounded-lg transition-colors duration-200"
            >
              <MessageSquare className="h-5 w-5" />
              <span className="text-sm">Open Whiteboard</span>
            </button>
          </div>
        )}

        {isOpen && (
          <div className="p-4 border-t border-gray-800 mt-auto flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-600 flex-shrink-0"></div>

            <div className="flex-1">
              <p className="text-[12px] font-medium text-gray-300">{user.email}</p>
            </div>
            <Link href='/'>
            <button
              className="text-gray-400 hover:text-red-500 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
            </Link>
          </div>
        )}
      {isSettingsModalOpen && (
        <SettingsModal isOpen={isSettingsModalOpen} 
        onClose={()=>setIsSettingsModalOpen(!isSettingsModalOpen)}
         workspaceId={selectedWorkspace?.workspaceId || ""} 
         workspaceName={selectedWorkspace?.workspaceName||""}
         onWorkspaceUpdate={handleWorkspaceUpdate}/>
      )}

    </div>
  );
};
export default Sidebar;