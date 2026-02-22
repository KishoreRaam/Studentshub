import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  Search, Filter, MapPin, Calendar, Clock, Users, ChevronDown,
  Zap, Palette, Trophy, BookOpen, Monitor, ArrowRight, Upload,
  BarChart3, Eye, MousePointerClick, Share2, TrendingUp, Menu, X,
  GraduationCap, CheckCircle, Globe, Star, Play, ChevronRight,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ── Design Tokens ─────────────────────────────────────────────────────────────
const C = {
  blue:        '#1A56DB',
  blueDark:    '#1548c7',
  dark:        '#0A0A0A',
  body:        '#374151',
  muted:       '#6B7280',
  border:      '#E5E7EB',
  blueLight:   '#EBF2FF',
  white:       '#FFFFFF',
  grayBg:      '#F9FAFB',
  green:       '#10B981',
  greenLight:  '#ECFDF5',
  amber:       '#D97706',
  amberLight:  '#FFFBEB',
  purple:      '#7C3AED',
  purpleLight: '#F3E8FF',
  red:         '#EF4444',
  redLight:    '#FEF2F2',
};

// ── Font helpers ──────────────────────────────────────────────────────────────
const Fd: React.CSSProperties = { fontFamily: '"Playfair Display", serif', fontWeight: 700 };
const Fb: React.CSSProperties = { fontFamily: '"DM Sans", sans-serif' };
const Fm: React.CSSProperties = { fontFamily: '"JetBrains Mono", monospace', fontWeight: 700 };

// ── Chart data ────────────────────────────────────────────────────────────────
const engagementData = [
  { day: 'Mon', views: 1200, registrations: 400 },
  { day: 'Tue', views: 1800, registrations: 600 },
  { day: 'Wed', views: 1400, registrations: 500 },
  { day: 'Thu', views: 2200, registrations: 800 },
  { day: 'Fri', views: 2800, registrations: 1000 },
  { day: 'Sat', views: 3200, registrations: 1200 },
  { day: 'Sun', views: 2600, registrations: 900 },
];

const peakHoursData = [
  { hour: '8AM', count: 120 },
  { hour: '10AM', count: 280 },
  { hour: '12PM', count: 340 },
  { hour: '2PM', count: 420 },
  { hour: '4PM', count: 380 },
  { hour: '6PM', count: 520 },
  { hour: '8PM', count: 460 },
  { hour: '10PM', count: 200 },
];

// ── Animated counter hook ─────────────────────────────────────────────────────
function useCountUp(end: number, duration = 2, startOnView = true) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true });
  const started = useRef(false);

  useEffect(() => {
    if (!startOnView || !inView || started.current) return;
    started.current = true;
    const obj = { val: 0 };
    gsap.to(obj, {
      val: end,
      duration,
      ease: 'power2.out',
      onUpdate: () => setCount(Math.round(obj.val)),
    });
  }, [inView, end, duration, startOnView]);

  return { count, ref };
}

// ── Section wrapper with scroll animation ─────────────────────────────────────
function Section({ children, id, style, className }: {
  children: React.ReactNode;
  id?: string;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <motion.section
      id={id}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7 }}
      style={style}
    >
      {children}
    </motion.section>
  );
}

// ── Floating Event Card ───────────────────────────────────────────────────────
function FloatingCard({ title, date, color, icon, style }: {
  title: string;
  date: string;
  color: string;
  icon: React.ReactNode;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      y: '+=12',
      duration: 2 + Math.random() * 1.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
  }, []);

  return (
    <div ref={ref} style={{
      position: 'absolute',
      background: C.white,
      border: `0.8px solid ${C.border}`,
      borderRadius: 14,
      boxShadow: '0px 8px 24px rgba(0,0,0,0.08)',
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      zIndex: 5,
      ...style,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <p style={{ ...Fb, fontWeight: 600, fontSize: 12, color: C.dark, margin: 0, whiteSpace: 'nowrap' }}>{title}</p>
        <p style={{ ...Fb, fontWeight: 400, fontSize: 10, color: C.muted, margin: 0 }}>{date}</p>
      </div>
    </div>
  );
}

// ── EventsLanding ─────────────────────────────────────────────────────────────
export default function EventsLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All Events');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Countdown timer state (target: 5 days from now)
  const [countdown, setCountdown] = useState({ days: 5, hours: 12, mins: 30, secs: 0 });

  useEffect(() => {
    const target = Date.now() + 5 * 86400000 + 12 * 3600000 + 30 * 60000;
    const timer = setInterval(() => {
      const diff = Math.max(0, target - Date.now());
      setCountdown({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // GSAP blob animation
  const blobRef1 = useRef<HTMLDivElement>(null);
  const blobRef2 = useRef<HTMLDivElement>(null);
  const blobRef3 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    [blobRef1, blobRef2, blobRef3].forEach((ref, i) => {
      if (!ref.current) return;
      gsap.to(ref.current, {
        x: `+=${20 + i * 10}`,
        y: `+=${15 + i * 8}`,
        duration: 4 + i * 1.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    });
  }, []);

  // GSAP timeline stagger
  const timelineRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!timelineRef.current) return;
    const items = timelineRef.current.querySelectorAll('.el-timeline-item');
    gsap.from(items, {
      opacity: 0,
      x: -30,
      duration: 0.6,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: timelineRef.current,
        start: 'top 75%',
        once: true,
      },
    });
  }, []);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const filterTabs = ['All Events', 'Tech', 'Cultural', 'Sports', 'Workshops', 'Webinars'];

  const categories = [
    { icon: <Zap size={20} color={C.blue} />, title: 'Tech', count: 12, color: C.blueLight,
      events: ['Hackathon 2026 — Mar 15', 'AI/ML Workshop — Mar 18', 'Code Sprint — Mar 22'] },
    { icon: <Palette size={20} color={C.purple} />, title: 'Cultural', count: 8, color: C.purpleLight,
      events: ['Cultural Night — Mar 14', 'Dance Competition — Mar 17', 'Music Fest — Mar 20'] },
    { icon: <Trophy size={20} color={C.amber} />, title: 'Sports', count: 6, color: C.amberLight,
      events: ['Cricket Tournament — Mar 13', 'Basketball League — Mar 16', 'Athletics Meet — Mar 21'] },
    { icon: <BookOpen size={20} color={C.green} />, title: 'Workshops', count: 15, color: C.greenLight,
      events: ['UI/UX Masterclass — Mar 14', 'Cloud Computing — Mar 16', 'Data Science — Mar 19'] },
    { icon: <Monitor size={20} color={C.red} />, title: 'Webinars', count: 9, color: C.redLight,
      events: ['Career in Tech — Mar 15', 'Startup Stories — Mar 17', 'AI Ethics — Mar 20'] },
  ];

  const weekDays = [
    { day: 'THU', date: 12, events: [
      { time: '10:00 AM', title: 'AI Workshop: GPT & Beyond', location: 'VIT Chennai, Hall A', tag: 'Tech' },
      { time: '2:00 PM', title: 'Cultural Dance Rehearsal', location: 'SRM University, Auditorium', tag: 'Cultural' },
    ]},
    { day: 'FRI', date: 13, events: [
      { time: '9:00 AM', title: 'Cricket Tournament — Day 1', location: 'Anna University, Grounds', tag: 'Sports' },
    ]},
    { day: 'SAT', date: 14, events: [
      { time: '10:00 AM', title: 'UI/UX Design Masterclass', location: 'IIT Madras, IC&SR Hall', tag: 'Workshop' },
      { time: '4:00 PM', title: 'Cultural Night 2026', location: 'Loyola College, Main Stage', tag: 'Cultural' },
      { time: '6:00 PM', title: 'Startup Pitch Night', location: 'SSN College, Seminar Hall', tag: 'Tech' },
    ]},
    { day: 'SUN', date: 15, events: [
      { time: '9:00 AM', title: 'Hackathon 2026: Build the Future', location: 'CEG Campus, Lab Complex', tag: 'Tech' },
    ]},
    { day: 'MON', date: 16, events: [
      { time: '11:00 AM', title: 'Cloud Computing Workshop', location: 'SRMIST, TP Hall', tag: 'Workshop' },
      { time: '3:00 PM', title: 'Basketball League Finals', location: 'VIT, Indoor Stadium', tag: 'Sports' },
    ]},
    { day: 'TUE', date: 17, events: [
      { time: '5:00 PM', title: 'Startup Stories Webinar', location: 'Online — Zoom', tag: 'Webinar' },
    ]},
    { day: 'WED', date: 18, events: [
      { time: '10:00 AM', title: 'Data Science Bootcamp', location: 'PSG Tech, CS Block', tag: 'Workshop' },
    ]},
  ];

  const topColleges = [
    { name: 'VIT Chennai', value: 342, pct: 85 },
    { name: 'SRM University', value: 287, pct: 72 },
    { name: 'Anna University', value: 234, pct: 58 },
    { name: 'IIT Madras', value: 198, pct: 49 },
    { name: 'Loyola College', value: 173, pct: 43 },
  ];

  const eventTypes = ['Hackathon', 'Workshop', 'Seminar', 'Cultural', 'Sports', 'Webinar'];
  const tagOptions = ['Tech', 'AI/ML', 'Web Dev', 'Design', 'Business', 'Career'];

  return (
    <>
      {/* ─ Responsive CSS ─ */}
      <style>{`
        .el-hero-cards { display:block; }
        .el-cat-grid { display:flex; gap:20px; overflow-x:auto; padding-bottom:16px; scroll-snap-type:x mandatory; }
        .el-cat-grid::-webkit-scrollbar { display:none; }
        .el-cat-card { min-width:260px; scroll-snap-align:start; flex-shrink:0; }
        .el-feat-grid { display:grid; grid-template-columns:1fr 1fr; gap:48px; align-items:center; }
        .el-org-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
        .el-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:48px; align-items:center; }
        .el-stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; }
        .el-chart-grid { display:grid; grid-template-columns:1fr 1fr; gap:24px; }
        .el-week-events { display:flex; gap:16px; flex-wrap:wrap; flex:1; }
        .el-desktop-nav { display:flex !important; }
        .el-mobile-nav { display:none !important; }

        @media (max-width:1100px) {
          .el-feat-grid { grid-template-columns:1fr; }
          .el-form-grid { grid-template-columns:1fr; }
          .el-hero-cards { display:none; }
        }
        @media (max-width:900px) {
          .el-org-grid { grid-template-columns:1fr; }
          .el-stats-grid { grid-template-columns:repeat(2,1fr); }
          .el-chart-grid { grid-template-columns:1fr; }
        }
        @media (max-width:767px) {
          .el-desktop-nav { display:none !important; }
          .el-mobile-nav { display:flex !important; }
        }
        @media (max-width:640px) {
          .el-stats-grid { grid-template-columns:1fr; }
        }

        .el-nav-btn:hover { color:#0A0A0A !important; }
        .el-cta-btn:hover { background:#1548c7 !important; }
        .el-card:hover { transform:translateY(-2px); box-shadow:0px 8px 20px rgba(0,0,0,0.10) !important; }
        .el-mob-link:hover { background:#F3F4F6 !important; }
        .el-page { -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale; }
        .el-tag-btn { transition:all 0.15s; cursor:pointer; }
        .el-tag-btn:hover { background:#1A56DB !important; color:#fff !important; }
      `}</style>

      <div className="el-page" style={{ background: C.white, minHeight: '100vh', ...Fb }}>

        {/* ══════════════════════════════════════════════════════════════════
            NAVIGATION
        ══════════════════════════════════════════════════════════════════ */}
        <nav style={{
          position: 'sticky', top: 0, zIndex: 50,
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: `0.8px solid ${C.border}`,
        }}>
          {/* Desktop nav */}
          <div style={{
            maxWidth: 1183, margin: '0 auto',
            padding: '0 24px', height: 64,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }} className="el-desktop-nav">
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
              <div style={{
                width: 32, height: 32,
                background: C.blue, borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <span style={{ ...Fd, fontSize: 16, color: C.white }}>S</span>
              </div>
              <span style={{ ...Fb, fontWeight: 700, fontSize: 18, color: C.dark }}>StudentsHub</span>
              <span style={{
                ...Fb, fontWeight: 500, fontSize: 11,
                background: C.blueLight, color: C.blue,
                padding: '3px 10px', borderRadius: 9999,
              }}>Events</span>
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
              {['Categories', 'This Week', 'For Organizers'].map((label, i) => {
                const ids = ['categories', 'this-week', 'organizers'];
                return (
                  <button key={label} onClick={() => scrollTo(ids[i])}
                    className="el-nav-btn"
                    style={{
                      ...Fb, fontWeight: 500, fontSize: 14, color: C.body,
                      background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                      transition: 'color 0.15s',
                    }}>{label}</button>
                );
              })}
              <button onClick={() => scrollTo('organizers')}
                className="el-cta-btn"
                style={{
                  background: C.blue, color: C.white,
                  ...Fb, fontWeight: 600, fontSize: 14,
                  height: 41, padding: '0 20px', borderRadius: 10,
                  border: 'none', cursor: 'pointer',
                  transition: 'background 0.15s',
                }}>Submit Event</button>
            </div>
          </div>

          {/* Mobile nav */}
          <div className="el-mobile-nav" style={{
            display: 'none', padding: '0 16px', height: 56,
            alignItems: 'center', justifyContent: 'space-between',
          }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', flexShrink: 0 }}>
              <div style={{
                width: 28, height: 28, background: C.blue, borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <span style={{ ...Fd, fontSize: 14, color: C.white }}>S</span>
              </div>
              <span style={{ ...Fb, fontWeight: 700, fontSize: 16, color: C.dark }}>StudentsHub</span>
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <button onClick={() => scrollTo('organizers')}
                className="el-cta-btn"
                style={{
                  background: C.blue, color: C.white,
                  ...Fb, fontWeight: 600, fontSize: 13,
                  height: 36, padding: '0 14px', borderRadius: 9,
                  border: 'none', cursor: 'pointer',
                  transition: 'background 0.15s', whiteSpace: 'nowrap',
                }}>Submit Event</button>
              <button onClick={() => setMobileMenuOpen(v => !v)} style={{
                width: 36, height: 36,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'none', border: `0.8px solid ${C.border}`,
                borderRadius: 8, cursor: 'pointer', flexShrink: 0,
              }} aria-label="Toggle menu">
                {mobileMenuOpen ? <X size={18} color={C.body} /> : <Menu size={18} color={C.body} />}
              </button>
            </div>
          </div>

          {/* Mobile dropdown */}
          {mobileMenuOpen && (
            <div className="el-mobile-nav" style={{
              display: 'flex', flexDirection: 'column',
              padding: '8px 16px 14px',
              borderTop: `0.8px solid ${C.border}`,
              gap: 2, background: C.white,
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            }}>
              {['Categories', 'This Week', 'For Organizers'].map((label, i) => {
                const ids = ['categories', 'this-week', 'organizers'];
                return (
                  <button key={label}
                    className="el-mob-link"
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
            SECTION 1 — HERO
        ══════════════════════════════════════════════════════════════════ */}
        <section style={{
          minHeight: '100vh',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {/* Gradient blobs */}
          <div ref={blobRef1} style={{
            position: 'absolute', top: '-10%', left: '-5%',
            width: 500, height: 500, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }} />
          <div ref={blobRef2} style={{
            position: 'absolute', top: '20%', right: '-10%',
            width: 450, height: 450, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(26,86,219,0.15) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }} />
          <div ref={blobRef3} style={{
            position: 'absolute', bottom: '-5%', left: '30%',
            width: 400, height: 400, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }} />

          <div style={{ maxWidth: 1183, margin: '0 auto', padding: '80px 24px 60px', width: '100%', position: 'relative', zIndex: 2 }}>
            <div style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Badge */}
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  ...Fb, fontWeight: 500, fontSize: 12,
                  color: C.blue, background: C.blueLight,
                  padding: '6px 16px', borderRadius: 9999,
                  letterSpacing: 0.5, textTransform: 'uppercase',
                  marginBottom: 32,
                }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: C.green,
                    boxShadow: '0 0 8px rgba(16,185,129,0.6)',
                    animation: 'pulse 2s ease-in-out infinite',
                  }} />
                  LIVE EVENTS PLATFORM
                </span>
                <style>{`@keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }`}</style>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                style={{
                  ...Fd, fontSize: 56, lineHeight: '64px',
                  color: C.dark, margin: '24px 0 0',
                }}
              >
                Discover What's{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #1A56DB, #7C3AED)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>Happening</span>
                <br />Near You
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                style={{
                  ...Fb, fontWeight: 400, fontSize: 18, lineHeight: '28px',
                  color: C.body, maxWidth: 560, margin: '20px auto 36px',
                }}
              >
                From hackathons to cultural fests, find and register for the most exciting
                student events across Tamil Nadu. Never miss what matters.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}
              >
                <button onClick={() => scrollTo('this-week')}
                  className="el-cta-btn"
                  style={{
                    background: C.blue, color: C.white,
                    ...Fb, fontWeight: 600, fontSize: 16,
                    height: 52, padding: '0 32px', borderRadius: 12,
                    border: 'none', cursor: 'pointer',
                    boxShadow: '0px 10px 25px rgba(26,86,219,0.25)',
                    transition: 'background 0.15s',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>Explore Events <ArrowRight size={18} /></button>
                <button onClick={() => scrollTo('organizers')}
                  style={{
                    background: 'transparent', color: C.dark,
                    ...Fb, fontWeight: 600, fontSize: 16,
                    height: 52, padding: '0 32px', borderRadius: 12,
                    border: `1.5px solid ${C.border}`, cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}>Submit Event</button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                style={{ display: 'flex', gap: 32, justifyContent: 'center', marginTop: 48, flexWrap: 'wrap' }}
              >
                {[
                  { value: '47', label: 'Events This Week' },
                  { value: '12', label: 'Colleges Hosting' },
                  { value: '3.2K', label: 'Registrations' },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: 'center' }}>
                    <p style={{ ...Fm, fontSize: 28, color: C.dark, margin: 0 }}>{s.value}</p>
                    <p style={{ ...Fb, fontWeight: 400, fontSize: 13, color: C.muted, margin: '4px 0 0' }}>{s.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Floating cards — desktop only */}
            <div className="el-hero-cards" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
              <FloatingCard title="Hackathon 2026" date="Mar 15 — VIT Chennai" color={C.blueLight}
                icon={<Zap size={16} color={C.blue} />} style={{ top: '15%', left: '2%' }} />
              <FloatingCard title="Cultural Night" date="Mar 14 — Loyola" color={C.purpleLight}
                icon={<Palette size={16} color={C.purple} />} style={{ top: '10%', right: '3%' }} />
              <FloatingCard title="AI Workshop" date="Mar 18 — IIT Madras" color={C.greenLight}
                icon={<BookOpen size={16} color={C.green} />} style={{ bottom: '25%', left: '0%' }} />
              <FloatingCard title="Sports Meet" date="Mar 21 — Anna Univ" color={C.amberLight}
                icon={<Trophy size={16} color={C.amber} />} style={{ bottom: '20%', right: '2%' }} />
              <FloatingCard title="Web Dev Bootcamp" date="Mar 22 — SRM" color={C.redLight}
                icon={<Monitor size={16} color={C.red} />} style={{ top: '50%', right: '8%' }} />
            </div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              style={{ textAlign: 'center', marginTop: 48 }}
            >
              <p style={{ ...Fb, fontWeight: 400, fontSize: 13, color: C.muted, margin: '0 0 8px' }}>Scroll to explore</p>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ChevronDown size={20} color={C.muted} />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 2 — FEATURED EVENT SPOTLIGHT
        ══════════════════════════════════════════════════════════════════ */}
        <Section style={{ background: C.grayBg, padding: '80px 24px' }}>
          <div style={{ maxWidth: 1183, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <span style={{
                ...Fb, fontWeight: 500, fontSize: 12,
                color: C.blue, background: C.blueLight,
                padding: '4px 14px', borderRadius: 9999,
                letterSpacing: 0.5, textTransform: 'uppercase',
              }}>FEATURED EVENT</span>
              <h2 style={{ ...Fd, fontSize: 36, color: C.dark, margin: '16px 0 0' }}>Spotlight</h2>
            </div>

            <div className="el-feat-grid">
              {/* Event image */}
              <div style={{
                borderRadius: 16, overflow: 'hidden', position: 'relative',
                background: 'linear-gradient(135deg, #1A56DB 0%, #7C3AED 100%)',
                minHeight: 360,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ textAlign: 'center', color: C.white, padding: 40 }}>
                  <div style={{
                    ...Fm, fontSize: 14, background: 'rgba(255,255,255,0.2)',
                    padding: '6px 16px', borderRadius: 8, display: 'inline-block', marginBottom: 16,
                  }}>FEATURED</div>
                  <h3 style={{ ...Fd, fontSize: 32, margin: '0 0 8px' }}>TechnoVanza 2026</h3>
                  <p style={{ ...Fb, fontSize: 16, opacity: 0.9 }}>Innovation Summit & Hackathon</p>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 20, flexWrap: 'wrap' }}>
                    <span style={{ ...Fb, fontSize: 12, background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: 9999 }}>Hackathon</span>
                    <span style={{ ...Fb, fontSize: 12, background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: 9999 }}>Workshops</span>
                    <span style={{ ...Fb, fontSize: 12, background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: 9999 }}>Prizes Worth ₹5L</span>
                  </div>
                </div>
                {/* Play button overlay */}
                <div style={{
                  position: 'absolute', bottom: 20, right: 20,
                  width: 48, height: 48, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                }}>
                  <Play size={20} color={C.white} fill={C.white} />
                </div>
              </div>

              {/* Event details */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: C.blueLight,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <GraduationCap size={18} color={C.blue} />
                  </div>
                  <div>
                    <p style={{ ...Fb, fontWeight: 600, fontSize: 14, color: C.dark, margin: 0 }}>VIT Chennai</p>
                    <p style={{ ...Fb, fontWeight: 400, fontSize: 12, color: C.muted, margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <CheckCircle size={12} color={C.green} /> Verified College
                    </p>
                  </div>
                </div>

                <h3 style={{ ...Fd, fontSize: 28, color: C.dark, margin: '0 0 12px', lineHeight: '36px' }}>
                  TechnoVanza 2026: Innovation Summit & Hackathon
                </h3>

                <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
                  {['Hackathon', 'Workshops', 'Prizes Worth ₹5L'].map(t => (
                    <span key={t} style={{
                      ...Fb, fontWeight: 500, fontSize: 12,
                      background: C.blueLight, color: C.blue,
                      padding: '4px 12px', borderRadius: 9999,
                    }}>{t}</span>
                  ))}
                </div>

                {/* Countdown */}
                <div style={{
                  display: 'flex', gap: 12, marginBottom: 24,
                }}>
                  {[
                    { val: countdown.days, label: 'DAYS' },
                    { val: countdown.hours, label: 'HOURS' },
                    { val: countdown.mins, label: 'MINS' },
                    { val: countdown.secs, label: 'SECS' },
                  ].map(c => (
                    <div key={c.label} style={{
                      background: C.dark, borderRadius: 10,
                      padding: '12px 16px', textAlign: 'center', minWidth: 60,
                    }}>
                      <p style={{ ...Fm, fontSize: 24, color: C.white, margin: 0 }}>
                        {String(c.val).padStart(2, '0')}
                      </p>
                      <p style={{ ...Fb, fontWeight: 400, fontSize: 10, color: '#9CA3AF', margin: '4px 0 0', letterSpacing: 1 }}>
                        {c.label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Meta */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
                  {[
                    { icon: <Calendar size={16} color={C.muted} />, text: 'March 15-17, 2026' },
                    { icon: <MapPin size={16} color={C.muted} />, text: 'VIT Chennai Campus, Kelambakkam' },
                    { icon: <Users size={16} color={C.muted} />, text: '500+ participants expected' },
                    { icon: <Globe size={16} color={C.muted} />, text: 'Registration closes Mar 12' },
                  ].map((m, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {m.icon}
                      <span style={{ ...Fb, fontWeight: 400, fontSize: 14, color: C.body }}>{m.text}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <button className="el-cta-btn" style={{
                    background: C.blue, color: C.white,
                    ...Fb, fontWeight: 600, fontSize: 15,
                    height: 48, padding: '0 28px', borderRadius: 10,
                    border: 'none', cursor: 'pointer',
                    transition: 'background 0.15s',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>Register Now <ArrowRight size={16} /></button>
                  <button style={{
                    background: 'transparent', color: C.body,
                    ...Fb, fontWeight: 500, fontSize: 15,
                    height: 48, padding: '0 28px', borderRadius: 10,
                    border: `1.5px solid ${C.border}`, cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}>View Full Details</button>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 3 — EXPLORE BY CATEGORY
        ══════════════════════════════════════════════════════════════════ */}
        <Section id="categories" style={{ padding: '80px 24px' }}>
          <div style={{ maxWidth: 1183, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <h2 style={{ ...Fd, fontSize: 36, color: C.dark, margin: '0 0 12px' }}>Explore by Category</h2>
              <p style={{ ...Fb, fontWeight: 400, fontSize: 16, color: C.muted, maxWidth: 480, margin: '0 auto' }}>
                Browse events by type and find exactly what interests you
              </p>
            </div>

            <div className="el-cat-grid">
              {categories.map(cat => (
                <div key={cat.title} className="el-cat-card el-card" style={{
                  background: C.white,
                  border: `0.8px solid ${C.border}`,
                  borderRadius: 16,
                  padding: 24,
                  boxShadow: '0px 2px 8px rgba(0,0,0,0.04)',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: cat.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {cat.icon}
                    </div>
                    <div>
                      <p style={{ ...Fb, fontWeight: 600, fontSize: 16, color: C.dark, margin: 0 }}>{cat.title}</p>
                      <p style={{ ...Fb, fontWeight: 400, fontSize: 12, color: C.muted, margin: 0 }}>{cat.count} upcoming</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {cat.events.map((evt, i) => (
                      <React.Fragment key={evt}>
                        <p style={{
                          ...Fb, fontWeight: 400, fontSize: 13, color: C.body,
                          margin: 0, padding: '10px 0',
                        }}>{evt}</p>
                        {i < cat.events.length - 1 && (
                          <div style={{ height: 1, background: C.border }} />
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  <button style={{
                    marginTop: 16, width: '100%',
                    background: C.grayBg, color: C.body,
                    ...Fb, fontWeight: 500, fontSize: 13,
                    height: 38, borderRadius: 8,
                    border: `0.8px solid ${C.border}`,
                    cursor: 'pointer', transition: 'all 0.15s',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}>View All <ChevronRight size={14} /></button>
                </div>
              ))}
            </div>

            {/* Carousel dots */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
              {categories.map((_, i) => (
                <div key={i} style={{
                  width: i === 0 ? 24 : 8, height: 8, borderRadius: 4,
                  background: i === 0 ? C.blue : C.border,
                  transition: 'all 0.3s',
                }} />
              ))}
            </div>
          </div>
        </Section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 4 — HAPPENING THIS WEEK
        ══════════════════════════════════════════════════════════════════ */}
        <Section id="this-week" style={{ background: C.grayBg, padding: '80px 24px' }}>
          <div style={{ maxWidth: 1183, margin: '0 auto' }}>
            {/* Search & filters */}
            <div style={{ marginBottom: 32 }}>
              <div style={{
                display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap',
              }}>
                <div style={{
                  flex: 1, minWidth: 260, position: 'relative',
                }}>
                  <Search size={18} color={C.muted} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    placeholder="Search events, colleges, or categories..."
                    style={{
                      width: '100%', height: 48,
                      border: `0.8px solid ${C.border}`,
                      borderRadius: 10, padding: '0 16px 0 42px',
                      ...Fb, fontWeight: 400, fontSize: 14, color: C.body,
                      background: C.white, outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>
                <button style={{
                  height: 48, padding: '0 16px', borderRadius: 10,
                  border: `0.8px solid ${C.border}`, background: C.white,
                  ...Fb, fontWeight: 500, fontSize: 14, color: C.body,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <MapPin size={16} /> Location <ChevronDown size={14} />
                </button>
                <button style={{
                  height: 48, padding: '0 16px', borderRadius: 10,
                  border: `0.8px solid ${C.border}`, background: C.white,
                  ...Fb, fontWeight: 500, fontSize: 14, color: C.body,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <Calendar size={16} /> Date <ChevronDown size={14} />
                </button>
              </div>

              {/* Filter tabs */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {filterTabs.map(tab => (
                  <button key={tab} onClick={() => setActiveFilter(tab)} style={{
                    ...Fb, fontWeight: 500, fontSize: 13,
                    padding: '8px 18px', borderRadius: 9999,
                    border: 'none', cursor: 'pointer',
                    background: activeFilter === tab ? C.blue : C.white,
                    color: activeFilter === tab ? C.white : C.body,
                    boxShadow: activeFilter === tab ? 'none' : `inset 0 0 0 0.8px ${C.border}`,
                    transition: 'all 0.15s',
                  }}>{tab}</button>
                ))}
              </div>
            </div>

            {/* Week heading */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
              <h2 style={{ ...Fd, fontSize: 32, color: C.dark, margin: 0 }}>Happening This Week</h2>
              <button style={{
                ...Fb, fontWeight: 500, fontSize: 14, color: C.blue,
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 4,
              }}>View calendar <ArrowRight size={14} /></button>
            </div>

            {/* Timeline */}
            <div ref={timelineRef} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {weekDays.map((wd, dayIdx) => (
                <div key={wd.day} className="el-timeline-item" style={{
                  display: 'flex', gap: 24, minHeight: 80,
                }}>
                  {/* Day circle + connector */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 56, flexShrink: 0 }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: '50%',
                      background: dayIdx === 0 ? C.blue : C.white,
                      border: `2px solid ${dayIdx === 0 ? C.blue : C.border}`,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span style={{ ...Fb, fontWeight: 700, fontSize: 10, color: dayIdx === 0 ? C.white : C.muted, lineHeight: 1 }}>{wd.day}</span>
                      <span style={{ ...Fm, fontSize: 14, color: dayIdx === 0 ? C.white : C.dark, lineHeight: 1, marginTop: 2 }}>{wd.date}</span>
                    </div>
                    {dayIdx < weekDays.length - 1 && (
                      <div style={{ width: 2, flex: 1, background: C.border, minHeight: 20 }} />
                    )}
                  </div>

                  {/* Event cards */}
                  <div className="el-week-events" style={{ paddingBottom: 24 }}>
                    {wd.events.map((evt, evtIdx) => (
                      <div key={evtIdx} className="el-card" style={{
                        background: C.white,
                        border: `0.8px solid ${C.border}`,
                        borderRadius: 12,
                        padding: '16px 20px',
                        flex: '1 1 260px',
                        maxWidth: 340,
                        boxShadow: '0px 2px 8px rgba(0,0,0,0.04)',
                        transition: 'all 0.2s',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                          <span style={{
                            ...Fb, fontWeight: 500, fontSize: 12, color: C.blue,
                            display: 'flex', alignItems: 'center', gap: 4,
                          }}>
                            <Clock size={12} /> {evt.time}
                          </span>
                          <span style={{
                            ...Fb, fontWeight: 500, fontSize: 11,
                            background: C.blueLight, color: C.blue,
                            padding: '2px 8px', borderRadius: 9999,
                          }}>{evt.tag}</span>
                        </div>
                        <p style={{ ...Fb, fontWeight: 600, fontSize: 14, color: C.dark, margin: '0 0 6px' }}>{evt.title}</p>
                        <p style={{
                          ...Fb, fontWeight: 400, fontSize: 12, color: C.muted, margin: '0 0 12px',
                          display: 'flex', alignItems: 'center', gap: 4,
                        }}>
                          <MapPin size={12} /> {evt.location}
                        </p>
                        <button className="el-cta-btn" style={{
                          background: C.blue, color: C.white,
                          ...Fb, fontWeight: 600, fontSize: 12,
                          height: 32, padding: '0 16px', borderRadius: 8,
                          border: 'none', cursor: 'pointer',
                          transition: 'background 0.15s',
                        }}>Register</button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 5 — FOR ORGANIZERS CTA
        ══════════════════════════════════════════════════════════════════ */}
        <Section id="organizers" style={{
          padding: '80px 24px', position: 'relative', overflow: 'hidden',
        }}>
          {/* Background blobs */}
          <div style={{
            position: 'absolute', top: '-20%', right: '-10%',
            width: 400, height: 400, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }} />
          <div style={{
            position: 'absolute', bottom: '-15%', left: '-5%',
            width: 350, height: 350, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(26,86,219,0.08) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }} />

          <div style={{ maxWidth: 1183, margin: '0 auto', position: 'relative', zIndex: 2 }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <span style={{
                ...Fb, fontWeight: 500, fontSize: 12,
                color: C.purple, background: C.purpleLight,
                padding: '4px 14px', borderRadius: 9999,
                letterSpacing: 0.5, textTransform: 'uppercase',
              }}>FOR ORGANIZERS</span>
              <h2 style={{ ...Fd, fontSize: 40, color: C.dark, margin: '16px 0 12px', lineHeight: '48px' }}>
                Host Events. Reach 50,000+ Students.
              </h2>
              <p style={{ ...Fb, fontWeight: 400, fontSize: 16, color: C.muted, maxWidth: 560, margin: '0 auto' }}>
                Submit your event in minutes and get instant visibility across colleges in Tamil Nadu.
                Free for student organizations.
              </p>
            </div>

            <div className="el-org-grid" style={{ marginBottom: 40 }}>
              {[
                {
                  icon: <Zap size={24} color={C.blue} />,
                  title: 'Quick Submission',
                  desc: 'Fill a simple form and your event goes live within 24 hours. No approvals needed for verified colleges.',
                  color: C.blueLight,
                },
                {
                  icon: <BarChart3 size={24} color={C.purple} />,
                  title: 'Analytics Dashboard',
                  desc: 'Track views, registrations, and engagement in real-time. Know exactly how your event is performing.',
                  color: C.purpleLight,
                },
                {
                  icon: <CheckCircle size={24} color={C.green} />,
                  title: 'Verified Reach',
                  desc: 'Your events reach 50,000+ verified students across 12 colleges. Targeted, authentic audience.',
                  color: C.greenLight,
                },
              ].map(card => (
                <div key={card.title} className="el-card" style={{
                  background: C.white,
                  border: `0.8px solid ${C.border}`,
                  borderRadius: 16,
                  padding: 28,
                  boxShadow: '0px 2px 8px rgba(0,0,0,0.04)',
                  transition: 'all 0.2s',
                }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14,
                    background: card.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 20,
                  }}>
                    {card.icon}
                  </div>
                  <h3 style={{ ...Fb, fontWeight: 600, fontSize: 18, color: C.dark, margin: '0 0 8px' }}>{card.title}</h3>
                  <p style={{ ...Fb, fontWeight: 400, fontSize: 14, color: C.muted, margin: 0, lineHeight: '22px' }}>{card.desc}</p>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center' }}>
              <button onClick={() => scrollTo('publish')} className="el-cta-btn" style={{
                background: C.blue, color: C.white,
                ...Fb, fontWeight: 600, fontSize: 16,
                height: 52, padding: '0 36px', borderRadius: 12,
                border: 'none', cursor: 'pointer',
                boxShadow: '0px 10px 25px rgba(26,86,219,0.25)',
                transition: 'background 0.15s',
                display: 'inline-flex', alignItems: 'center', gap: 8,
              }}>Submit Your Event <ArrowRight size={18} /></button>
            </div>
          </div>
        </Section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 6 — EFFORTLESS EVENT PUBLISHING (Form Mockup)
        ══════════════════════════════════════════════════════════════════ */}
        <Section id="publish" style={{ background: C.grayBg, padding: '80px 24px' }}>
          <div style={{ maxWidth: 1183, margin: '0 auto' }}>
            <div className="el-form-grid">
              {/* Left text */}
              <div>
                <span style={{
                  ...Fb, fontWeight: 500, fontSize: 12,
                  color: C.blue, background: C.blueLight,
                  padding: '4px 14px', borderRadius: 9999,
                  letterSpacing: 0.5, textTransform: 'uppercase',
                }}>SIMPLE PROCESS</span>
                <h2 style={{ ...Fd, fontSize: 36, color: C.dark, margin: '16px 0 12px', lineHeight: '44px' }}>
                  Effortless Event Publishing
                </h2>
                <p style={{ ...Fb, fontWeight: 400, fontSize: 16, color: C.muted, lineHeight: '26px', maxWidth: 480 }}>
                  Create and publish your event in under 5 minutes. Our streamlined form
                  handles everything — from posters to registration links.
                </p>
                <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {[
                    'Fill in event details and upload your poster',
                    'Add registration link and expected attendees',
                    'Preview your listing and publish instantly',
                  ].map((step, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: C.blueLight,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <span style={{ ...Fm, fontSize: 12, color: C.blue }}>{i + 1}</span>
                      </div>
                      <span style={{ ...Fb, fontWeight: 400, fontSize: 14, color: C.body }}>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form card */}
              <div style={{
                background: C.white,
                border: `0.8px solid ${C.border}`,
                borderRadius: 16,
                boxShadow: '0px 12px 40px rgba(0,0,0,0.08)',
                padding: 32,
              }}>
                <h3 style={{ ...Fb, fontWeight: 600, fontSize: 18, color: C.dark, margin: '0 0 24px' }}>Create Event</h3>

                {/* Event Title */}
                <div style={{ marginBottom: 18 }}>
                  <label style={{ ...Fb, fontWeight: 500, fontSize: 13, color: C.body, display: 'block', marginBottom: 6 }}>Event Title</label>
                  <input placeholder="e.g., Hackathon 2026" style={{
                    width: '100%', height: 44, border: `0.8px solid ${C.border}`,
                    borderRadius: 10, padding: '0 14px', ...Fb, fontWeight: 400, fontSize: 14,
                    color: C.body, background: C.white, outline: 'none', boxSizing: 'border-box',
                  }} />
                </div>

                {/* Event Type */}
                <div style={{ marginBottom: 18 }}>
                  <label style={{ ...Fb, fontWeight: 500, fontSize: 13, color: C.body, display: 'block', marginBottom: 6 }}>Event Type</label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {eventTypes.map((type, i) => (
                      <span key={type} style={{
                        ...Fb, fontWeight: 500, fontSize: 12,
                        padding: '6px 14px', borderRadius: 9999,
                        background: i === 0 ? C.blue : C.grayBg,
                        color: i === 0 ? C.white : C.body,
                        border: `0.8px solid ${i === 0 ? C.blue : C.border}`,
                        cursor: 'pointer',
                      }}>{type}</span>
                    ))}
                  </div>
                </div>

                {/* Date + Time */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
                  <div>
                    <label style={{ ...Fb, fontWeight: 500, fontSize: 13, color: C.body, display: 'block', marginBottom: 6 }}>Date</label>
                    <div style={{
                      width: '100%', height: 44, border: `0.8px solid ${C.border}`,
                      borderRadius: 10, padding: '0 14px', ...Fb, fontWeight: 400, fontSize: 14,
                      color: C.muted, background: C.white, boxSizing: 'border-box',
                      display: 'flex', alignItems: 'center', gap: 8,
                    }}>
                      <Calendar size={14} color={C.muted} /> Select date
                    </div>
                  </div>
                  <div>
                    <label style={{ ...Fb, fontWeight: 500, fontSize: 13, color: C.body, display: 'block', marginBottom: 6 }}>Time</label>
                    <div style={{
                      width: '100%', height: 44, border: `0.8px solid ${C.border}`,
                      borderRadius: 10, padding: '0 14px', ...Fb, fontWeight: 400, fontSize: 14,
                      color: C.muted, background: C.white, boxSizing: 'border-box',
                      display: 'flex', alignItems: 'center', gap: 8,
                    }}>
                      <Clock size={14} color={C.muted} /> Select time
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div style={{ marginBottom: 18 }}>
                  <label style={{ ...Fb, fontWeight: 500, fontSize: 13, color: C.body, display: 'block', marginBottom: 6 }}>Location</label>
                  <div style={{
                    width: '100%', height: 44, border: `0.8px solid ${C.border}`,
                    borderRadius: 10, padding: '0 14px', ...Fb, fontWeight: 400, fontSize: 14,
                    color: C.muted, background: C.white, boxSizing: 'border-box',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <MapPin size={14} color={C.muted} /> Enter venue or select online
                  </div>
                </div>

                {/* Event Poster */}
                <div style={{ marginBottom: 18 }}>
                  <label style={{ ...Fb, fontWeight: 500, fontSize: 13, color: C.body, display: 'block', marginBottom: 6 }}>Event Poster</label>
                  <div style={{
                    border: `1.5px dashed ${C.border}`,
                    borderRadius: 10, padding: '24px 0',
                    textAlign: 'center', cursor: 'pointer',
                    background: C.grayBg,
                  }}>
                    <Upload size={24} color={C.muted} />
                    <p style={{ ...Fb, fontWeight: 500, fontSize: 13, color: C.muted, margin: '8px 0 0' }}>
                      Drag & drop or click to upload
                    </p>
                    <p style={{ ...Fb, fontWeight: 400, fontSize: 11, color: C.muted, margin: '4px 0 0' }}>
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div style={{ marginBottom: 18 }}>
                  <label style={{ ...Fb, fontWeight: 500, fontSize: 13, color: C.body, display: 'block', marginBottom: 6 }}>Description</label>
                  <div style={{
                    width: '100%', height: 80, border: `0.8px solid ${C.border}`,
                    borderRadius: 10, padding: '12px 14px', ...Fb, fontWeight: 400, fontSize: 14,
                    color: C.muted, background: C.white, boxSizing: 'border-box',
                  }}>Describe your event...</div>
                </div>

                {/* Registration Link */}
                <div style={{ marginBottom: 18 }}>
                  <label style={{ ...Fb, fontWeight: 500, fontSize: 13, color: C.body, display: 'block', marginBottom: 6 }}>Registration Link</label>
                  <input placeholder="https://..." style={{
                    width: '100%', height: 44, border: `0.8px solid ${C.border}`,
                    borderRadius: 10, padding: '0 14px', ...Fb, fontWeight: 400, fontSize: 14,
                    color: C.body, background: C.white, outline: 'none', boxSizing: 'border-box',
                  }} />
                </div>

                {/* Expected Attendees */}
                <div style={{ marginBottom: 18 }}>
                  <label style={{ ...Fb, fontWeight: 500, fontSize: 13, color: C.body, display: 'block', marginBottom: 6 }}>Expected Attendees</label>
                  <input placeholder="e.g., 200" style={{
                    width: '100%', height: 44, border: `0.8px solid ${C.border}`,
                    borderRadius: 10, padding: '0 14px', ...Fb, fontWeight: 400, fontSize: 14,
                    color: C.body, background: C.white, outline: 'none', boxSizing: 'border-box',
                  }} />
                </div>

                {/* Tags */}
                <div style={{ marginBottom: 24 }}>
                  <label style={{ ...Fb, fontWeight: 500, fontSize: 13, color: C.body, display: 'block', marginBottom: 6 }}>Tags</label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {tagOptions.map((tag, i) => (
                      <span key={tag} className="el-tag-btn" style={{
                        ...Fb, fontWeight: 500, fontSize: 12,
                        padding: '6px 14px', borderRadius: 9999,
                        background: i < 2 ? C.blue : C.grayBg,
                        color: i < 2 ? C.white : C.body,
                        border: `0.8px solid ${i < 2 ? C.blue : C.border}`,
                      }}>{tag}</span>
                    ))}
                  </div>
                </div>

                <button className="el-cta-btn" style={{
                  width: '100%', height: 48,
                  background: C.blue, color: C.white,
                  ...Fb, fontWeight: 600, fontSize: 15,
                  borderRadius: 10, border: 'none', cursor: 'pointer',
                  transition: 'background 0.15s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}>Preview & Publish <ArrowRight size={16} /></button>
              </div>
            </div>
          </div>
        </Section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 7 — TRACK WHAT WORKS (Analytics)
        ══════════════════════════════════════════════════════════════════ */}
        <Section id="analytics" style={{ padding: '80px 24px' }}>
          <div style={{ maxWidth: 1183, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <span style={{
                ...Fb, fontWeight: 500, fontSize: 12,
                color: C.purple, background: C.purpleLight,
                padding: '4px 14px', borderRadius: 9999,
                letterSpacing: 0.5, textTransform: 'uppercase',
              }}>ANALYTICS</span>
              <h2 style={{ ...Fd, fontSize: 36, color: C.dark, margin: '16px 0 12px' }}>Track What Works</h2>
              <p style={{ ...Fb, fontWeight: 400, fontSize: 16, color: C.muted, maxWidth: 500, margin: '0 auto' }}>
                Get real-time insights into how your events are performing across the platform
              </p>
            </div>

            {/* Stat cards */}
            <div className="el-stats-grid" style={{ marginBottom: 32 }}>
              {[
                { label: 'Event Views', value: 3847, suffix: '', change: '+18%', icon: <Eye size={20} color={C.blue} />, color: C.blueLight },
                { label: 'Registrations', value: 1234, suffix: '', change: '+24%', icon: <Users size={20} color={C.green} />, color: C.greenLight },
                { label: 'CTR', value: 8.7, suffix: '%', change: '+5%', icon: <MousePointerClick size={20} color={C.purple} />, color: C.purpleLight },
                { label: 'Shares', value: 462, suffix: '', change: '+12%', icon: <Share2 size={20} color={C.amber} />, color: C.amberLight },
              ].map(stat => {
                const isDecimal = stat.suffix === '%';
                const counter = useCountUp(isDecimal ? Math.round(stat.value * 10) : stat.value);
                const displayVal = isDecimal
                  ? (counter.count / 10).toFixed(1)
                  : counter.count.toLocaleString();
                return (
                  <div key={stat.label} style={{
                    background: C.white,
                    border: `0.8px solid ${C.border}`,
                    borderRadius: 14,
                    padding: 20,
                    boxShadow: '0px 2px 8px rgba(0,0,0,0.04)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 10,
                        background: stat.color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>{stat.icon}</div>
                      <span style={{
                        ...Fb, fontWeight: 600, fontSize: 12,
                        color: C.green,
                        display: 'flex', alignItems: 'center', gap: 2,
                      }}>
                        <TrendingUp size={12} /> {stat.change}
                      </span>
                    </div>
                    <p ref={counter.ref} style={{ ...Fm, fontSize: 28, color: C.dark, margin: '0 0 4px' }}>
                      {displayVal}{stat.suffix}
                    </p>
                    <p style={{ ...Fb, fontWeight: 400, fontSize: 13, color: C.muted, margin: 0 }}>{stat.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Weekly Engagement Chart */}
            <div style={{
              background: C.white,
              border: `0.8px solid ${C.border}`,
              borderRadius: 14,
              padding: 24,
              boxShadow: '0px 2px 8px rgba(0,0,0,0.04)',
              marginBottom: 24,
            }}>
              <h3 style={{ ...Fb, fontWeight: 600, fontSize: 16, color: C.dark, margin: '0 0 4px' }}>Weekly Engagement</h3>
              <p style={{ ...Fb, fontWeight: 400, fontSize: 13, color: C.muted, margin: '0 0 20px' }}>Views and registrations over the week</p>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={engagementData}>
                  <defs>
                    <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={C.blue} stopOpacity={0.15} />
                      <stop offset="100%" stopColor={C.blue} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="regsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={C.green} stopOpacity={0.15} />
                      <stop offset="100%" stopColor={C.green} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                  <XAxis dataKey="day" tick={{ ...Fb, fontSize: 12, fill: C.muted }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ ...Fb, fontSize: 12, fill: C.muted }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      ...Fb, fontSize: 13, borderRadius: 8, border: `0.8px solid ${C.border}`,
                      boxShadow: '0px 4px 12px rgba(0,0,0,0.08)',
                    }}
                  />
                  <Area type="monotone" dataKey="views" stroke={C.blue} strokeWidth={2} fill="url(#viewsGrad)" />
                  <Area type="monotone" dataKey="registrations" stroke={C.green} strokeWidth={2} fill="url(#regsGrad)" />
                </AreaChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 8 }}>
                {[
                  { color: C.blue, label: 'Views' },
                  { color: C.green, label: 'Registrations' },
                ].map(l => (
                  <span key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 10, height: 3, borderRadius: 2, background: l.color }} />
                    <span style={{ ...Fb, fontSize: 12, color: C.muted }}>{l.label}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom charts */}
            <div className="el-chart-grid">
              {/* Top Colleges */}
              <div style={{
                background: C.white,
                border: `0.8px solid ${C.border}`,
                borderRadius: 14,
                padding: 24,
                boxShadow: '0px 2px 8px rgba(0,0,0,0.04)',
              }}>
                <h3 style={{ ...Fb, fontWeight: 600, fontSize: 16, color: C.dark, margin: '0 0 4px' }}>Top Colleges by Registrations</h3>
                <p style={{ ...Fb, fontWeight: 400, fontSize: 13, color: C.muted, margin: '0 0 20px' }}>Where your audience comes from</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {topColleges.map(col => (
                    <div key={col.name}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ ...Fb, fontWeight: 500, fontSize: 13, color: C.body }}>{col.name}</span>
                        <span style={{ ...Fm, fontSize: 12, color: C.dark }}>{col.value}</span>
                      </div>
                      <div style={{ height: 8, background: C.grayBg, borderRadius: 4, overflow: 'hidden' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${col.pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.2 }}
                          style={{ height: '100%', background: C.blue, borderRadius: 4 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Peak Registration Hours */}
              <div style={{
                background: C.white,
                border: `0.8px solid ${C.border}`,
                borderRadius: 14,
                padding: 24,
                boxShadow: '0px 2px 8px rgba(0,0,0,0.04)',
              }}>
                <h3 style={{ ...Fb, fontWeight: 600, fontSize: 16, color: C.dark, margin: '0 0 4px' }}>Peak Registration Hours</h3>
                <p style={{ ...Fb, fontWeight: 400, fontSize: 13, color: C.muted, margin: '0 0 20px' }}>When students register most</p>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={peakHoursData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                    <XAxis dataKey="hour" tick={{ ...Fb, fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ ...Fb, fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        ...Fb, fontSize: 13, borderRadius: 8, border: `0.8px solid ${C.border}`,
                        boxShadow: '0px 4px 12px rgba(0,0,0,0.08)',
                      }}
                    />
                    <Bar dataKey="count" fill={C.blue} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </Section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 8 — NEWSLETTER / FOOTER
        ══════════════════════════════════════════════════════════════════ */}
        <Section style={{
          background: C.dark, padding: '80px 24px',
        }}>
          <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ ...Fd, fontSize: 36, color: C.white, margin: '0 0 12px' }}>
              Never Miss an Event Again
            </h2>
            <p style={{ ...Fb, fontWeight: 400, fontSize: 16, color: '#9CA3AF', lineHeight: '26px', margin: '0 0 32px' }}>
              Get weekly digests of the hottest events happening near your campus.
              Curated picks, exclusive early access, and more.
            </p>

            {subscribed ? (
              <div style={{
                background: 'rgba(16,185,129,0.15)',
                border: '1px solid rgba(16,185,129,0.3)',
                borderRadius: 12, padding: 20,
              }}>
                <CheckCircle size={24} color={C.green} />
                <p style={{ ...Fb, fontWeight: 600, fontSize: 16, color: C.green, margin: '8px 0 0' }}>
                  You're subscribed!
                </p>
                <p style={{ ...Fb, fontWeight: 400, fontSize: 13, color: '#9CA3AF', margin: '4px 0 0' }}>
                  Check your inbox for a confirmation email.
                </p>
              </div>
            ) : (
              <>
                <div style={{
                  display: 'flex', gap: 12,
                  maxWidth: 460, margin: '0 auto 16px',
                }}>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    style={{
                      flex: 1, height: 48,
                      border: '0.8px solid rgba(255,255,255,0.15)',
                      borderRadius: 10, padding: '0 16px',
                      ...Fb, fontWeight: 400, fontSize: 14,
                      color: C.white, background: 'rgba(255,255,255,0.08)',
                      outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                  <button
                    onClick={() => { if (email) setSubscribed(true); }}
                    className="el-cta-btn"
                    style={{
                      background: C.blue, color: C.white,
                      ...Fb, fontWeight: 600, fontSize: 14,
                      height: 48, padding: '0 24px', borderRadius: 10,
                      border: 'none', cursor: 'pointer',
                      transition: 'background 0.15s', whiteSpace: 'nowrap',
                    }}
                  >Subscribe</button>
                </div>
                <p style={{ ...Fb, fontWeight: 400, fontSize: 12, color: '#6B7280' }}>
                  No spam, ever. Unsubscribe anytime.
                </p>
              </>
            )}
          </div>
        </Section>

        {/* Footer */}
        <footer style={{
          background: C.dark,
          borderTop: '1px solid rgba(255,255,255,0.08)',
          padding: '32px 24px',
        }}>
          <div style={{ maxWidth: 1183, margin: '0 auto' }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              flexWrap: 'wrap', gap: 16,
            }}>
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                {['About', 'Privacy', 'Terms', 'Contact', 'Blog'].map(link => (
                  <a key={link} href="#" style={{
                    ...Fb, fontWeight: 400, fontSize: 13, color: '#9CA3AF',
                    textDecoration: 'none', transition: 'color 0.15s',
                  }}>{link}</a>
                ))}
              </div>
              <p style={{ ...Fb, fontWeight: 400, fontSize: 13, color: '#6B7280', margin: 0 }}>
                &copy; 2026 StudentsHub. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
