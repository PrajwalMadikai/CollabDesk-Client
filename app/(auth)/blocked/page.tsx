"use client";
import Image from 'next/image';

import { useRouter } from "next/navigation";

const Blocked = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[radial-gradient(100%_50%_at_50%_0%,rgba(98,51,238,1)_0,rgba(0,0,0,0.8)_50%,rgba(0,0,0,1)_100%)] flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-row items-center gap-8 max-w-5xl w-full">
        <div className="flex-1 flex justify-center">
          <Image
          src="./collabdesk white logo.png"
          alt="Blocked" 
          width={500}  
          height={200} 
          className="w-full max-w-xs md:max-w-sm"  
        />
        </div>
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left space-y-6 p-10">
          <h1 className="text-md md:text-3xl font-bold text-white">Blocked</h1>
          <p className="text-gray-300 text-[18px] ">
            Your account has been blocked. Please contact support if you think this is a mistake.
          </p>
          <button 
            onClick={() => router.push('/')} 
            className="bg-[#6a69d8] text-white font-semibold px-6 py-3 rounded-md transition-all"
          >
            Go to Home
          </button>
        </div>

      </div>
    </div>
  );
};

export default Blocked;