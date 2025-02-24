"use client";
import { API } from "@/app/api/handle-token-expire";
import ProtectedRoute from "@/components/Providers/ProtectedRoute";
import { addWorkspace } from "@/store/slice/userSlice";
import { AppDispatch, RootState } from "@/store/store";
import { workspaceSchema } from "@/validations/workspace";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export default function CreateWorkspace() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const userId = user.id;
  const token=localStorage.getItem('accessToken')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      workspaceName: ""
    }
  });

  const workspaceName = watch("workspaceName");

  // useEffect(() => {
  //   const userData = localStorage.getItem('user');
  //   if (userData) {
  //     const parsedData = JSON.parse(userData);
  //     dispatch(setUser({
  //       id: parsedData.id,
  //       fullname: parsedData.fullname,
  //       email: parsedData.email,
  //       workSpaces: parsedData.workSpaces,
  //       isAuthenticated: true,
  //     }));
  //   }
  // }, [dispatch]);

  const onSubmit = async (formData: { workspaceName: string }) => {
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

      const workspaceResponse = await API.post(
        "/workspace/create",
        { 
          spaceName: formData.workspaceName, 
          userId 
        },
        { withCredentials: true }
      );
      if(workspaceResponse.status==201){

        toast.success("Workspace created successfully!", {
          duration: 2000,
          position: 'top-right',
          style: {
            background: '#28a745',
            color: '#fff',
          },
        });
        dispatch(addWorkspace(workspaceResponse.data.workspace))

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
     

      router.push(`/dashboard/${workspaceId}`);
      }
    } catch (error: any) {
      console.error("Workspace creation error:", error);

      if (error.response?.status === 409) {   
        toast.error(error.response.data.message || "Workspace name already exists", {
          duration: 3000,
          position: 'top-right',
          style: {
            background: '#f44336',  
            color: '#fff',
          },
        });
      }else if (error.response?.status === 403 && error.response?.data?.message.includes("Subscription")) {
        router.push('/subscription-ended')
      }
      else {
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

  return (
    <ProtectedRoute>
     <div className="min-h-screen flex flex-col bg-gray-900 text-white px-4">
  <div className="flex items-center ">
    <Link href="/">
      <img
        src="/collabdesk white logo.png"
        alt="Logo"
        className="h-24 w-auto md:h-[125px]"
      />
    </Link>
  </div>

  <div className="flex-1 flex items-center justify-center">
    <div className="max-w-4xl w-full bg-gray-800 p-6 md:p-8 rounded-xl shadow-lg">
      <h1 className="text-2xl font-semibold">Create A Workspace</h1>
      <p className="text-gray-300 mt-2 text-[15px]">
        Let's create a private workspace to get you started.
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-6">
          <label className="block text-sm font-medium">Name</label>
          <div className="flex items-center border border-gray-600 rounded-lg overflow-hidden mt-2">
            <span className="p-3 bg-gray-700">
              <img src="/office.png" alt="Folder Icon" className="h-8" />
            </span>
            <input
              type="text"
              {...register("workspaceName")}
              placeholder="Workspace name"
              className="flex-1 bg-transparent p-3 outline-none text-white"
            />
          </div>
          {errors.workspaceName?.message && (
            <p className="text-red-600 text-[15px] mt-2">
              {errors.workspaceName.message.toString()}
            </p>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="w-[170px] bg-transparent border-[1px] border-gray-400 hover:bg-gradient-to-r hover:from-gray-500 hover:to-gray-700 font-light text-[14px] text-white py-2 rounded-[4px] disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create a Workspace"}
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
    </ProtectedRoute>
  );
}