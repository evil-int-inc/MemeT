import type * as React from "react";

import { cn } from "@/lib/utils";

function Separator({
  className,
  orientation = "horizontal",
  decorative: _decorative = true,
  ...props
}: React.ComponentProps<"div"> & {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
}) {
  return (
    <div
      data-slot="separator"
      className={cn(
        "divider",
        orientation === "vertical" && "divider-horizontal",
        className,
      )}
      {...props}
    />
  );
}

export { Separator };
