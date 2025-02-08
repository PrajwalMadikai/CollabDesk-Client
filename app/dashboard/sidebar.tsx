"use client";
import { API } from "@/api/handle-token-expire";
import { RootState } from "@/store/store";
import { Folder, Menu, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [folders, setFolders] = useState<{ id: string; name: string }[]>([]);
  const [workspaces, setWorkspaces] = useState<{ workspaceId: string; workspaceName: string }[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<{ workspaceId: string; workspaceName: string } | null>(null);
  const [showWorkspaceList, setShowWorkspaceList] = useState<boolean>(false);
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [newName, setNewName] = useState<string>("");

  const user = useSelector((state: RootState) => state.user);
  const token = localStorage.getItem("accessToken");
  const userId: string | null = user.id;

  useEffect(() => {
    const fetchSpace = async () => {
      try {
        let response = await API.post("/workspace/fetch", { userId }, { withCredentials: true });
        const fetchedWorkspaces = response.data.workspace;
        console.log("Workspaces:", fetchedWorkspaces);

        setWorkspaces(fetchedWorkspaces);
        if (fetchedWorkspaces.length > 0) {
          setSelectedWorkspace(fetchedWorkspaces[0]);
        }
      } catch (error) {
        console.error("Error fetching workspaces:", error);
      }
    };
    fetchSpace();
  }, [userId, token]);

  const fetchFolders = async () => {
    try {
      console.log("Fetching latest folders...");
      let response = await API.post("/folder/fetch", { workspaceId: selectedWorkspace?.workspaceId }, { withCredentials: true });

      console.log("Fetched folders:", response.data.folders);

      if (response.data.folders) {
        setFolders(response.data.folders);
      }
    } catch (error) {
      console.error("Error fetching folders:", error);
    }
  };

  /** ✅ Call `fetchFolders` when `selectedWorkspace` changes */
  useEffect(() => {
    if (selectedWorkspace?.workspaceId) {
      fetchFolders();
    }
  }, [selectedWorkspace?.workspaceId]);

  const addFolder = async () => {
    try {
      const response = await API.post("/folder/create", { name: "Untitled", workspaceId: selectedWorkspace?.workspaceId }, { withCredentials: true });
      if (response?.data?.result) {
        let folderData = { id: response.data.result.id, name: response.data.result.name };
        setFolders([...folders, folderData]);
      }
    } catch (err) {
      console.error("Failed to create folder:", err);
    }
  };

  const startEditing = (folderId: string, currentName: string) => {
    setEditingFolderId(folderId);
    setNewName(currentName);
  };

  /** ✅ Call `fetchFolders` after renaming */
  const renameFolder = async (folderId: string) => {
    try {
      if (!newName.trim()) {
        console.error("Folder name cannot be empty");
        return;
      }

      let response = await API.put(`/folder/update/${folderId}`, { newName }, { withCredentials: true });

      if (response.data.folder) {
        console.log("Folder renamed successfully:", response.data.folder);

       
       await fetchFolders();
      }

      setNewName("");
      setEditingFolderId(null);
    } catch (err) {
      console.error("Failed to rename folder:", err);
    }
  };

  return (
    <div className={`fixed inset-y-0 left-0 bg-black border-r border-gray-800 transition-all duration-300 ${isOpen ? "w-64" : "w-16"}`}>
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
              <div key={workspace.workspaceId} className="px-3 py-2 hover:bg-gray-700 cursor-pointer rounded-md" onClick={() => setSelectedWorkspace(workspace)}>
                {workspace.workspaceName}
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-gray-400 text-[13px] uppercase font-semibold text-start px-2 py-2">
          <span className="text-white">Folders</span>
          <button onClick={addFolder} className="text-gray-400 hover:text-white">
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {folders.map((folder) => (
            <div key={folder.id} className="flex items-center gap-2 px-4 py-2 text-white hover:bg-gray-800 cursor-pointer">
              <Folder className="h-5 w-5 text-gray-400" />

              <div className="flex-1">
                {editingFolderId === folder.id ? (
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onBlur={() => renameFolder(folder.id)}
                    onKeyDown={(e) => e.key === "Enter" && renameFolder(folder.id)}
                    autoFocus
                    className="bg-transparent text-white outline-none px-1 w-full"
                  />
                ) : (
                  <span onClick={() => startEditing(folder.id, folder.name)} className="text-[14px] text-gray-300">
                    {folder.name}
                  </span>
                )}
              </div>
            </div>
          ))}

          <div className="flex items-center gap-2 px-4 py-2 text-white hover:bg-gray-800 cursor-pointer mt-4">
            <Trash2 className="h-5 w-5 text-gray-400" />
            <span>Trash</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
