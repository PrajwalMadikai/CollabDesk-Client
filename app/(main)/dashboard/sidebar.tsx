import SettingsModal from "@/components/Settings";
import VideoCallButton from "@/components/Video Call/VideoCallButton";
import { useFile } from "@/hooks/useFile";
import { useFolder } from "@/hooks/useFolder";
import { useProfile } from "@/hooks/useProfile";
import { useWorkspace, Workspace } from "@/hooks/useWorkspaceHook";
import { setUser } from "@/store/slice/userSlice";
import { RootState } from "@/store/store";
import { ChevronRight, File, Folder, Menu, MessageSquare, Plus, RefreshCcw, Settings, Trash } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Sidebar: React.FC = () => {

  const router = useRouter();
  const params = useParams();
  const dispatch=useDispatch()
  const [isOpen, setIsOpen] = useState(true);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [showWorkspaceList, setShowWorkspaceList] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
 
  const user = useSelector((state: RootState) => state.user);

console.log('user detail sidebar:',user);
  if(!user.email||!user.id)
  {
    return
  }
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
    updateFileNameInFolder
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
  } = useFile(selectedWorkspace, fetchFolders,updateFileNameInFolder,fetchTrashItems);

  const {
    fetchUserDetils,
    userProfile,
    handleImageUpload,
    handleChange,
    handleSubmit,
    error,
    newPassword
  }=useProfile()

  

  useEffect(() => {
    const initializeWorkspace = async () => {
      if (isInitialLoad) {
        const workspaceId = params?.workspaceId as string;
        const fetchedWorkspaces = await fetchWorkspaces();
        
        if (fetchedWorkspaces && fetchedWorkspaces.length > 0) {
          if (workspaceId) {
            const targetWorkspace = fetchedWorkspaces.find((w: Workspace) => w.workspaceId === workspaceId);
            if (targetWorkspace) {
              selectWorkspace(targetWorkspace);
            } else {
              selectWorkspace(fetchedWorkspaces[0]);
            }
          } else {
            selectWorkspace(fetchedWorkspaces[0]);
          }
        }
        
        setIsInitialLoad(false);
      }
    };

    initializeWorkspace();
  
  }, [isInitialLoad, params?.workspaceId]);

  useEffect(()=>{
    const userData=localStorage.getItem('user')
    if(userData){
    const user=JSON.parse(userData)
    
    dispatch(setUser({
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      isAuthenticated: true,
      planType: user.paymentDetail.paymentType,
      workSpaces: user.workSpaces,
      avatar:user.googleId
    }))
  }
  if(user.id){
  fetchUserDetils(user.id)
  }
  },[])

  useEffect(() => {
    if (selectedWorkspace?.workspaceId) {
      fetchFolders(selectedWorkspace.workspaceId);
      fetchTrashItems(selectedWorkspace.workspaceId);
      
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
      router.push(`/dashboard/whiteboard/${selectedWorkspace.workspaceId}`);
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
                        className="bg-transparent w-[100px]  border-none focus:outline-none text-sm text-gray-300"
                        value={editingFolderName}
                        onChange={(e) => setEditingFolderName(e.target.value)}
                        onBlur={() => updateFolderName(folder.id,user.email)}
                        onKeyPress={(e) => e.key === 'Enter' && updateFolderName(folder.id,user.email)}
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
                        moveFolderToTrash(folder.id, selectedWorkspace?.workspaceId,user.email);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => createFile(folder.id,user.email)}
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
                            onBlur={() => renameFile(file.fileId, folder.id,user.email)}
                            onKeyPress={(e) => e.key === 'Enter' && renameFile(file.fileId, folder.id,user.email)}
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
                            moveFileToTrash(file.fileId, folder.id,user.email, () => fetchFolders(selectedWorkspace?.workspaceId));
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
                          onClick={() => restoreFolder(folder._id, selectedWorkspace?.workspaceId,user.email)}
                          className="text-gray-400 hover:text-white transition duration-200"
                        >
                          <RefreshCcw className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {trashItems.files.length > 0 && (
                  <div className="mt-2 ">
                    <h4 className="text-sm font-semibold text-gray-300">Files</h4>
                    {trashItems.files.map((file) => (
                      <div key={file._id} className="flex items-center justify-between gap-2 text-gray-400">
                        <div className="flex items-center gap-2">
                          <File className="h-4 w-4" />
                          <span>{file.name}</span>
                        </div>
                        <button
                          onClick={() => restoreFile(file._id,user.email, () => fetchFolders(selectedWorkspace?.workspaceId))}
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
      {}
      <VideoCallButton workspaceId={params?.workspaceId as string}  />
      {isOpen && (
        <div className="p-4 border-gray-800 mt-auto">
          <button
            onClick={handleWhiteboardClick}
            className="flex items-center justify-center gap-2 w-full p-3 text-white rounded-lg transition-colors duration-200"
          >
            <MessageSquare className="h-5 w-5" />
            <span className="text-sm">Open Whiteboard</span>
          </button>
        </div>
      )}

      {isOpen && (
        <div className="p-4 border-t border-gray-800 mt-auto flex justify-center items-center gap-[35px]">
          {/* Profile Section */}
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="flex items-center gap-2 cursor-pointer  "
          >
            {/* Profile Image */}
            <div className="w-8 h-8 rounded-full bg-gray-600 overflow-hidden flex-shrink-0">
              {userProfile?.avatar && (
                <img
                  src={userProfile.avatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            {/* Profile Text */}
            <div className="flex-1">
              <p className="text-[14px] font-semibold text-white">Profile</p>
            </div>
          </button>

          <span className="text-white">|</span>

          <Link href="/">
            <button className="text-white hover:text-white transition">
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
      {isProfileModalOpen && (
        <div
        className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
        onClick={() => setIsProfileModalOpen(false)}  
      >
        <div
          className="bg-gray-950 p-6 rounded-[4px] h-[550px] w-[650px] relative flex flex-col justify-between overflow-hidden"
          onClick={(e) => e.stopPropagation()}  
        >
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-white transition"
            onClick={() => setIsProfileModalOpen(false)}
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Profile Image Upload */}
          <div className="flex flex-col items-center justify-center flex-grow">
            <label
              htmlFor="profile-image"
              className="w-20 h-20 rounded-full bg-gray-600 flex items-center justify-center cursor-pointer hover:bg-gray-700 transition overflow-hidden relative"
            >
              {userProfile?.avatar ? (
                <img
                  src={userProfile.avatar}
                  alt="User Avatar"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
              )}
            </label>

            {/* Hidden Input for File Upload */}
            <input
              id="profile-image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(e, user.id)}
            />

            <p className="text-sm text-gray-400 mt-2">Upload Profile Image</p>
          </div>

          {/* Email Field */}
          <div className="mb-2">
            <label className="block text-xs text-gray-400">Email</label>
            <input
              type="text"
              value={userProfile?.email }
              readOnly
              className="w-full bg-gray-800 text-gray-300 text-sm px-3 py-2 rounded mt-1 focus:outline-none"
            />
          </div>

          <div className="flex gap-4 mt-4">
            <div className="flex-1">
              <label className="block text-xs text-gray-400">Payment Plan</label>
              <input
                type="text"
                value={
                  userProfile?.paymentPlan === 'Non'
                    ? 'No Plan Purchased'
                    : userProfile?.paymentPlan
                    ? `${userProfile.paymentPlan[0].toLocaleUpperCase()}${userProfile.paymentPlan.slice(1)} Subscription`
                    : 'No Plan Selected'
                }
                readOnly
                className="w-full bg-gray-800 text-gray-300 text-sm px-3 py-2 rounded mt-1 focus:outline-none"
              />
            </div>
            {userProfile?.paymentPlan !== 'Non' && (
            <div className="flex-1">
              <label className="block text-xs text-gray-400">Expiration Date</label>
              <input
                type="text"
                value={userProfile?.expireDate ? new Date(userProfile.expireDate).toLocaleDateString() : "N/A"}
                readOnly
                className="w-full bg-gray-800 text-gray-300 text-sm px-3 py-2 rounded mt-1 focus:outline-none"
              />
            </div>
          )}
          </div>

          <form onSubmit={()=>handleSubmit(user.id)} className="flex-grow mt-7">
            <label className="block text-xs text-gray-400">New Password</label>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={handleChange}
              className={`w-full bg-gray-800 text-gray-300 text-sm px-3 py-2 rounded mt-1 focus:outline-none ${
                error ? 'border border-red-500' : ''
              }`}
            />
            {error && (
              <p className="text-red-500 text-xs mt-1">{error}</p>
            )}

            <button
              type="submit"
              className="mt-6 w-full bg-green-600 text-white text-sm py-2 rounded hover:bg-green-700 transition"
            >
              Save Password
            </button>
          </form>
        </div>
      </div>
      )}
    </div>
  );
};

export default Sidebar;