'use client';
import VideoCall from "@/components/Video Call/VideoCall";
import { RootState } from "@/store/store";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";

function Page() {
  const params = useParams();
  const workspaceId = params?.workspaceId as string;
  const user = useSelector((state: RootState) => state.user);

  return (
    <div className="flex flex-col h-screen bg-black p-4">
      <h1 className="text-2xl font-semibold mb-4 text-white">Meeting Room</h1>
      <div className="flex-grow w-full overflow-hidden rounded-lg border border-gray-800">
        <VideoCall
          workspaceId={workspaceId}
          userId={user.id}
          userName={user.fullname}
        />
      </div>
    </div>
  );
}

export default Page;