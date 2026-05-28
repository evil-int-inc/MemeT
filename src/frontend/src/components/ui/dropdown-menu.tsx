import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";
import type * as React from "react";

import { cn } from "@/lib/utils";

// DaisyUI dropdown — CSS-only, no JS positioning needed
function DropdownMenu({
  children,
}: {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
}) {
  return (
    <div data-slot="dropdown-menu" className="dropdown">
      {children}
    </div>
  );
}

function DropdownMenuPortal({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function DropdownMenuTrigger({
  asChild = false,
  children,
  className,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  return (
    <button
      type="button"
      data-slot="dropdown-menu-trigger"
      tabIndex={0}
      className={cn("cursor-pointer", className)}
      {...props}
    >
      {children}
    </button>
  );
}

function DropdownMenuContent({
  className,
  sideOffset: _sideOffset,
  children,
  align,
  ...props
}: React.ComponentProps<"ul"> & { sideOffset?: number; align?: string }) {
  return (
    <ul
      data-slot="dropdown-menu-content"
      className={cn(
        "dropdown-content menu bg-base-100 rounded-box z-50 w-52 p-2 shadow-lg border border-base-200",
        align === "end" && "right-0",
        className,
      )}
      {...props}
    >
      {children}
    </ul>
  );
}

function DropdownMenuGroup({ children, ...props }: React.ComponentProps<"li">) {
  return (
    <li data-slot="dropdown-menu-group" {...props}>
      {children}
    </li>
  );
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  children,
  onClick,
  ...props
}: React.ComponentProps<"li"> & {
  inset?: boolean;
  variant?: "default" | "destructive";
  onClick?: React.MouseEventHandler<HTMLElement>;
}) {
  return (
    <li data-slot="dropdown-menu-item" {...props}>
      <button
        type="button"
        className={cn(
          "w-full text-left flex items-center gap-2",
          variant === "destructive" && "text-error",
          inset && "pl-8",
          className,
        )}
        onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
      >
        {children}
      </button>
    </li>
  );
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  onCheckedChange,
  ...props
}: React.ComponentProps<"li"> & {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}) {
  return (
    <li data-slot="dropdown-menu-checkbox-item" {...props}>
      <label
        className={cn("flex items-center gap-2 cursor-pointer", className)}
      >
        <input
          type="checkbox"
          className="checkbox checkbox-sm"
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
        />
        {children}
      </label>
    </li>
  );
}

function DropdownMenuRadioGroup({
  children,
  value: _value,
  onValueChange: _onValueChange,
  ...props
}: React.ComponentProps<"div"> & {
  value?: string;
  onValueChange?: (value: string) => void;
}) {
  return (
    <div data-slot="dropdown-menu-radio-group" {...props}>
      {children}
    </div>
  );
}

function DropdownMenuRadioItem({
  className,
  children,
  value: _value,
  ...props
}: React.ComponentProps<"li"> & { value: string }) {
  return (
    <li data-slot="dropdown-menu-radio-item" {...props}>
      <button
        type="button"
        className={cn("w-full text-left flex items-center gap-2", className)}
      >
        <CircleIcon className="size-2 fill-current" />
        {children}
      </button>
    </li>
  );
}

function DropdownMenuLabel({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<"li"> & { inset?: boolean }) {
  return (
    <li data-slot="dropdown-menu-label" className="menu-title" {...props}>
      <span className={cn(inset && "pl-6", className)}>{children}</span>
    </li>
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="dropdown-menu-separator"
      className={cn("border-t border-base-200 my-1", className)}
      {...props}
    />
  );
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn("ml-auto text-xs opacity-60 tracking-widest", className)}
      {...props}
    />
  );
}

function DropdownMenuSub({
  children,
}: {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  return <>{children}</>;
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<"button"> & { inset?: boolean }) {
  return (
    <button
      type="button"
      data-slot="dropdown-menu-sub-trigger"
      className={cn(
        "w-full text-left flex items-center gap-2",
        inset && "pl-8",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-4" />
    </button>
  );
}

function DropdownMenuSubContent({
  className,
  children,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="dropdown-menu-sub-content"
      className={cn(
        "dropdown-content menu bg-base-100 rounded-box z-50 w-48 p-2 shadow-lg border border-base-200",
        className,
      )}
      {...props}
    >
      {children}
    </ul>
  );
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};
