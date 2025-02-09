"use client";
import { API } from "@/api/handle-token-expire";
import { RootState } from "@/store/store";
import { ChevronDown, ChevronRight, Folder, Menu, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface File {
  fileId: string;
  fileName: string;
}

interface Folder {
  id: string;
  name: string;
  files: File[];
}

interface Workspace {
  workspaceId: string;
  workspaceName: string;
}

const Sidebar: React.FC = () => {
  
  const user=useSelector((state:RootState)=>state.user)

  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [showWorkspaceList, setShowWorkspaceList] = useState<boolean>(false);
  const [expandedFolders, setExpandedFolders] = useState<{ [key: string]: boolean }>({});
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [newName, setNewName] = useState<string>("");

  const userId=user.id

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  useEffect(() => {
    if (selectedWorkspace?.workspaceId) {
      fetchFolders();
    }
  }, [selectedWorkspace?.workspaceId]);

  const fetchWorkspaces = async () => {
    try {
      const response = await API.post("/workspace/fetch", { userId }, { withCredentials: true });
      const fetchedWorkspaces = response.data.workspace;
      setWorkspaces(fetchedWorkspaces);
      if (fetchedWorkspaces.length > 0) {
        setSelectedWorkspace(fetchedWorkspaces[0]);
      }
    } catch (error) {
      console.error("Error fetching workspaces:", error);
    }
  };

  const fetchFolders = async () => {
    try {
      const response = await API.post(
        "/folder/fetch",
        { workspaceId: selectedWorkspace?.workspaceId },
        { withCredentials: true }
      );
      if (response.data.folders) {
        setFolders(response.data.folders);
      }
    } catch (error) {
      console.error("Error fetching folders:", error);
    }
  };

  const createFolder = async () => {
    if (!selectedWorkspace) return;
    
    try {
      const response = await API.post(
        "/folder/create",
        {
          workspaceId: selectedWorkspace.workspaceId,
          name: "New Folder"
        },
        { withCredentials: true }
      );

      if (response.data.folder) {
        setFolders(prevFolders => [...prevFolders, { 
          id: response.data.folder.id,
          name: response.data.folder.name,
          files: []
        }]);
        setEditingFolderId(response.data.folder.id);
        setNewName(response.data.folder.name);
      }
    } catch (err) {
      console.error("Failed to create folder:", err);
    }
  };

  const renameFolder = async (folderId: string) => {
    try {
      if (!newName.trim()) {
        setEditingFolderId(null);
        setNewName("");
        return;
      }

      await API.put(
        `/folder/update/${folderId}`,
        { newName },
        { withCredentials: true }
      );

      setFolders(prevFolders =>
        prevFolders.map(folder =>
          folder.id === folderId ? { ...folder, name: newName } : folder
        )
      );

      setEditingFolderId(null);
      setNewName("");
    } catch (err) {
      console.error("Failed to rename folder:", err);
      setEditingFolderId(null);
      setNewName("");
    }
  };

  const addFileToFolder = async (folderId: string) => {
    try {
      const response = await API.post(
        "/file/create",
        { folderId, name: "New File" },
        { withCredentials: true }
      );

      if (response.data.file) {
        setFolders(prevFolders =>
          prevFolders.map(folder =>
            folder.id === folderId
              ? {
                  ...folder,
                  files: [...folder.files, {
                    fileId: response.data.file.id,
                    fileName: response.data.file.name
                  }]
                }
              : folder
          )
        );
        setExpandedFolders(prev => ({ ...prev, [folderId]: true }));
      }
    } catch (err) {
      console.error("Failed to add file:", err);
    }
  };

  const deleteFile = async (folderId: string, fileId: string) => {
    try {
      await API.delete(`/file/delete/${fileId}`, { withCredentials: true });
      setFolders(prevFolders =>
        prevFolders.map(folder =>
          folder.id === folderId
            ? { ...folder, files: folder.files.filter(file => file.fileId !== fileId) }
            : folder
        )
      );
    } catch (err) {
      console.error("Failed to delete file:", err);
    }
  };

  const deleteFolder = async (folderId: string) => {
    try {
      await API.delete(`/folder/delete/${folderId}`, { withCredentials: true });
      setFolders(prevFolders => prevFolders.filter(folder => folder.id !== folderId));
    } catch (err) {
      console.error("Failed to delete folder:", err);
    }
  };

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => ({ ...prev, [folderId]: !prev[folderId] }));
  };

  const handleWorkspaceSelect = (workspace: Workspace) => {
    setSelectedWorkspace(workspace);
    setShowWorkspaceList(false);
  };

  return (
    <div className={`fixed inset-y-0 left-0 bg-black border-r border-gray-800 transition-all duration-300 ${isOpen ? "w-64" : "w-16"}`}>
      <div className="p-4 flex flex-col h-full relative">
        {/* Workspace Selection */}
        <div className="flex justify-between items-center mb-4 relative">
          {isOpen && (
            <>
              <div
                className="text-white text-lg font-semibold cursor-pointer relative flex items-center gap-2"
                onClick={() => setShowWorkspaceList(!showWorkspaceList)}
              >
                {selectedWorkspace?.workspaceName}
                <ChevronDown className="h-4 w-4" />
              </div>
              
              {/* Workspace Dropdown */}
              {showWorkspaceList && (
                <div className="absolute top-full left-0 w-full bg-gray-900 rounded-md mt-1 py-1 z-50">
                  {workspaces.map(workspace => (
                    <div
                      key={workspace.workspaceId}
                      className="px-4 py-2 hover:bg-gray-800 cursor-pointer text-white text-sm"
                      onClick={() => handleWorkspaceSelect(workspace)}
                    >
                      {workspace.workspaceName}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg text-white hover:bg-gray-800"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Folder Section */}
        {isOpen && (
          <>
            <div className="flex justify-between items-center text-gray-400 text-[13px] uppercase font-semibold text-start px-2 py-2">
              <span className="text-white">Folders</span>
              <button
                onClick={createFolder}
                className="text-gray-400 hover:text-white"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {folders.map(folder => (
                <div key={folder.id} className="group">
                  <div className="flex items-center justify-between px-4 py-2 text-white hover:bg-gray-800 cursor-pointer rounded">
                    <div className="flex items-center gap-2 flex-1">
                      <button onClick={() => toggleFolder(folder.id)}>
                        {expandedFolders[folder.id] ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                      <Folder className="h-5 w-5" />
                      {editingFolderId === folder.id ? (
                        <input
                          type="text"
                          value={newName}
                          onChange={e => setNewName(e.target.value)}
                          onBlur={() => renameFolder(folder.id)}
                          onKeyDown={e => e.key === "Enter" && renameFolder(folder.id)}
                          autoFocus
                          className="bg-transparent text-white outline-none px-1 w-full"
                        />
                      ) : (
                        <span
                          className="text-[14px] text-gray-300 flex-1"
                          onClick={() => {
                            setEditingFolderId(folder.id);
                            setNewName(folder.name);
                          }}
                        >
                          {folder.name}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => deleteFolder(folder.id)}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => addFileToFolder(folder.id)}>
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Files List */}
                  {expandedFolders[folder.id] && folder.files.length > 0 && (
                    <div className="ml-8 mt-1">
                      {folder.files.map(file => (
                        <div
                          key={file.fileId}
                          className="flex items-center justify-between px-4 py-2 text-gray-300 hover:bg-gray-800 rounded group"
                        >
                          <span className="text-[13px]">{file.fileName}</span>
                          <button
                            onClick={() => deleteFile(folder.id, file.fileId)}
                            className="opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;