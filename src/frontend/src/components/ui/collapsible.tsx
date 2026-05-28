import * as React from "react";

import { cn } from "@/lib/utils";

type CollapsibleContextValue = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const CollapsibleContext = React.createContext<CollapsibleContextValue>({
  open: false,
  onOpenChange: () => {},
});

function Collapsible({
  open,
  onOpenChange,
  defaultOpen = false,
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
}) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isOpen = open !== undefined ? open : internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  return (
    <CollapsibleContext.Provider
      value={{ open: isOpen, onOpenChange: setOpen }}
    >
      <div
        data-slot="collapsible"
        className={cn("collapse", className)}
        {...props}
      >
        {children}
      </div>
    </CollapsibleContext.Provider>
  );
}

function CollapsibleTrigger({
  asChild = false,
  children,
  className,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const { onOpenChange, open } = React.useContext(CollapsibleContext);

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
      data-slot="collapsible-trigger"
      className={cn("collapse-title", className)}
      onClick={() => onOpenChange(!open)}
      {...props}
    >
      {children}
    </button>
  );
}

function CollapsibleContent({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { open } = React.useContext(CollapsibleContext);

  if (!open) return null;

  return (
    <div
      data-slot="collapsible-content"
      className={cn("collapse-content", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
