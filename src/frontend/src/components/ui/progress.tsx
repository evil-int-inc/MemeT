import type * as React from "react";

import { cn } from "@/lib/utils";

function Progress({
  className,
  value,
  max = 100,
  ...props
}: React.ComponentProps<"progress">) {
  return (
    <progress
      data-slot="progress"
      className={cn("progress progress-primary w-full", className)}
      value={value}
      max={max}
      {...props}
    />
  );
}

export { Progress };
