import * as React from "react";

import { cn } from "@/lib/utils";

// DaisyUI popover using dropdown pattern
type PopoverContextValue = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
const PopoverContext = React.createContext<PopoverContextValue>({
  open: false,
  onOpenChange: () => {},
});

function Popover({
  children,
  open,
  onOpenChange,
}: {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isOpen = open !== undefined ? open : internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  return (
    <PopoverContext.Provider value={{ open: isOpen, onOpenChange: setOpen }}>
      <div data-slot="popover" className="relative inline-block">
        {children}
      </div>
    </PopoverContext.Provider>
  );
}

function PopoverTrigger({
  asChild = false,
  children,
  className,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const { onOpenChange, open } = React.useContext(PopoverContext);

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<Record<string, unknown>>;
    return React.cloneElement(child, {
      ...child.props,
      onClick: (e: React.MouseEvent) => {
        (child.props.onClick as ((e: React.MouseEvent) => void) | undefined)?.(
          e,
        );
        onOpenChange(!open);
      },
    });
  }

  return (
    <button
      type="button"
      data-slot="popover-trigger"
      className={className}
      onClick={() => onOpenChange(!open)}
      {...props}
    >
      {children}
    </button>
  );
}

function PopoverContent({
  className,
  children,
  align: _align,
  sideOffset: _sideOffset,
  ...props
}: React.ComponentProps<"div"> & { align?: string; sideOffset?: number }) {
  const { open, onOpenChange } = React.useContext(PopoverContext);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={() => onOpenChange(false)}
        onKeyDown={(e) => e.key === "Escape" && onOpenChange(false)}
      />
      <div
        data-slot="popover-content"
        className={cn(
          "absolute z-50 mt-2 w-72 bg-base-100 rounded-box border border-base-200 p-4 shadow-lg",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </>
  );
}

function PopoverAnchor({ children, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="popover-anchor" {...props}>
      {children}
    </div>
  );
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
