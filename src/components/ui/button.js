import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:pointer-events-none disabled:opacity-60 shadow-sm",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white hover:bg-blue-600/90 focus-visible:ring-blue-500 shadow-blue-600/30",
        secondary: "bg-violet-600 text-white hover:bg-violet-600/90 focus-visible:ring-violet-500 shadow-violet-600/30",
        outline: "border border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800 focus-visible:ring-slate-500 shadow-slate-800/30",
        ghost: "bg-transparent text-slate-100 hover:bg-slate-800 focus-visible:ring-slate-600 shadow-slate-800/30",
        destructive: "bg-rose-600 text-white hover:bg-rose-600/90 focus-visible:ring-rose-500 shadow-rose-600/30"
      },
      size: {
        sm: "h-9 px-3",
        md: "h-10 px-4",
        lg: "h-11 px-5 text-base"
      },
      shadow: {
        true: "shadow-lg",
        false: ""
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      shadow: true
    }
  }
);

const Button = React.forwardRef(({ className, variant, size, shadow = true, ...props }, ref) => (
  <button ref={ref} className={cn(buttonVariants({ variant, size, shadow, className }))} {...props} />
));
Button.displayName = "Button";

export { Button, buttonVariants };

