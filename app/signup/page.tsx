"use client";
import TextField from "@mui/material/TextField";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { toast } from 'react-hot-toast';

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validate = () => {
    let isValid = true;
    const newErrors: any = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required.";
      isValid = false;
    }
    if (!email.trim()) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format.";
      isValid = false;
    }
    if (!password.trim()) {
      newErrors.password = "Password is required.";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
      isValid = false;
    }
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm password is required.";
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
       
      toast.error("Please fix the errors in the form.", {
        duration: 3000,  
        position: 'top-right',
        style: {
            background: '#f44336',  
            color: '#fff', 
        },
    });
      return;
    }

    try {
      
      
      await axios.post("http://localhost:5713/signup", {
        fullName,
        email,
        password,
      });
       
      toast.success("Signup successful!", {
        duration: 3000,  
        position: 'top-right',
        style: {
            background: '#333',  
            color: '#fff',  
        },
    });

      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      // setErrors({});

    } catch (error:any) {
      if(error.response && error.response.status==400)
      {
        const errorMessage = error.response.data.message
        toast.error(errorMessage, {
          duration: 3000,
          position: 'top-right',
          style: {
            background: '#f44336',
            color: '#fff',
          },
        });
      }else{
      toast.error("Signup failed. Please try again.", {
        duration: 3000,  
        position: 'top-right',
        style: {
            background: '#f44336',  
            color: '#fff', 
        },
    });
     }
    }
  };

  return (
    <div className="min-h-screen bg-[#2A2852] flex items-center justify-center p-4">
      {/* Toast Container */}

      <div className="flex flex-col md:flex-row items-stretch gap-8 max-w-5xl h-[600px] w-full border-black rounded-lg shadow-xl">
        {/* Left Section */}
        <div className="flex flex-1 flex-col items-center text-center md:text-left space-y-28 bg-[#2A2852] p-14 rounded-lg">
          <img
            src="/3682888.jpg"
            alt="Signup Illustration"
            className="w-full max-w-xs md:max-w-sm mx-auto pt-10"
          />
          <div>
            <span className="text-white text-md font-thin">Already have an account? </span>
            <Link href="/login" className="text-[#8B8AF4] hover:underline font-semibold">
              Login
            </Link>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-1 flex-col space-y-6 bg-[#2A2852] p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-white text-center md:text-left">Create Your Account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Field */}
            <div className="space-y-2">
              <TextField
                id="fullName"
                label="Full Name"
                variant="outlined"
                fullWidth
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                error={!!errors.fullName}
                helperText={errors.fullName && <span className="text-red-600">{errors.fullName}</span>}
                InputProps={{
                  style: { backgroundColor: "white" },
                }}
                InputLabelProps={{
                  style: { color: "darkgray", fontWeight: 400 },
                }}
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <TextField
                id="email"
                label="Email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!errors.email}
                helperText={errors.email && <span className="text-red-600">{errors.email}</span>}
                InputProps={{
                  style: { backgroundColor: "white" },
                }}
                InputLabelProps={{
                  style: { color: "darkgray", fontWeight: 400 },
                }}
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <TextField
                id="password"
                label="Password"
                variant="outlined"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!errors.password}
                helperText={errors.password && <span className="text-red-600">{errors.password}</span>}
                InputProps={{
                  style: { backgroundColor: "white" },
                }}
                InputLabelProps={{
                  style: { color: "darkgray", fontWeight: 400 },
                }}
              />
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <TextField
                id="confirmPassword"
                label="Confirm Password"
                variant="outlined"
                type="password"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={!!errors.confirmPassword}
                helperText={
                  errors.confirmPassword && (
                    <span className="text-red-600">{errors.confirmPassword}</span>
                  )
                }
                InputProps={{
                  style: { backgroundColor: "white" },
                }}
                InputLabelProps={{
                  style: { color: "darkgray", fontWeight: 400 },
                }}
              />
            </div>

            {/* Signup button */}
            <button
              type="submit"
              className="w-full bg-[#1a1744] hover:bg-[#15123a] text-white font-semibold text-md py-2 rounded-sm h-12"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
