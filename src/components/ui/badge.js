import * as React from "react";
import { cn } from "../../lib/utils";

function Badge({ className, variant = "default", ...props }) {
  const variants = {
    default: "bg-blue-600/80 text-white border border-blue-500/50",
    secondary: "bg-violet-600/80 text-white border border-violet-500/50",
    muted: "bg-slate-800 text-slate-100 border border-slate-700",
    success: "bg-emerald-600/80 text-white border border-emerald-500/50",
    warning: "bg-amber-500/90 text-white border border-amber-400/60",
    danger: "bg-rose-600/85 text-white border border-rose-500/60"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow-sm",
        variants[variant] || variants.default,
        className
      )}
      {...props}
    />
  );
}

export { Badge };

