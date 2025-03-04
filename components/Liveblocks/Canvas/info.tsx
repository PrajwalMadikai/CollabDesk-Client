"use client";
import { Button } from "@/components/ui/button";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { TooltipComponent } from "../global/tooltip";


interface InfoProps {
  boardId: string;
}

const TabSeparator = () => {
  return <div className="text-neutral-300 px-1.5">|</div>;
};

export const Info = ({ boardId }: InfoProps) => {
  const router = useRouter();
  const user=useSelector((state:RootState)=>state.user)
  const workspace:any=user.workSpaces.find(space=> space.workspaceId==boardId)
  const workspaceName=workspace.workspaceName
  
  const onClick = () => {
    router.back()
  };
  if (!workspaceName) return <InfoSkeleton />;

  return (
    <div className="absolute top-2 left-2 bg-black rounded-md px-1.5 h-12 flex items-center shadow-md">
      <TooltipComponent message="Go to boards" side="bottom" sideOffset={10}>
        <Button asChild variant="board" className="px-2">
           
            <img
              src="/collabdesk white logo.png"
              alt="Board logo"
              className="h-[90px] "
            />
            
        </Button>
      </TooltipComponent>
      <TabSeparator />
      <Button
        variant="board"
        onClick={onClick}
        className="text-base px-2 font-black" 
      >
        {workspaceName }
      </Button>
    </div>
  );
};

export const InfoSkeleton = () => {
  return (
    <div className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md w-[300px]" />
  );
};