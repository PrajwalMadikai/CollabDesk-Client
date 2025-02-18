"use client";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
  const workspaceName:any=user.workSpaces.find(space=> space.id==boardId)
  const onClick = () => {
    router.back()
  };
  if (!workspaceName) return <InfoSkeleton />;

  return (
    <div className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md">
      <TooltipComponent message="Go to boards" side="bottom" sideOffset={10}>
        <Button asChild variant="board" className="px-2">
          <Link href={`/dashboard/${boardId}`}>
            <img
              src="/collabdesk Logo.png"
              alt="Board logo"
              className="h-6 "
            />
            <span className={cn("font-semibold text-xl ml-2 text-black")}>
              Meeting Room
            </span>
          </Link>
        </Button>
      </TooltipComponent>
      <TabSeparator />
      <Button
        variant="board"
        onClick={onClick}
        className="text-base font-normal px-2"
      >
        {workspaceName}
      </Button>
    </div>
  );
};

export const InfoSkeleton = () => {
  return (
    <div className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md w-[300px]" />
  );
};