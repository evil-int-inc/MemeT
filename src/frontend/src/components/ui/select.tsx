import * as React from "react";

import { cn } from "@/lib/utils";

type SelectContextValue = {
  value?: string;
  onValueChange?: (value: string) => void;
  name?: string;
};

const SelectContext = React.createContext<SelectContextValue>({});

function Select({
  children,
  value,
  onValueChange,
  defaultValue: _defaultValue,
  name,
}: {
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  name?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <SelectContext.Provider value={{ value, onValueChange, name }}>
      {children}
    </SelectContext.Provider>
  );
}

function SelectGroup({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function SelectValue({ placeholder: _placeholder }: { placeholder?: string }) {
  // Rendered inside SelectTrigger — not needed for native select
  return null;
}

function SelectTrigger({
  size: _size = "default",
  children,
}: React.ComponentProps<"div"> & { size?: "sm" | "default" }) {
  // The actual <select> is rendered inside SelectContent; this wrapper is a no-op
  return <>{children}</>;
}

function SelectContent({
  className,
  children,
  position: _position,
}: React.ComponentProps<"div"> & { position?: string }) {
  const { value, onValueChange, name } = React.useContext(SelectContext);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onValueChange?.(e.target.value);
  };

  return (
    <select
      data-slot="select"
      name={name}
      value={value}
      onChange={handleChange}
      className={cn("select select-bordered w-full", className)}
    >
      {children}
    </select>
  );
}

function SelectLabel({
  className,
  children,
  ...props
}: React.ComponentProps<"optgroup">) {
  return (
    <optgroup data-slot="select-label" className={cn(className)} {...props}>
      {children}
    </optgroup>
  );
}

function SelectItem({
  className,
  children,
  value,
  disabled,
  ...props
}: React.ComponentProps<"option"> & { value: string }) {
  return (
    <option
      data-slot="select-item"
      value={value}
      disabled={disabled}
      className={cn(className)}
      {...props}
    >
      {children}
    </option>
  );
}

function SelectSeparator({ className, ...props }: React.ComponentProps<"hr">) {
  return <hr className={cn("border-base-300 my-1", className)} {...props} />;
}

function SelectScrollUpButton() {
  return null;
}
function SelectScrollDownButton() {
  return null;
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
