import { useRef, useState } from "react";
import type mapboxgl from "mapbox-gl";
import { useMapState } from "../hooks/useMapState";
import { MapNavBar } from "../components/map/MapNavBar";
import { ControlPanel } from "../components/map/ControlPanel";
import { MobileBottomSheet } from "../components/map/MobileBottomSheet";
import { MapCanvas } from "../components/map/MapCanvas";
import { InfoCard } from "../components/map/InfoCard";

export default function MapPage() {
  const state = useMapState();
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const [isMobileLayersOpen, setIsMobileLayersOpen] = useState(false);

  return (
    <div className="h-screen w-screen overflow-hidden" style={{ background: "#eceef1" }}>
      {/* Desktop nav (hides itself on mobile via hidden md:flex) */}
      <MapNavBar />

      {/* Content area — responsive via CSS classes defined in index.css */}
      <div className="map-page-content">
        {/* Map area */}
        <div className="map-page-map-area">
          <MapCanvas
            showHeatmap={state.showHeatmap}
            showDiscounts={state.showDiscounts}
            activeTime={state.activeTime}
            activeCategory={state.activeCategory}
            onMarkerClick={state.setSelectedDeal}
            onMapReady={(map) => {
              mapInstanceRef.current = map;
            }}
          />

          {/* Mobile-only: map overlay buttons */}
          <div
            className="absolute z-10 flex flex-col gap-2 md:hidden"
            style={{ right: 12, top: 12 }}
          >
            <button
              onClick={() => setIsMobileLayersOpen(!isMobileLayersOpen)}
              className="flex items-center justify-center cursor-pointer"
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: "rgba(255,255,255,0.95)",
                border: "0.8px solid #e5e7eb",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </button>
            <button
              className="flex items-center justify-center cursor-pointer"
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: "rgba(255,255,255,0.95)",
                border: "0.8px solid #e5e7eb",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </button>
          </div>

          {/* Mobile-only: layers popup */}
          {isMobileLayersOpen && (
            <>
              <div
                className="absolute inset-0 md:hidden"
                style={{ zIndex: 15 }}
                onClick={() => setIsMobileLayersOpen(false)}
              />
              <div
                className="absolute md:hidden"
                style={{
                  zIndex: 20,
                  right: 60,
                  top: 12,
                  width: 200,
                  padding: 16,
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.96)",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                  border: "0.8px solid #e5e7eb",
                }}
              >
                {[
                  { label: "Show Heatmap", emoji: "\uD83D\uDD25", isOn: state.showHeatmap, toggle: state.setShowHeatmap, color: "#1a56db" },
                  { label: "Show Discounts", emoji: "\uD83D\uDCCD", isOn: state.showDiscounts, toggle: state.setShowDiscounts, color: "#f59e0b" },
                  { label: "Show Colleges", emoji: "\uD83C\uDFEB", isOn: state.showColleges, toggle: state.setShowColleges, color: "#d1d5db" },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between" style={{ marginBottom: 10 }}>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#374151" }}>
                      {row.emoji} {row.label}
                    </span>
                    <button
                      onClick={() => row.toggle(!row.isOn)}
                      className="relative shrink-0 cursor-pointer"
                      style={{
                        width: 36,
                        height: 20,
                        borderRadius: 10,
                        background: row.isOn ? row.color : "#d1d5db",
                        border: "none",
                        transition: "background 0.2s",
                      }}
                    >
                      <span
                        className="absolute bg-white rounded-full"
                        style={{
                          width: 12,
                          height: 12,
                          top: 4,
                          left: row.isOn ? 20 : 4,
                          transition: "left 0.2s",
                        }}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          <InfoCard
            deal={state.selectedDeal}
            map={mapInstanceRef.current}
            onClose={state.clearSelection}
          />
        </div>

        {/* Desktop-only: sidebar (hidden on mobile via its own class) */}
        <ControlPanel
          showHeatmap={state.showHeatmap}
          setShowHeatmap={state.setShowHeatmap}
          showDiscounts={state.showDiscounts}
          setShowDiscounts={state.setShowDiscounts}
          showColleges={state.showColleges}
          setShowColleges={state.setShowColleges}
          activeTime={state.activeTime}
          setActiveTime={state.setActiveTime}
          activeCategory={state.activeCategory}
          setActiveCategory={state.setActiveCategory}
          onSelectDeal={state.setSelectedDeal}
        />

        {/* Mobile-only: bottom sheet */}
        <div className="map-page-bottom-sheet">
          <MobileBottomSheet
            activeTime={state.activeTime}
            setActiveTime={state.setActiveTime}
            activeCategory={state.activeCategory}
            setActiveCategory={state.setActiveCategory}
            onSelectDeal={state.setSelectedDeal}
          />
        </div>
      </div>
    </div>
  );
}
