import { API } from "@/app/api/handle-token-expire";
import { ResponseStatus } from "@/enums/responseStatus";
import getResponseStatus from "@/lib/responseStatus";
import { updateName } from "@/store/slice/userSlice";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
interface User {
    id: string;
    fullname: string;
    email: string;
  }
  
  interface Collaborator {
    id: string;
    email: string;
  }

const useSettings = (workspaceId: string, workspaceName: string) => {
  const dispatch = useDispatch();
  const mainUser = useSelector((state: RootState) => state.user);

  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [addingUser, setAddingUser] = useState<string|null>(null);

  const [isWorkspaceNameEditing, setIsWorkspaceNameEditing] = useState(false);
  const [workspaceNameInput, setWorkspaceNameInput] = useState(workspaceName);

  const [isUserNameEditing, setIsUserNameEditing] = useState(false);
  const [userNameInput, setUserNameInput] = useState(mainUser.fullname);

  const fetchInitialCollaborators = async () => {
    try {
      const response = await API.post(
        "/workspace/collaborators",
        { workspaceId },
        { withCredentials: true }
      );

      const responseStatus = getResponseStatus(response.status);

      if (responseStatus === ResponseStatus.SUCCESS) {
        const userDetails = response.data.user?.userDetails;
        const newCollaborators = userDetails.map((user: any) => ({
          id: user.userId,
          email: user.userEmail,
        }));
        setCollaborators(newCollaborators);
      }
    } catch (error) {
      console.error("Error fetching collaborators:", error);
    }
  };

  // Fetch available users
  const fetchAvailableUsers = async () => {
    try {
      const response = await API.get("/fetch-user", { withCredentials: true });

      const responseStatus = getResponseStatus(response.status);

      if (responseStatus === ResponseStatus.SUCCESS) {
        const users = response.data.user
          .filter(
            (user: any) =>
              user.id !== mainUser.id &&
              !collaborators.some((collab) => collab.id === user.id)
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

  // Add collaborator
  const handleAddCollaborator = async (email: string) => {
    try {
      setAddingUser(email);
      const response = await API.post(
        "/workspace/add-collaborator",
        { email, workspaceId, invitedEmail: mainUser.email },
        { withCredentials: true }
      );

      const responseStatus = getResponseStatus(response.status);

      if (responseStatus === ResponseStatus.SUCCESS) {
        toast.success("Collaborator added", {
          duration: 1500,
          position: "top-right",
        });
        fetchInitialCollaborators();
      }
    } catch (error) {
      console.error("Error adding collaborator:", error);
    } finally {
      setAddingUser(null);
    }
  };

  const removeCollaborator = async (email: string) => {
    try {
      const response = await API.post(
        "/workspace/remove-collaborator",
        { email, workspaceId },
        { withCredentials: true }
      );

      const responseStatus = getResponseStatus(response.status);

      if (responseStatus === ResponseStatus.SUCCESS) {
        fetchInitialCollaborators();
      }
    } catch (error) {
      console.error("Error removing collaborator:", error);
    }
  };

  const renameWorkspace = async (newName: string) => {
    try {
      const response = await API.post(
        "/workspace/rename",
        { workspaceId, newName },
        { withCredentials: true }
      );

      const responseStatus = getResponseStatus(response.status);

      if (responseStatus === ResponseStatus.SUCCESS) {
        setWorkspaceNameInput(response.data.space.name);
        setIsWorkspaceNameEditing(false);
      }
    } catch (error) {
      console.error("Error renaming workspace:", error);
      toast.error("Failed to rename workspace", {
        duration: 1500,
        position: "top-right",
      });
    }
  };

  const updateUserName = async (newName: string) => {
    try {
      const response = await API.put(
        "/update-name",
        { userId: mainUser.id, newName },
        { withCredentials: true }
      );

      const responseStatus = getResponseStatus(response.status);

      if (responseStatus === ResponseStatus.SUCCESS) {
        dispatch(updateName(newName));
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

  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timer: NodeJS.Timeout;
    return function (this: any, ...args: any[]) {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  };

  const debouncedRenameWorkspace = debounce(renameWorkspace, 500);
  const debouncedUpdateUserName = debounce(updateUserName, 500);

  useEffect(() => {
    fetchInitialCollaborators().then(() => fetchAvailableUsers());
  }, [mainUser.id, workspaceId]);

  return {
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
  };
};

export default useSettings;