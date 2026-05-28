import * as React from "react";

import { cn } from "@/lib/utils";

type AvatarProps = React.ComponentProps<"div"> & {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
};

const sizeMap = {
  xs: "w-6",
  sm: "w-8",
  md: "w-12",
  lg: "w-16",
  xl: "w-24",
};

const AvatarContext = React.createContext<{ size: string }>({
  size: "w-8",
});

function Avatar({ className, size = "sm", children, ...props }: AvatarProps) {
  return (
    <AvatarContext.Provider value={{ size: sizeMap[size] }}>
      <div data-slot="avatar" className={cn("avatar", className)} {...props}>
        <div className={cn(sizeMap[size], "rounded-full overflow-hidden")}>
          {children}
        </div>
      </div>
    </AvatarContext.Provider>
  );
}

function AvatarImage({
  className,
  src,
  alt = "",
  ...props
}: React.ComponentProps<"img">) {
  if (!src) return null;
  return (
    // biome-ignore lint/a11y/useAltText: alt prop is passed via spread or default empty string for decorative avatars
    <img
      data-slot="avatar-image"
      src={src}
      alt={alt}
      className={cn("object-cover w-full h-full", className)}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-fallback"
      className={cn(
        "flex items-center justify-center w-full h-full bg-base-300 text-base-content font-medium text-sm",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export { Avatar, AvatarImage, AvatarFallback };
