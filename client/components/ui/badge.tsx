import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-aragorn-emerald focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-aragorn-emerald/10 text-aragorn-emerald",
        secondary:
          "border-transparent bg-aragorn-purple/10 text-aragorn-purple-bright",
        destructive:
          "border-transparent bg-aragorn-rose/10 text-aragorn-rose",
        outline: "text-aragorn-text-secondary border-aragorn-border-light",
        amber:
          "border-transparent bg-aragorn-amber/10 text-aragorn-amber",
        cyan:
          "border-transparent bg-aragorn-cyan/10 text-aragorn-cyan",
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
