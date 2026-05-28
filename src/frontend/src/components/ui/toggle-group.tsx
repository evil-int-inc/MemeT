import type { VariantProps } from "class-variance-authority";
import * as React from "react";

import type { toggleVariants } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

type ToggleGroupContextValue = {
  value?: string | string[];
  onValueChange?: (value: string) => void;
  type: "single" | "multiple";
} & VariantProps<typeof toggleVariants>;

const ToggleGroupContext = React.createContext<ToggleGroupContextValue>({
  size: "default",
  variant: "default",
  type: "single",
});

function ToggleGroup({
  className,
  variant,
  size,
  children,
  type = "single",
  value,
  onValueChange,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof toggleVariants> & {
    type?: "single" | "multiple";
    value?: string | string[];
    onValueChange?: (value: string) => void;
  }) {
  return (
    <ToggleGroupContext.Provider
      value={{ variant, size, type, value, onValueChange }}
    >
      <div
        data-slot="toggle-group"
        className={cn("join", className)}
        {...props}
      >
        {children}
      </div>
    </ToggleGroupContext.Provider>
  );
}

function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  value,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof toggleVariants> & {
    value: string;
  }) {
  const context = React.useContext(ToggleGroupContext);
  const activeVariant = context.variant ?? variant;
  const activeSize = context.size ?? size;
  const isActive = Array.isArray(context.value)
    ? context.value.includes(value)
    : context.value === value;

  return (
    <button
      type="button"
      data-slot="toggle-group-item"
      data-state={isActive ? "on" : "off"}
      aria-pressed={isActive}
      className={cn(
        "btn join-item",
        activeVariant === "outline" ? "btn-outline" : "btn-ghost",
        activeSize === "sm" ? "btn-sm" : activeSize === "lg" ? "btn-lg" : "",
        isActive && "btn-active",
        className,
      )}
      onClick={() => context.onValueChange?.(value)}
      {...props}
    >
      {children}
    </button>
  );
}

export { ToggleGroup, ToggleGroupItem };
