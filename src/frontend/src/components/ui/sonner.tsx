"use client";

import type { CSSProperties } from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--color-base-100)",
          "--normal-text": "var(--color-base-content)",
          "--normal-border": "var(--color-base-300)",
        } as CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
