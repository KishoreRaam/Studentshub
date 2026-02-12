import React from "react";
import type { TimeOfDay } from "../../hooks/useMapState";
import { dealsData, categories, type Deal } from "../../data/discountLocations";

interface ControlPanelProps {
  showHeatmap: boolean;
  setShowHeatmap: (v: boolean) => void;
  showDiscounts: boolean;
  setShowDiscounts: (v: boolean) => void;
  showColleges: boolean;
  setShowColleges: (v: boolean) => void;
  activeTime: TimeOfDay;
  setActiveTime: (v: TimeOfDay) => void;
  activeCategory: string;
  setActiveCategory: (v: string) => void;
  onSelectDeal: (deal: Deal) => void;
}

const toggleRows: {
  key: "showHeatmap" | "showDiscounts" | "showColleges";
  emoji: string;
  label: string;
  onColor: string;
}[] = [
  { key: "showHeatmap", emoji: "🔥", label: "Show Heatmap", onColor: "#1a56db" },
  { key: "showDiscounts", emoji: "📍", label: "Show Discounts", onColor: "#f59e0b" },
  { key: "showColleges", emoji: "🏫", label: "Show Colleges", onColor: "#d1d5db" },
];

const timeOptions: { value: TimeOfDay; emoji: string }[] = [
  { value: "Morning", emoji: "🌅" },
  { value: "Afternoon", emoji: "☀️" },
  { value: "Evening", emoji: "🌆" },
];

export const ControlPanel = React.memo(function ControlPanel(
  props: ControlPanelProps
) {
  const {
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
    onSelectDeal,
  } = props;

  const toggleState: Record<string, boolean> = {
    showHeatmap,
    showDiscounts,
    showColleges,
  };
  const toggleSetters: Record<string, (v: boolean) => void> = {
    showHeatmap: setShowHeatmap,
    showDiscounts: setShowDiscounts,
    showColleges: setShowColleges,
  };

  const filteredDeals =
    activeCategory === "All"
      ? dealsData
      : dealsData.filter((d) => d.category === activeCategory);

  return (
    <div
      className="absolute z-10 flex-col hidden md:flex"
      style={{
        left: 16,
        top: 16,
        width: 300,
        maxHeight: "calc(100% - 32px)",
        borderRadius: 16,
        background: "rgba(255,255,255,0.92)",
        boxShadow: "4px 0px 24px rgba(0,0,0,0.06)",
      }}
    >
      {/* Fixed header */}
      <div style={{ padding: "20px 16px 0 16px" }}>
        {/* Title */}
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700,
            fontSize: 20,
            color: "#0a0a0a",
            margin: 0,
          }}
        >
          Discover Deals
        </h2>
        <div className="flex items-center gap-1" style={{ marginTop: 4 }}>
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              color: "#6b7280",
            }}
          >
            Tamil Nadu · 12 locations found
          </span>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#1a56db",
              display: "inline-block",
            }}
          />
        </div>
      </div>

      {/* Scrollable content */}
      <div
        className="flex-1 overflow-y-auto deals-scroll"
        style={{ padding: "20px 16px 16px 16px" }}
      >
        {/* LAYERS */}
        <div style={{ marginBottom: 20 }}>
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 10,
              fontWeight: 600,
              color: "#9ca3af",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            LAYERS
          </span>
          <div className="flex flex-col" style={{ marginTop: 12, gap: 12 }}>
            {toggleRows.map((row) => {
              const isOn = toggleState[row.key];
              return (
                <div
                  key={row.key}
                  className="flex items-center justify-between"
                >
                  <span
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 14,
                      color: "#374151",
                    }}
                  >
                    {row.emoji} {row.label}
                  </span>
                  <button
                    onClick={() => toggleSetters[row.key](!isOn)}
                    className="relative shrink-0 cursor-pointer"
                    style={{
                      width: 40,
                      height: 22,
                      borderRadius: 11,
                      background: isOn ? row.onColor : "#d1d5db",
                      border: "none",
                      transition: "background 0.2s",
                    }}
                  >
                    <span
                      className="absolute bg-white rounded-full"
                      style={{
                        width: 14,
                        height: 14,
                        top: 4,
                        left: isOn ? 22 : 4,
                        transition: "left 0.2s",
                      }}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* TIME OF DAY */}
        <div style={{ marginBottom: 20 }}>
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 10,
              fontWeight: 600,
              color: "#9ca3af",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            TIME OF DAY
          </span>
          <div
            className="flex items-center"
            style={{
              marginTop: 12,
              height: 40,
              borderRadius: 10,
              background: "#f3f4f6",
              padding: 3,
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
        </div>

        {/* CATEGORY */}
        <div style={{ marginBottom: 20 }}>
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 10,
              fontWeight: 600,
              color: "#9ca3af",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            CATEGORY
          </span>
          <div
            className="flex flex-wrap"
            style={{ marginTop: 12, gap: 8 }}
          >
            {categories.map((cat) => {
              const isActive = activeCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className="flex items-center gap-1 cursor-pointer"
                  style={{
                    height: 32,
                    padding: "0 12px",
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
        </div>

        {/* NEARBY */}
        <div>
          <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 10,
                fontWeight: 600,
                color: "#9ca3af",
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              NEARBY
            </span>
            <span
              className="flex items-center justify-center"
              style={{
                minWidth: 24,
                height: 20,
                padding: "0 6px",
                borderRadius: 9999,
                background: "#ebf2ff",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                fontWeight: 600,
                color: "#1a56db",
              }}
            >
              {filteredDeals.length}
            </span>
          </div>

          <div className="flex flex-col" style={{ gap: 12 }}>
            {filteredDeals.map((deal) => (
              <button
                key={deal.id}
                onClick={() => onSelectDeal(deal)}
                className="flex items-center gap-3 w-full text-left cursor-pointer"
                style={{
                  height: 64,
                  background: "transparent",
                  border: "none",
                  padding: 0,
                }}
              >
                {/* Emoji circle */}
                <div
                  className="flex items-center justify-center shrink-0 rounded-full"
                  style={{
                    width: 32,
                    height: 32,
                    background: deal.bgColor,
                    fontSize: 16,
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
                      fontSize: 14,
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
                    }}
                  >
                    {deal.category}
                  </div>
                </div>

                {/* Discount + distance */}
                <div className="flex flex-col items-end shrink-0">
                  <span
                    className="rounded-full"
                    style={{
                      padding: "2px 8px",
                      background: "#fffbeb",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 13,
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
    </div>
  );
});
