import * as React from "react";

import { cn } from "@/lib/utils";

// Implemented as a CSS hover-based card using DaisyUI tooltip-like approach
function HoverCard({
  children,
}: {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  openDelay?: number;
  closeDelay?: number;
}) {
  return (
    <div data-slot="hover-card" className="relative inline-block group">
      {children}
    </div>
  );
}

function HoverCardTrigger({
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
  if (asChild && React.isValidElement(children)) {
    return <>{children}</>;
  }
  return (
    <div data-slot="hover-card-trigger" {...props}>
      {children}
    </div>
  );
}

function HoverCardContent({
  className,
  children,
  align: _align,
  sideOffset: _sideOffset,
  ...props
}: React.ComponentProps<"div"> & { align?: string; sideOffset?: number }) {
  return (
    <div
      data-slot="hover-card-content"
      className={cn(
        "absolute z-50 w-64 bg-base-100 rounded-box border border-base-200 p-4 shadow-lg",
        "invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity",
        "top-full left-1/2 -translate-x-1/2 mt-2",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { HoverCard, HoverCardTrigger, HoverCardContent };
