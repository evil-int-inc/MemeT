import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";
import type * as React from "react";

import { cn } from "@/lib/utils";

// DaisyUI menubar using navbar + menu pattern
function Menubar({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="menubar"
      className={cn(
        "navbar bg-base-100 border border-base-200 rounded-box shadow-xs p-1 h-9 min-h-9",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function MenubarMenu({ children }: { children: React.ReactNode }) {
  return (
    <div data-slot="menubar-menu" className="dropdown">
      {children}
    </div>
  );
}

function MenubarGroup({ children, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="menubar-group" {...props}>
      {children}
    </div>
  );
}

function MenubarPortal({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function MenubarRadioGroup({
  children,
  value: _v,
  onValueChange: _ov,
  ...props
}: React.ComponentProps<"div"> & {
  value?: string;
  onValueChange?: (v: string) => void;
}) {
  return (
    <div data-slot="menubar-radio-group" {...props}>
      {children}
    </div>
  );
}

function MenubarTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      data-slot="menubar-trigger"
      tabIndex={0}
      className={cn("btn btn-ghost btn-sm rounded-btn", className)}
      {...props}
    >
      {children}
    </button>
  );
}

function MenubarContent({
  className,
  children,
  align: _align,
  alignOffset: _alignOffset,
  sideOffset: _sideOffset,
  ...props
}: React.ComponentProps<"ul"> & {
  align?: string;
  alignOffset?: number;
  sideOffset?: number;
}) {
  return (
    <ul
      data-slot="menubar-content"
      className={cn(
        "dropdown-content menu bg-base-100 rounded-box z-50 w-52 p-2 shadow-lg border border-base-200",
        className,
      )}
      {...props}
    >
      {children}
    </ul>
  );
}

function MenubarItem({
  className,
  inset,
  variant = "default",
  children,
  ...props
}: React.ComponentProps<"li"> & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) {
  return (
    <li data-slot="menubar-item" {...props}>
      <button
        type="button"
        className={cn(
          "w-full text-left flex items-center gap-2",
          variant === "destructive" && "text-error",
          inset && "pl-8",
          className,
        )}
      >
        {children}
      </button>
    </li>
  );
}

function MenubarCheckboxItem({
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
    <li data-slot="menubar-checkbox-item" {...props}>
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

function MenubarRadioItem({
  className,
  children,
  value: _value,
  ...props
}: React.ComponentProps<"li"> & { value: string }) {
  return (
    <li data-slot="menubar-radio-item" {...props}>
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

function MenubarLabel({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<"li"> & { inset?: boolean }) {
  return (
    <li data-slot="menubar-label" className="menu-title" {...props}>
      <span className={cn(inset && "pl-6", className)}>{children}</span>
    </li>
  );
}

function MenubarSeparator({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="menubar-separator"
      className={cn("border-t border-base-200 my-1", className)}
      {...props}
    />
  );
}

function MenubarShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="menubar-shortcut"
      className={cn("ml-auto text-xs opacity-60 tracking-widest", className)}
      {...props}
    />
  );
}

function MenubarSub({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function MenubarSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<"button"> & { inset?: boolean }) {
  return (
    <button
      type="button"
      data-slot="menubar-sub-trigger"
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

function MenubarSubContent({
  className,
  children,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="menubar-sub-content"
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
  Menubar,
  MenubarPortal,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarSeparator,
  MenubarLabel,
  MenubarItem,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
};
