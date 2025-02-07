"use client";
import { API } from "@/api/handle-token-expire";
import ProtectedRoute from "@/components/Providers/ProtectedRoute";
import { setUser } from "@/store/slice/userSlice";
import { AppDispatch, RootState } from "@/store/store";
import { workspaceSchema } from "@/validations/workspace";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export default function CreateWorkspace() {

  const[spaceName,setName]=useState('')
  const [loading, setLoading] = useState(false);
   const route=useRouter()
  const user=useSelector((state:RootState)=>state.user)
  const dispatch=useDispatch<AppDispatch>()
  const userId=user.id
  
  useEffect(()=>{
   const userData= localStorage.getItem('user')
   if(userData)
   {
     dispatch(setUser(JSON.parse(userData)))
   }

   
  },[dispatch])
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(workspaceSchema),
  });
  const token = localStorage.getItem("accessToken");
  const onSubmit = async () => {
    try {
        setLoading(true);

        const response = await API.post(
            "http://localhost:5713/workspace/create",
            { spaceName, userId },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.status === 201) {
            toast.success("Workspace created successfully!", {
                duration: 2000,
                position: 'top-right',
                style: {
                    background: '#28a745',
                    color: '#fff',
                },
            });
            route.push('/dashboard');
        } else {
             
            toast.error(response.data.message, {
                duration: 2000,
                position: 'top-right',
                style: {
                    background: '#e74c3c',
                    color: '#fff',
                },
            });
        }
    } catch (error: any) {
        if (error.response?.status === 409) {   
            toast.error(error.response.data.message, {
                duration: 3000,
                position: 'top-right',
                style: {
                    background: '#f44336',  
                    color: '#fff',
                },
            });
        }
       else {
            toast.error("An error occurred", {
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


  return (<>
  <ProtectedRoute>
  
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4 relative">
    {/* Logo Section */}
    <div className="absolute top-0 left-0 p-4 flex items-center">
      <Link href='/'>
        <img src="/collabdesk white logo.png" alt="Logo" className="h-24 w-auto md:h-[125px]" />
      </Link>
    </div>
  
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
              value={spaceName}
              onChange={e=>setName(e.target.value)}
              className="flex-1 bg-transparent p-3 outline-none text-white"
            />
          </div>
          {errors.workspaceName?.message && (
            <p className="text-red-600 text-[15px] mt-2">{errors.workspaceName.message.toString()}</p>
          )}
        </div>
  
        {/* Button aligned to the right */}
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
  </ProtectedRoute>
  </>
  );
}
