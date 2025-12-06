import * as React from "react";
import { cn } from "../../lib/utils";

const Input = React.forwardRef(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-lg border border-slate-800 bg-slate-900/70 px-4 text-sm text-slate-100 shadow-inner shadow-slate-950/50 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 placeholder:text-slate-500",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };

