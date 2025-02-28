import SettingsModal from "@/components/Settings";
import { useFile } from "@/hooks/useFile";
import { useFolder } from "@/hooks/useFolder";
import { useWorkspace, Workspace } from "@/hooks/useWorkspaceHook";
import { RootState } from "@/store/store";
import { ChevronRight, File, Folder, Menu, MessageSquare, Plus, RefreshCcw, Settings, Trash } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Sidebar: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const [isOpen, setIsOpen] = useState(true);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [showWorkspaceList, setShowWorkspaceList] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const user = useSelector((state: RootState) => state.user);

  const workspace = useWorkspace();
  if (!workspace) {
    console.log('workspace is null in workspace hook');
    return null;
  }

  const {
    workspaces,
    selectedWorkspace,
    loading: workspaceLoading,
    newWorkspaceName,
    setNewWorkspaceName,
    fetchWorkspaces,
    selectWorkspace,
    findAndSelectWorkspace,
    createWorkspace,
    deleteWorkspace,
    updateWorkspaceName,
  } = workspace;

  const {
    folders,
    trashItems,
    isTrashExpanded,
    setIsTrashExpanded,
    loading: folderLoading,
    editingFolderId,
    editingFolderName,
    setEditingFolderName,
    fetchFolders,
    fetchTrashItems,
    toggleFolderExpansion,
    createFolder,
    updateFolderName,
    moveToTrash: moveFolderToTrash,
    restoreFolder,
    startEditingFolder,
  } = useFolder();

  const {
    selectedFile,
    editingFileId,
    editingFileName,
    setEditingFileName,
    loading: fileLoading,
    createFile,
    openFile,
    renameFile,
    moveToTrash: moveFileToTrash,
    restoreFile,
    startEditingFile,
  } = useFile(selectedWorkspace, fetchFolders);

  useEffect(() => {
    const initializeWorkspace = async () => {
      if (isInitialLoad) {
        const workspaceId = params?.workspaceId as string;
        const fetchedWorkspaces = await fetchWorkspaces();
        
        if (fetchedWorkspaces && fetchedWorkspaces.length > 0) {
          // If we have a workspaceId in the URL, try to select that workspace
          if (workspaceId) {
            const targetWorkspace = fetchedWorkspaces.find((w: Workspace) => w.workspaceId === workspaceId);
            if (targetWorkspace) {
              selectWorkspace(targetWorkspace);
            } else {
              // If workspace in URL not found, select the first one
              selectWorkspace(fetchedWorkspaces[0]);
            }
          } else {
            // No workspace in URL, select the first one
            selectWorkspace(fetchedWorkspaces[0]);
          }
        }
        
        setIsInitialLoad(false);
      }
    };

    initializeWorkspace();
  }, [isInitialLoad, params?.workspaceId]);

  useEffect(() => {
    if (selectedWorkspace?.workspaceId) {
      fetchFolders(selectedWorkspace.workspaceId);
      fetchTrashItems(selectedWorkspace.workspaceId);
      
      // Update URL to match selected workspace without causing a page reload
      const currentUrl = window.location.pathname;
      const targetUrl = `/dashboard/${selectedWorkspace.workspaceId}`;
      
      if (!currentUrl.includes(selectedWorkspace.workspaceId)) {
        router.push(targetUrl);
      }
    }
  }, [selectedWorkspace?.workspaceId]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleWorkspaceUpdate = (updatedWorkspace: { workspaceId: string; workspaceName: string }) => {
    updateWorkspaceName(updatedWorkspace);
  };

  const handleWorkspaceSelect = (workspace: { workspaceId: string; workspaceName: string }) => {
    selectWorkspace(workspace);
    setShowWorkspaceList(false);
  };

  const handleWhiteboardClick = () => {
    if (selectedWorkspace) {
      router.push(`/dashboard/${selectedWorkspace.workspaceId}`);
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
              <span>{selectedWorkspace?.workspaceName || "Select Workspace"}</span>
              <ChevronRight 
                className={`h-4 w-4 transition-transform ${showWorkspaceList ? 'rotate-90' : ''}`}
              />
            </div>
          )}
          <button onClick={handleToggle} className="p-2 rounded-lg text-white hover:bg-gray-800">
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {showWorkspaceList && isOpen && (
          <div className="bg-gray-900 rounded-lg text-white mb-4">
            {workspaces.map((workspace) => (
              <div
                key={workspace.workspaceId}
                className={`group px-3 py-2 hover:bg-gray-700 cursor-pointer rounded-md transition duration-200 flex justify-between items-center ${
                  selectedWorkspace?.workspaceId === workspace.workspaceId ? 'bg-gray-700' : ''
                }`}
                onClick={() => handleWorkspaceSelect(workspace)}
              >
                <span>{workspace.workspaceName}</span>
                <button
                  className="hidden group-hover:block text-gray-300 transition duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteWorkspace(workspace.workspaceId);
                  }}
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            ))}
            <div className="px-3 py-2 border-t border-gray-800">
              <input
                type="text"
                placeholder="New workspace..."
                className="w-full bg-transparent border-none focus:outline-none text-sm text-gray-300"
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") createWorkspace();
                }}
              />
            </div>
          </div>
        )}

        {isOpen && (
          <div className="flex items-center justify-start my-4 text-[13px] uppercase font-semibold py-0">
            <button 
              onClick={() => setIsSettingsModalOpen(true)} 
              className="flex items-center text-white hover:text-white transition duration-200"
            >
              <Settings className="h-6 w-5" />
              <h5 className="text-sm ml-2">Settings</h5>
            </button>
          </div>
        )}

        {isOpen && (
          <div className="flex items-center justify-between text-gray-400 text-[13px] uppercase font-semibold text-start px-2 py-2">
            <span className="text-white">Folders</span>
            <button 
              onClick={() => createFolder(selectedWorkspace?.workspaceId)} 
              className="text-gray-400 hover:text-white transition duration-200"
              disabled={!selectedWorkspace}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        )}

        {isOpen && (
          <div className="flex flex-col gap-1">
            {folders.map((folder) => (
              <div key={folder.id} className="group flex flex-col">
                <div className="flex items-center justify-between px-4 text-white hover:bg-gray-800 cursor-pointer transition duration-200">
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
                        onBlur={() => updateFolderName(folder.id)}
                        onKeyPress={(e) => e.key === 'Enter' && updateFolderName(folder.id)}
                        autoFocus
                      />
                    ) : (
                      <span 
                        className="text-[14px] text-gray-300"
                        onDoubleClick={() => startEditingFolder(folder.id, folder.name)}
                      >
                        {folder.name}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="hidden group-hover:block text-gray-400 hover:text-white transition duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveFolderToTrash(folder.id, selectedWorkspace?.workspaceId);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => createFile(folder.id)}
                      className="hidden group-hover:block text-gray-400 hover:text-white transition duration-200"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {folder.isExpanded && (
                  <div className="ml-8">
                    {folder.files.map((file) => (
                      <div 
                        key={file.fileId} 
                        className={`flex items-center gap-2 px-4 py-1 text-gray-300 cursor-pointer transition duration-200 group ${
                          selectedFile === file.fileId ? 'bg-gray-700' : ''
                        }`}
                        onClick={() => openFile(file.fileId, selectedWorkspace?.workspaceId)}
                      >
                        <File className="h-4 w-4 text-gray-400" />
                        {editingFileId === file.fileId ? (
                          <input
                            type="text"
                            className="bg-transparent border-none focus:outline-none text-sm text-gray-300 w-full"
                            value={editingFileName}
                            onChange={(e) => setEditingFileName(e.target.value)}
                            onBlur={() => renameFile(file.fileId, folder.id)}
                            onKeyPress={(e) => e.key === 'Enter' && renameFile(file.fileId, folder.id)}
                            autoFocus
                          />
                        ) : (
                          <span 
                            className="text-[14px] flex-1"
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              startEditingFile(file.fileId, file.fileName);
                            }}
                          >
                            {file.fileName}
                          </span>
                        )}
                        <button
                          className="ml-auto hidden group-hover:block text-gray-400 hover:text-white transition duration-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveFileToTrash(file.fileId, folder.id, () => fetchFolders(selectedWorkspace?.workspaceId));
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
              className="flex items-center cursor-pointer text-primary transition duration-200"
              onClick={() => setIsTrashExpanded(!isTrashExpanded)}
            >
              <Trash className="h-4 w-4" />
              <span className="font-semibold text-primary text-[13px] ml-2">TRASH</span>
            </div>

            {isTrashExpanded && (
              <div className="ml-4 mt-2">
                {trashItems.folders.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300">Folders</h4>
                    {trashItems.folders.map((folder) => (
                      <div key={folder._id} className="flex items-center justify-between gap-2 text-gray-400">
                        <div className="flex items-center gap-2">
                          <Folder className="h-4 w-4" />
                          <span>{folder.name}</span>
                        </div>
                        <button
                          onClick={() => restoreFolder(folder._id, selectedWorkspace?.workspaceId)}
                          className="text-gray-400 hover:text-white transition duration-200"
                        >
                          <RefreshCcw className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {trashItems.files.length > 0 && (
                  <div className="mt-2">
                    <h4 className="text-sm font-semibold text-gray-300">Files</h4>
                    {trashItems.files.map((file) => (
                      <div key={file._id} className="flex items-center justify-between gap-2 text-gray-400">
                        <div className="flex items-center gap-2">
                          <File className="h-4 w-4" />
                          <span>{file.name}</span>
                        </div>
                        <button
                          onClick={() => restoreFile(file._id, () => fetchFolders(selectedWorkspace?.workspaceId))}
                          className="text-gray-400 hover:text-white transition duration-200"
                        >
                          <RefreshCcw className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {trashItems.folders.length === 0 && trashItems.files.length === 0 && (
                  <p className="text-sm text-gray-400">No items in trash.</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {isOpen && (
        <div className="p-4 border-gray-800 mt-auto">
          <button
            onClick={handleWhiteboardClick}
            className="flex items-center justify-center gap-2 w-full p-3 text-white rounded-lg transition-colors duration-200"
            disabled={!selectedWorkspace}
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
          <Link href="/">
            <button className="text-gray-400 hover:text-red-500 transition">
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
        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          workspaceId={selectedWorkspace?.workspaceId || ""}
          workspaceName={selectedWorkspace?.workspaceName || ""}
          onWorkspaceUpdate={handleWorkspaceUpdate}
        />
      )}
    </div>
  );
};

export default Sidebar;