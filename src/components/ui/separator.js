import * as React from "react";
import { cn } from "../../lib/utils";

function Separator({ className, orientation = "horizontal", ...props }) {
  return (
    <div
      className={cn(
        "bg-slate-800/80",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className
      )}
      {...props}
    />
  );
}

export { Separator };

