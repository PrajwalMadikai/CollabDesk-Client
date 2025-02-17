import SettingsModal from "@/components/Settings";
import { RootState } from "@/store/store";
import { ChevronRight, FileText, Folder, Menu, Plus, Settings } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { API } from "../api/handle-token-expire";

const Sidebar: React.FC = () => {
  
  const router = useRouter();
  const params = useParams();
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [folders, setFolders] = useState<{ id: string; name: string; files: { fileId: string; fileName: string }[]; isExpanded?: boolean }[]>([]);
  const [workspaces, setWorkspaces] = useState<{ workspaceId: string; workspaceName: string }[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<{ workspaceId: string; workspaceName: string } | null>(null);
  const [showWorkspaceList, setShowWorkspaceList] = useState<boolean>(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState<string>("");
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingFolderName, setEditingFolderName] = useState<string>("");
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const user = useSelector((state: RootState) => state.user);
  const token = localStorage.getItem("accessToken");
  const userId: string | null = user.id;

  useEffect(() => {
    
    fetchSpace();

  }, [userId, token, params.workspaceId]);

  const fetchSpace = async () => {
    try {
      let response = await API.post("/workspace/fetch", { userId }, { withCredentials: true });
      const fetchedWorkspaces = response.data.workspace;
      setWorkspaces(fetchedWorkspaces);

      if (fetchedWorkspaces.length > 0) {
        const initialWorkspace = fetchedWorkspaces.find((w: { workspaceId: string | string[] | undefined }) => w.workspaceId === params.workspaceId) || fetchedWorkspaces[0];
        setSelectedWorkspace(initialWorkspace);
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
      try {
        const response = await API.post("/workspace/create", {
          spaceName: newWorkspaceName,
          userId
        }, { withCredentials: true });
        
        if (response.status === 201) {
          const newWorkspace = response.data.workspace;
        setWorkspaces((prevWorkspaces) => [...prevWorkspaces, newWorkspace]);
          setNewWorkspaceName("");
          fetchSpace()
        }
      } catch (error) {
        console.error("Error creating workspace:", error);
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
    }
  }, [selectedWorkspace?.workspaceId]);

  const handleWorkspaceSelect = (workspace: { workspaceId: string; workspaceName: string }) => {
    setSelectedWorkspace(workspace);
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
        const response = await API.post("/folder/update", {
          folderId,
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
    try {
      const response = await API.post("/folder/create", {
        name: "Untitled",
        workspaceId: selectedWorkspace.workspaceId,
      }, { withCredentials: true });
      if (response.status === 200) {
        setFolders([...folders, { ...response.data.folder, files: [] }]);
        
      }
    } catch (error) {
      console.error("Error creating folder:", error);
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
            title: newFile.name || "Untitled",
          }),
        });
  
        if (!roomResponse.ok) {
          throw new Error("Failed to create room");
        }
  
        setFolders((prevFolders) =>
          prevFolders.map((folder) =>
            folder.id === folderId 
              ? { 
                  ...folder, 
                  files: [...(folder.files || []), { 
                    fileId: newFile.id,
                    fileName: newFile.name
                  }]
                } 
              : folder
          )
        );
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
          <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-lg text-white hover:bg-gray-800">
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

        <div className="flex flex-col gap-2">
          {folders.map((folder) => (
            <div key={folder.id} className="group flex flex-col">
              <div className="flex items-center justify-between px-4 py-2 text-white hover:bg-gray-800 cursor-pointer transition duration-200">
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
                <button onClick={() => handleAddFile(folder.id)} className="hidden group-hover:block text-gray-400 hover:text-white transition duration-200">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              {folder.isExpanded && (
                <div className="ml-8">
                  {(folder.files || []).map((file) => (  
                    <div 
                      key={file.fileId} 
                      className={`flex items-center gap-2 px-4 py-1 text-gray-300 hover:bg-gray-700 cursor-pointer transition duration-200 ${
                        params.fileId === file.fileId ? 'bg-gray-700' : ''
                      }`}
                      onClick={() => handleFileClick(file.fileId)}
                    >
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-[14px]">{file.fileName}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
       )}
      </div>
      {/* setting section  */}
      {isSettingsModalOpen && (
        <SettingsModal isOpen={isSettingsModalOpen} onClose={()=>setIsSettingsModalOpen(!isSettingsModalOpen)}
         workspaceId={selectedWorkspace?.workspaceId || ""} workspaceName={selectedWorkspace?.workspaceName||""}/>
      )}

    </div>
  );
};
export default Sidebar;