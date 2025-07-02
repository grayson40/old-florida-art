"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps {
  value: number[]
  onValueChange: (value: number[]) => void
  max?: number
  min?: number
  step?: number
  className?: string
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ value, onValueChange, max = 100, min = 0, step = 1, className, ...props }, ref) => {
    const [localValue, setLocalValue] = React.useState(value)

    React.useEffect(() => {
      setLocalValue(value)
    }, [value])

    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMin = Number(e.target.value)
      const newValue = [newMin, Math.max(newMin, localValue[1])]
      setLocalValue(newValue)
      onValueChange(newValue)
    }

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMax = Number(e.target.value)
      const newValue = [Math.min(localValue[0], newMax), newMax]
      setLocalValue(newValue)
      onValueChange(newValue)
    }

    const minPercent = ((localValue[0] - min) / (max - min)) * 100
    const maxPercent = ((localValue[1] - min) / (max - min)) * 100

    return (
      <div className={cn("relative w-full", className)}>
        <div className="relative h-2 bg-florida-sand-200 rounded-full">
          {/* Active range background */}
          <div
            className="absolute h-2 bg-florida-green-500 rounded-full"
            style={{
              left: `${minPercent}%`,
              width: `${maxPercent - minPercent}%`,
            }}
          />
          
          {/* Min thumb */}
          <div
            className="absolute w-4 h-4 bg-white border-2 border-florida-green-500 rounded-full shadow-sm -translate-y-1 cursor-pointer hover:bg-florida-green-50 transition-colors"
            style={{ left: `calc(${minPercent}% - 8px)` }}
          />
          
          {/* Max thumb */}
          <div
            className="absolute w-4 h-4 bg-white border-2 border-florida-green-500 rounded-full shadow-sm -translate-y-1 cursor-pointer hover:bg-florida-green-50 transition-colors"
            style={{ left: `calc(${maxPercent}% - 8px)` }}
          />
        </div>
        
        {/* Invisible input elements for interaction */}
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue[0]}
          onChange={handleMinChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          style={{ zIndex: 1 }}
          {...props}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue[1]}
          onChange={handleMaxChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          style={{ zIndex: 2 }}
        />
      </div>
    )
  }
)

Slider.displayName = "Slider"

export { Slider } 