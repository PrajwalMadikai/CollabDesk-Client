import { API } from "@/app/api/handle-token-expire";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { ResponseStatus } from "@/enums/responseStatus";
import getResponseStatus from "@/lib/responseStatus";
import { updateName } from "@/store/slice/userSlice";
import { RootState } from "@/store/store";
import { Briefcase, User } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";


const SettingsModal = ({
  isOpen,
  onClose,
  workspaceId,
  workspaceName,
  onWorkspaceUpdate
}: {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  workspaceName: string;
  onWorkspaceUpdate?: (workspace: { workspaceId: string; workspaceName: string }) => void;
}) => {
  const dispatch=useDispatch()
  const mainUser=useSelector((state:RootState)=>state.user)
  const [addingUser, setAddingUser] = useState<string | null>(null);
  const [collaborators, setCollaborators] = useState<{ id: string; email: string }[]>([]);
  const [availableUsers, setAvailableUsers] = useState<{ id: string; fullname: string; email: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isWorkspaceNameEditing, setIsWorkspaceNameEditing] = useState(false);
  const [workspaceNameInput, setWorkspaceNameInput] = useState(workspaceName);

  const [isUserNameEditing, setIsUserNameEditing] = useState(false);
  const [userNameInput, setUserNameInput] = useState(mainUser.fullname);

  const fetchInitialCollaborators = async () => {
    try {
      let response = await API.post('/workspace/collaborators', { workspaceId }, {
        withCredentials: true,
      });

      const responseStatus=getResponseStatus(response.status)

      if (responseStatus === ResponseStatus.SUCCESS) {

        const userDetails = response.data.user?.userDetails;
        const newCollaborators = userDetails.map((user: any) => ({
          id: user.userId,
          email: user.userEmail,
        }));
        setCollaborators(newCollaborators);
      }
    } catch (error) {
      console.error("Error fetching usersDetails:", error);
    }
  };

  const handleAddCollaborator = async (email: string) => {
    try {
      setAddingUser(email)
      const response = await API.post(
        "/workspace/add-collaborator",
        { email, workspaceId ,invitedEmail:mainUser.email},
        { withCredentials: true }
      );

      const responseStatus=getResponseStatus(response.status)

      if (responseStatus === ResponseStatus.SUCCESS) {

        toast.success('collaborator added',{
          duration:1500,
          position:'top-right'
        })
        fetchInitialCollaborators()
       
      }
    } catch (error) {
      console.error("Error adding collaborator:", error);
    }finally{
      setAddingUser(null)
    }
  };

  useEffect(() => {
    const fetchAvailableUsers = async () => {
      try {
        const response = await API.get("/fetch-user", { withCredentials: true });

        const responseStatus=getResponseStatus(response.status)

        if (responseStatus === ResponseStatus.SUCCESS) {

          const users = response.data.user
            .filter((user: any) => 
              user.id !== mainUser.id && 
              !collaborators.some(collab => collab.id === user.id)
            )
            .map((user: any) => ({
              id: user.id,
              fullname: user.fullname,
              email: user.email,
            }));

          setAvailableUsers(users);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchInitialCollaborators().then(() => fetchAvailableUsers());
  }, [mainUser.id, workspaceId]);


  const removeCollaborator=async(email:string)=>{
    try {
      const response=await API.post('/workspace/remove-collaborator',
        {email,workspaceId},
        {withCredentials:true}
      )

      const responseStatus=getResponseStatus(response.status)

      if(responseStatus==ResponseStatus.SUCCESS)
      {
        fetchInitialCollaborators()
      }
    } catch (error) {
      console.log("error in removing collaborator");
      
    }
  }

  function debounce(func: (...args: any[]) => void, delay: number) {
    let timer: NodeJS.Timeout;
    return function (this: any, ...args: any[]) {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  }
  const renameWorkspace = async (newName: string) => {
    try {
      const response = await API.post(
        "/workspace/rename",
        { workspaceId, newName },
        { withCredentials: true }
      );

      const responseStatus=getResponseStatus(response.status)
      
      if (responseStatus === ResponseStatus.SUCCESS) {

        setWorkspaceNameInput(response.data.space.name)
        setIsWorkspaceNameEditing(false);  
        onWorkspaceUpdate?.({
          workspaceId,
          workspaceName: response.data.space.name
        });

      }
    } catch (error) {
      console.error("Error renaming workspace:", error);
      toast.error("Failed to rename workspace", {
        duration: 1500,
        position: "top-right",
      });
    }
  };
  
  const debouncedRenameWorkspace = debounce(renameWorkspace, 500);
  
  const handleRenameWorkspace = (newName: string) => {
    if (newName.trim() && newName !== workspaceName) {
      debouncedRenameWorkspace(newName);
    } else {
      setIsWorkspaceNameEditing(false);  
    }
  };
  const updateUserName = async (newName: string) => {
    try {
      const response = await API.put(
        "/update-name",
        { userId: mainUser.id, newName },
        { withCredentials: true }
      );

      const responseStatus=getResponseStatus(response.status)

      if (responseStatus === ResponseStatus.SUCCESS) {
        dispatch(updateName(newName))
          
        setIsUserNameEditing(false);  
      }
    } catch (error) {
      console.error("Error updating username:", error);
      toast.error("Failed to update username", {
        duration: 1500,
        position: "top-right",
      });
    }
  };
  
  const debouncedUpdateUserName = debounce((newName: string) => {
    console.log('Debounced function called with:', newName); 
    updateUserName(newName);
  }, 500);
  
  const handleUpdateUserName = (newName: string) => {
    if (newName.trim() && newName !== userNameInput) {
      debouncedUpdateUserName(newName);
      console.log('calling debounce');
      
    } else {
      setIsUserNameEditing(false);  
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-900 h-[600px] rounded-[4px] p-6 w-[500px] relative">
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
                {availableUsers.length > 0 ? (
                  availableUsers
                    .filter((user) =>
                      user.fullname.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between bg-gray-800 border border-gray-700 p-2 rounded-[5px] mb-2"
                      >
                        <div>
                          <p className="text-white text-xs">{user.fullname}</p>
                          <p className="text-gray-400 text-xs">{user.email}</p>
                        </div>
                        <button
                           className="w-[70px] h-7 rounded text-sm font-normal bg-primary text-primary-foreground"
                          onClick={() => handleAddCollaborator(user.email)}
                          aria-label={`Add ${user.fullname} as collaborator`}
                        >
                       {addingUser === user.email ? "Adding..." : "Add"}
                        </button>
                      </div>
                    ))
                ) : (
                  <p className="text-gray-400 text-sm p-2">No users available.</p>
                )}

                {availableUsers.filter((user) =>
                  user.fullname.toLowerCase().includes(searchQuery.toLowerCase())
                ).length === 0 && availableUsers.length > 0 && (
                  <p className="text-gray-400 text-sm p-2">No users found.</p>
                )}
              </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Display Collaborators */}
          <h3 className="text-gray-300 text-[16px]">Collaborators</h3>
          <div className="max-h-40 min-h-12 overflow-y-auto bg-gray-800 rounded-[3px] p-2 mt-2">
            {collaborators.length > 0 ? (
              collaborators.map((collaborator) => (
                <div
                  key={collaborator.email}
                  className="flex items-center justify-between bg-gray-800 border border-gray-700 p-2 rounded-[5px] mb-2"
                >
                  <div>
                    <p className="text-white text-xs">{collaborator.email}</p>
                  </div>
                  <button className="text-red-600 text-sm" onClick={()=>removeCollaborator(collaborator.email)}>Remove</button>
                  
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No collaborators added yet.</p>
            )}
          </div>
        </div>

        {/* Profile Section */}
        <div className="mb-4 border-t border-gray-700 pt-4">
          <h3 className="text-gray-300 flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile
          </h3>
          <label className="text-gray-400 text-sm block mt-2">Preferred Name</label>
          <div className="flex items-center bg-gray-800 p-2 rounded-md">
            <User className="h-5 w-5 text-gray-300" />
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
              className="w-full p-2 bg-gray-800 text-white rounded-[2px] mt-1 h-10 pl-5 cursor-pointer"
            >
              {userNameInput}
            </div>
          )}
          </div>
          <p className="text-gray-400 mt-2 ">{mainUser.email}</p>
        </div>

        {/* Close Button */}
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