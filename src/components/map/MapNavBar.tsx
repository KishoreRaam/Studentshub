import React from "react";
import { Link } from "react-router-dom";
import { Search, Store } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const navLinks = [
  { label: "Map", to: "/map", active: true },
  { label: "Perks", to: "/perks", active: false },
  { label: "Resources", to: "/resources", active: false },
  { label: "AI Tools", to: "/tools", active: false },
];

interface MapNavBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const MapNavBar = React.memo(function MapNavBar({
  searchQuery,
  onSearchChange,
}: MapNavBarProps) {
  const { user, loading } = useAuth();

  const userName = user?.name?.trim() || "";
  const userInitials = userName
    ? userName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part: string) => part.charAt(0).toUpperCase())
        .join("")
    : "";

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
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search shops, cafes, print services near you..."
            className="flex-1 bg-transparent border-none outline-none"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              color: "#0a0a0a",
            }}
            aria-label="Search nearby deals"
          />
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

        {/* Vendor CTA */}
        <Link
          to="/vendors"
          className="ml-3 no-underline flex items-center gap-1.5 transition-all"
          style={{
            padding: "6px 14px",
            borderRadius: 9999,
            background: "linear-gradient(135deg, #0a0a0a 0%, #1e293b 100%)",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            fontWeight: 600,
            color: "#fff",
            letterSpacing: "0.2px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "linear-gradient(135deg, #1e293b 0%, #334155 100%)";
            e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "linear-gradient(135deg, #0a0a0a 0%, #1e293b 100%)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <Store size={14} />
          For Vendors
        </Link>

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

        {user ? (
          <>
            <span
              className="ml-3"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                fontWeight: 500,
                color: "#111827",
                maxWidth: 140,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              title={userName}
            >
              {userName}
            </span>
            <div
              className="flex items-center justify-center rounded-full ml-2"
              style={{
                width: 36,
                height: 36,
                background: "#ebf2ff",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                fontWeight: 600,
                color: "#1a56db",
              }}
              aria-label={`${userName} profile`}
              title={userName}
            >
              {userInitials || "U"}
            </div>
          </>
        ) : (
          <Link
            to="/login"
            className="ml-3 no-underline"
            style={{
              padding: "8px 14px",
              borderRadius: 9999,
              border: "0.8px solid #e5e7eb",
              background: "#fff",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              fontWeight: 600,
              color: "#1a56db",
              opacity: loading ? 0.7 : 1,
            }}
            aria-label="Login"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
});
