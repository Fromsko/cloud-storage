import { cn } from "@/lib/utils";
import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantClasses = {
    default: "border-transparent bg-blue-500 text-black hover:bg-blue-600",
    secondary: "border-transparent bg-gray-500 text-black hover:bg-gray-600",
    destructive: "border-transparent bg-red-500 text-black hover:bg-red-600",
    outline: "border-gray-300 text-gray-700 hover:bg-gray-50",
  };

  return (
    <div
      className={cn(
        "focus:ring-ring inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
