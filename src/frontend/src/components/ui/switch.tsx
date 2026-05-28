import type * as React from "react";

import { cn } from "@/lib/utils";

function Switch({
  className,
  checked,
  defaultChecked,
  onCheckedChange,
  onChange,
  ...props
}: React.ComponentProps<"input"> & {
  onCheckedChange?: (checked: boolean) => void;
}) {
  const handleChange = (
    e: React.ChangeEvent<
      "input" extends keyof HTMLElementTagNameMap ? HTMLInputElement : never
    >,
  ) => {
    onChange?.(e as React.ChangeEvent<HTMLInputElement>);
    onCheckedChange?.((e.target as HTMLInputElement).checked);
  };

  return (
    <input
      type="checkbox"
      role="switch"
      aria-checked={checked}
      data-slot="switch"
      checked={checked}
      defaultChecked={defaultChecked}
      onChange={handleChange as React.ChangeEventHandler<HTMLInputElement>}
      className={cn("toggle", className)}
      {...props}
    />
  );
}

export { Switch };
