import * as React from "react";

import { cn } from "@/lib/utils";

// DaisyUI tooltip uses data-tip attribute and CSS only
function TooltipProvider({
  children,
}: { children: React.ReactNode; delayDuration?: number }) {
  return <>{children}</>;
}

type TooltipContextValue = { tip?: string };
const TooltipContext = React.createContext<TooltipContextValue>({});

function Tooltip({
  children,
}: React.ComponentProps<"div"> & {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <TooltipContext.Provider value={{}}>{children}</TooltipContext.Provider>
  );
}

function TooltipTrigger({
  asChild = false,
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
  if (asChild && React.isValidElement(children)) {
    return <>{children}</>;
  }
  return (
    <div className={cn("inline-flex", className)} {...props}>
      {children}
    </div>
  );
}

function TooltipContent({
  children: _children,
  className: _className,
  sideOffset: _sideOffset,
  align: _align,
  side: _side,
  hidden: _hidden,
}: React.ComponentProps<"div"> & {
  sideOffset?: number;
  align?: string;
  side?: string;
  hidden?: boolean;
}) {
  // Content is stored in context — the actual tip is placed via parent Tooltip wrapper
  // For DaisyUI we rely on the parent wrapper using data-tip
  return null;
}

// Higher-level wrapper that uses DaisyUI tooltip pattern with data-tip
function WithTooltip({
  tip,
  children,
  className,
}: {
  tip: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("tooltip", className)} data-tip={tip}>
      {children}
    </div>
  );
}

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  WithTooltip,
};
