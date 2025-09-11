import * as React from "react"
import { cn } from "../../lib/utils"

const Slider = React.forwardRef(({ className, defaultValue, max, onValueChange, ...props }, ref) => {
  const [value, setValue] = React.useState(defaultValue?.[0] || 50);
  
  const handleChange = (e) => {
    const newValue = parseInt(e.target.value);
    setValue(newValue);
    if (onValueChange) {
      onValueChange([newValue]);
    }
  };

  return (
    <input
      ref={ref}
      type="range"
      value={value}
      max={max || 100}
      onChange={handleChange}
      className={cn(
        "w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider",
        className
      )}
      {...props}
    />
  );
});

Slider.displayName = "Slider"

export { Slider }
