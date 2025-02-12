import { RootState } from "@/store/store";
import { FileText, Folder, Menu, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API } from "../api/handle-token-expire";

const Sidebar: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [folders, setFolders] = useState<{ id: string; name: string; files: { fileId: string; fileName: string }[] }[]>([]);
  const [workspaces, setWorkspaces] = useState<{ workspaceId: string; workspaceName: string }[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<{ workspaceId: string; workspaceName: string } | null>(null);
  const [showWorkspaceList, setShowWorkspaceList] = useState<boolean>(false);
  const user = useSelector((state: RootState) => state.user);
  const token = localStorage.getItem("accessToken");
  const userId: string | null = user.id;

  useEffect(() => {
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
    fetchSpace();
  }, [userId, token, params.workspaceId]);

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
    router.push(`/dashboard/${workspace.workspaceId}`);
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

  const fileFetch = async (folderId: string) => {
    try {
      const response = await API.post('/file/fetch', { folderId }, { withCredentials: true });
      if (response.status === 200) {
        setFolders((prevFolders) =>
          prevFolders.map((folder) =>
            folder.id === folderId
              ? { ...folder, files: response.data.files }
              : folder
          )
        );
      }
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const handleAddFile = async (folderId: string) => {
    try {
      console.log('front end:',folderId);
      
      if (!folderId) {
        console.error("Missing folderId");
        return;
      }

      const response = await API.post("/file/create", { 
         folderId 
      }, { withCredentials: true });

      if (response.status === 201) {
        const newFile = response.data.file;

        if (!userId || !user.email) {
          console.error("Missing user information");
          return;
        }

        const roomResponse = await fetch(`/api/create-room`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roomId: newFile.id,
            userId,
            email: user.email,
            title: newFile.name || 'Untitled',
          }),
        });

        if (!roomResponse.ok) {
          const errorData = await roomResponse.json();
          throw new Error(`Failed to create room: ${errorData.message}`);
        }

        // Update the folders state with the new file
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

        // Optionally refresh the folder to ensure consistency
        fetchFolders();
      }
    } catch (error) {
      console.error("Error creating file and room:", error);
    }
  };

  const handleFileClick = (fileId: string) => {
    if (selectedWorkspace?.workspaceId) {
      router.push(`/dashboard/${selectedWorkspace.workspaceId}/${fileId}`);
    }
  };

  return (
    <div className={`fixed inset-y-0 left-0 bg-black border-r border-gray-800 transition-all duration-300 ease-in-out ${isOpen ? "w-64" : "w-16"} flex flex-col`}>
      <div className="p-4 flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          {isOpen && (
            <div className="text-white text-lg font-semibold cursor-pointer" onClick={() => setShowWorkspaceList(!showWorkspaceList)}>
              {selectedWorkspace?.workspaceName}
            </div>
          )}
          <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-lg text-white hover:bg-gray-800">
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {showWorkspaceList && isOpen && (
          <div className="bg-gray-900 p-2 rounded-lg text-white">
            {workspaces.map((workspace) => (
              <div
                key={workspace.workspaceId}
                className="px-3 py-2 hover:bg-gray-700 cursor-pointer rounded-md transition duration-200"
                onClick={() => handleWorkspaceSelect(workspace)}
              >
                {workspace.workspaceName}
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-gray-400 text-[13px] uppercase font-semibold text-start px-2 py-2">
          <span className="text-white">Folders</span>
          <button onClick={handleAddFolder} className="text-gray-400 hover:text-white transition duration-200">
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col gap-2">
        {folders.map((folder) => (
          <div key={folder.id} className="group flex flex-col" onClick={() => fileFetch(folder.id)}>
            <div className="flex items-center justify-between px-4 py-2 text-white hover:bg-gray-800 cursor-pointer transition duration-200">
              <div className="flex items-center gap-2">
                <Folder className="h-5 w-5 text-gray-400" />
                <span className="text-[14px] text-gray-300">{folder.name}</span>
              </div>
              <button onClick={() => handleAddFile(folder.id)} className="hidden group-hover:block text-gray-400 hover:text-white transition duration-200">
                <Plus className="h-4 w-4" />
              </button>
            </div>
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
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};

export default Sidebar;