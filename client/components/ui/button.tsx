import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-aragorn-emerald disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-aragorn-emerald text-aragorn-black hover:bg-aragorn-emerald-dim shadow-[0_0_20px_rgba(0,255,148,0.2)]",
        destructive:
          "bg-aragorn-rose text-white hover:bg-rose-600",
        outline:
          "border border-aragorn-border-light bg-transparent hover:bg-aragorn-surface hover:border-aragorn-emerald/50",
        secondary:
          "bg-aragorn-surface text-aragorn-text hover:bg-aragorn-elevated border border-aragorn-border",
        ghost:
          "hover:bg-aragorn-surface hover:text-aragorn-text",
        link:
          "text-aragorn-emerald underline-offset-4 hover:underline",
        glow:
          "bg-gradient-to-r from-aragorn-emerald to-aragorn-cyan text-aragorn-black font-semibold hover:shadow-[0_0_30px_rgba(0,255,148,0.3)]",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
