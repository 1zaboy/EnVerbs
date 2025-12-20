import React from "react";
import {
  Slider as AriaSlider,
  SliderTrack,
  SliderThumb,
  SliderOutput,
} from "react-aria-components";
import { cn } from "../../../lib/utils";

function Slider({
  min = 0,
  max = 100,
  step = 1,
  defaultValue = [0, 1],
  value,
  onValueChange,
  labelPosition = "top-floating",
  className,
  ...props
}) {
  const isControlled = Array.isArray(value);

  const handleChange = (val) => {
    if (onValueChange) {
      onValueChange(val);
    }
  };

  return (
    <AriaSlider
      minValue={min}
      maxValue={max}
      step={step}
      value={isControlled ? value : undefined}
      defaultValue={!isControlled ? defaultValue : undefined}
      onChange={handleChange}
      className={cn("relative flex w-full touch-none select-none items-center py-3", className)}
      {...props}
    >
      <SliderTrack className="relative h-2 w-full grow rounded-full bg-slate-800">
        {({ state }) => (
          <>
            {/* Закрашенная часть трека между двумя ползунками */}
            <div
              className="absolute h-full rounded-full bg-blue-500"
              style={{
                left: `${(state.getThumbPercent(0) * 100)}%`,
                width: `${((state.getThumbPercent(1) - state.getThumbPercent(0)) * 100)}%`,
              }}
            />
            
            {/* Первый ползунок */}
            <SliderThumb
              index={0}
              className="top-1/2 -translate-y-1/2 block h-5 w-5 rounded-full border-2 border-slate-900 bg-white shadow-lg shadow-blue-500/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              {labelPosition === "top-floating" && (
                <SliderOutput className="absolute -top-10 left-1/2 -translate-x-1/2 rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-100 shadow-md whitespace-nowrap">
                  {({ state }) => state.values[0]}
                </SliderOutput>
              )}
            </SliderThumb>

            {/* Второй ползунок */}
            <SliderThumb
              index={1}
              className="top-1/2 -translate-y-1/2 block h-5 w-5 rounded-full border-2 border-slate-900 bg-white shadow-lg shadow-blue-500/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              {labelPosition === "top-floating" && (
                <SliderOutput className="absolute -top-10 left-1/2 -translate-x-1/2 rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-100 shadow-md whitespace-nowrap">
                  {({ state }) => state.values[1]}
                </SliderOutput>
              )}
            </SliderThumb>
          </>
        )}
      </SliderTrack>
    </AriaSlider>
  );
}

export { Slider };

