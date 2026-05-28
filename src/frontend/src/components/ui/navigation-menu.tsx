import { ChevronDownIcon } from "lucide-react";
import type * as React from "react";

import { cn } from "@/lib/utils";

// Pure DaisyUI navbar/menu implementation
function NavigationMenu({
  className,
  children,
  viewport: _viewport = true,
  ...props
}: React.ComponentProps<"nav"> & { viewport?: boolean }) {
  return (
    <nav
      data-slot="navigation-menu"
      className={cn("navbar flex items-center", className)}
      {...props}
    >
      {children}
    </nav>
  );
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="navigation-menu-list"
      className={cn("menu menu-horizontal flex items-center gap-1", className)}
      {...props}
    />
  );
}

function NavigationMenuItem({
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  );
}

const navigationMenuTriggerStyle = () =>
  "btn btn-ghost text-sm font-medium inline-flex items-center gap-1";

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), className)}
      {...props}
    >
      {children}
      <ChevronDownIcon className="size-3" />
    </button>
  );
}

function NavigationMenuContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="navigation-menu-content"
      className={cn(
        "absolute top-full left-0 z-50 bg-base-100 rounded-box border border-base-200 shadow-lg p-2 min-w-[12rem]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function NavigationMenuViewport(_props: React.ComponentProps<"div">) {
  return null;
}

function NavigationMenuLink({
  className,
  ...props
}: React.ComponentProps<"a">) {
  return (
    <a
      data-slot="navigation-menu-link"
      className={cn(
        "flex flex-col gap-1 rounded-btn p-2 text-sm hover:bg-base-200 transition-colors",
        className,
      )}
      {...props}
    />
  );
}

function NavigationMenuIndicator(_props: React.ComponentProps<"div">) {
  return null;
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
};
