import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Filter, Clock, TrendingUp, Lightbulb } from "lucide-react";
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
        <div className="flex flex-col items-center w-full" style={{ height: 120 }}>
          <h2
            className="text-center"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: 48,
              lineHeight: "48px",
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
              height: 4,
              marginTop: 16,
              opacity: 0.69,
              background:
                "linear-gradient(to right, #155DFC, #00C950, #9810FA)",
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
            }}
          >
            See where to save and when to go without the crowd.
          </p>
        </div>

        {/* BLOCK 2 — Main Content */}
        <div className="w-full flex flex-col lg:flex-row gap-[24px]">
          {/* LEFT — Map Preview Card */}
          <div
            className="flex-1 flex flex-col"
            style={{
              background: "rgba(255,255,255,0.8)",
              border: "0.8px solid #E5E7EB",
              borderRadius: 24,
              boxShadow: "0px 25px 50px -12px rgba(0,0,0,0.25)",
              padding: 32,
            }}
          >
            {/* Map Preview Box */}
            <div
              className="relative w-full overflow-hidden"
              style={{
                height: 300,
                background: "#F0F0F0",
                border: "0.8px solid #D1D5DC",
                borderRadius: 16,
                boxShadow: "inset 0px 2px 4px 0px rgba(0,0,0,0.05)",
              }}
            >
              <MapPreview />
            </div>

            {/* Explore Map Button */}
            <button
              onClick={() => navigate("/map")}
              className="w-full cursor-pointer"
              style={{
                marginTop: 24,
                height: 52,
                borderRadius: 14,
                background:
                  "linear-gradient(135deg, #155DFC 0%, #00A63E 100%)",
                border: "none",
                boxShadow:
                  "0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.1)",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                fontSize: 16,
                color: "#fff",
                transition: "opacity 0.2s ease, transform 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.9";
                e.currentTarget.style.transform = "scale(1.01)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              Explore Map →
            </button>
          </div>

          {/* RIGHT — Sidebar Cards */}
          <div
            className="flex flex-col gap-[24px]"
            style={{ width: 320, flexShrink: 0 }}
          >
            {/* Card 1 — Filters */}
            <div
              className="flex flex-col gap-[24px]"
              style={{
                background: "rgba(255,255,255,0.8)",
                border: "0.8px solid #E5E7EB",
                borderRadius: 16,
                boxShadow:
                  "0px 20px 25px 0px rgba(0,0,0,0.1), 0px 8px 10px 0px rgba(0,0,0,0.1)",
                padding: 24,
              }}
            >
              {/* Header */}
              <div className="flex items-center gap-[8px]">
                <Filter size={20} color="#101828" />
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 400,
                    fontSize: 18,
                    lineHeight: "28px",
                    color: "#101828",
                  }}
                >
                  Filters
                </span>
              </div>

              {/* Toggles */}
              <div className="flex flex-col gap-[16px]">
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
                      width: 48,
                      height: 24,
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
                        width: 16,
                        height: 16,
                        top: 4,
                        left: showDiscounts ? 28 : 4,
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
                      width: 48,
                      height: 24,
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
                        width: 16,
                        height: 16,
                        top: 4,
                        left: showCrowdHeat ? 28 : 4,
                        transition: "left 0.2s ease",
                      }}
                    />
                  </button>
                </div>
              </div>

              {/* Category dropdown */}
              <div className="flex flex-col gap-[8px]">
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
                  className="w-full cursor-pointer appearance-none"
                  style={{
                    height: 41,
                    background: "#fff",
                    border: "0.8px solid #D1D5DC",
                    borderRadius: 14,
                    padding: "0 14px",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    color: "#364153",
                    outline: "none",
                  }}
                >
                  <option value="all">All</option>
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
              <div className="flex flex-col" style={{ gap: 8 }}>
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
                    height: 8,
                    appearance: "none",
                    background: "#E5E7EB",
                    borderRadius: 10,
                    outline: "none",
                  }}
                />
                <div className="flex justify-between">
                  <span
                    style={{
                      fontFamily: "Arial, sans-serif",
                      fontSize: 12,
                      lineHeight: "16px",
                      color: "#6A7282",
                    }}
                  >
                    1 km
                  </span>
                  <span
                    style={{
                      fontFamily: "Arial, sans-serif",
                      fontSize: 12,
                      lineHeight: "16px",
                      color: "#6A7282",
                    }}
                  >
                    5 km
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2 — Time of Day */}
            <div
              className="flex flex-col gap-[16px]"
              style={{
                background: "rgba(255,255,255,0.8)",
                border: "0.8px solid #E5E7EB",
                borderRadius: 16,
                boxShadow:
                  "0px 20px 25px 0px rgba(0,0,0,0.1), 0px 8px 10px 0px rgba(0,0,0,0.1)",
                padding: 24,
              }}
            >
              {/* Header */}
              <div className="flex items-center gap-[8px]">
                <Clock size={20} color="#101828" />
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 400,
                    fontSize: 18,
                    lineHeight: "28px",
                    color: "#101828",
                  }}
                >
                  Time of Day
                </span>
              </div>

              {/* Time buttons */}
              <div className="relative flex flex-col gap-[6.8px]">
                {(["Morning", "Afternoon", "Evening"] as TimeOption[]).map(
                  (time) => {
                    const isActive = activeTime === time;
                    return (
                      <button
                        key={time}
                        onClick={() => setActiveTime(time)}
                        className="cursor-pointer"
                        style={{
                          width: isActive ? "calc(100% + 13px)" : "100%",
                          marginLeft: isActive ? -6.5 : 0,
                          height: isActive ? 50 : 48,
                          borderRadius: 14,
                          border: "none",
                          background: isActive
                            ? "linear-gradient(to right, #155DFC, #00A63E)"
                            : "#F3F4F6",
                          boxShadow: isActive
                            ? "0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.1)"
                            : "none",
                          fontFamily: "'DM Sans', sans-serif",
                          fontWeight: 400,
                          fontSize: 16,
                          lineHeight: "24px",
                          color: isActive ? "#fff" : "#364153",
                          textAlign: "center",
                          transition:
                            "all 0.2s ease",
                        }}
                      >
                        {time}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Card 3 — Active Deals */}
            <div
              className="flex flex-col gap-[12px]"
              style={{
                background:
                  "linear-gradient(155.18deg, #155DFC 0%, #00A63E 100%)",
                borderRadius: 16,
                boxShadow:
                  "0px 20px 25px 0px rgba(0,0,0,0.1), 0px 8px 10px 0px rgba(0,0,0,0.1)",
                padding: 24,
              }}
            >
              <div className="flex items-center gap-[8px]">
                <TrendingUp size={20} color="#fff" />
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 400,
                    fontSize: 18,
                    lineHeight: "28px",
                    color: "#fff",
                  }}
                >
                  Active Deals
                </span>
              </div>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 30,
                  lineHeight: "36px",
                  color: "#fff",
                  margin: 0,
                }}
              >
                5
              </p>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  lineHeight: "20px",
                  color: "#DBEAFE",
                  margin: 0,
                }}
              >
                locations nearby
              </p>
            </div>
          </div>
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
          {/* Icon circle */}
          <div
            className="flex items-center justify-center shrink-0 rounded-full"
            style={{
              width: 40,
              height: 40,
              background: "#155DFC",
            }}
          >
            <Lightbulb size={20} color="#fff" />
          </div>

          {/* Text */}
          <div className="flex flex-col gap-[8px]">
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 400,
                fontSize: 16,
                lineHeight: "24px",
                color: "#101828",
                margin: 0,
              }}
            >
              💡 Smart Insight
            </p>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 400,
                fontSize: 16,
                lineHeight: "24px",
                color: "#364153",
                margin: 0,
              }}
            >
              Most printout shops near colleges are busiest between{" "}
              <span style={{ fontWeight: 700, color: "#101828" }}>
                12:30 PM – 2:00 PM
              </span>
              . Visit after{" "}
              <span style={{ fontWeight: 700, color: "#101828" }}>
                4:30 PM
              </span>{" "}
              for faster service and avoid the lunch rush.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
