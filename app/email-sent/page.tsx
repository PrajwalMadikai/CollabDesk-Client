"use client";
import { ArrowRight } from 'lucide-react';

export default function EmailSent() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-[#020817] text-white p-4">
      {/* Main Container */}
      <div className="w-full max-w-3xl mx-auto text-center space-y-12">
        {/* Illustration */}
        <div className="relative w-full max-w-lg mx-auto">
          <svg className="w-full h-auto" viewBox="0 0 786 466" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M457.722 465H39.2777C17.5862 465 0 447.414 0 425.722V39.2777C0 17.5862 17.5862 0 39.2777 0H457.722C479.414 0 497 17.5862 497 39.2777V425.722C497 447.414 479.414 465 457.722 465Z" fill="#1E293B"/>
            <rect x="63" y="127" width="371" height="85" rx="8" fill="#334155"/>
            <rect x="63" y="241" width="371" height="85" rx="8" fill="#334155"/>
            <circle cx="107" cy="73" r="20" fill="#334155"/>
            <path d="M785.722 425H367.278C345.586 425 328 407.414 328 385.722V129.278C328 107.586 345.586 90 367.278 90H785.722C807.414 90 825 107.586 825 129.278V385.722C825 407.414 807.414 425 785.722 425Z" fill="#1E293B"/>
            <rect x="391" y="217" width="371" height="85" rx="8" fill="#334155"/>
            <circle cx="435" cy="163" r="20" fill="#334155"/>
            <path d="M556 90L696 230M696 90L556 230" stroke="#60A5FA" strokeWidth="24" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Check your email
          </h1>
          <p className="text-lg text-gray-400 max-w-md mx-auto">
            We've sent a verification link to your email.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="group px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-2 min-w-[200px]">
            Open email app
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          {/* <button className="px-6 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors min-w-[200px]">
            Resend email
          </button> */}
        </div>

        {/* Help Text */}
        <p className="text-sm text-gray-500">
          Didn't receive the email? Check your spam folder or try another email address
        </p>
      </div>

      {/* Decorative Elements */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
    </div>
  );
}