import type * as React from "react";

import { cn } from "@/lib/utils";

function AppCard({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("card bg-base-100", className)} {...props} />;
}

function AppCardBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("card-body", className)} {...props} />;
}

interface AppCardTitleProps extends React.HTMLAttributes<HTMLElement> {
  as?: "h1" | "h2" | "h3" | "p";
}

function AppCardTitle({
  className,
  as: Component = "h2",
  ...props
}: AppCardTitleProps) {
  return <Component className={cn("card-title", className)} {...props} />;
}

function AppCardActions({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("card-actions", className)} {...props} />;
}

export { AppCard, AppCardActions, AppCardBody, AppCardTitle };
