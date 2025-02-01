"use client";
import { AppDispatch } from "@/store/store";
import TextField from "@mui/material/TextField";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

export default function AdminLogin() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5713/admin/login", { email, password });

      if (response.status === 200) {
        toast.success("Admin login successful!", {
          duration: 2000,
          position: "top-right",
          style: { background: "#28a745", color: "#fff" },
        });

        localStorage.setItem("admin", JSON.stringify(response.data.admin));
        localStorage.setItem("adminAccessToken", response.data.accessToken);
        const admin=localStorage.getItem('admin')
        const adminaces=localStorage.getItem('adminAccessToken')
        console.log('admin from :',admin);
        console.log(adminaces);
        

        setTimeout(() => {
          router.push("/admin");
        }, 2100);
      } else {
        toast.error(response.data.message || "Login failed", {
          position: "top-right",
          duration: 3000,
        });
      }
    } catch (error: any) {
      console.error("Error during admin login:", error);
      toast.error(error.response?.data?.message || "Error during login", {
        position: "top-right",
        duration: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(100%_50%_at_50%_0%,rgba(98,51,238,1)_0,rgba(0,0,0,0.8)_50%,rgba(0,0,0,1)_100%)] flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-row items-stretch gap-8 max-w-5xl h-[600px] w-full">
        
        {/* Left Section: Admin Illustration */}
        <div className="flex flex-1 flex-col items-center text-center md:text-left space-y-28 p-14 rounded-lg">
          <img
            src="/3682888-Photoroom.png" // Replace with admin login image
            alt="Admin Login"
            className="w-full max-w-xs md:max-w-sm mx-auto pt-10"
          />
          <div>
            <span className="text-white text-md font-thin">Not an Admin? </span>
            <Link href="/" className="text-[#8B8AF4] hover:underline font-semibold">
              Go to Home
            </Link>
          </div>
        </div>

        {/* Right Section: Admin Login */}
        <div className="flex flex-1 flex-col md:mt-[110px] space-y-6 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-white text-center md:text-left">
            Admin Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <TextField
                id="admin-email"
                label="Admin Email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  style: { backgroundColor: "transparent", color: "white" },
                }}
                InputLabelProps={{
                  style: { color: "white", fontWeight: 100, fontSize: "0.85rem" },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "gray", borderWidth: "1px" },
                    "&:hover fieldset": { borderColor: "darkgray", borderWidth: "1px" },
                    "&.Mui-focused fieldset": { borderColor: "gray", borderWidth: "1px" },
                  },
                  "& .MuiInputBase-input": { color: "white" },
                  "& .MuiFormHelperText-root": { color: "white" },
                }}
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <TextField
                id="admin-password"
                label="Password"
                variant="outlined"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  style: { backgroundColor: "transparent", color: "white" },
                }}
                InputLabelProps={{
                  style: { color: "white", fontWeight: 100, fontSize: "0.85rem" },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "gray", borderWidth: "1px" },
                    "&:hover fieldset": { borderColor: "darkgray", borderWidth: "1px" },
                    "&.Mui-focused fieldset": { borderColor: "gray", borderWidth: "1px" },
                  },
                  "& .MuiInputBase-input": { color: "white" },
                  "& .MuiFormHelperText-root": { color: "white" },
                }}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#1a1744] hover:bg-[#15123a] text-white font-semibold text-md py-2 rounded-sm h-12"
            >
              Login as Admin
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
