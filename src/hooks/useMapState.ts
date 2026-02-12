import { useState, useCallback } from "react";
import type { Deal } from "../data/discountLocations";

export type TimeOfDay = "Morning" | "Afternoon" | "Evening";

export function useMapState() {
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showDiscounts, setShowDiscounts] = useState(true);
  const [showColleges, setShowColleges] = useState(false);
  const [activeTime, setActiveTime] = useState<TimeOfDay>("Afternoon");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  const clearSelection = useCallback(() => setSelectedDeal(null), []);

  return {
    showHeatmap,
    setShowHeatmap,
    showDiscounts,
    setShowDiscounts,
    showColleges,
    setShowColleges,
    activeTime,
    setActiveTime,
    activeCategory,
    setActiveCategory,
    selectedDeal,
    setSelectedDeal,
    clearSelection,
  };
}
