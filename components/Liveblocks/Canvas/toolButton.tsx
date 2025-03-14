"use client";

import { LucideIcon } from "lucide-react";
import { Button } from "../../ui/button";
import { TooltipComponent } from "../global/tooltip";

interface ToolButtonProps {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  isActive?: boolean;
  isDisabled?: boolean;
}

export const ToolButton = ({
  label,
  icon: Icon,
  onClick,
  isDisabled,
}: ToolButtonProps) => {
  return (
    <TooltipComponent  message={label} side="right" sideOffset={14}>
      <Button
        disabled={isDisabled}
        onClick={onClick}
        size="icon"
      >
        <Icon />
      </Button>
    </TooltipComponent>
  );
};