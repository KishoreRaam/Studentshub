import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle';
import {
  FileText, CheckCircle, MapPin, BarChart3,
  TrendingUp, Eye, MousePointerClick, Clock,
  Building2, ShieldCheck, Upload, Phone, Mail, Check,
  GraduationCap, MapPinned, Users, Menu, X,
} from 'lucide-react';
import { Footer } from '../components/Footer';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';

// ── Design Tokens ─────────────────────────────────────────────────────────────
const C = {
  blue:        'var(--vl-blue, #1A56DB)',
  dark:        'var(--vl-dark, #0A0A0A)',
  body:        'var(--vl-body, #374151)',
  muted:       'var(--vl-muted, #6B7280)',
  border:      'var(--vl-border, #E5E7EB)',
  blueLight:   'var(--vl-blueLight, #EBF2FF)',
  white:       'var(--vl-white, #FFFFFF)',
  grayBg:      'var(--vl-grayBg, #F9FAFB)',
  green:       'var(--vl-green, #10B981)',
  greenLight:  'var(--vl-greenLight, #ECFDF5)',
  amber:       'var(--vl-amber, #D97706)',
  amberLight:  'var(--vl-amberLight, #FFFBEB)',
  purpleLight: 'var(--vl-purpleLight, #F3E8FF)',
  mapBg:       'var(--vl-mapBg, #F0F4F8)',
};

// ── Font helpers ──────────────────────────────────────────────────────────────
const Fd: React.CSSProperties = { fontFamily: '"Playfair Display", serif', fontWeight: 700 };
const Fb: React.CSSProperties = { fontFamily: '"DM Sans", sans-serif' };
const Fm: React.CSSProperties = { fontFamily: '"JetBrains Mono", monospace', fontWeight: 700 };

// ── Shared input style ────────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: '100%',
  height: 48,
  border: `0.8px solid ${C.border}`,
  borderRadius: 10,
  padding: '0 16px',
  ...Fb,
  fontWeight: 400,
  fontSize: 14,
  color: C.body,
  background: C.white,
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
};

// ── Map Mockup ────────────────────────────────────────────────────────────────
function MapMockup({ height = 280, showLegend = false }: { height?: number; showLegend?: boolean }) {
  return (
    <div style={{
      position: 'relative',
      background: C.mapBg,
      borderRadius: 14,
      border: `0.8px solid ${C.border}`,
      height,
      overflow: 'hidden',
    }}>
      {/* Vertical grid lines */}
      {[20, 40, 60, 80].map(p => (
        <div key={`v${p}`} style={{
          position: 'absolute', left: `${p}%`, top: 0, bottom: 0,
          width: 1, background: 'rgba(26,86,219,0.08)',
        }} />
      ))}
      {/* Horizontal grid lines */}
      {[20, 40, 60, 80].map(p => (
        <div key={`h${p}`} style={{
          position: 'absolute', top: `${p}%`, left: 0, right: 0,
          height: 1, background: 'rgba(26,86,219,0.08)',
        }} />
      ))}

      {/* Heat blobs */}
      <div style={{
        position: 'absolute', left: '22%', top: '30%',
        width: 130, height: 130, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(251,146,60,0.45) 0%, transparent 70%)',
        filter: 'blur(14px)',
        transform: 'translate(-50%,-50%)',
      }} />
      <div style={{
        position: 'absolute', left: '64%', top: '52%',
        width: 100, height: 100, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(239,68,68,0.35) 0%, transparent 70%)',
        filter: 'blur(12px)',
        transform: 'translate(-50%,-50%)',
      }} />

      {/* Small discount markers */}
      {[
        { pct: '15%', left: '13%', top: '18%' },
        { pct: '25%', left: '63%', top: '37%' },
        { pct: '10%', left: '28%', top: '67%' },
        { pct: '20%', left: '74%', top: '63%' },
      ].map(pin => (
        <div key={pin.pct} style={{
          position: 'absolute',
          left: pin.left, top: pin.top,
          width: 40, height: 40, borderRadius: '50%',
          background: C.white,
          border: `1.6px solid ${C.blue}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0px 4px 12px var(--vl-shadow-1)',
          transform: 'translate(-50%,-50%)',
          zIndex: 2,
        }}>
          <span style={{ ...Fm, fontSize: 10, color: C.blue }}>{pin.pct}</span>
        </div>
      ))}

      {/* 30% main marker + tooltip */}
      <div style={{
        position: 'absolute', left: '42%', top: '30%',
        transform: 'translate(-50%,-50%)',
        zIndex: 5,
      }}>
        {/* Popup */}
        <div style={{
          position: 'absolute',
          bottom: 'calc(100% + 12px)',
          left: '50%',
          transform: 'translateX(-50%)',
          background: C.white,
          borderRadius: 12,
          boxShadow: '0px 8px 24px var(--vl-shadow-2)',
          border: `0.8px solid ${C.border}`,
          padding: '10px 12px',
          width: 180,
          zIndex: 10,
        }}>
          <p style={{ ...Fb, fontWeight: 600, fontSize: 13, color: C.dark, margin: 0 }}>
            CopyQuick Print Hub
          </p>
          <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
            <span style={{
              ...Fb, fontWeight: 500, fontSize: 10,
              background: C.amberLight, color: C.amber,
              padding: '2px 8px', borderRadius: 9999,
            }}>30% OFF</span>
            <span style={{
              ...Fb, fontWeight: 500, fontSize: 10,
              background: C.amberLight, color: C.amber,
              padding: '2px 8px', borderRadius: 9999,
            }}>Medium</span>
          </div>
          <button style={{
            marginTop: 8, width: '100%',
            background: C.blue, color: C.white,
            border: 'none', borderRadius: 8,
            padding: '6px 0',
            ...Fb, fontWeight: 600, fontSize: 11,
            cursor: 'pointer',
          }}>View Deal</button>
          {/* Triangle */}
          <div style={{
            position: 'absolute', bottom: -7, left: '50%',
            marginLeft: -7, width: 0, height: 0,
            borderLeft: '7px solid transparent',
            borderRight: '7px solid transparent',
            borderTop: `7px solid ${C.white}`,
          }} />
        </div>
        {/* 30% circle */}
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          background: C.white,
          border: `2.4px solid ${C.blue}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0px 8px 24px rgba(26,86,219,0.25)',
        }}>
          <span style={{ ...Fm, fontSize: 11, color: C.blue }}>30%</span>
        </div>
      </div>

      {/* Traffic legend */}
      {showLegend && (
        <div style={{
          position: 'absolute', bottom: 12, left: 12,
          background: 'var(--vl-bg-overlay)',
          backdropFilter: 'blur(4px)',
          borderRadius: 8,
          padding: '6px 14px',
          display: 'flex', alignItems: 'center', gap: 14,
          boxShadow: '0px 2px 8px var(--vl-shadow-1)',
          zIndex: 10,
          border: `0.8px solid ${C.border}`,
        }}>
          <span style={{ ...Fb, fontWeight: 500, fontSize: 11, color: C.muted }}>Traffic:</span>
          {[
            { color: '#10B981', label: 'Low' },
            { color: '#FBBF24', label: 'Medium' },
            { color: '#EF4444', label: 'High' },
          ].map(t => (
            <span key={t.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: t.color, display: 'inline-block' }} />
              <span style={{ ...Fb, fontSize: 11, color: C.body }}>{t.label}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Weekly Trend Bars ─────────────────────────────────────────────────────────
function TrendBars() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 40 }}>
      {[12, 16, 14, 20, 18, 26, 32].map((h, i) => (
        <div key={i} style={{
          flex: 1, height: h,
          background: i === 6 ? C.blue : 'rgba(26,86,219,0.2)',
          borderRadius: 2,
        }} />
      ))}
    </div>
  );
}

// ── Chart data ────────────────────────────────────────────────────────────────
const chartData = [
  { day: 'Mon', value: 280 },
  { day: 'Tue', value: 320 },
  { day: 'Wed', value: 300 },
  { day: 'Thu', value: 340 },
  { day: 'Fri', value: 380 },
  { day: 'Sat', value: 450 },
  { day: 'Sun', value: 550 },
];

// ── VendorLanding ─────────────────────────────────────────────────────────────
export default function VendorLanding() {
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '', category: '', location: '',
    discount: '', phone: '', email: '',
  });

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Vendor application:', formData);
    setSubmitted(true);
  };

  return (
    <>
      {/* ─ Responsive CSS ─ */}
      <style>{`
        :root {
          --vl-white-rgb: 255, 255, 255;
          --vl-blue: #1A56DB;
          --vl-dark: #0A0A0A;
          --vl-body: #374151;
          --vl-muted: #6B7280;
          --vl-border: #E5E7EB;
          --vl-blueLight: #EBF2FF;
          --vl-white: #FFFFFF;
          --vl-grayBg: #F9FAFB;
          --vl-green: #10B981;
          --vl-greenLight: #ECFDF5;
          --vl-amber: #D97706;
          --vl-amberLight: #FFFBEB;
          --vl-purpleLight: #F3E8FF;
          --vl-mapBg: #F0F4F8;
          --vl-bg-overlay: rgba(255,255,255,0.92);
          --vl-bg-card: rgba(255,255,255,0.25);
          --vl-shadow-1: rgba(0,0,0,0.08);
          --vl-shadow-2: rgba(0,0,0,0.12);
        }
        .dark {
          --vl-white-rgb: 10, 10, 10;
          --vl-blue: #1A56DB;
          --vl-dark: #FFFFFF;
          --vl-body: #D1D5DB;
          --vl-muted: #9CA3AF;
          --vl-border: #374151;
          --vl-blueLight: rgba(26,86,219,0.15);
          --vl-white: #0A0A0A;
          --vl-grayBg: #111827;
          --vl-green: #10B981;
          --vl-greenLight: rgba(16,185,129,0.15);
          --vl-amber: #D97706;
          --vl-amberLight: rgba(217,119,6,0.15);
          --vl-purpleLight: rgba(124,58,237,0.15);
          --vl-mapBg: #111827;
          --vl-bg-overlay: rgba(10,10,10,0.92);
          --vl-bg-card: rgba(10,10,10,0.4);
          --vl-shadow-1: rgba(0,0,0,0.4);
          --vl-shadow-2: rgba(0,0,0,0.5);
        }
      
        .vl-hero-grid   { display:grid; grid-template-columns:1fr 1fr; gap:65px; align-items:center; }
        .vl-steps-grid  { display:grid; grid-template-columns:repeat(4,1fr); gap:24px; position:relative; }
        .vl-map-grid    { display:grid; grid-template-columns:2fr 1fr; gap:48px; align-items:start; }
        .vl-ben-grid    { display:grid; grid-template-columns:1fr 1fr; gap:32px; }
        .vl-met-grid    { display:grid; grid-template-columns:repeat(6,1fr); gap:16px; margin-bottom:32px; }
        .vl-test-grid   { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
        .vl-price-grid  { display:grid; grid-template-columns:1fr 1fr; gap:32px; max-width:1000px; margin:0 auto; }
        .vl-disc-row    { display:grid; grid-template-columns:1fr 1fr; gap:24px; }
        .vl-dash-col    {}

        @media (max-width:1100px) {
          .vl-hero-grid  { grid-template-columns:1fr; }
          .vl-dash-col   { display:none; }
          .vl-steps-grid { grid-template-columns:repeat(2,1fr); }
          .vl-map-grid   { grid-template-columns:1fr; }
          .vl-ben-grid   { grid-template-columns:1fr; }
          .vl-met-grid   { grid-template-columns:repeat(3,1fr); }
          .vl-test-grid  { grid-template-columns:repeat(2,1fr); }
          .vl-price-grid { grid-template-columns:1fr; }
        }
        @media (max-width:640px) {
          .vl-steps-grid { grid-template-columns:1fr; }
          .vl-test-grid  { grid-template-columns:1fr; }
          .vl-disc-row   { grid-template-columns:1fr; }
          .vl-met-grid   { grid-template-columns:repeat(2,1fr); }
        }

        .vl-nav-btn:hover { color:#0A0A0A !important; }
        .vl-apply-btn:hover { background:#1548c7 !important; }
        .vl-cta-btn:hover  { background:#1548c7 !important; }
        .vl-mob-link:hover { background:#F3F4F6 !important; color:#0A0A0A !important; }
        .vl-desktop-nav { display:flex !important; }
        .vl-mobile-nav  { display:none !important; }
        @media (max-width:767px) {
          .vl-desktop-nav { display:none !important; }
          .vl-mobile-nav  { display:flex !important; }
        }
        .vl-card:hover {
          transform: translateY(-2px);
          box-shadow: 0px 8px 20px rgba(0,0,0,0.10) !important;
          transition: all 0.2s ease;
        }
        .vl-input:focus {
          border-color: #1A56DB !important;
          box-shadow: 0 0 0 3px rgba(26,86,219,0.08) !important;
          outline: none !important;
        }
        .vl-file-drop:hover { border-color: #1A56DB !important; }
        .vl-basic-btn:hover { background:#F9FAFB !important; }
        .vl-outline-btn:hover { background:#F3F4F6 !important; }
        .vl-link-btn:hover { opacity:0.75 !important; }
        .vl-page { -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale; }
      `}</style>

      <div className="vl-page" style={{ background: C.white, minHeight: '100vh', ...Fb }}>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 1 — Navigation
        ══════════════════════════════════════════════════════════════════ */}
        <nav style={{
          position: 'sticky', top: 0, zIndex: 50,
          background: 'var(--vl-bg-overlay)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: `0.8px solid ${C.border}`,
        }}>
          {/* ── Desktop nav ── */}
          <div style={{
            maxWidth: 1183, margin: '0 auto',
            padding: '0 24px', height: 64,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }} className="vl-desktop-nav">
            {/* Left — Brand */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
              <div style={{
                width: 32, height: 32,
                background: C.blue, borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <span style={{ ...Fd, fontSize: 16, color: C.white }}>S</span>
              </div>
              <span style={{ ...Fb, fontWeight: 700, fontSize: 18, color: C.dark }}>StudentPerks</span>
              <span style={{
                ...Fb, fontWeight: 500, fontSize: 11,
                background: C.blueLight, color: C.blue,
                padding: '3px 10px', borderRadius: 9999,
              }}>For Vendors</span>
            </Link>

            {/* Right — Links + CTA */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
              {(['How It Works', 'Benefits', 'Pricing'] as const).map((label, i) => {
                const ids = ['how-it-works', 'benefits', 'pricing'];
                return (
                  <button key={label} onClick={() => scrollTo(ids[i])}
                    className="vl-nav-btn"
                    style={{
                      ...Fb, fontWeight: 500, fontSize: 14, color: C.body,
                      background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                      transition: 'color 0.15s',
                    }}>{label}</button>
                );
              })}
              <ThemeToggle />
              <button onClick={() => scrollTo('apply')}
                className="vl-apply-btn"
                style={{
                  background: C.blue, color: C.white,
                  ...Fb, fontWeight: 600, fontSize: 14,
                  height: 41, width: 112, borderRadius: 10,
                  border: 'none', cursor: 'pointer',
                  transition: 'background 0.15s',
                }}>Apply Now</button>
            </div>
          </div>

          {/* ── Mobile nav ── */}
          <div className="vl-mobile-nav" style={{
            display: 'none',
            padding: '0 16px',
            height: 56,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            {/* Brand */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', flexShrink: 0 }}>
              <div style={{
                width: 28, height: 28, background: C.blue, borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <span style={{ ...Fd, fontSize: 14, color: C.white }}>S</span>
              </div>
              <span style={{ ...Fb, fontWeight: 700, fontSize: 16, color: C.dark }}>StudentPerks</span>
            </Link>

            {/* Right: Apply Now + hamburger */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <ThemeToggle />
              <button onClick={() => scrollTo('apply')}
                className="vl-apply-btn"
                style={{
                  background: C.blue, color: C.white,
                  ...Fb, fontWeight: 600, fontSize: 13,
                  height: 36, padding: '0 14px', borderRadius: 9,
                  border: 'none', cursor: 'pointer',
                  transition: 'background 0.15s', whiteSpace: 'nowrap',
                }}>Apply Now</button>
              <button
                onClick={() => setMobileMenuOpen(v => !v)}
                style={{
                  width: 36, height: 36,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'none', border: `0.8px solid ${C.border}`,
                  borderRadius: 8, cursor: 'pointer', flexShrink: 0,
                }}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={18} color={C.body} /> : <Menu size={18} color={C.body} />}
              </button>
            </div>
          </div>

          {/* ── Mobile dropdown ── */}
          {mobileMenuOpen && (
            <div className="vl-mobile-nav" style={{
              display: 'flex', flexDirection: 'column',
              padding: '8px 16px 14px',
              borderTop: `0.8px solid ${C.border}`,
              gap: 2,
              background: C.white,
              boxShadow: '0 4px 16px var(--vl-shadow-1)',
            }}>
              {(['How It Works', 'Benefits', 'Pricing'] as const).map((label, i) => {
                const ids = ['how-it-works', 'benefits', 'pricing'];
                return (
                  <button key={label}
                    className="vl-mob-link"
                    onClick={() => { scrollTo(ids[i]); setMobileMenuOpen(false); }}
                    style={{
                      ...Fb, fontWeight: 500, fontSize: 15, color: C.body,
                      background: 'none', border: 'none', cursor: 'pointer',
                      padding: '10px 12px', borderRadius: 8, textAlign: 'left',
                      transition: 'background 0.15s, color 0.15s',
                    }}>{label}</button>
                );
              })}
            </div>
          )}
        </nav>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 2 — Hero
        ══════════════════════════════════════════════════════════════════ */}
        <section style={{
          minHeight: 700,
          backgroundImage: [
            'linear-gradient(149.4deg, #F9FAFB 0%, #EBF2FF 50%, #ECFDF5 100%)',
            'linear-gradient(180deg, rgba(0,0,0,0.03) 0.14%, transparent 0.14%)',
            'linear-gradient(90deg, rgba(0,0,0,0.03) 0%, transparent 0%)',
          ].join(', '),
          display: 'flex', alignItems: 'center',
        }}>
          <div style={{
            maxWidth: 1183, margin: '0 auto',
            padding: '72px 24px 96px',
            width: '100%',
          }}>
            <div className="vl-hero-grid">

              {/* ── Left column ── */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                {/* FOR BUSINESSES pill */}
                <span style={{
                  display: 'inline-block',
                  ...Fb, fontWeight: 500, fontSize: 12,
                  color: C.blue, background: C.blueLight,
                  padding: '3.8px 12px', borderRadius: 9999,
                  letterSpacing: 0.5, textTransform: 'uppercase',
                }}>FOR BUSINESSES</span>

                {/* H1 */}
                <h1 style={{
                  ...Fd, fontSize: 47.936, lineHeight: '52.73px',
                  color: C.dark, margin: '50px 0 0',
                }}>
                  Reach 10,000+<br />Verified Students<br />Around Your Shop
                </h1>

                {/* Paragraph */}
                <p style={{
                  ...Fb, fontWeight: 400, fontSize: 20, lineHeight: '32px',
                  color: C.body, maxWidth: 518, margin: '20px 0 32px',
                }}>
                  Join Tamil Nadu's leading student discount network. Get discovered
                  by verified students when they need you most — right near your location.
                </p>

                {/* Stat cards */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
                  {[
                    { value: '5,664', label: 'Colleges' },
                    { value: '50K+',  label: 'Students' },
                    { value: 'TN',    label: 'Tamil Nadu Wide' },
                  ].map(s => (
                    <div key={s.label} style={{
                      background: C.white,
                      border: `0.8px solid ${C.border}`,
                      borderRadius: 14,
                      boxShadow: '0px 2px 8px rgba(0,0,0,0.04)',
                      padding: '12.8px 16.8px',
                    }}>
                      <p style={{ ...Fm, fontSize: 24, color: C.dark, margin: 0 }}>{s.value}</p>
                      <p style={{ ...Fb, fontWeight: 400, fontSize: 13, color: C.muted, margin: '2px 0 0' }}>{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* CTA button */}
                <button onClick={() => scrollTo('apply')}
                  className="vl-cta-btn"
                  style={{
                    display: 'block',
                    background: C.blue, color: C.white,
                    ...Fb, fontWeight: 600, fontSize: 16,
                    width: 220, height: 56,
                    borderRadius: 14, border: 'none', cursor: 'pointer',
                    boxShadow: '0px 10px 25px rgba(26,86,219,0.25)',
                    marginBottom: 16,
                    transition: 'background 0.15s',
                  }}>
                  Become a Partner →
                </button>

                {/* Scroll link */}
                <button onClick={() => scrollTo('how-it-works')}
                  className="vl-link-btn"
                  style={{
                    ...Fb, fontWeight: 500, fontSize: 14, color: C.blue,
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                    transition: 'opacity 0.15s',
                  }}>
                  See how it works ↓
                </button>
              </motion.div>

              {/* ── Right column — Dashboard Mockup ── */}
              <motion.div
                className="vl-dash-col"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{ position: 'relative', paddingTop: 20, paddingBottom: 48, paddingLeft: 16 }}
              >
                {/* Verified Partner floating badge */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  style={{
                    position: 'absolute', top: 8, left: 4, zIndex: 10,
                    background: C.white,
                    border: `0.8px solid ${C.border}`,
                    borderRadius: 14,
                    boxShadow: '0px 8px 24px var(--vl-shadow-1)',
                    padding: '10px 14px',
                    display: 'flex', alignItems: 'center', gap: 10,
                  }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: C.greenLight,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <ShieldCheck size={16} color={C.green} />
                  </div>
                  <div>
                    <p style={{ ...Fb, fontWeight: 600, fontSize: 12, color: C.dark, margin: 0 }}>Verified Partner</p>
                    <p style={{ ...Fb, fontWeight: 500, fontSize: 10, color: C.green, margin: 0 }}>Active</p>
                  </div>
                </motion.div>

                {/* Main dashboard card */}
                <div style={{
                  background: C.white,
                  border: `0.8px solid ${C.border}`,
                  borderRadius: 16,
                  boxShadow: '0px 25px 50px var(--vl-shadow-2), 0px 10px 20px rgba(0,0,0,0.06)',
                  overflow: 'hidden',
                }}>
                  {/* Top bar */}
                  <div style={{
                    padding: '14px 20px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    borderBottom: `0.8px solid ${C.border}`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 12, height: 12, background: C.green, borderRadius: '50%' }} />
                      <span style={{ ...Fb, fontWeight: 600, fontSize: 14, color: C.dark }}>
                        StudentPerks Vendor Dashboard
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {[0, 1, 2].map(i => (
                        <div key={i} style={{ width: 12, height: 12, background: C.border, borderRadius: '50%' }} />
                      ))}
                    </div>
                  </div>

                  {/* Map area */}
                  <div style={{ padding: '16px 20px 0' }}>
                    <MapMockup height={260} />
                  </div>

                  {/* Bottom stats */}
                  <div style={{ padding: '12px 20px 20px', display: 'flex', gap: 10 }}>
                    {[
                      { icon: <Eye size={14} color={C.muted} />, value: '2.8K', label: 'Impressions' },
                      { icon: <GraduationCap size={14} color={C.muted} />, value: '3 colleges', label: 'Nearby' },
                      { icon: <ShieldCheck size={14} color={C.muted} />, value: '100%', label: 'Verified' },
                    ].map(s => (
                      <div key={s.label} style={{
                        flex: 1,
                        background: C.grayBg,
                        border: `0.8px solid ${C.border}`,
                        borderRadius: 10,
                        padding: '8px 10px',
                        display: 'flex', alignItems: 'center', gap: 8,
                      }}>
                        {s.icon}
                        <div>
                          <p style={{ ...Fm, fontSize: 13, color: C.dark, margin: 0 }}>{s.value}</p>
                          <p style={{ ...Fb, fontWeight: 400, fontSize: 11, color: C.muted, margin: 0 }}>{s.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weekly Trend floating card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                  style={{
                    position: 'absolute', bottom: 24, right: -8,
                    background: C.white, borderRadius: 14,
                    boxShadow: '0px 10px 30px rgba(0,0,0,0.1)',
                    border: `0.8px solid ${C.border}`,
                    padding: '12px 14px',
                    width: 152,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                    <TrendingUp size={14} color={C.blue} />
                    <span style={{ ...Fb, fontWeight: 600, fontSize: 11, color: C.dark }}>Weekly Trend</span>
                  </div>
                  <TrendBars />
                  <p style={{ ...Fb, fontWeight: 600, fontSize: 11, color: C.green, margin: '8px 0 0' }}>
                    +24% ↑ this week
                  </p>
                </motion.div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 3 — 3 Steps Process
        ══════════════════════════════════════════════════════════════════ */}
        <section id="how-it-works" style={{ padding: '100px 24px' }}>
          <div style={{ maxWidth: 1183, margin: '0 auto' }}>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <p style={{
                ...Fb, fontWeight: 600, fontSize: 12,
                color: C.muted, letterSpacing: 1.5,
                textTransform: 'uppercase', margin: '0 0 14px',
              }}>SIMPLE PROCESS</p>
              <h2 style={{
                ...Fd, fontSize: 36, color: C.dark,
                lineHeight: '1.2', margin: '0 0 16px',
              }}>
                Start Appearing in Front of Students in 3 Steps
              </h2>
              <p style={{ ...Fb, fontWeight: 400, fontSize: 18, color: C.body, margin: 0 }}>
                From registration to live visibility in under 48 hours.
              </p>
            </div>

            {/* Cards + connector line */}
            <div style={{ position: 'relative' }}>
              {/* Connector line through circle centers */}
              <div style={{
                position: 'absolute',
                top: 48,
                left: 'calc(12.5% + 0px)',
                right: 'calc(12.5% + 0px)',
                height: 0,
                borderTop: `1.6px solid ${C.border}`,
                zIndex: 0,
              }} />

              <div className="vl-steps-grid">
                {[
                  { num: 1, title: 'Register Business',   desc: 'Submit business name, category, location, and discount offer.',                                    Icon: FileText },
                  { num: 2, title: 'Get Verified',        desc: 'Upload business registration proof. Approval within 24 hours.',                                   Icon: CheckCircle },
                  { num: 3, title: 'Appear on Map',       desc: 'Your discount goes live. Students discover you through map search and filters.',                  Icon: MapPin },
                  { num: 4, title: 'Monitor Analytics',   desc: 'Access real-time data on impressions, clicks, and peak traffic times.',                           Icon: BarChart3 },
                ].map((step, i) => (
                  <motion.div
                    key={step.num}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="vl-card"
                    style={{
                      background: C.white,
                      border: `0.8px solid ${C.border}`,
                      borderRadius: 16,
                      boxShadow: '0px 4px 12px rgba(0,0,0,0.06)',
                      padding: '24px 24px 28px',
                      position: 'relative', zIndex: 1,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                      <div style={{
                        width: 48, height: 48, borderRadius: '50%',
                        background: C.blueLight,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <span style={{ ...Fb, fontWeight: 700, fontSize: 24, color: C.blue }}>{step.num}</span>
                      </div>
                      <step.Icon size={28} color={C.border} />
                    </div>
                    <h3 style={{ ...Fb, fontWeight: 600, fontSize: 18, color: C.dark, margin: '0 0 8px' }}>
                      {step.title}
                    </h3>
                    <p style={{ ...Fb, fontWeight: 400, fontSize: 14, color: C.muted, lineHeight: '22.4px', margin: 0 }}>
                      {step.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 4 — Map Preview + Features
        ══════════════════════════════════════════════════════════════════ */}
        <section style={{ padding: '100px 24px', background: C.grayBg }}>
          <div style={{ maxWidth: 1183, margin: '0 auto' }}>

            {/* Section header */}
            <div style={{ marginBottom: 48 }}>
              <h2 style={{ ...Fd, fontSize: 36, color: C.dark, lineHeight: '1.2', margin: '0 0 16px' }}>
                See How Your Business Appears
              </h2>
              <p style={{ ...Fb, fontWeight: 400, fontSize: 18, color: C.body, maxWidth: 640, margin: 0 }}>
                Interactive map placement with discount badge, crowd density indicator,
                and one-tap deal view for students.
              </p>
            </div>

            <div className="vl-map-grid">
              {/* Left — Large map */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                style={{
                  background: C.white,
                  borderRadius: 16,
                  border: `0.8px solid ${C.border}`,
                  boxShadow: '0px 4px 12px rgba(0,0,0,0.06)',
                  padding: 24,
                }}
              >
                <MapMockup height={480} showLegend />
              </motion.div>

              {/* Right — Feature list */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                style={{ display: 'flex', flexDirection: 'column', gap: 0 }}
              >
                {[
                  { Icon: MapPinned,   title: 'Prime Placement',       desc: 'Appear when students filter by category and distance. Your business shown prominently on the map.' },
                  { Icon: Eye,         title: 'Highlight Your Offer',  desc: 'Your discount % prominently displayed on every marker. Attract attention instantly.' },
                  { Icon: TrendingUp,  title: 'Traffic Intelligence',  desc: 'Get featured during high-traffic periods automatically. Maximise student visibility.' },
                ].map((f, i) => (
                  <div key={f.title} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 16,
                    minHeight: 114,
                    paddingTop: i === 0 ? 0 : 20,
                    borderTop: i > 0 ? `0.8px solid ${C.border}` : 'none',
                    paddingBottom: 20,
                  }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%',
                      background: C.blueLight, flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginTop: 2,
                    }}>
                      <f.Icon size={20} color={C.blue} />
                    </div>
                    <div>
                      <h4 style={{ ...Fb, fontWeight: 600, fontSize: 16, color: C.dark, margin: '0 0 6px' }}>
                        {f.title}
                      </h4>
                      <p style={{ ...Fb, fontWeight: 400, fontSize: 14, color: C.muted, lineHeight: '22.4px', margin: 0 }}>
                        {f.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 5 — Benefits Grid
        ══════════════════════════════════════════════════════════════════ */}
        <section id="benefits" style={{ padding: '100px 24px' }}>
          <div style={{ maxWidth: 1183, margin: '0 auto' }}>

            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <h2 style={{ ...Fd, fontSize: 36, color: C.dark, lineHeight: '1.2', margin: '0 0 16px' }}>
                Why Local Businesses Choose StudentPerks
              </h2>
              <p style={{ ...Fb, fontWeight: 400, fontSize: 18, color: C.body, margin: 0 }}>
                Data-driven exposure. Verified student traffic. Measurable results.
              </p>
            </div>

            <div className="vl-ben-grid">
              {[
                { Icon: ShieldCheck, bg: C.blueLight,   iconColor: C.blue,    title: 'Verified Students Only',      desc: 'Every user is a verified college student with .edu email or institutional ID. No fake claims, no spam.' },
                { Icon: MapPin,      bg: C.blueLight,   iconColor: C.blue,    title: 'Foot Traffic When It Counts', desc: "Students discover you when they're nearby — peak visibility during lunch hours, exam prep seasons, and college events." },
                { Icon: BarChart3,   bg: C.purpleLight, iconColor: '#7C3AED', title: 'Performance Insights',         desc: 'Track impressions, clicks, peak hours, and nearby college engagement. Optimize your offers based on actual data.' },
                { Icon: TrendingUp,  bg: C.purpleLight, iconColor: '#7C3AED', title: 'Free to Start',                desc: 'Basic listing is always free. Upgrade to featured placement for premium visibility during high-traffic windows.' },
              ].map((b, i) => (
                <motion.div
                  key={b.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="vl-card"
                  style={{
                    background: C.white,
                    border: `0.8px solid ${C.border}`,
                    borderRadius: 16,
                    padding: '40px',
                    minHeight: 247,
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{
                    width: 56, height: 56, borderRadius: 16,
                    background: b.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 24,
                  }}>
                    <b.Icon size={28} color={b.iconColor} />
                  </div>
                  <h3 style={{ ...Fb, fontWeight: 600, fontSize: 20, color: C.dark, margin: '0 0 12px' }}>
                    {b.title}
                  </h3>
                  <p style={{ ...Fb, fontWeight: 400, fontSize: 16, color: C.muted, lineHeight: '1.6', margin: 0 }}>
                    {b.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 6 — Vendor Dashboard Analytics
        ══════════════════════════════════════════════════════════════════ */}
        <section style={{
          padding: '100px 24px',
          background: 'linear-gradient(135deg, #EBF2FF 0%, #F9FAFB 50%, #ECFDF5 100%)',
        }}>
          <div style={{ maxWidth: 1183, margin: '0 auto' }}>

            <div style={{ marginBottom: 48 }}>
              <p style={{
                ...Fb, fontWeight: 600, fontSize: 12,
                color: C.muted, letterSpacing: 1.5, textTransform: 'uppercase',
                margin: '0 0 12px',
              }}>VENDOR DASHBOARD</p>
              <h2 style={{ ...Fd, fontSize: 36, color: C.dark, lineHeight: '1.2', margin: '0 0 16px' }}>
                Track What Matters
              </h2>
              <p style={{ ...Fb, fontWeight: 400, fontSize: 18, color: C.body, margin: 0 }}>
                Real-time analytics dashboard included with every partnership.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{
                background: C.white,
                borderRadius: 16,
                boxShadow: '0px 4px 12px rgba(0,0,0,0.06)',
                border: `0.8px solid ${C.border}`,
                padding: 32,
              }}
            >
              {/* Metric boxes */}
              <div className="vl-met-grid">
                {[
                  { label: 'MAP IMPRESSIONS', value: '2,847', trend: '+18% ↑', pos: true },
                  { label: 'DETAIL VIEWS',    value: '412',   trend: '+24% ↑', pos: true },
                  { label: 'CLICK-THROUGHS',  value: '89',    trend: '+9% ↑',  pos: true },
                  { label: 'PEAK HOUR',       value: '1:30 PM', trend: 'Steady', pos: false },
                  { label: 'NEARBY COLLEGES', value: '3',     trend: 'campuses', pos: false },
                  { label: 'AVG. DISTANCE',   value: '0.4 km', trend: 'from colleges', pos: false },
                ].map(m => (
                  <div key={m.label} style={{
                    border: `0.8px solid ${C.border}`,
                    borderRadius: 10,
                    padding: '20px 16px',
                  }}>
                    <p style={{
                      ...Fb, fontWeight: 400, fontSize: 10,
                      color: C.muted, textTransform: 'uppercase', letterSpacing: 0.8,
                      margin: '0 0 8px',
                    }}>{m.label}</p>
                    <p style={{ ...Fm, fontSize: 22, color: C.dark, margin: '0 0 6px' }}>{m.value}</p>
                    <p style={{
                      ...Fb, fontSize: 12,
                      color: m.pos ? C.green : C.muted,
                      fontWeight: m.pos ? 600 : 400,
                      margin: 0,
                    }}>{m.trend}</p>
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <span style={{ ...Fb, fontWeight: 600, fontSize: 16, color: C.dark }}>Weekly Engagement</span>
                  <span style={{ ...Fb, fontWeight: 600, fontSize: 14, color: C.green }}>+18% this week</span>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="blueAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={C.blue} stopOpacity={0.15} />
                        <stop offset="100%" stopColor={C.blue} stopOpacity={0.01} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                    <XAxis dataKey="day" axisLine={false} tickLine={false}
                      tick={{ fontSize: 12, fill: C.muted, fontFamily: '"DM Sans", sans-serif' }} />
                    <YAxis axisLine={false} tickLine={false}
                      tick={{ fontSize: 12, fill: C.muted, fontFamily: '"DM Sans", sans-serif' }}
                      domain={[0, 600]} ticks={[0, 150, 300, 450, 600]} />
                    <Tooltip contentStyle={{
                      borderRadius: 8, border: `1px solid ${C.border}`,
                      fontSize: 13, fontFamily: '"DM Sans", sans-serif',
                    }} />
                    <Area type="monotone" dataKey="value"
                      stroke={C.blue} strokeWidth={2}
                      fill="url(#blueAreaGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 7 — Testimonials
        ══════════════════════════════════════════════════════════════════ */}
        <section style={{ padding: '100px 24px' }}>
          <div style={{ maxWidth: 1183, margin: '0 auto' }}>

            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <h2 style={{ ...Fd, fontSize: 36, color: C.dark, lineHeight: '1.2', margin: 0 }}>
                Trusted by Tamil Nadu Businesses
              </h2>
            </div>

            <div className="vl-test-grid">
              {[
                {
                  quote: 'We saw a 40% increase in student footfall within 2 weeks of listing. The heatmap feature helped us adjust our discount timing perfectly.',
                  name: 'Rajesh Kumar', business: 'CopyQuick Print Hub, Anna Nagar',
                  tag: '📄 Print', initials: 'RK', avatarBg: C.blueLight, avatarColor: C.blue,
                },
                {
                  quote: 'StudentPerks brought a whole new demographic to our cafe. During exam week, our orders tripled. The location-based discovery is a game changer.',
                  name: 'Priya Lakshmi', business: 'BrewBean Cafe, Adyar',
                  tag: '☕ Cafe', initials: 'PL', avatarBg: '#FEF3C7', avatarColor: '#D97706',
                },
                {
                  quote: 'The analytics dashboard showed us exactly when students shop. We now run flash discounts during peak hours and our revenue is up 25%.',
                  name: 'Vikram Sundaram', business: 'StudyMart Stationery, T. Nagar',
                  tag: '📝 Stationery', initials: 'VS', avatarBg: C.purpleLight, avatarColor: '#7C3AED',
                },
              ].map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="vl-card"
                  style={{
                    background: C.white,
                    border: `0.8px solid ${C.border}`,
                    borderRadius: 16,
                    boxShadow: '0px 4px 12px rgba(0,0,0,0.06)',
                    padding: 32,
                    transition: 'all 0.2s ease',
                  }}
                >
                  {/* Quote icon */}
                  <div style={{
                    width: 32, height: 32, marginBottom: 16,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <text x="2" y="28" style={{ fontFamily: 'Georgia, serif', fontSize: '34px', fill: C.border }}>"</text>
                    </svg>
                  </div>

                  {/* Quote text */}
                  <p style={{
                    ...Fb, fontWeight: 400, fontSize: 16, fontStyle: 'italic',
                    lineHeight: '27px', color: C.body, margin: '0 0 24px',
                  }}>
                    "{t.quote}"
                  </p>

                  {/* Divider */}
                  <div style={{ height: 1, background: C.border, margin: '0 0 20px' }} />

                  {/* Author */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 48, height: 48, borderRadius: '50%',
                        background: t.avatarBg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <span style={{ ...Fb, fontWeight: 700, fontSize: 14, color: t.avatarColor }}>{t.initials}</span>
                      </div>
                      <div>
                        <p style={{ ...Fb, fontWeight: 600, fontSize: 15, color: C.dark, margin: 0 }}>{t.name}</p>
                        <p style={{ ...Fb, fontWeight: 400, fontSize: 13, color: C.muted, margin: 0 }}>{t.business}</p>
                      </div>
                    </div>
                    <span style={{
                      ...Fb, fontWeight: 400, fontSize: 12,
                      background: C.grayBg, padding: '4px 10px', borderRadius: 9999,
                      color: C.body, flexShrink: 0, marginLeft: 8,
                    }}>{t.tag}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 8 — Pricing
        ══════════════════════════════════════════════════════════════════ */}
        <section id="pricing" style={{ padding: '100px 24px', background: C.grayBg }}>
          <div style={{ maxWidth: 1183, margin: '0 auto' }}>

            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <h2 style={{ ...Fd, fontSize: 36, color: C.dark, lineHeight: '1.2', margin: '0 0 16px' }}>
                Simple, Transparent Pricing
              </h2>
              <p style={{ ...Fb, fontWeight: 400, fontSize: 18, color: C.body, margin: 0 }}>
                Start free. Upgrade when you're ready.
              </p>
            </div>

            <div className="vl-price-grid">

              {/* Basic */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{
                  background: C.white,
                  border: `0.8px solid ${C.border}`,
                  borderRadius: 16,
                  padding: '40px',
                }}
              >
                <span style={{
                  ...Fb, fontWeight: 500, fontSize: 12,
                  background: C.greenLight, color: C.green,
                  padding: '4px 12px', borderRadius: 9999,
                  display: 'inline-block', marginBottom: 20,
                  letterSpacing: 0.5, textTransform: 'uppercase',
                }}>ALWAYS FREE</span>

                <h3 style={{ ...Fb, fontWeight: 600, fontSize: 24, color: C.dark, margin: '0 0 16px' }}>
                  Basic Listing
                </h3>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: '0 0 36px' }}>
                  <span style={{ ...Fd, fontSize: 48, color: C.dark }}>₹0</span>
                  <span style={{ ...Fb, fontWeight: 400, fontSize: 16, color: C.muted }}>/ month</span>
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 36px' }}>
                  {['Map placement', 'Discount badge', 'Basic analytics', 'Category filters', 'Email support'].map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0' }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: '50%',
                        background: C.greenLight, flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Check size={11} color={C.green} />
                      </div>
                      <span style={{ ...Fb, fontWeight: 400, fontSize: 15, color: C.body }}>{f}</span>
                    </li>
                  ))}
                </ul>

                <button onClick={() => scrollTo('apply')}
                  className="vl-basic-btn"
                  style={{
                    width: '100%', height: 52,
                    background: 'transparent',
                    border: `0.8px solid ${C.border}`,
                    borderRadius: 14, cursor: 'pointer',
                    ...Fb, fontWeight: 600, fontSize: 16, color: C.dark,
                    transition: 'background 0.15s',
                  }}>Get Started Free</button>
              </motion.div>

              {/* Premium */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                style={{
                  background: C.white,
                  border: `1.6px solid ${C.blue}`,
                  borderRadius: 16,
                  padding: '40px',
                  boxShadow: '0px 0px 0px 4px rgba(26,86,219,0.06)',
                  position: 'relative',
                }}
              >
                <span style={{
                  ...Fb, fontWeight: 500, fontSize: 12,
                  background: C.blue, color: C.white,
                  padding: '4px 12px', borderRadius: 9999,
                  display: 'inline-block', marginBottom: 20,
                  letterSpacing: 0.5, textTransform: 'uppercase',
                }}>RECOMMENDED</span>

                <h3 style={{ ...Fb, fontWeight: 600, fontSize: 24, color: C.dark, margin: '0 0 16px' }}>
                  Featured Premium
                </h3>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: '0 0 36px' }}>
                  <span style={{ ...Fd, fontSize: 48, color: C.dark }}>₹499</span>
                  <span style={{ ...Fb, fontWeight: 400, fontSize: 16, color: C.muted }}>/ month</span>
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 36px' }}>
                  {[
                    'Everything in Basic',
                    'Priority map placement',
                    'Heatmap boost during peak hours',
                    'Advanced analytics dashboard',
                    'Nearby college insights',
                    'Dedicated account manager',
                  ].map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0' }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: '50%',
                        background: C.greenLight, flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Check size={11} color={C.green} />
                      </div>
                      <span style={{ ...Fb, fontWeight: 400, fontSize: 15, color: C.body }}>{f}</span>
                    </li>
                  ))}
                </ul>

                <button onClick={() => scrollTo('apply')}
                  className="vl-cta-btn"
                  style={{
                    width: '100%', height: 52,
                    background: C.blue, color: C.white,
                    border: 'none', borderRadius: 14, cursor: 'pointer',
                    ...Fb, fontWeight: 600, fontSize: 16,
                    transition: 'background 0.15s',
                  }}>Start 14-Day Trial</button>
              </motion.div>

            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 9 — Partner Application Form
        ══════════════════════════════════════════════════════════════════ */}
        <section id="apply" style={{
          padding: '100px 24px',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #ECFDF5 100%)',
        }}>
          <div style={{ maxWidth: 1183, margin: '0 auto' }}>

            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <h2 style={{ ...Fd, fontSize: 36, color: C.dark, lineHeight: '1.2', margin: '0 0 16px' }}>
                Ready to Partner with Us?
              </h2>
              <p style={{
                ...Fb, fontWeight: 400, fontSize: 18, color: C.body,
                maxWidth: 600, margin: '0 auto',
              }}>
                Fill out the form below. We'll verify your business and have you live
                on the student map within 48 hours.
              </p>
            </div>

            {/* Form card */}
            <div style={{
              background: C.white,
              borderRadius: 16,
              boxShadow: '0px 4px 12px rgba(0,0,0,0.06)',
              border: `0.8px solid ${C.border}`,
              padding: 48,
              maxWidth: 800,
              margin: '0 auto',
            }}>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: '50%',
                    background: C.greenLight,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 20px',
                  }}>
                    <Check size={32} color={C.green} />
                  </div>
                  <h3 style={{ ...Fd, fontSize: 28, color: C.dark, margin: '0 0 12px' }}>
                    Application Submitted!
                  </h3>
                  <p style={{ ...Fb, fontWeight: 400, fontSize: 16, color: C.body, margin: 0 }}>
                    We'll verify your business and get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                    {/* Business Name */}
                    <div>
                      <label style={{
                        ...Fb, fontWeight: 500, fontSize: 14, color: C.body,
                        display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8,
                      }}>
                        <Building2 size={16} color={C.muted} />
                        Business Name <span style={{ color: '#EF4444' }}>*</span>
                      </label>
                      <input type="text" placeholder="e.g., CopyQuick Print Hub"
                        value={formData.businessName} required
                        onChange={e => setFormData(p => ({ ...p, businessName: e.target.value }))}
                        className="vl-input" style={inputStyle}
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label style={{
                        ...Fb, fontWeight: 500, fontSize: 14, color: C.body,
                        display: 'block', marginBottom: 8,
                      }}>
                        Category <span style={{ color: '#EF4444' }}>*</span>
                      </label>
                      <select value={formData.category} required
                        onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
                        className="vl-input"
                        style={{
                          ...inputStyle,
                          appearance: 'none',
                          backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 7L11 1' stroke='%236B7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 16px center',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="">Select a category</option>
                        {['Food & Beverages', 'Print & Copy', 'Stationery', 'Books', 'Electronics', 'Clothing', 'Fitness', 'Salon & Beauty', 'Other'].map(o => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    </div>

                    {/* Location */}
                    <div>
                      <label style={{
                        ...Fb, fontWeight: 500, fontSize: 14, color: C.body,
                        display: 'block', marginBottom: 8,
                      }}>
                        Location <span style={{ color: '#EF4444' }}>*</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', display: 'flex' }}>
                          <MapPin size={18} color={C.muted} />
                        </div>
                        <input type="text" placeholder="Street Address, City, Tamil Nadu"
                          value={formData.location} required
                          onChange={e => setFormData(p => ({ ...p, location: e.target.value }))}
                          className="vl-input" style={{ ...inputStyle, paddingLeft: 42 }}
                        />
                      </div>
                    </div>

                    {/* Discount + Phone */}
                    <div className="vl-disc-row">
                      <div>
                        <label style={{
                          ...Fb, fontWeight: 500, fontSize: 14, color: C.body,
                          display: 'block', marginBottom: 8,
                        }}>
                          Discount Percentage <span style={{ color: '#EF4444' }}>*</span>
                        </label>
                        <div style={{ position: 'relative' }}>
                          <input type="number" placeholder="e.g., 25" min="1" max="100"
                            value={formData.discount} required
                            onChange={e => setFormData(p => ({ ...p, discount: e.target.value }))}
                            className="vl-input" style={{ ...inputStyle, paddingRight: 40 }}
                          />
                          <span style={{
                            ...Fb, fontWeight: 500, fontSize: 14, color: C.muted,
                            position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                          }}>%</span>
                        </div>
                      </div>
                      <div>
                        <label style={{
                          ...Fb, fontWeight: 500, fontSize: 14, color: C.body,
                          display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8,
                        }}>
                          <Phone size={16} color={C.muted} />
                          Contact Phone <span style={{ color: '#EF4444' }}>*</span>
                        </label>
                        <div style={{ position: 'relative' }}>
                          <span style={{
                            ...Fb, fontWeight: 400, fontSize: 14, color: C.body,
                            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                          }}>+91</span>
                          <input type="tel" placeholder="XXXXX XXXXX"
                            value={formData.phone} required
                            onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                            className="vl-input" style={{ ...inputStyle, paddingLeft: 48 }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label style={{
                        ...Fb, fontWeight: 500, fontSize: 14, color: C.body,
                        display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8,
                      }}>
                        <Mail size={16} color={C.muted} />
                        Contact Email <span style={{ color: '#EF4444' }}>*</span>
                      </label>
                      <input type="email" placeholder="you@business.com"
                        value={formData.email} required
                        onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                        className="vl-input" style={inputStyle}
                      />
                    </div>

                    {/* File upload */}
                    <div>
                      <label style={{
                        ...Fb, fontWeight: 500, fontSize: 14, color: C.body,
                        display: 'block', marginBottom: 8,
                      }}>
                        Business Registration Proof
                      </label>
                      <div className="vl-file-drop" style={{
                        border: `1.6px dashed ${C.border}`,
                        borderRadius: 10,
                        padding: '32px 24px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'border-color 0.15s',
                      }}>
                        <Upload size={28} color={C.muted} style={{ margin: '0 auto 12px', display: 'block' }} />
                        <p style={{ ...Fb, fontWeight: 400, fontSize: 14, color: C.body, margin: '0 0 4px' }}>
                          Upload GST certificate or business registration
                        </p>
                        <p style={{ ...Fb, fontWeight: 400, fontSize: 12, color: C.muted, margin: 0 }}>
                          PDF, JPG, PNG (max 5MB)
                        </p>
                      </div>
                    </div>

                    {/* Checkbox */}
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
                      <input type="checkbox" checked={agreed}
                        onChange={e => setAgreed(e.target.checked)}
                        style={{
                          width: 18, height: 18, marginTop: 2,
                          accentColor: C.blue, flexShrink: 0, cursor: 'pointer',
                        }}
                      />
                      <span style={{ ...Fb, fontWeight: 400, fontSize: 14, color: C.body }}>
                        I agree to StudentPerks Vendor Terms &amp; Conditions
                      </span>
                    </label>

                    {/* Submit */}
                    <button type="submit" disabled={!agreed}
                      style={{
                        width: '100%', height: 56,
                        background: agreed ? C.blue : C.border,
                        color: agreed ? C.white : C.muted,
                        border: 'none', borderRadius: 14,
                        ...Fb, fontWeight: 600, fontSize: 16,
                        cursor: agreed ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s',
                      }}>
                      Submit Application →
                    </button>

                  </div>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 10 — Footer CTA
        ══════════════════════════════════════════════════════════════════ */}
        <section style={{
          padding: '80px 24px',
          background: 'linear-gradient(135deg, #F9FAFB 0%, #EBF2FF 100%)',
          textAlign: 'center',
        }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <h3 style={{ ...Fd, fontSize: 32, color: C.dark, lineHeight: '1.2', margin: '0 0 16px' }}>
              Have Questions?
            </h3>
            <p style={{
              ...Fb, fontWeight: 400, fontSize: 16, color: C.body,
              maxWidth: 520, margin: '0 auto 32px',
            }}>
              Our partnership team is here to help. Email us at partners@studentperks.me
            </p>
            <a href="mailto:partners@studentperks.me"
              className="vl-cta-btn"
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                background: C.blue, color: C.white,
                ...Fb, fontWeight: 600, fontSize: 16,
                height: 50, width: 145, borderRadius: 14,
                textDecoration: 'none',
                transition: 'background 0.15s',
              }}>
              Contact Us
            </a>
          </div>
        </section>

      </div>

      {/* ══════════════════════════════════════════════════════════════════
          FOOTER — shared site footer
      ══════════════════════════════════════════════════════════════════ */}
      <Footer />
    </>
  );
}
