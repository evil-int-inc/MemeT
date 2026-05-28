import type * as React from "react";

import { cn } from "@/lib/utils";

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  step,
  onValueChange,
  onChange,
  ...props
}: Omit<
  React.ComponentProps<"input">,
  "value" | "defaultValue" | "onChange"
> & {
  defaultValue?: number[];
  value?: number[];
  onValueChange?: (value: number[]) => void;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}) {
  const singleValue = Array.isArray(value) ? value[0] : undefined;
  const singleDefault = Array.isArray(defaultValue)
    ? defaultValue[0]
    : undefined;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
    onValueChange?.([Number(e.target.value)]);
  };

  return (
    <input
      type="range"
      data-slot="slider"
      min={min}
      max={max}
      step={step}
      value={singleValue}
      defaultValue={singleDefault}
      onChange={handleChange}
      className={cn("range", className)}
      {...props}
    />
  );
}

export { Slider };
