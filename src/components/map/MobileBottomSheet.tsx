import React from "react";
import type { TimeOfDay } from "../../hooks/useMapState";
import { dealsData, categories, type Deal } from "../../data/discountLocations";

interface MobileBottomSheetProps {
  activeTime: TimeOfDay;
  setActiveTime: (v: TimeOfDay) => void;
  activeCategory: string;
  setActiveCategory: (v: string) => void;
  onSelectDeal: (deal: Deal) => void;
}

const timeOptions: { value: TimeOfDay; emoji: string }[] = [
  { value: "Morning", emoji: "\uD83C\uDF05" },
  { value: "Afternoon", emoji: "\u2600\uFE0F" },
  { value: "Evening", emoji: "\uD83C\uDF06" },
];

export const MobileBottomSheet = React.memo(function MobileBottomSheet(
  props: MobileBottomSheetProps
) {
  const {
    activeTime,
    setActiveTime,
    activeCategory,
    setActiveCategory,
    onSelectDeal,
  } = props;

  const filteredDeals =
    activeCategory === "All"
      ? dealsData
      : dealsData.filter((d) => d.category === activeCategory);

  return (
    <div
      className="flex flex-col flex-1 overflow-hidden"
      style={{
        background: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: -16,
        position: "relative",
        zIndex: 15,
        boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
      }}
    >
      {/* Drag handle */}
      <div className="flex justify-center" style={{ paddingTop: 10, paddingBottom: 6 }}>
        <div
          style={{
            width: 36,
            height: 4,
            borderRadius: 2,
            background: "#d1d5db",
          }}
        />
      </div>

      {/* Fixed filters section */}
      <div style={{ padding: "0 16px" }}>
        {/* Time of day */}
        <div
          className="flex items-center"
          style={{
            height: 40,
            borderRadius: 10,
            background: "#f3f4f6",
            padding: 3,
            marginBottom: 12,
          }}
        >
          {timeOptions.map((t) => {
            const isActive = activeTime === t.value;
            return (
              <button
                key={t.value}
                onClick={() => setActiveTime(t.value)}
                className="flex-1 flex items-center justify-center gap-1 cursor-pointer"
                style={{
                  height: "100%",
                  borderRadius: 8,
                  border: "none",
                  background: isActive ? "#fff" : "transparent",
                  boxShadow: isActive
                    ? "0 1px 4px rgba(0,0,0,0.12)"
                    : "none",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: 500,
                  color: isActive ? "#0a0a0a" : "#6b7280",
                  transition: "all 0.2s",
                }}
              >
                <span style={{ fontSize: 13 }}>{t.emoji}</span>
                {t.value}
              </button>
            );
          })}
        </div>

        {/* Category chips - horizontal scroll */}
        <div
          className="flex items-center gap-2 overflow-x-auto no-scrollbar"
          style={{ paddingBottom: 12 }}
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className="flex items-center gap-1 cursor-pointer shrink-0"
                style={{
                  height: 34,
                  padding: "0 14px",
                  borderRadius: 9999,
                  border: isActive ? "none" : "0.8px solid #e5e7eb",
                  background: isActive ? "#0a0a0a" : "#fff",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: 500,
                  color: isActive ? "#fff" : "#374151",
                  transition: "all 0.15s",
                }}
              >
                {cat.emoji && (
                  <span style={{ fontSize: 13 }}>{cat.emoji}</span>
                )}
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Deals count header */}
        <div style={{ paddingBottom: 8 }}>
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15,
              fontWeight: 700,
              color: "#0a0a0a",
            }}
          >
            {filteredDeals.length} deals near you
          </span>
        </div>
      </div>

      {/* Scrollable deals list */}
      <div
        className="flex-1 overflow-y-auto deals-scroll"
        style={{ padding: "0 16px 16px 16px" }}
      >
        <div className="flex flex-col" style={{ gap: 4 }}>
          {filteredDeals.map((deal) => (
            <button
              key={deal.id}
              onClick={() => onSelectDeal(deal)}
              className="flex items-center gap-3 w-full text-left cursor-pointer"
              style={{
                minHeight: 64,
                background: "transparent",
                border: "none",
                padding: "10px 0",
                borderBottom: "0.5px solid #f3f4f6",
              }}
            >
              {/* Emoji circle */}
              <div
                className="flex items-center justify-center shrink-0 rounded-full"
                style={{
                  width: 40,
                  height: 40,
                  background: deal.bgColor,
                  fontSize: 18,
                }}
              >
                {deal.emoji}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div
                  className="truncate"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#0a0a0a",
                  }}
                >
                  {deal.name}
                </div>
                <div
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 12,
                    color: "#6b7280",
                    marginTop: 2,
                  }}
                >
                  {deal.category}
                </div>
              </div>

              {/* Discount + distance */}
              <div className="flex flex-col items-end shrink-0">
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#d97706",
                  }}
                >
                  {deal.discount}% OFF
                </span>
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 11,
                    color: "#9ca3af",
                    marginTop: 2,
                  }}
                >
                  {deal.distance}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});
