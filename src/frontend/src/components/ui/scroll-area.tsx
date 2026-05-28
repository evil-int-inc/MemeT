import type * as React from "react";

import { cn } from "@/lib/utils";

function ScrollArea({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="scroll-area"
      className={cn("overflow-auto relative", className)}
      {...props}
    >
      {children}
    </div>
  );
}

function ScrollBar(
  _props: React.ComponentProps<"div"> & {
    orientation?: "vertical" | "horizontal";
  },
) {
  // Native scrollbar — no custom scrollbar needed with DaisyUI
  return null;
}

export { ScrollArea, ScrollBar };
