"use client";
import TextField from "@mui/material/TextField";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
  };

  return (
    <div className="min-h-screen bg-[#2A2852] flex items-center justify-center p-4">
      {/* Outer Container with Shadow */}
      <div className="flex flex-col md:flex-row items-stretch gap-8 max-w-5xl h-[500px] w-full border-black rounded-lg shadow-xl">
        {/* Left Section */}
        <div className="flex flex-1 flex-col items-center justify-between text-center md:text-left space-y-5 bg-[#2A2852] p-14 rounded-lg">
          {/* Image */}
          <img
            src="/3682888.jpg"
            alt="Login Illustration"
            className="w-full max-w-xs md:max-w-sm mx-auto pt-10"
          />

          {/* Register Section */}
          <div>
            <span className="text-white">Don't have an account? </span>
            <Link href="/signup" className="text-[#8B8AF4] hover:underline">Register</Link>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-1 flex-col space-y-6 bg-[#2A2852] p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-white text-center md:text-left">
            Login to your Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <TextField
                id="email"
                label="Email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                InputProps={{
                  style: { backgroundColor: "white" },
                }}
                InputLabelProps={{
                  style: { color: "darkgray", fontWeight: 400 },
                }}
              />
            </div>

            {/* Login button */}
            <button
              type="submit"
              className="w-full bg-[#1a1744] hover:bg-[#15123a] text-white font-semibold text-md py-2 rounded-sm h-12"
            >
              Login
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-500"></span>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-white bg-[#2A2852]">OR</span>
            </div>
          </div>

          {/* Social Login buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-white hover:bg-gray-100 text-gray-800 flex items-center justify-center space-x-2 h-[45px] rounded-[2px]">
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google"
                className="w-auto h-8"
              />
            </button>
            <button className="bg-white hover:bg-gray-100 text-gray-800 flex items-center justify-center space-x-2 h-[45px] rounded-[2px]">
              <img
                src="https://github.com/favicon.ico"
                alt="GitHub"
                className="w-auto h-7"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
