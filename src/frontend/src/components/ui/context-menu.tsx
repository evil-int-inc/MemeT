import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

// DaisyUI context menu — CSS dropdown positioned via JS
type ContextMenuContextValue = {
  open: boolean;
  x: number;
  y: number;
  setOpen: (open: boolean) => void;
};

const ContextMenuContext = React.createContext<ContextMenuContextValue>({
  open: false,
  x: 0,
  y: 0,
  setOpen: () => {},
});

function ContextMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [pos, setPos] = React.useState({ x: 0, y: 0 });

  return (
    <ContextMenuContext.Provider value={{ open, x: pos.x, y: pos.y, setOpen }}>
      <div
        data-slot="context-menu"
        onContextMenu={(e) => {
          e.preventDefault();
          setPos({ x: e.clientX, y: e.clientY });
          setOpen(true);
        }}
      >
        {children}
      </div>
    </ContextMenuContext.Provider>
  );
}

function ContextMenuTrigger({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div data-slot="context-menu-trigger" className={className} {...props}>
      {children}
    </div>
  );
}

function ContextMenuGroup({ children, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="context-menu-group" {...props}>
      {children}
    </div>
  );
}

function ContextMenuPortal({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function ContextMenuSub({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function ContextMenuRadioGroup({
  children,
  value: _v,
  onValueChange: _ov,
  ...props
}: React.ComponentProps<"div"> & {
  value?: string;
  onValueChange?: (v: string) => void;
}) {
  return (
    <div data-slot="context-menu-radio-group" {...props}>
      {children}
    </div>
  );
}

function ContextMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<"button"> & { inset?: boolean }) {
  return (
    <button
      type="button"
      data-slot="context-menu-sub-trigger"
      className={cn(
        "w-full text-left flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-base-200",
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

function ContextMenuSubContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="context-menu-sub-content"
      className={cn(
        "bg-base-100 border border-base-200 rounded-box shadow-lg p-1 min-w-[8rem]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function ContextMenuContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { open, x, y, setOpen } = React.useContext(ContextMenuContext);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={() => setOpen(false)}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
      />
      <div
        data-slot="context-menu-content"
        className={cn(
          "fixed z-50 bg-base-100 border border-base-200 rounded-box shadow-lg p-1 min-w-[8rem]",
          className,
        )}
        style={{ top: y, left: x }}
        {...props}
      >
        {children}
      </div>
    </>
  );
}

function ContextMenuItem({
  className,
  inset,
  variant = "default",
  children,
  onClick,
  ...props
}: React.ComponentProps<"button"> & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) {
  const { setOpen } = React.useContext(ContextMenuContext);
  return (
    <button
      type="button"
      data-slot="context-menu-item"
      className={cn(
        "w-full text-left flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-base-200",
        variant === "destructive" && "text-error hover:bg-error/10",
        inset && "pl-8",
        className,
      )}
      onClick={(e) => {
        onClick?.(e);
        setOpen(false);
      }}
      {...props}
    >
      {children}
    </button>
  );
}

function ContextMenuCheckboxItem({
  className,
  children,
  checked,
  onCheckedChange,
  ...props
}: React.ComponentProps<"button"> & {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      data-slot="context-menu-checkbox-item"
      className={cn(
        "w-full text-left flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-base-200",
        className,
      )}
      onClick={() => onCheckedChange?.(!checked)}
      {...props}
    >
      <CheckIcon className={cn("size-4", !checked && "opacity-0")} />
      {children}
    </button>
  );
}

function ContextMenuRadioItem({
  className,
  children,
  value: _value,
  ...props
}: React.ComponentProps<"button"> & { value: string }) {
  return (
    <button
      type="button"
      data-slot="context-menu-radio-item"
      className={cn(
        "w-full text-left flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-base-200",
        className,
      )}
      {...props}
    >
      <CircleIcon className="size-2 fill-current" />
      {children}
    </button>
  );
}

function ContextMenuLabel({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<"div"> & { inset?: boolean }) {
  return (
    <div
      data-slot="context-menu-label"
      className={cn(
        "px-2 py-1.5 text-sm font-medium opacity-60",
        inset && "pl-8",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function ContextMenuSeparator({
  className,
  ...props
}: React.ComponentProps<"hr">) {
  return (
    <hr
      data-slot="context-menu-separator"
      className={cn("-mx-1 my-1 border-base-200", className)}
      {...props}
    />
  );
}

function ContextMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="context-menu-shortcut"
      className={cn("ml-auto text-xs opacity-60 tracking-widest", className)}
      {...props}
    />
  );
}

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
};
