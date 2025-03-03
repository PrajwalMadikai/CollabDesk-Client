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
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Video Conference</h1>
      <VideoCall
        workspaceId={workspaceId}
        userId={user.id}
        userName={user.fullname}
      />
    </div>
  );
}

export default Page;