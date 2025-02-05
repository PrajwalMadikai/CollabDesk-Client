'use client';
import baseUrl from "@/api/urlconfig";
import passwordSchema from "@/validations/password";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function ChangePassword() {

  const router=useRouter()
  const {register,handleSubmit,formState: { errors },} = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const [loading, setLoading] = useState(false);
  
  const email=localStorage.getItem('resetEmail')
 
  const resetPasswordForm = async(data:any) => {
    console.log('shfj');
    
    try {
      setLoading(true)
      let response=await axios.post(`${baseUrl}/reset-password`,{email,password:data.newPassword})
    if(response&&response.status==200)
    {
      toast.success('password updated successfully!', {
        duration: 2000,
        position: 'top-right',
        style: { background: '#4caf50', color: '#fff' },

      })
      localStorage.removeItem('resetEmail')
      setTimeout(()=>{
         router.push('/login')
      },2000)
    }
      
    } catch (error:any) {
      console.error("Error updating password:", error.response?.data || error.message);
     toast.error(error.response?.data?.message || "Failed to update password.");;
    }

  }
    

  return (
    <div className="min-h-screen bg-[radial-gradient(100%_50%_at_50%_0%,rgba(98,51,238,1)_0,rgba(0,0,0,0.8)_50%,rgba(0,0,0,1)_100%)] flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-row items-stretch gap-8 max-w-5xl w-full flex-grow">
        {/* Left Section: Image (Hidden on small screens) */}
        <div className="hidden md:flex flex-1 flex-col items-center text-center space-y-28 p-14 rounded-lg">
          <img
            src="/3682888-Photoroom.png"
            alt="Password Change Illustration"
            className="w-full max-w-xs md:max-w-sm mx-auto"
          />
        </div>
        {/* Right Section: Change Password Form */}
        <div className="flex flex-1 flex-col md:mt-[110px] space-y-6 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-white text-center md:text-left">Change Your Password</h2>
          <form onSubmit={handleSubmit(resetPasswordForm)} className="space-y-4">
            {/* <div className="space-y-2">
              <label className="text-white block">Email</label>
              <input
                type="text"
                {...register("email")}
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                className="w-full bg-transparent border border-gray-400 text-white rounded-md px-4 py-2 focus:outline-none focus:border-white"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message?.toString()}</p>}
            </div> */}
            <div className="space-y-2">
              <label className="text-white block">New Password</label>
              <input
                type="text"
                {...register("newPassword")}
                className="w-full bg-transparent border border-gray-400 text-white rounded-md px-4 py-2 focus:outline-none focus:border-white"
              />
              {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword.message?.toString()}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-white block">Confirm Password</label>
              <input
                type="password"
                {...register("confirmPassword")}
                className="w-full bg-transparent border border-gray-400 text-white rounded-md px-4 py-2 focus:outline-none focus:border-white"
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message?.toString()}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-[#1a1744] hover:bg-[#15123a] text-white font-semibold text-md py-2 rounded-sm h-12"
              disabled={loading}
            >
              {loading ? "Processing..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

