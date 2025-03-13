"use client";

import Image from "next/image";
import Link from "next/link";
import ProtectedRoute from "../../../components/Providers/ProtectedRoute";
import { useCreateWorkspace } from "../../../hooks/useWorkspaceHook";

export default function CreateWorkspace() {
  const {
    register,
    handleSubmit,
    errors,
    loading,
    onSubmit
  } = useCreateWorkspace();

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-gray-900 text-white px-4">
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/collabdesk white logo.png"
              alt="Logo"
              width={800}  
              height={600}
              className="h-24 w-auto md:h-[125px]"
            />
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-4xl w-full bg-gray-800 p-6 md:p-8 rounded-xl shadow-lg">
            <h1 className="text-2xl font-semibold">Create A Workspace</h1>
            <p className="text-gray-300 mt-2 text-[15px]">
              Let&apos;s create a private workspace to get you started.
            </p>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mt-6">
                <label className="block text-sm font-medium">Name</label>
                <div className="flex items-center border border-gray-600 rounded-lg overflow-hidden mt-2">
                  <span className="p-3 bg-gray-700">
                    <img src="/office.png" alt="Folder Icon" className="h-8" />
                  </span>
                  <input
                    type="text"
                    {...register("workspaceName")}
                    placeholder="Workspace name"
                    className="flex-1 bg-transparent p-3 outline-none text-white"
                  />
                </div>
                {errors.workspaceName?.message && (
                  <p className="text-red-600 text-[15px] mt-2">
                    {errors.workspaceName.message.toString()}
                  </p>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="w-[170px] bg-transparent border-[1px] border-gray-400 hover:bg-gradient-to-r hover:from-gray-500 hover:to-gray-700 font-light text-[14px] text-white py-2 rounded-[4px] disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create a Workspace"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}