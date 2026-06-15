import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva("badge", {
  variants: {
    variant: {
      default: "badge-primary",
      secondary: "badge-secondary",
      destructive: "badge-error",
      outline: "badge-outline",
      success: "badge-success",
      warning: "badge-warning",
      info: "badge-info",
      accent: "badge-accent",
      ghost: "badge-ghost",
      neutral: "badge-neutral",
    },
    size: {
      default: "",
      xs: "badge-xs",
      sm: "badge-sm",
      lg: "badge-lg",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

function Badge({
  className,
  variant,
  size,
  asChild: _asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

function BadgeButton({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof badgeVariants>) {
  return (
    <button
      type="button"
      data-slot="badge-button"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge, BadgeButton, badgeVariants };
