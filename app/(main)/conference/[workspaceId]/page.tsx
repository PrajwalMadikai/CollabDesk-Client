'use client';
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import VideoCall from "../../../../components/Video Call/VideoCall";
import { RootState } from "../../../../store/store";

function Page() {
  const params = useParams();
  const workspaceId = params?.workspaceId as string;
  const user = useSelector((state: RootState) => state.user);

  return (
    <div className="w-full h-full">
      <div className="h-full flex flex-col">
        <h1 className="text-xl font-bold p-4">Meeting Room</h1>
        <div className="flex-1">
          <VideoCall 
            workspaceId={workspaceId} 
            userId={user?.id || null} 
            userName={user?.fullname || null} 
          />
        </div>
      </div>
    </div>
  );
}

export default Page;