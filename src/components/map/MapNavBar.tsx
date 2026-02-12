import React from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

const navLinks = [
  { label: "Map", to: "/map", active: true },
  { label: "Perks", to: "/perks", active: false },
  { label: "Resources", to: "/resources", active: false },
  { label: "AI Tools", to: "/tools", active: false },
];

export const MapNavBar = React.memo(function MapNavBar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 hidden md:flex items-center px-6"
      style={{
        height: 64,
        background: "#fff",
        borderBottom: "0.8px solid #e5e7eb",
      }}
    >
      {/* Logo — left */}
      <Link
        to="/"
        className="flex items-center gap-1 no-underline shrink-0"
      >
        <span
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700,
            fontSize: 22,
            color: "#0a0a0a",
          }}
          className=""
        >
          StudentPerks
        </span>
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#1a56db",
            display: "inline-block",
            marginLeft: 2,
            marginBottom: 8,
          }}
        />
      </Link>

      {/* Search bar — centered (desktop only) */}
      <div className="flex-1 flex justify-center">
        <div
          className="flex items-center gap-2.5 px-4"
          style={{
            width: 480,
            height: 44,
            borderRadius: 9999,
            background: "#f9fafb",
            border: "0.8px solid #e5e7eb",
          }}
        >
          <Search size={18} color="rgba(10,10,10,0.4)" />
          <span
            className="flex-1"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              color: "rgba(10,10,10,0.5)",
            }}
          >
            Search shops, cafés, print services near you…
          </span>
          <span
            className="flex items-center justify-center"
            style={{
              padding: "2px 6px",
              borderRadius: 6,
              background: "#fff",
              border: "0.8px solid #e5e7eb",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              color: "#9ca3af",
              fontWeight: 500,
            }}
          >
            ⌘K
          </span>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-0 shrink-0">
        {/* Nav links */}
        <div className="flex items-center gap-0">
          {navLinks.map((link) => (
            <div key={link.label} className="relative flex flex-col items-center">
              {link.active ? (
                <span
                  className="px-4 py-2"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#1a56db",
                    cursor: "default",
                  }}
                >
                  {link.label}
                </span>
              ) : (
                <Link
                  to={link.to}
                  className="px-4 py-2 no-underline transition-colors"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#374151",
                  }}
                >
                  {link.label}
                </Link>
              )}
              {link.active && (
                <div
                  className="absolute bottom-0"
                  style={{
                    width: 24,
                    height: 2,
                    borderRadius: 9999,
                    background: "#1a56db",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Separator */}
        <div
          className="mx-4"
          style={{
            width: 1,
            height: 24,
            background: "#e5e7eb",
          }}
        />

        {/* Verified badge */}
        <div
          className="flex items-center gap-1 px-2.5 py-1 rounded-full"
          style={{
            background: "#ecfdf5",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M11.667 3.5L5.25 9.917 2.333 7"
              stroke="#10b981"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              fontWeight: 500,
              color: "#10b981",
            }}
          >
            Verified
          </span>
        </div>

        {/* Avatar */}
        <div
          className="flex items-center justify-center rounded-full ml-3"
          style={{
            width: 36,
            height: 36,
            background: "#ebf2ff",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            fontWeight: 600,
            color: "#1a56db",
          }}
        >
          AK
        </div>
      </div>
    </nav>
  );
});
