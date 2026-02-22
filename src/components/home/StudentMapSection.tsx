import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Filter, Clock, TrendingUp, Lightbulb, Map } from "lucide-react";
import { MapPreview } from "../map/MapPreview";

type TimeOption = "Morning" | "Afternoon" | "Evening";

export default function StudentMapSection() {
  const navigate = useNavigate();
  const [showDiscounts, setShowDiscounts] = useState(true);
  const [showCrowdHeat, setShowCrowdHeat] = useState(true);
  const [activeTime, setActiveTime] = useState<TimeOption>("Afternoon");
  const [category, setCategory] = useState("all");
  const [distance, setDistance] = useState(3);

  return (
    <section
      className="w-full flex flex-col items-start"
      style={{
        paddingTop: 80,
        paddingLeft: 16,
        paddingRight: 16,
        backgroundImage:
          "linear-gradient(132.98deg, #F9FAFB 0%, rgba(239,246,255,0.3) 50%, rgba(240,253,244,0.3) 100%)",
      }}
    >
      <div
        className="w-full mx-auto flex flex-col gap-[48px]"
        style={{ maxWidth: 1200 }}
      >
        {/* BLOCK 1 — Section Header */}
        <div className="flex flex-col items-center w-full">
          <h2
            className="text-center"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: 48,
              lineHeight: "52px",
              color: "#101828",
              margin: 0,
            }}
          >
            Student Discounts Around You
          </h2>
          <div
            className="rounded-full"
            style={{
              width: 485,
              maxWidth: "100%",
              height: 4,
              marginTop: 16,
              opacity: 0.69,
              background: "linear-gradient(to right, #155DFC, #00C950, #9810FA)",
            }}
          />
          <p
            className="text-center"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              fontSize: 20,
              lineHeight: "28px",
              color: "#4A5565",
              marginTop: 8,
              marginBottom: 0,
            }}
          >
            See where to save and when to go without the crowd.
          </p>
        </div>

        {/* BLOCK 2 — Main Content */}
        <div className="w-full flex flex-col" style={{ gap: 20 }}>

          {/* Two-column row: Map + Sidebar */}
          <div className="w-full flex flex-col lg:flex-row gap-[20px]">

            {/* LEFT — Map Preview Card (no button inside, map fills the card) */}
            <div
              className="flex-1 flex flex-col"
              style={{
                background: "rgba(255,255,255,0.8)",
                border: "0.8px solid #E5E7EB",
                borderRadius: 24,
                boxShadow: "0px 25px 50px -12px rgba(0,0,0,0.25)",
                padding: 20,
                minHeight: 380,
              }}
            >
              {/* Map fills all available space */}
              <div
                className="relative w-full overflow-hidden flex-1"
                style={{
                  background: "#F0F0F0",
                  border: "0.8px solid #D1D5DC",
                  borderRadius: 16,
                  boxShadow: "inset 0px 2px 4px 0px rgba(0,0,0,0.05)",
                  minHeight: 340,
                }}
              >
                <MapPreview />
              </div>
            </div>

            {/* RIGHT — Sidebar Cards (tighter gap + spacing) */}
            <div
              className="flex flex-col"
              style={{ width: 300, flexShrink: 0, gap: 16 }}
            >
              {/* Card 1 — Filters */}
              <div
                className="flex flex-col"
                style={{
                  background: "rgba(255,255,255,0.8)",
                  border: "0.8px solid #E5E7EB",
                  borderRadius: 16,
                  boxShadow:
                    "0px 20px 25px 0px rgba(0,0,0,0.1), 0px 8px 10px 0px rgba(0,0,0,0.1)",
                  padding: 20,
                  gap: 16,
                }}
              >
                {/* Header */}
                <div className="flex items-center gap-[8px]">
                  <Filter size={18} color="#101828" />
                  <span
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 600,
                      fontSize: 17,
                      lineHeight: "24px",
                      color: "#101828",
                    }}
                  >
                    Filters
                  </span>
                </div>

                {/* Toggles */}
                <div className="flex flex-col" style={{ gap: 14 }}>
                  {/* Show Discounts */}
                  <div className="flex items-center justify-between">
                    <span
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 400,
                        fontSize: 14,
                        lineHeight: "20px",
                        color: "#364153",
                      }}
                    >
                      Show Discounts
                    </span>
                    <button
                      onClick={() => setShowDiscounts(!showDiscounts)}
                      className="relative shrink-0 rounded-full cursor-pointer"
                      style={{
                        width: 44,
                        height: 22,
                        background: showDiscounts
                          ? "linear-gradient(to right, #155DFC, #00A63E)"
                          : "#D1D5DC",
                        border: "none",
                        transition: "background 0.2s ease",
                      }}
                    >
                      <div
                        className="absolute rounded-full bg-white"
                        style={{
                          width: 14,
                          height: 14,
                          top: 4,
                          left: showDiscounts ? 26 : 4,
                          transition: "left 0.2s ease",
                        }}
                      />
                    </button>
                  </div>

                  {/* Show Crowd Heat */}
                  <div className="flex items-center justify-between">
                    <span
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 400,
                        fontSize: 14,
                        lineHeight: "20px",
                        color: "#364153",
                      }}
                    >
                      Show Crowd Heat
                    </span>
                    <button
                      onClick={() => setShowCrowdHeat(!showCrowdHeat)}
                      className="relative shrink-0 rounded-full cursor-pointer"
                      style={{
                        width: 44,
                        height: 22,
                        background: showCrowdHeat
                          ? "linear-gradient(to right, #155DFC, #00A63E)"
                          : "#D1D5DC",
                        border: "none",
                        transition: "background 0.2s ease",
                      }}
                    >
                      <div
                        className="absolute rounded-full bg-white"
                        style={{
                          width: 14,
                          height: 14,
                          top: 4,
                          left: showCrowdHeat ? 26 : 4,
                          transition: "left 0.2s ease",
                        }}
                      />
                    </button>
                  </div>
                </div>

                {/* Category dropdown */}
                <div className="flex flex-col" style={{ gap: 6 }}>
                  <label
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 400,
                      fontSize: 14,
                      lineHeight: "20px",
                      color: "#364153",
                    }}
                  >
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full cursor-pointer"
                    style={{
                      height: 38,
                      background: "#fff",
                      border: "0.8px solid #D1D5DC",
                      borderRadius: 10,
                      padding: "0 12px",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 14,
                      color: "#364153",
                      outline: "none",
                      appearance: "auto",
                    }}
                  >
                    <option value="all">All Categories</option>
                    <option value="print">Print</option>
                    <option value="cafe">Café</option>
                    <option value="stationery">Stationery</option>
                    <option value="food">Food</option>
                    <option value="retail">Retail</option>
                    <option value="medical">Medical</option>
                    <option value="transport">Transport</option>
                  </select>
                </div>

                {/* Distance slider */}
                <div className="flex flex-col" style={{ gap: 6 }}>
                  <span
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 400,
                      fontSize: 14,
                      lineHeight: "20px",
                      color: "#364153",
                    }}
                  >
                    Distance: {distance} km
                  </span>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={distance}
                    onChange={(e) => setDistance(Number(e.target.value))}
                    className="w-full cursor-pointer"
                    style={{
                      height: 4,
                      appearance: "none",
                      background: `linear-gradient(to right, #155DFC ${((distance - 1) / 4) * 100}%, #E5E7EB ${((distance - 1) / 4) * 100}%)`,
                      borderRadius: 10,
                      outline: "none",
                    }}
                  />
                  <div className="flex justify-between">
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#6A7282" }}>
                      1 km
                    </span>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#6A7282" }}>
                      5 km
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 2 — Time of Day */}
              <div
                className="flex flex-col"
                style={{
                  background: "rgba(255,255,255,0.8)",
                  border: "0.8px solid #E5E7EB",
                  borderRadius: 16,
                  boxShadow:
                    "0px 20px 25px 0px rgba(0,0,0,0.1), 0px 8px 10px 0px rgba(0,0,0,0.1)",
                  padding: 20,
                  gap: 14,
                }}
              >
                <div className="flex items-center gap-[8px]">
                  <Clock size={18} color="#101828" />
                  <span
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 600,
                      fontSize: 17,
                      lineHeight: "24px",
                      color: "#101828",
                    }}
                  >
                    Time of Day
                  </span>
                </div>

                <div className="relative flex flex-col" style={{ gap: 6 }}>
                  {(["Morning", "Afternoon", "Evening"] as TimeOption[]).map((time) => {
                    const isActive = activeTime === time;
                    return (
                      <button
                        key={time}
                        onClick={() => setActiveTime(time)}
                        className="cursor-pointer"
                        style={{
                          width: isActive ? "calc(100% + 12px)" : "100%",
                          marginLeft: isActive ? -6 : 0,
                          height: isActive ? 48 : 46,
                          borderRadius: 12,
                          border: "none",
                          background: isActive
                            ? "linear-gradient(to right, #155DFC, #00A63E)"
                            : "#F3F4F6",
                          boxShadow: isActive
                            ? "0 8px 20px rgba(21,93,252,0.28)"
                            : "none",
                          fontFamily: "'DM Sans', sans-serif",
                          fontWeight: isActive ? 600 : 400,
                          fontSize: 15,
                          lineHeight: "24px",
                          color: isActive ? "#fff" : "#364153",
                          textAlign: "center",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Card 3 — Active Deals */}
              <div
                className="flex flex-col"
                style={{
                  background: "linear-gradient(155.18deg, #155DFC 0%, #00A63E 100%)",
                  borderRadius: 16,
                  boxShadow:
                    "0px 20px 25px 0px rgba(0,0,0,0.1), 0px 8px 10px 0px rgba(0,0,0,0.1)",
                  padding: 20,
                  gap: 10,
                }}
              >
                <div className="flex items-center gap-[8px]">
                  <TrendingUp size={18} color="#fff" />
                  <span
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 600,
                      fontSize: 17,
                      lineHeight: "24px",
                      color: "#fff",
                    }}
                  >
                    Active Deals
                  </span>
                </div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 32, lineHeight: "38px", color: "#fff", margin: 0 }}>
                  5
                </p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: "20px", color: "#DBEAFE", margin: 0 }}>
                  locations nearby
                </p>
              </div>
            </div>
          </div>

          {/* ── Explore Map CTA — prominent full-width button below map + sidebar ── */}
          <button
            onClick={() => navigate("/map")}
            className="w-full cursor-pointer flex items-center justify-center"
            style={{
              height: 60,
              borderRadius: 16,
              background: "linear-gradient(135deg, #155DFC 0%, #00A63E 100%)",
              border: "none",
              boxShadow: "0 12px 32px rgba(21,93,252,0.30), 0 4px 12px rgba(0,0,0,0.12)",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: 0.2,
              color: "#fff",
              gap: 10,
              transition: "opacity 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.93";
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 16px 40px rgba(21,93,252,0.38), 0 4px 12px rgba(0,0,0,0.14)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 12px 32px rgba(21,93,252,0.30), 0 4px 12px rgba(0,0,0,0.12)";
            }}
          >
            <Map size={20} color="#fff" />
            Explore Live Map →
          </button>
        </div>

        {/* BLOCK 3 — Smart Insight Banner */}
        <div
          className="w-full flex gap-[16px] items-start"
          style={{
            background: "#EFF6FF",
            border: "0.8px solid #BEDBFF",
            borderRadius: 16,
            padding: 24,
            marginBottom: 48,
          }}
        >
          <div
            className="flex items-center justify-center shrink-0 rounded-full"
            style={{ width: 40, height: 40, background: "#155DFC" }}
          >
            <Lightbulb size={20} color="#fff" />
          </div>
          <div className="flex flex-col gap-[8px]">
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: 16, lineHeight: "24px", color: "#101828", margin: 0 }}>
              💡 Smart Insight
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: 16, lineHeight: "24px", color: "#364153", margin: 0 }}>
              Most printout shops near colleges are busiest between{" "}
              <span style={{ fontWeight: 700, color: "#101828" }}>12:30 PM – 2:00 PM</span>.
              Visit after{" "}
              <span style={{ fontWeight: 700, color: "#101828" }}>4:30 PM</span>{" "}
              for faster service and avoid the lunch rush.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
