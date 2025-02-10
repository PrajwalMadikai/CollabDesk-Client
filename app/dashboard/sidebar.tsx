"use client";
import { API } from "@/api/handle-token-expire";
import { ChevronDown, ChevronRight, FileTextIcon, Folder } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface File {
  fileId: string;
  fileName: string;
}

interface Folder {
  id: string;
  name: string;
  files: File[];
}

interface Workspace {
  workspaceId: string;
  workspaceName: string;
}

const Sidebar: React.FC<{ workspaces: Workspace[] }> = ({ workspaces }) => {
  const router = useRouter();
  const { workspaceId } = useParams();

  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (workspaces.length > 0) {
      const foundWorkspace = workspaces.find(w => w.workspaceId === workspaceId) || workspaces[0];
      setSelectedWorkspace(foundWorkspace);
      router.replace(`/dashboard/${foundWorkspace.workspaceId}`);
    }
  }, [workspaces, workspaceId, router]);

  useEffect(() => {
    if (selectedWorkspace?.workspaceId) {
      fetchFolders(selectedWorkspace.workspaceId);
    }
  }, [selectedWorkspace]);

  const fetchFolders = async (workspaceId: string) => {
    try {
      const response = await API.post("/folder/fetch", { workspaceId }, { withCredentials: true });
      if (response.data.folders) {
        setFolders(
          response.data.folders.map((folder: any) => ({
            id: folder.id,
            name: folder.name,
            files: folder.files ? folder.files.map((file: any) => ({ fileId: file.fileId, fileName: file.fileName })) : []
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching folders:", error);
    }
  };

  return (
    <div className="fixed inset-y-0 left-0 bg-black border-r border-gray-800 w-64 p-4">
      <div className="mb-4">
        <div className="text-white text-lg font-semibold">Workspaces</div>
        {workspaces.map(workspace => (
          <Link
            key={workspace.workspaceId}
            href={`/dashboard/${workspace.workspaceId}`}
            className={`block text-white px-3 py-2 rounded-lg mt-2 ${
              selectedWorkspace?.workspaceId === workspace.workspaceId ? "bg-gray-800" : "hover:bg-gray-700"
            }`}
          >
            {workspace.workspaceName}
          </Link>
        ))}
      </div>

      <div className="text-white font-semibold mb-2">Folders</div>
      {folders.map(folder => (
        <div key={folder.id} className="mb-2">
          <button
            className="flex items-center gap-2 text-white"
            onClick={() => setExpandedFolders(prev => ({ ...prev, [folder.id]: !prev[folder.id] }))}
          >
            {expandedFolders[folder.id] ? <ChevronDown /> : <ChevronRight />}
            <Folder />
            {folder.name}
          </button>
          {expandedFolders[folder.id] && folder.files.length > 0 && (
            <div className="ml-6 mt-2">
              {folder.files.map(file => (
                <Link
                  key={file.fileId}
                  href={`/dashboard/${selectedWorkspace?.workspaceId}/${file.fileId}`}
                  className="block text-gray-300 hover:text-white"
                >
                  <FileTextIcon className="inline-block mr-2" />
                  {file.fileName}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
