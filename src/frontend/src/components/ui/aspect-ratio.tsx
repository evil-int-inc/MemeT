import type * as React from "react";

import { cn } from "@/lib/utils";

function AspectRatio({
  ratio = 1,
  className,
  children,
  style,
  ...props
}: React.ComponentProps<"div"> & { ratio?: number }) {
  return (
    <div
      data-slot="aspect-ratio"
      style={{ aspectRatio: ratio, ...style }}
      className={cn("overflow-hidden", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { AspectRatio };
