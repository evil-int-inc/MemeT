import * as React from "react";

import { cn } from "@/lib/utils";

type TabsContextValue = {
  value: string;
  onValueChange: (value: string) => void;
};

const TabsContext = React.createContext<TabsContextValue>({
  value: "",
  onValueChange: () => {},
});

function Tabs({
  className,
  defaultValue,
  value: valueProp,
  onValueChange,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}) {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
  const value = valueProp !== undefined ? valueProp : internalValue;
  const setValue = onValueChange ?? setInternalValue;

  return (
    <TabsContext.Provider value={{ value, onValueChange: setValue }}>
      <div
        data-slot="tabs"
        className={cn("flex flex-col gap-2", className)}
        {...props}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
}

function TabsList({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="tabs-list"
      role="tablist"
      className={cn("tabs tabs-bordered", className)}
      {...props}
    >
      {children}
    </div>
  );
}

function TabsTrigger({
  className,
  value,
  children,
  disabled,
  ...props
}: React.ComponentProps<"button"> & { value: string }) {
  const { value: activeValue, onValueChange } = React.useContext(TabsContext);
  const isActive = activeValue === value;

  return (
    <button
      type="button"
      role="tab"
      data-slot="tabs-trigger"
      data-state={isActive ? "active" : "inactive"}
      aria-selected={isActive}
      disabled={disabled}
      className={cn(
        "tab",
        isActive && "tab-active",
        disabled && "opacity-50 pointer-events-none",
        className,
      )}
      onClick={() => !disabled && onValueChange(value)}
      {...props}
    >
      {children}
    </button>
  );
}

function TabsContent({
  className,
  value,
  children,
  ...props
}: React.ComponentProps<"div"> & { value: string }) {
  const { value: activeValue } = React.useContext(TabsContext);

  if (activeValue !== value) return null;

  return (
    <div
      data-slot="tabs-content"
      role="tabpanel"
      className={cn("outline-none", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
