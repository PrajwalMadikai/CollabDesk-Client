"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

const SubscriptionEnded = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[radial-gradient(100%_50%_at_50%_0%,rgba(98,51,238,1)_0,rgba(0,0,0,0.8)_50%,rgba(0,0,0,1)_100%)] flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-row items-center gap-8 max-w-5xl w-full">
        
        {/* Left Section - Image */}
        <div className="flex-1 flex justify-center md:justify-end">
          <Image src="/collabdesk white logo.png" 
            alt="Subscription Ended" 
            className="w-full max-w-xs md:max-w-sm"
          />
        </div>

        {/* Right Section - Text and Button */}
        <div className="flex-1 flex flex-col items-center text-center md:text-left space-y-6 p-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Your Payment Plan Has Ended
          </h1>
          <p className="text-white text-lg md:text-xl">
            Renew your subscription to continue using premium features.
          </p>
          <p className="text-gray-300 text-base md:text-lg">
            You can still use your existing workspaces and folders.
          </p>
          <button 
            onClick={() => router.push('/')} 
            className="bg-[#6a69d8] text-white font-semibold px-6 py-3 rounded-md transition-all hover:bg-[#5a58c7]"
          >
            Renew Subscription from home page
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionEnded;