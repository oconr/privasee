import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "ui/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border border-blue-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-950 focus:ring-offset-2 dark:border-blue-800 dark:focus:ring-blue-300",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-blue-900 text-blue-50 shadow hover:bg-blue-900/80 dark:bg-blue-50 dark:text-blue-900 dark:hover:bg-blue-50/80",
        secondary:
          "border-transparent bg-blue-100 text-blue-900 hover:bg-blue-100/80 dark:bg-blue-800 dark:text-blue-50 dark:hover:bg-blue-800/80",
        destructive:
          "border-transparent bg-red-500 text-slate-50 shadow hover:bg-red-500/80 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/80",
        outline: "text-blue-950 dark:text-blue-50",
        success:
          "border-transparent bg-green-100 text-green-900 hover:bg-green-100/80 dark:bg-green-800 dark:text-green-50 dark:hover:bg-green-800/80",
        grey: "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
