import { useEffect, useRef, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { toGeoJSON, type Deal } from "../../data/discountLocations";
import type { TimeOfDay } from "../../hooks/useMapState";

interface MapCanvasProps {
  showHeatmap: boolean;
  showDiscounts: boolean;
  activeTime: TimeOfDay;
  filteredDeals: Deal[];
  onMarkerClick: (deal: Deal) => void;
  onMapReady: (map: mapboxgl.Map) => void;
}

const timeIntensity: Record<TimeOfDay, number> = {
  Morning: 0.6,
  Afternoon: 1.0,
  Evening: 0.8,
};

export function MapCanvas({
  showHeatmap,
  showDiscounts,
  activeTime,
  filteredDeals,
  onMarkerClick,
  onMapReady,
}: MapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const filteredDealsRef = useRef<Deal[]>(filteredDeals);

  useEffect(() => {
    filteredDealsRef.current = filteredDeals;
  }, [filteredDeals]);

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
  }, []);

  const addMarkers = useCallback(
    (map: mapboxgl.Map) => {
      clearMarkers();
      if (!showDiscounts) return;
      filteredDeals.forEach((deal) => {
        const el = document.createElement("div");
        el.className = "deal-marker";
        el.innerHTML = `
          <div style="display:flex;flex-direction:column;align-items:center;gap:4px;">
            <div style="
              width:42px;height:42px;border-radius:21px;
              background:white;border:1.6px solid #1a56db;
              display:flex;align-items:center;justify-content:center;
              box-shadow:0 4px 12px rgba(0,0,0,0.14);
              font-family:'JetBrains Mono',monospace;font-weight:700;
              font-size:14px;color:#1a56db;
            ">${deal.discount}%</div>
            <span style="
              font-family:'DM Sans',sans-serif;font-size:9px;
              color:#374151;text-align:center;max-width:80px;
              overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
            ">${deal.name}</span>
          </div>
        `;

        el.addEventListener("click", (e) => {
          e.stopPropagation();
          onMarkerClick(deal);
        });

        const marker = new mapboxgl.Marker({ element: el, anchor: "top" })
          .setLngLat([deal.lng, deal.lat])
          .addTo(map);

        markersRef.current.push(marker);
      });
    },
    [filteredDeals, showDiscounts, onMarkerClick, clearMarkers]
  );

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
    if (!mapboxgl.accessToken) {
      mapboxgl.accessToken = "";
    }

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [80.2707, 13.0827],
      zoom: 13,
      attributionControl: true,
    });

    map.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }),
      "bottom-right"
    );

    map.on("load", () => {
      map.resize();
      if (import.meta.env.DEV) {
        console.log("Map initialized successfully");
      }

      // Add GeoJSON source
      map.addSource("deals-heat", {
        type: "geojson",
        data: toGeoJSON(filteredDealsRef.current),
      });

      // Add heatmap layer
      map.addLayer({
        id: "deals-heatmap",
        type: "heatmap",
        source: "deals-heat",
        paint: {
          "heatmap-weight": ["get", "weight"],
          "heatmap-intensity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            10,
            1,
            15,
            3,
          ],
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0,
            "rgba(0,0,0,0)",
            0.2,
            "rgba(254,240,217,0.4)",
            0.4,
            "rgba(253,204,138,0.5)",
            0.6,
            "rgba(252,141,89,0.5)",
            0.8,
            "rgba(239,101,72,0.6)",
            1,
            "rgba(215,48,31,0.7)",
          ],
          "heatmap-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            10,
            20,
            15,
            40,
          ],
          "heatmap-opacity": 0.6,
        },
      });

      mapRef.current = map;
      onMapReady(map);
      addMarkers(map);
    });

    return () => {
      clearMarkers();
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update markers when filters change
  useEffect(() => {
    if (!mapRef.current) return;
    addMarkers(mapRef.current);
  }, [addMarkers]);

  // Update GeoJSON source when filtered deals change (without reinitializing the map)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    const source = map.getSource("deals-heat") as mapboxgl.GeoJSONSource | undefined;
    if (!source) return;

    source.setData(toGeoJSON(filteredDeals));
  }, [filteredDeals]);

  // Toggle heatmap visibility
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    try {
      map.setLayoutProperty(
        "deals-heatmap",
        "visibility",
        showHeatmap ? "visible" : "none"
      );
    } catch {
      // Layer not ready yet
    }
  }, [showHeatmap]);

  // Update heatmap intensity by time
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    try {
      map.setPaintProperty(
        "deals-heatmap",
        "heatmap-intensity",
        timeIntensity[activeTime]
      );
    } catch {
      // Layer not ready yet
    }
  }, [activeTime]);

  return (
    <div className="absolute inset-0">
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />

      {/* Heat legend — bottom-left */}
      {showHeatmap && (
        <div
          className="absolute z-10 flex flex-col gap-1.5"
          style={{
            left: 16,
            bottom: 32,
            width: 120,
            padding: "10px 12px",
            borderRadius: 10,
            background: "rgba(255,255,255,0.9)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11,
              fontWeight: 600,
              color: "#374151",
            }}
          >
            Traffic Density
          </span>
          <div
            style={{
              width: "100%",
              height: 8,
              borderRadius: 4,
              background:
                "linear-gradient(to right, #fde68a, #fbbf24, #f59e0b, #ef4444, #dc2626)",
            }}
          />
          <div className="flex justify-between">
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 10,
                color: "#9ca3af",
              }}
            >
              Low
            </span>
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 10,
                color: "#9ca3af",
              }}
            >
              High
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
