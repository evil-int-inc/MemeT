import { XIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

type SheetContextValue = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side: "top" | "right" | "bottom" | "left";
};

const SheetContext = React.createContext<SheetContextValue>({
  open: false,
  onOpenChange: () => {},
  side: "right",
});

function Sheet({
  open,
  onOpenChange,
  defaultOpen = false,
  children,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isOpen = open !== undefined ? open : internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  return (
    <SheetContext.Provider
      value={{ open: isOpen, onOpenChange: setOpen, side: "right" }}
    >
      {children}
    </SheetContext.Provider>
  );
}

function SheetTrigger({
  asChild = false,
  children,
  className,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const { onOpenChange } = React.useContext(SheetContext);

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<Record<string, unknown>>;
    return React.cloneElement(child, {
      ...child.props,
      onClick: (e: React.MouseEvent) => {
        (child.props.onClick as ((e: React.MouseEvent) => void) | undefined)?.(
          e,
        );
        onOpenChange(true);
      },
    });
  }

  return (
    <button
      type="button"
      data-slot="sheet-trigger"
      className={className}
      onClick={() => onOpenChange(true)}
      {...props}
    >
      {children}
    </button>
  );
}

function SheetClose({
  asChild = false,
  children,
  className,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const { onOpenChange } = React.useContext(SheetContext);

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<Record<string, unknown>>;
    return React.cloneElement(child, {
      ...child.props,
      onClick: (e: React.MouseEvent) => {
        (child.props.onClick as ((e: React.MouseEvent) => void) | undefined)?.(
          e,
        );
        onOpenChange(false);
      },
    });
  }

  return (
    <button
      type="button"
      data-slot="sheet-close"
      className={className}
      onClick={() => onOpenChange(false)}
      {...props}
    >
      {children}
    </button>
  );
}

export function SheetPortal({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

const sideClasses = {
  right: "fixed inset-y-0 right-0 h-full w-3/4 max-w-sm border-l",
  left: "fixed inset-y-0 left-0 h-full w-3/4 max-w-sm border-r",
  top: "fixed inset-x-0 top-0 h-auto border-b",
  bottom: "fixed inset-x-0 bottom-0 h-auto border-t",
};

function SheetContent({
  className,
  children,
  side = "right",
  ...props
}: React.ComponentProps<"div"> & {
  side?: "top" | "right" | "bottom" | "left";
}) {
  const { open, onOpenChange } = React.useContext(SheetContext);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={() => onOpenChange(false)}
        onKeyDown={(e) => e.key === "Escape" && onOpenChange(false)}
      />
      <div
        data-slot="sheet-content"
        className={cn(
          "fixed z-50 bg-base-100 shadow-xl flex flex-col gap-4 p-0",
          sideClasses[side],
          className,
        )}
        {...props}
      >
        {children}
        <button
          type="button"
          className="btn btn-sm btn-ghost btn-square absolute top-4 right-4"
          onClick={() => onOpenChange(false)}
          aria-label="Close"
        >
          <XIcon className="size-4" />
        </button>
      </div>
    </>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5 p-4", className)}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  );
}

function SheetTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      data-slot="sheet-title"
      className={cn("font-semibold text-base-content", className)}
      {...props}
    />
  );
}

function SheetDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="sheet-description"
      className={cn("text-sm opacity-70", className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
