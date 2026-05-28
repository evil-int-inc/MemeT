import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const toggleVariants = cva("btn", {
  variants: {
    variant: {
      default: "btn-ghost",
      outline: "btn-outline",
    },
    size: {
      default: "",
      sm: "btn-sm",
      lg: "btn-lg",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

function Toggle({
  className,
  variant,
  size,
  pressed,
  defaultPressed,
  onPressedChange,
  onClick,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof toggleVariants> & {
    pressed?: boolean;
    defaultPressed?: boolean;
    onPressedChange?: (pressed: boolean) => void;
  }) {
  const [internalPressed, setInternalPressed] = React.useState(
    defaultPressed ?? false,
  );
  const isPressed = pressed !== undefined ? pressed : internalPressed;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    const next = !isPressed;
    setInternalPressed(next);
    onPressedChange?.(next);
  };

  return (
    <button
      type="button"
      data-slot="toggle"
      aria-pressed={isPressed}
      data-state={isPressed ? "on" : "off"}
      className={cn(
        toggleVariants({ variant, size }),
        isPressed && "btn-active",
        className,
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}

export { Toggle, toggleVariants };
