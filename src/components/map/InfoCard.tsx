import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import type { Deal } from "../../data/discountLocations";
import type mapboxgl from "mapbox-gl";

interface InfoCardProps {
  deal: Deal | null;
  map: mapboxgl.Map | null;
  onClose: () => void;
}

export function InfoCard({ deal, map, onClose }: InfoCardProps) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  const updatePosition = useCallback(() => {
    if (!deal || !map) return;
    const point = map.project([deal.lng, deal.lat]);
    setPos({ x: point.x, y: point.y });
  }, [deal, map]);

  useEffect(() => {
    if (!map || !deal) return;
    updatePosition();
    map.on("move", updatePosition);
    return () => {
      map.off("move", updatePosition);
    };
  }, [map, deal, updatePosition]);

  return (
    <AnimatePresence>
      {deal && pos && (
        <motion.div
          key={deal.id}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute z-20 pointer-events-auto"
          style={{
            left: pos.x,
            top: pos.y - 16,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div
            className="relative"
            style={{
              width: 260,
              borderRadius: 14,
              background: "rgba(255,255,255,0.96)",
              backdropFilter: "blur(16px)",
              border: "0.8px solid #e5e7eb",
              boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
              padding: 16,
            }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 flex items-center justify-center rounded-full cursor-pointer"
              style={{
                width: 24,
                height: 24,
                background: "#f3f4f6",
                border: "none",
              }}
            >
              <X size={12} color="#6b7280" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
              <div
                className="flex items-center justify-center rounded-full shrink-0"
                style={{
                  width: 36,
                  height: 36,
                  background: deal.bgColor,
                  fontSize: 18,
                }}
              >
                {deal.emoji}
              </div>
              <div>
                <div
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
                  }}
                >
                  {deal.category} · {deal.distance}
                </div>
              </div>
            </div>

            {/* Discount */}
            <div
              className="flex items-center justify-center rounded-xl"
              style={{
                padding: "10px 0",
                background: "#fffbeb",
                marginBottom: 12,
              }}
            >
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#d97706",
                }}
              >
                {deal.discount}%
              </span>
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  color: "#6b7280",
                  marginLeft: 6,
                }}
              >
                OFF
              </span>
            </div>

            {/* CTA */}
            <button
              className="w-full py-2.5 rounded-xl text-white cursor-pointer"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                background: "#1a56db",
                border: "none",
              }}
            >
              View Deal
            </button>

            {/* Triangle */}
            <div
              style={{
                position: "absolute",
                bottom: -8,
                left: "50%",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "8px solid transparent",
                borderRight: "8px solid transparent",
                borderTop: "8px solid rgba(255,255,255,0.96)",
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
