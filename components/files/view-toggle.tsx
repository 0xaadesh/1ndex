"use client";

import { useState, useEffect } from "react";
import { Grid3x3, List } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type ViewMode = "grid" | "list";

interface ViewToggleProps {
  value?: ViewMode;
  onValueChange?: (value: ViewMode) => void;
}

export function ViewToggle({ value: controlledValue, onValueChange }: ViewToggleProps) {
  const [internalValue, setInternalValue] = useState<ViewMode>("grid");

  // Use controlled value if provided, otherwise use internal state
  const value = controlledValue ?? internalValue;

  useEffect(() => {
    // Load from localStorage on mount
    const saved = localStorage.getItem("file-view-mode") as ViewMode;
    if (saved && (saved === "grid" || saved === "list")) {
      setInternalValue(saved);
    }
  }, []);

  const handleValueChange = (newValue: ViewMode) => {
    if (newValue) {
      if (onValueChange) {
        onValueChange(newValue);
      } else {
        setInternalValue(newValue);
      }
      // Only save to localStorage if onValueChange is not provided (uncontrolled mode)
      if (!onValueChange) {
        localStorage.setItem("file-view-mode", newValue);
      }
    }
  };

  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={handleValueChange}
      className="border rounded-md"
    >
      <ToggleGroupItem value="grid" aria-label="Grid view">
        <Grid3x3 className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="list" aria-label="List view">
        <List className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

