import { CollaborativeRoom } from "@/components/Liveblocks/CollaborativeRoom";
import { CollaborativeEditor } from "@/components/Liveblocks/CollaborativeTextEditor";
import { useParams } from "next/navigation";

export default function FileEditor() {
  const { fileId } = useParams() as { fileId: string };

  return (
    <div className="h-screen bg-gray-900">
      <CollaborativeRoom roomId={fileId}>
        <CollaborativeEditor roomId={fileId} />
      </CollaborativeRoom>
    </div>
  );
}