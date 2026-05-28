import { XIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

type DialogContextValue = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dialogId: string;
};

const DialogContext = React.createContext<DialogContextValue>({
  open: false,
  onOpenChange: () => {},
  dialogId: "dialog",
});

function Dialog({
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
  const dialogId = React.useId();
  const isOpen = open !== undefined ? open : internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  return (
    <DialogContext.Provider
      value={{ open: isOpen, onOpenChange: setOpen, dialogId }}
    >
      {children}
    </DialogContext.Provider>
  );
}

function DialogTrigger({
  asChild = false,
  children,
  className,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const { onOpenChange } = React.useContext(DialogContext);

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
      data-slot="dialog-trigger"
      className={className}
      onClick={() => onOpenChange(true)}
      {...props}
    >
      {children}
    </button>
  );
}

function DialogClose({
  asChild = false,
  children,
  className,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const { onOpenChange } = React.useContext(DialogContext);

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
      data-slot="dialog-close"
      className={className}
      onClick={() => onOpenChange(false)}
      {...props}
    >
      {children}
    </button>
  );
}

function DialogOverlay({ className, ...props }: React.ComponentProps<"div">) {
  const { onOpenChange } = React.useContext(DialogContext);
  return (
    <div
      data-slot="dialog-overlay"
      className={cn("fixed inset-0 z-40 bg-black/50", className)}
      onClick={() => onOpenChange(false)}
      {...props}
    />
  );
}

function DialogPortal({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<"div"> & { showCloseButton?: boolean }) {
  const { open, onOpenChange } = React.useContext(DialogContext);

  if (!open) return null;

  return (
    <>
      <DialogOverlay />
      <div
        data-slot="dialog-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
          "w-full max-w-lg max-h-[90vh] overflow-y-auto",
          "bg-base-100 rounded-box shadow-xl p-6",
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <button
            type="button"
            data-slot="dialog-close"
            className="btn btn-sm btn-ghost btn-square absolute top-3 right-3"
            onClick={() => onOpenChange(false)}
            aria-label="Close"
          >
            <XIcon className="size-4" />
          </button>
        )}
      </div>
    </>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 mb-4", className)}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex flex-row justify-end gap-2 mt-4", className)}
      {...props}
    />
  );
}

function DialogTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      data-slot="dialog-title"
      className={cn("text-lg font-semibold leading-none", className)}
      {...props}
    />
  );
}

function DialogDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="dialog-description"
      className={cn("text-sm opacity-70", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
