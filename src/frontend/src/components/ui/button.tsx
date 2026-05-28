import type * as React from "react";

import { cn } from "@/lib/utils";

// Simplified Button — always renders as btn btn-neutral.
// Exceptions: variant="destructive" → btn-error, variant="ghost" → btn-ghost (icon-only).
type ButtonVariant =
  | "default"
  | "destructive"
  | "ghost"
  | "outline"
  | "secondary"
  | "link";
type ButtonSize = "default" | "sm" | "lg" | "xs" | "icon";

const variantClass: Record<ButtonVariant, string> = {
  default: "btn-neutral",
  destructive: "btn-error",
  ghost: "btn-ghost",
  outline: "btn-outline btn-neutral",
  secondary: "btn-neutral",
  link: "btn-link",
};

/** Compat shim for shadcn/ui-generated files (calendar, pagination, carousel). */
const buttonVariants = (opts?: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) => {
  const v = opts?.variant ?? "default";
  const s = opts?.size ?? "default";
  return cn("btn", variantClass[v], sizeClass[s], opts?.className);
};

const sizeClass: Record<ButtonSize, string> = {
  default: "",
  sm: "btn-sm",
  lg: "btn-lg",
  xs: "btn-xs",
  icon: "btn-square btn-sm",
};

function Button({
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}: React.ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return (
    <button
      data-slot="button"
      className={cn("btn", variantClass[variant], sizeClass[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

export { Button, buttonVariants };
