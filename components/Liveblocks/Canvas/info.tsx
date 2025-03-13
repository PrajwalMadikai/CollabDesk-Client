"use client";
import { ArrowLeftToLine } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../../ui/button";
import { TooltipComponent } from "../global/tooltip";
 

// const TabSeparator = () => {
//   return <div className="text-neutral-300 px-1.5">|</div>;
// };

export const Info = ( ) => {
  const router = useRouter();
  // const user=useSelector((state:RootState)=>state.user)
  // const workspace:any=user.workSpaces.find(space=> space.workspaceId==boardId)
  // const workspaceName=workspace.workspaceName
  
  const onClick = () => {
    router.back()
  };
  // if (!workspaceName) return <InfoSkeleton />;

  return (
    <div className="absolute top-2 left-2 bg-black rounded-md px-1.5 w-14 h-12 flex items-center shadow-md">
      <TooltipComponent message="Go to boards" side="bottom" sideOffset={10}>
        {/* <Button asChild className="px-2">
           
            <img
              src="/collabdesk white logo.png"
              alt="Board logo"
              className="h-[90px] "
            />
            
        </Button> */}
      <Button
        onClick={onClick}
        className="h-10 w-10 px-2 font-black bg-black text-white" 
      >
        <ArrowLeftToLine />
      </Button>
      </TooltipComponent>
      {/* <TabSeparator /> */}
    </div>
  );
};

export const InfoSkeleton = () => {
  return (
    <div className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md w-[300px]" />
  );
};