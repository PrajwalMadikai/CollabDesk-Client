"use client";

import { ResponseStatus } from "@/enums/responseStatus";
import getResponseStatus from "@/lib/responseStatus";
import { deleteWorkspaceFunc, userActivityLogs, workspaceCreateFunc, workspaceFetch } from "@/services/workspaceApi";
import { addWorkspace, removeWorkspace } from "@/store/slice/userSlice";
import { AppDispatch, RootState } from "@/store/store";
import { workspaceSchema } from "@/validations/workspace";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

interface CreateWorkspaceFormData {
  workspaceName: string;
}
interface useractivity{
  email:string,
  action:string,
  time:Date
}
interface UseWorkspaceReturn {
  workspaces: Workspace[];
  selectedWorkspace: Workspace | null;
  loading: boolean;
  newWorkspaceName: string;
  userLogs:useractivity[];
  setNewWorkspaceName: React.Dispatch<React.SetStateAction<string>>;
  fetchWorkspaces: () => Promise<Workspace[]>; 
  selectWorkspace: (workspace: Workspace) => void;
  findAndSelectWorkspace: (workspaceId: string | string[]) => Promise<Workspace | null>;
  createWorkspace: () => Promise<void>;
  deleteWorkspace: (workspaceId: string) => Promise<void>;
  updateWorkspaceName: (updatedWorkspace: Workspace) => void;
  userAction:(workspaceId:string)=>Promise<void>
}

export function useCreateWorkspace() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const userId = user.id;
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateWorkspaceFormData>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      workspaceName: ""
    }
  });

  const workspaceName = watch("workspaceName");

  const onSubmit = async (formData: CreateWorkspaceFormData) => {
    if (!userId || !user.email) {
      toast.error("User information is missing", {
        duration: 2000,
        position: 'top-right',
        style: {
          background: '#e74c3c',
          color: '#fff',
        },
      });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');

      const workspaceResponse=await workspaceCreateFunc(formData.workspaceName,userId)

      const responseStatus = getResponseStatus(workspaceResponse.status);

      if (responseStatus === ResponseStatus.CREATED) {
        
        
        dispatch(addWorkspace({workspaceId:workspaceResponse.data.workspace.id,workspaceName:workspaceResponse.data.workspace.name}));
        const workspaceId = workspaceResponse.data.workspace.id;

        const roomResponse = await fetch("/api/create-room", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`  
          },
          body: JSON.stringify({
            roomId: workspaceResponse.data.workspace.id,
            userId: user.id,
            email: user.email,
            title: workspaceResponse.data.workspace.name || "Untitled",
          }),
        });

        if (!roomResponse.ok) {
          throw new Error("Failed to create room");
        }
        setLoading(false);
        
        toast.success("Workspace created successfully!", {
          duration: 2000,
          position: 'top-right',
          style: {
            background: '#166534',  
            color: '#d1fae5',    
            borderRadius: '8px',    
            padding: '12px',        
            fontSize: '14px',      
          },
        });

        router.push(`/dashboard/${workspaceId}`);
      }
    } catch (error: any) {
      console.error("Workspace creation error:", error);
      const responseStatus = getResponseStatus(error.response?.status);
      
      if (responseStatus === ResponseStatus.CONFLICT) {   
        toast.error(error.response.data.message || "Workspace name already exists", {
          duration: 3000,
          position: 'top-right',
          style: {
            background: '#f44336',  
            color: '#fff',
          },
        });
      } else if (responseStatus === ResponseStatus.FORBIDDEN && error.response?.data?.message.includes("Subscription")) {
        router.push('/subscription-ended');
      } else {
        toast.error(error.response?.data?.message || "Failed to create workspace", {
          duration: 2000,
          position: 'top-right',
          style: {
            background: '#e74c3c',
            color: '#fff',
          },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    workspaceName,
    loading,
    onSubmit
  };
}
 
export interface Workspace {
  workspaceId: string;
  workspaceName: string;
}


export function useWorkspace() :UseWorkspaceReturn|null{

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState<string>("");
  const [userLogs,setuserLogs]=useState<useractivity[]>([])
  
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const userId = user.id;

  if(!userId)
  {
    console.log('no user id');
    return null
  }
 const fetchWorkspaces = async (): Promise<Workspace[]> => {
  try {
    setLoading(true);
    const response = await workspaceFetch(userId);
    const responseStatus = getResponseStatus(response.status);

    if (responseStatus === ResponseStatus.SUCCESS) {
      const fetchedWorkspaces = response.data.workspace;
      setWorkspaces(fetchedWorkspaces);
      return fetchedWorkspaces;  
    }
    return [];  
  } catch (error) {
    console.error("Error fetching workspaces:", error);
    return []; 
  } finally {
    setLoading(false);
  }
};

  const selectWorkspace = (workspace: Workspace) => {
    setSelectedWorkspace(workspace);
    router.push(`/dashboard/${workspace.workspaceId}`);
  };

  const findAndSelectWorkspace = async (workspaceId: string | string[]) => {
    try {
      setLoading(true);
      const fetchedWorkspaces = await fetchWorkspaces();
      
      if (fetchedWorkspaces.length > 0) {
        const initialWorkspace = fetchedWorkspaces.find(
          (w: { workspaceId: string | string[] | undefined }) => 
            w.workspaceId === workspaceId
        ) || fetchedWorkspaces[0];
        
        setSelectedWorkspace(initialWorkspace);
        return initialWorkspace;
      }
    } catch (error) {
      console.error("Error finding and selecting workspace:", error);
    } finally {
      setLoading(false);
    }
    return null;
  };

  const createWorkspace = async () => {
    if (newWorkspaceName.trim().length < 3) {
      toast.error("Workspace name must be at least 3 characters", {
        position: 'top-right',
        duration: 2000
      });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      
       
      const response=await workspaceCreateFunc(newWorkspaceName,userId)

      const responseStatus = getResponseStatus(response.status);

      if (responseStatus === ResponseStatus.CREATED) {
        const newWorkspace = response.data.workspace;
        setNewWorkspaceName("");
        setWorkspaces((prevWorkspaces) => [
          ...prevWorkspaces, 
          { 
            workspaceId: newWorkspace.id, 
            workspaceName: newWorkspace.name 
          }
        ]);

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

        dispatch(addWorkspace({workspaceId:newWorkspace.id,workspaceName:newWorkspace.name}));
        return newWorkspace;
      }
    } catch (error: any) {
      const responseStatus = getResponseStatus(error.response?.status);
      if(responseStatus === ResponseStatus.FORBIDDEN&&user.planType=="premium" && error.response?.data?.message.includes("Workspace limit exceeded")){
        showLimitExceededToast("workspace",true);
      }
      else if (responseStatus === ResponseStatus.FORBIDDEN && error.response?.data?.message.includes("Workspace limit exceeded")) {
        showLimitExceededToast("workspace",false);
      } else if (responseStatus === ResponseStatus.FORBIDDEN && error.response?.data?.message.includes("Subscription")) {
        router.push('/subscription-ended');
      } else {
        console.error("Error creating workspace:", error);
        toast.error(error.response?.data?.message || "Failed to create workspace", {
          duration: 2000,
          position: 'top-right',
        });
      }
    } finally {
      setLoading(false);
    }
    
    return null;
  };

  const deleteWorkspace = async (workspaceId: string): Promise<void> => {
    try {
      setLoading(true);
  
      const response = await deleteWorkspaceFunc(workspaceId);
      const responseStatus = getResponseStatus(response.status);
  
      if (responseStatus === ResponseStatus.SUCCESS) {

        const deletedWorkspaceId = response.data.data;
  
        dispatch(removeWorkspace(deletedWorkspaceId));
  
        setWorkspaces((prev) => prev.filter((workspace) => workspace.workspaceId !== deletedWorkspaceId));
       
     
  
        if (selectedWorkspace?.workspaceId === deletedWorkspaceId) {
          const remainingWorkspaces = workspaces.filter((w) => w.workspaceId !== deletedWorkspaceId);
          if (remainingWorkspaces.length > 0) {
            setSelectedWorkspace(remainingWorkspaces[0]);
          } else {
            setSelectedWorkspace(null);
          }
        }
  
        fetchWorkspaces()  
        toast.success('Workspace deleted successfully', {
          duration: 2500,
          position: 'top-right',
          style: {
            background: '#166534',  
            color: '#d1fae5',    
            borderRadius: '8px',    
            padding: '12px',        
            fontSize: '14px',      
          },
        });
         // Delete the associated room
        await fetch('/api/delete-room', {
          method: "POST",
          body: JSON.stringify({ roomId: workspaceId }),
        });
      }
    } catch (error) {
      console.error('Error in workspace delete', error);
      toast.error('Failed to delete workspace', {
        duration: 2000,
        position: 'top-right',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateWorkspaceName = (updatedWorkspace: Workspace) => {
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

  const userAction=async(workspaceId:string)=>{

    try {

      const response =await userActivityLogs(workspaceId)
      const responseStatus=getResponseStatus(response.status)

      if(responseStatus==ResponseStatus.SUCCESS)
      {
        const newLogs: useractivity[] = response.data.data.activity;
        setuserLogs(newLogs);
      }
      
    } catch (error) {
      console.log('error in user activity log');
      
    }
  }

const showLimitExceededToast = (resourceType: string,isMax:boolean) => {
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 overflow-hidden`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            {/* Icon */}
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-red-500 pr-2"
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
  
            {/* Content */}
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-black">
                Your subscription plan has reached the maximum number of {resourceType}s.
              </p>
              {!isMax?(
              <>
              <p className="mt-1 text-sm text-gray-500">
                Please upgrade your subscription to create more {resourceType}s.
              </p>
              <a
                href="/"
                className="inline-block mt-2 text-black text-sm font-medium hover:underline focus:outline-none focus:ring-2 "
              >
                Click here for Upgrade Subscription
              </a>
              </>
              ):(
                <p className="mt-1 text-sm text-gray-500">Your out of your monthly subscription {resourceType} limit</p>
              )}
            </div>
          </div>
        </div>
  
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full text-red-500 border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Close
          </button>
        </div>
      </div>
    ));
  };

  return {
    workspaces,
    selectedWorkspace,
    loading,
    newWorkspaceName,
    setNewWorkspaceName,
    fetchWorkspaces,
    selectWorkspace,
    findAndSelectWorkspace,
    createWorkspace,
    deleteWorkspace,
    updateWorkspaceName,
    userAction,
    userLogs
  };
}