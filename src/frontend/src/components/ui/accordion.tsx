import { ChevronDownIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

type AccordionContextValue = {
  value?: string | string[];
  onValueChange?: (value: string) => void;
  type: "single" | "multiple";
};

const AccordionContext = React.createContext<AccordionContextValue>({
  type: "single",
});

function Accordion({
  children,
  type = "single",
  value,
  onValueChange,
  defaultValue,
  collapsible: _collapsible,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  type?: "single" | "multiple";
  value?: string | string[];
  onValueChange?: (value: string) => void;
  defaultValue?: string | string[];
  collapsible?: boolean;
}) {
  const [internalValue, setInternalValue] = React.useState<
    string | string[] | undefined
  >(defaultValue);
  const activeValue = value !== undefined ? value : internalValue;
  const handleChange = onValueChange ?? ((v: string) => setInternalValue(v));

  return (
    <AccordionContext.Provider
      value={{ value: activeValue, onValueChange: handleChange, type }}
    >
      <div
        data-slot="accordion"
        className={cn("join join-vertical w-full", className)}
        {...props}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

function AccordionItem({
  className,
  value,
  children,
  ...props
}: React.ComponentProps<"div"> & { value: string }) {
  return (
    <div
      data-slot="accordion-item"
      data-value={value}
      className={cn(
        "collapse collapse-arrow join-item border border-base-300",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      data-slot="accordion-trigger"
      className={cn(
        "collapse-title text-sm font-medium flex items-center justify-between w-full",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDownIcon className="size-4 shrink-0 transition-transform duration-200" />
    </button>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="accordion-content"
      className={cn("collapse-content text-sm", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
