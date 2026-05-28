import * as React from "react";

import { cn } from "@/lib/utils";

type AlertDialogContextValue = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const AlertDialogContext = React.createContext<AlertDialogContextValue>({
  open: false,
  onOpenChange: () => {},
});

function AlertDialog({
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
    <AlertDialogContext.Provider
      value={{ open: isOpen, onOpenChange: setOpen }}
    >
      {children}
    </AlertDialogContext.Provider>
  );
}

function AlertDialogTrigger({
  asChild = false,
  children,
  className,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const { onOpenChange } = React.useContext(AlertDialogContext);

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
      data-slot="alert-dialog-trigger"
      className={className}
      onClick={() => onOpenChange(true)}
      {...props}
    >
      {children}
    </button>
  );
}

function AlertDialogPortal({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function AlertDialogOverlay({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-overlay"
      className={cn("fixed inset-0 z-40 bg-black/50", className)}
      {...props}
    />
  );
}

function AlertDialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { open } = React.useContext(AlertDialogContext);

  if (!open) return null;

  return (
    <>
      <AlertDialogOverlay />
      <div
        data-slot="alert-dialog-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
          "w-full max-w-lg bg-base-100 rounded-box shadow-xl p-6",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </>
  );
}

function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn("flex flex-col gap-2 mb-4", className)}
      {...props}
    />
  );
}

function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn("flex flex-row justify-end gap-2 mt-4", className)}
      {...props}
    />
  );
}

function AlertDialogTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      data-slot="alert-dialog-title"
      className={cn("text-lg font-semibold", className)}
      {...props}
    />
  );
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="alert-dialog-description"
      className={cn("text-sm opacity-70", className)}
      {...props}
    />
  );
}

function AlertDialogAction({
  className,
  children,
  ...props
}: React.ComponentProps<"button">) {
  const { onOpenChange } = React.useContext(AlertDialogContext);
  return (
    <button
      type="button"
      data-slot="alert-dialog-action"
      className={cn("btn btn-primary", className)}
      onClick={(e) => {
        props.onClick?.(e);
        onOpenChange(false);
      }}
      {...props}
    >
      {children}
    </button>
  );
}

function AlertDialogCancel({
  className,
  children,
  ...props
}: React.ComponentProps<"button">) {
  const { onOpenChange } = React.useContext(AlertDialogContext);
  return (
    <button
      type="button"
      data-slot="alert-dialog-cancel"
      className={cn("btn btn-ghost", className)}
      onClick={(e) => {
        props.onClick?.(e);
        onOpenChange(false);
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
