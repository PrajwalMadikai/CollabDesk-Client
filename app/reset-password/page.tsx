'use client';
import { baseUrl } from "@/app/api/urlconfig";
import passwordSchema from "@/validations/password";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, CircularProgress, TextField } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function ChangePassword() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const [loading, setLoading] = useState(false);
  const email = localStorage.getItem('resetEmail');

  const resetPasswordForm = async (data: any) => {
    try {
      setLoading(true);
      let response = await axios.post(`${baseUrl}/reset-password`, { email, password: data.newPassword });

      if (response && response.status === 200) {
        toast.success('Password updated successfully!', {
          duration: 2000,
          position: 'top-right',
          style: { background: '#4caf50', color: '#fff' },
        });
        localStorage.removeItem('resetEmail');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (error: any) {
      console.error("Error updating password:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to update password.");
    }
  };

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
          <h2 className="text-xl pb-5 md:text-2xl font-bold text-white text-start md:text-left">Change Your Password</h2>
          <form onSubmit={handleSubmit(resetPasswordForm)} className="space-y-4">
            {/* New Password TextField */}
            <TextField
              label="new password"
              variant="outlined"
              type="password"
              {...register("newPassword")}
              fullWidth
              error={!!errors.newPassword}
              helperText={errors.newPassword && <p className="text-red-600">{errors.newPassword.message?.toString()}</p>}
              InputProps={{
                style: {
                  backgroundColor: "transparent",
                  color: "white",
                },
              }}
              InputLabelProps={{
                style: { color: "white", fontWeight: 100, fontSize: "0.85rem" },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "gray", 
                    borderWidth: "1px",
                  },
                  "&:hover fieldset": {
                    borderColor: "darkgray",
                    borderWidth: "1px",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "gray",
                    borderWidth: "1px",
                  },
                },
                "& .MuiInputBase-input": {
                  color: "white",  
                },
                "& .MuiFormHelperText-root": {
                  color: "white",
                },
              }}
            />

            {/* Confirm Password TextField */}
            <TextField
              label="confirm password"
              variant="outlined"
              type="password"
              {...register("confirmPassword")}
              fullWidth
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword && <span className="text-red-600">{errors.confirmPassword.message?.toString()}</span>}
              InputProps={{
                style: {
                  backgroundColor: "transparent",
                  color: "white",
                },
              }}
              InputLabelProps={{
                style: { color: "white", fontWeight: 100, fontSize: "0.85rem" },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "gray", 
                    borderWidth: "1px",
                  },
                  "&:hover fieldset": {
                    borderColor: "darkgray",
                    borderWidth: "1px",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "gray",
                    borderWidth: "1px",
                  },
                },
                "& .MuiInputBase-input": {
                  color: "white",  
                },
                "& .MuiFormHelperText-root": {
                  color: "white",
                },
              }}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "#1a1744",
                "&:hover": { backgroundColor: "#15123a" },
                height: "48px",
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Update Password"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
