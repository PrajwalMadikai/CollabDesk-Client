import { Briefcase, User } from "lucide-react";
import { useSelector } from "react-redux";
import useSettings from "../hooks/useSettings";
import { RootState } from "../store/store";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "./ui/sheet";

interface SettingsModalProps {
  isSidebarOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  workspaceName: string;
  onWorkspaceUpdate?: (workspace: { workspaceId: string; workspaceName: string }) => void;
  setIsSettingsModalOpen?: (value: React.SetStateAction<boolean>) => void;  
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isSidebarOpen,
  onClose,
  workspaceId,
  workspaceName,
}) => {
  const mainUser = useSelector((state: RootState) => state.user);
   
  const {
    collaborators,
    availableUsers,
    searchQuery,
    setSearchQuery,
    isWorkspaceNameEditing,
    setIsWorkspaceNameEditing,
    workspaceNameInput,
    setWorkspaceNameInput,
    isUserNameEditing,
    setIsUserNameEditing,
    userNameInput,
    setUserNameInput,
    handleAddCollaborator,
    removeCollaborator,
    debouncedRenameWorkspace,
    debouncedUpdateUserName,
    addingUser,
  } = useSettings(workspaceId, workspaceName);
  
  const handleRenameWorkspace = (newName: string) => {
    debouncedRenameWorkspace(newName);
  };

  const handleUpdateUserName = (newName: string) => {
    debouncedUpdateUserName(newName);
  };

  if (!isSidebarOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
      <div className="bg-gray-950 h-[600px] rounded-[4px] p-6 w-[500px] relative">
        <h2 className="text-white text-lg font-semibold mb-4">Settings</h2>

        {/* Workspace Section */}
        <div className="mb-4">
          <h3 className="text-gray-300 flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Workspace
          </h3>
          <label className="text-gray-400 text-sm block mt-2">Name</label>
           {isWorkspaceNameEditing ? (
            <input
              type="text"
              value={workspaceNameInput}
              onChange={(e) => setWorkspaceNameInput(e.target.value)}
              onBlur={() => handleRenameWorkspace(workspaceNameInput)}  
              autoFocus
              className="w-full p-2 bg-gray-800 text-white rounded-[2px] mt-1 h-12 pl-5 outline-none"
            />
          ) : (
            <div
              onClick={() => setIsWorkspaceNameEditing(true)}
              className="w-full p-2 bg-gray-800 text-white rounded-[2px] mt-1 h-12 pl-5 cursor-pointer"
            >
              {workspaceNameInput}
            </div>
          )}
        </div>

        {/* Add Collaborators Button and Sheet */}
        <div className="mb-4 py-3">
        <Sheet >
            <SheetTrigger asChild >
              <Button className="w-full my-3 bg-white text-black py-2 rounded-md">
                + Add Collaborators
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-black text-white">
              <SheetHeader >
                <SheetTitle className="text-white">Add Collaborators</SheetTitle>
                <SheetDescription>
                  Select users to add as collaborators.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                {/* Search Input */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="search" className="text-right">
                    Search
                  </Label>
                  <Input
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="col-span-3"
                    placeholder="Search for users..."
                  />
                </div>

                {/* List of Available Users */}
                <div className="max-h-60 overflow-y-auto">
                {searchQuery.trim() === '' ? (
                  <p className="text-gray-400 text-sm p-2">Enter a name to search for users.</p>
                ) : (
                  availableUsers.length > 0 ? (
                    availableUsers
                      .filter((user) =>
                        user.email.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-2 rounded-[5px] mb-2   transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center text-white  w-8 h-8 rounded-full border border-gray-500 text-xs font-semibold bg-gray-600">
                              {user.email.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-white text-xs">{user.email}</p>
                            </div>
                          </div>

                          {/* Add Button */}
                          <button
                            className="w-[70px] h-7 rounded text-sm font-medium bg-gray-700 text-white hover:bg-blue-700 transition-colors"
                            onClick={() => handleAddCollaborator(user.email)}
                            aria-label={`Add ${user.email} as collaborator`}
                            disabled={addingUser === user.email}
                          >
                            {addingUser === user.email ? "Adding..." : "Add"}
                          </button>
                        </div>
                      ))
                  ) : (
                    <p className="text-gray-400 text-sm p-2">No users available.</p>
                  )
                )}

                {searchQuery.trim() !== '' && availableUsers.filter((user) =>
                  user.email.toLowerCase().includes(searchQuery.toLowerCase())
                ).length === 0 && availableUsers.length > 0 && (
                  <p className="text-gray-400 text-sm p-2">No users found.</p>
                )}
              </div>
              </div>
            </SheetContent>
          </Sheet>

          <h3 className="text-gray-300 text-[16px]">Collaborators</h3>
          <div className="max-h-[100px] min-h-2  bg-gray-800 rounded-[3px] p-2 mt-2  overflow-y-auto custom-scrollbar"
            >
              {collaborators.length > 0 ? (
                collaborators.map((collaborator) => (
                  <div
                    key={collaborator.email}
                    className="flex items-center justify-between bg-gray-800 border border-gray-700 p-2 rounded-[5px] mb-2 transition duration-200 hover:bg-gray-700"
                  >
                    {/* Collaborator Details */}
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-gray-600 flex-shrink-0 flex items-center justify-center">
                        <span className="text-[12px] font-medium text-white">
                          {collaborator?.email.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-white text-sm">{collaborator.email}</p>
                        <p className="text-gray-400 text-xs">{collaborator.fullname}</p>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      className="text-red-600 text-sm font-medium hover:text-red-500 transition duration-200"
                      onClick={() => removeCollaborator(collaborator.email)}
                      aria-label={`Remove ${collaborator.email}`}
                    >
                      Remove
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm min-h-[50px]">No collaborators added yet.</p>
              )}
            </div>
        </div>

        <div className={`${collaborators.length<1? `mt-14`:'mt-0'} border-t border-gray-700 pt-4`}>
          <h3 className="text-gray-300 flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile
          </h3>
          <label className="text-gray-400 text-sm block mt-2 py-2">Preferred Name</label>
          <div className="flex items-center bg-gray-800  pl-5 rounded-[3px]">
          <div className="w-7 h-7 rounded-full bg-gray-600 flex-shrink-0 flex items-center justify-center">
            <span className="text-[12px] font-medium text-white">
              {mainUser?.email?.substring(0, 2).toUpperCase()}
            </span>
          </div>
            {isUserNameEditing ? (
            <input
              type="text"
              value={userNameInput||''}
              onChange={(e) => setUserNameInput(e.target.value)}
              onBlur={() => handleUpdateUserName(userNameInput||"")}  
              className="w-full p-2 bg-gray-800 text-white rounded-[2px] mt-1 h-10 pl-5 outline-none"
            />
          ) : (
            <div
              onClick={() => setIsUserNameEditing(true)}
              className="w-full p-2 bg-transparent text-white rounded-[2px]  h-10 pl-5 cursor-pointer"
            >
              {userNameInput}
            </div>
          )}
          </div>
          <p className="text-gray-400 mt-2 ">{mainUser.email}</p>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition duration-200"
        >
          <span className="text-sm">Cancel</span>
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;