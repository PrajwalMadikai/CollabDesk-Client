"use client";

import { useRouter } from "next/navigation";

const Blocked = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[radial-gradient(100%_50%_at_50%_0%,rgba(98,51,238,1)_0,rgba(0,0,0,0.8)_50%,rgba(0,0,0,1)_100%)] flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-row items-center gap-8 max-w-5xl w-full">
        
        {/* Left Section */}
        <div className="flex-1 flex flex-col items-center text-center md:text-left space-y-6 p-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white">Blocked</h1>
          <p className="text-white text-lg md:text-xl">
            Your account has been blocked. Please contact support if you think this is a mistake.
          </p>
          <button 
            onClick={() => router.push('/')} 
            className="bg-[#8B8AF4] hover:bg-[#6a69d8] text-white font-semibold px-6 py-3 rounded-md transition-all"
          >
            Go to Home
          </button>
        </div>

        {/* Right Section (Hidden on small screens) */}
        <div className="hidden md:flex flex-1 justify-center">
          <img 
            src="/blocked-image.png" 
            alt="Blocked" 
            className="w-full max-w-xs md:max-w-sm"
          />
        </div>

      </div>
    </div>
  );
};

export default Blocked;
