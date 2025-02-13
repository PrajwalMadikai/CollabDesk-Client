"use client";
import { useParams } from "next/navigation";

export default function WorkspaceDashboard() {
  const { workspaceId } = useParams();

  return (
     
      <div className="flex items-center justify-center h-screen">
        <img 
          src="/collabdesk white logo.png" 
          alt="Workspace Dashboard" 
          className="max-w-full h-auto w-[80%] md:w-[50%] lg:w-[40%]"
        />
      </div>
  );
}
