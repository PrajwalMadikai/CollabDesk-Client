import { useOthers } from "@/liveblocks.config";
import { Cursor } from "./Cursor";


export default function Presence() {
  const others = useOthers();

  return (
    <>
      {others.map(({ connectionId }) => { 
        return <Cursor key={connectionId}  connectionId={connectionId} />;
      })}
    </>
  );
}