import * as React from "react";

import { cn } from "@/lib/utils";

type RadioGroupContextValue = {
  value?: string;
  onValueChange?: (value: string) => void;
  name: string;
};

const RadioGroupContext = React.createContext<RadioGroupContextValue>({
  name: "radio",
});

function RadioGroup({
  className,
  value,
  onValueChange,
  defaultValue,
  name,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  name?: string;
}) {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
  const activeValue = value !== undefined ? value : internalValue;
  const generatedName = React.useId();
  const radioName = name ?? generatedName;
  const handleChange = onValueChange ?? setInternalValue;

  return (
    <RadioGroupContext.Provider
      value={{
        value: activeValue,
        onValueChange: handleChange,
        name: radioName,
      }}
    >
      <div
        data-slot="radio-group"
        role="radiogroup"
        className={cn("flex flex-col gap-3", className)}
        {...props}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

function RadioGroupItem({
  className,
  value,
  id,
  disabled,
  ...props
}: React.ComponentProps<"input"> & { value: string }) {
  const {
    value: groupValue,
    onValueChange,
    name,
  } = React.useContext(RadioGroupContext);

  return (
    <input
      type="radio"
      data-slot="radio-group-item"
      id={id}
      name={name}
      value={value}
      checked={groupValue === value}
      disabled={disabled}
      onChange={() => onValueChange?.(value)}
      className={cn("radio", className)}
      {...props}
    />
  );
}

export { RadioGroup, RadioGroupItem };
