import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Hero } from '../components/Hero';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle';
import { useAuth } from '../contexts/AuthContext';
import {
  Search, MapPin, Calendar, Clock, Users, ChevronDown,
  Zap, Trophy, BookOpen, Monitor, ArrowRight,
  BarChart3, Eye, MousePointerClick, Share2, TrendingUp, Menu, X,
  GraduationCap, CheckCircle, Globe, Star, Play, ChevronRight, User, LogIn, Shield,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Query } from 'appwrite';
import { databases, DATABASE_ID, COLLECTIONS, storage, eventMediaBucket } from '../lib/appwrite';
import { EventCalendar } from '../components/events/EventCalendar';
import { Footer } from '../components/Footer';

gsap.registerPlugin(ScrollTrigger);

// ── Design Tokens ─────────────────────────────────────────────────────────────
const C = {
  blue: 'var(--el-blue, #1A56DB)',
  blueDark: 'var(--el-blueDark, #1548c7)',
  dark: 'var(--el-dark, #0A0A0A)',
  body: 'var(--el-body, #374151)',
  muted: 'var(--el-muted, #6B7280)',
  border: 'var(--el-border, #E5E7EB)',
  blueLight: 'var(--el-blueLight, #EBF2FF)',
  white: 'var(--el-white, #FFFFFF)',
  grayBg: 'var(--el-grayBg, #F9FAFB)',
  green: 'var(--el-green, #10B981)',
  greenLight: 'var(--el-greenLight, #ECFDF5)',
  amber: 'var(--el-amber, #D97706)',
  amberLight: 'var(--el-amberLight, #FFFBEB)',
  purple: 'var(--el-purple, #7C3AED)',
  purpleLight: 'var(--el-purpleLight, #F3E8FF)',
  red: 'var(--el-red, #EF4444)',
  redLight: 'var(--el-redLight, #FEF2F2)',
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
  const ref = useRef<any>(null);
  const inView = useInView(ref, { once: true });
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


// ── Appwrite Event Document ──────────────────────────────────────────────────
interface EventDocument {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  title: string;
  description: string;
  category?: string[] | string;
  eventType?: string;
  status: string;
  eventDate: string;
  time: string;
  duration?: string;
  organizer: string;
  organizerLogo?: string;
  organizerWebsite?: string;
  participantCount: number;
  maxParticipants?: number;
  registrationLink: string;
  thumbnailUrl?: string;
  posterFileId?: string;
  recordingUrl?: string;
  streams?: string[];
  tags?: string[];
  location?: string;
  platform?: string;
  isPopular?: boolean;
  isFeatured?: boolean;
  certificateOffered?: boolean;
  isPaid?: boolean;
  price?: string;
}

function getEventType(evt: EventDocument): string {
  if (Array.isArray(evt.category) && evt.category.length > 0) return evt.category[0];
  if (typeof evt.category === 'string') return evt.category;
  return evt.eventType || 'Other';
}

function getPosterUrl(evt: EventDocument): string | null {
  if (evt.posterFileId && eventMediaBucket) {
    const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';
    const project = import.meta.env.VITE_APPWRITE_PROJECT || '';
    return `${endpoint}/storage/buckets/${eventMediaBucket}/files/${evt.posterFileId}/preview?project=${project}&width=600&height=400`;
  }
  if (evt.thumbnailUrl) return evt.thumbnailUrl;
  return null;
}

function formatShortDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const CATEGORY_META: Record<string, { icon: React.ReactNode; color: string }> = {
  Webinar: { icon: <Monitor size={20} color={C.red} />, color: C.redLight },
  Hackathon: { icon: <Zap size={20} color={C.blue} />, color: C.blueLight },
  Workshop: { icon: <BookOpen size={20} color={C.green} />, color: C.greenLight },
  Conference: { icon: <Trophy size={20} color={C.amber} />, color: C.amberLight },
};

const DEFAULT_CATEGORY_META = { icon: <Star size={20} color={C.purple} />, color: C.purpleLight };

const ADMIN_IDS = ['68ff4c5816bf5338810a', '68fe7498057792229b3d'];

// ── EventsLanding ─────────────────────────────────────────────────────────────
export default function EventsLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All Events');
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // ── Appwrite events state ──────────────────────────────────────────────────
  const [events, setEvents] = useState<EventDocument[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setEventsLoading(true);
        const now = new Date().toISOString();
        // Query solely by date to utilize idx_eventDate directly
        const response = await databases.listDocuments(
          DATABASE_ID,
          COLLECTIONS.EVENTS,
          [
            Query.greaterThanEqual('eventDate', now),
            Query.orderAsc('eventDate'),
            Query.limit(100),
          ]
        );

        // Filter approved events locally to bypass strict exact-index Appwrite requirements
        const rawEvents = response.documents as unknown as EventDocument[];
        console.log("RAW DB EVENTS RETURNED:", rawEvents);
        const approvedEvents = rawEvents.filter((e: any) => e.approved === true);
        console.log("FILTERED ADMIN EVENTS:", approvedEvents);

        setEvents(approvedEvents);
      } catch (err) {
        console.error('Failed to fetch events:', err);
      } finally {
        setEventsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // ── Derived data ───────────────────────────────────────────────────────────
  const featuredEvent = events.find(e => e.isFeatured) || events[0] || null;

  // Countdown timer for featured event
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const featuredEventDate = featuredEvent?.eventDate;

  useEffect(() => {
    if (!featuredEventDate) return;
    const target = new Date(featuredEventDate).getTime();
    const update = () => {
      const diff = Math.max(0, target - Date.now());
      setCountdown({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      });
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [featuredEventDate]);

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

  const filterTabs = ['All Events', 'Technical', 'Cultural', 'Sports', 'Webinar', 'Hackathon'];

  const categories = (() => {
    const grouped: Record<string, EventDocument[]> = {};
    events.forEach(evt => {
      let cats: string[] = [];
      let parsedCat = evt.category;

      // Handle Appwrite serialized arrays if they are stuck as strings
      if (typeof evt.category === 'string' && evt.category.startsWith('[')) {
        try { parsedCat = JSON.parse(evt.category); } catch (e) { }
      }

      if (Array.isArray(parsedCat) && parsedCat.length > 0) {
        cats = parsedCat;
      } else if (typeof parsedCat === 'string' && parsedCat.trim() !== '') {
        cats = [parsedCat.trim()];
      } else if (evt.eventType && typeof evt.eventType === 'string' && evt.eventType.trim() !== '') {
        cats = [evt.eventType.trim()];
      } else {
        cats = ['Other'];
      }

      cats.forEach(cat => {
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(evt);
      });
    });
    return Object.entries(grouped).map(([title, evts]) => {
      const meta = CATEGORY_META[title] || DEFAULT_CATEGORY_META;
      return {
        icon: meta.icon,
        title,
        count: evts.length,
        color: meta.color,
        events: evts.slice(0, 3).map(e => `${e.title} — ${formatShortDate(e.eventDate)}`),
      };
    });
  })();

  const weekDays = (() => {
    const days: { day: string; date: number; events: { time: string; title: string; location: string; tag: string; registrationLink?: string; posterUrl?: string | null; videoUrl?: string }[] }[] = [];
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() + i);
      const dateKey = d.toISOString().slice(0, 10);
      // If a calendar date is selected, only show that date
      if (selectedDate && dateKey !== selectedDate) continue;

      const dayEvents = events.filter(e => {
        if (e.eventDate.slice(0, 10) !== dateKey) return false;

        // Filter logic based on activeFilter
        if (activeFilter === 'All Events') return true;
        if (Array.isArray(e.category)) {
          return e.category.includes(activeFilter);
        } else {
          return e.category === activeFilter || e.eventType === activeFilter;
        }
      });
      if (dayEvents.length > 0) {
        days.push({
          day: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase().slice(0, 3),
          date: d.getDate(),
          events: dayEvents.map(e => ({
            time: e.time || 'TBA',
            title: e.title,
            location: e.location || 'Online',
            tag: getEventType(e),
            registrationLink: e.registrationLink,
            posterUrl: getPosterUrl(e),
            videoUrl: e.recordingUrl,
          })),
        });
      }
    }
    return days;
  })();

  const topColleges = [
    { name: 'VIT Chennai', value: 342, pct: 85 },
    { name: 'SRM University', value: 287, pct: 72 },
    { name: 'Anna University', value: 234, pct: 58 },
    { name: 'IIT Madras', value: 198, pct: 49 },
    { name: 'Loyola College', value: 173, pct: 43 },
  ];

  return (
    <>
      {/* ─ Responsive CSS ─ */}
      <style>{`
        :root {
          --el-white-rgb: 255, 255, 255;
          --el-blue: #1A56DB;
          --el-blueDark: #1548c7;
          --el-dark: #0A0A0A;
          --el-body: #374151;
          --el-muted: #6B7280;
          --el-border: #E5E7EB;
          --el-blueLight: #EBF2FF;
          --el-white: #FFFFFF;
          --el-grayBg: #F9FAFB;
          --el-green: #10B981;
          --el-greenLight: #ECFDF5;
          --el-amber: #D97706;
          --el-amberLight: #FFFBEB;
          --el-purple: #7C3AED;
          --el-purpleLight: #F3E8FF;
          --el-red: #EF4444;
          --el-redLight: #FEF2F2;
          --el-bg-overlay: rgba(255,255,255,0.92);
          --el-bg-card: rgba(255,255,255,0.25);
          --el-shadow-1: rgba(0,0,0,0.08);
          --el-shadow-2: rgba(0,0,0,0.12);
        }
        .dark {
          --el-white-rgb: 10, 10, 10;
          --el-blue: #1A56DB;
          --el-blueDark: #1548c7;
          --el-dark: #FFFFFF;
          --el-body: #D1D5DB;
          --el-muted: #9CA3AF;
          --el-border: #374151;
          --el-blueLight: rgba(26,86,219,0.15);
          --el-white: #0A0A0A;
          --el-grayBg: #111827;
          --el-green: #10B981;
          --el-greenLight: rgba(16,185,129,0.15);
          --el-amber: #D97706;
          --el-amberLight: rgba(217,119,6,0.15);
          --el-purple: #7C3AED;
          --el-purpleLight: rgba(124,58,237,0.15);
          --el-red: #EF4444;
          --el-redLight: rgba(239,68,68,0.15);
          --el-bg-overlay: rgba(10,10,10,0.92);
          --el-bg-card: rgba(10,10,10,0.4);
          --el-shadow-1: rgba(0,0,0,0.4);
          --el-shadow-2: rgba(0,0,0,0.5);
        }
      
        .el-hero-cards { display:block; }
        .el-cat-grid { display:flex; gap:20px; overflow-x:auto; padding-bottom:16px; scroll-snap-type:x mandatory; }
        .el-cat-grid::-webkit-scrollbar { display:none; }
        .el-cat-card { min-width:260px; scroll-snap-align:start; flex-shrink:0; }
        .el-feat-grid { display:grid; grid-template-columns:1fr 1fr; gap:48px; align-items:center; }
        .el-org-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
        .el-stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; }
        .el-chart-grid { display:grid; grid-template-columns:1fr 1fr; gap:24px; }
        .el-week-events { display:flex; gap:16px; flex-wrap:wrap; flex:1; }
        .el-desktop-nav { display:flex !important; }
        .el-mobile-nav { display:none !important; }

        @media (max-width:1100px) {
          .el-feat-grid { grid-template-columns:1fr; }
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
          background: 'var(--el-bg-overlay)',
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
              <ThemeToggle />
              {/* My Events link for logged-in users */}
              {!authLoading && user && (
                <>
                  <Link to="/events/dashboard" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    ...Fb, fontWeight: 500, fontSize: 14, color: C.blue,
                    background: C.blueLight,
                    borderRadius: 10, height: 41, padding: '0 16px',
                    textDecoration: 'none', transition: 'all 0.15s',
                  }}>
                    <BarChart3 size={16} /> My Events
                  </Link>

                  {/* Admin Moderation link */}
                  {ADMIN_IDS.includes(user.$id) && (
                    <Link to="/admin/events" style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      ...Fb, fontWeight: 500, fontSize: 14, color: C.red,
                      background: C.redLight,
                      borderRadius: 10, height: 41, padding: '0 16px',
                      textDecoration: 'none', transition: 'all 0.15s',
                    }}>
                      <Shield size={16} /> Admin Panel
                    </Link>
                  )}
                </>
              )}
              {/* User / Profile button */}
              {!authLoading && (
                user ? (
                  <button
                    onClick={() => navigate('/profile')}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      ...Fb, fontWeight: 500, fontSize: 14, color: C.body,
                      background: 'none', border: `0.8px solid ${C.border}`,
                      borderRadius: 10, height: 41, padding: '0 16px',
                      cursor: 'pointer', transition: 'all 0.15s',
                    }}
                  >
                    <User size={16} />
                    {user.name?.split(' ')[0] || 'Profile'}
                  </button>
                ) : (
                  <Link to="/login" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    ...Fb, fontWeight: 500, fontSize: 14, color: C.body,
                    background: 'none', border: `0.8px solid ${C.border}`,
                    borderRadius: 10, height: 41, padding: '0 16px',
                    cursor: 'pointer', transition: 'all 0.15s',
                    textDecoration: 'none',
                  }}>
                    <LogIn size={16} /> Sign In
                  </Link>
                )
              )}
              <Link to="/events/register"
                className="el-cta-btn"
                style={{
                  background: C.blue, color: C.white,
                  ...Fb, fontWeight: 600, fontSize: 14,
                  height: 41, padding: '0 20px', borderRadius: 10,
                  border: 'none', cursor: 'pointer',
                  transition: 'background 0.15s',
                  textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
                }}>Submit Event</Link>
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
              <ThemeToggle />
              {/* Mobile user button */}
              {!authLoading && (
                user ? (
                  <button
                    onClick={() => navigate('/profile')}
                    style={{
                      width: 36, height: 36, borderRadius: 8,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: C.blueLight, border: 'none', cursor: 'pointer',
                    }}
                  >
                    <User size={16} color={C.blue} />
                  </button>
                ) : (
                  <Link to="/login" style={{
                    width: 36, height: 36, borderRadius: 8,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'none', border: `0.8px solid ${C.border}`,
                    textDecoration: 'none',
                  }}>
                    <LogIn size={16} color={C.body} />
                  </Link>
                )
              )}
              <Link to="/events/register"
                className="el-cta-btn"
                style={{
                  background: C.blue, color: C.white,
                  ...Fb, fontWeight: 600, fontSize: 13,
                  height: 36, padding: '0 14px', borderRadius: 9,
                  border: 'none', cursor: 'pointer',
                  transition: 'background 0.15s', whiteSpace: 'nowrap',
                  textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
                }}>Submit Event</Link>
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
              boxShadow: '0 4px 16px var(--el-shadow-1)',
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
              {/* My Events link for logged-in users */}
              {!authLoading && user && (
                <>
                  <Link to="/events/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="el-mob-link"
                    style={{
                      ...Fb, fontWeight: 500, fontSize: 15, color: C.blue,
                      padding: '10px 12px', borderRadius: 8, textDecoration: 'none',
                      display: 'flex', alignItems: 'center', gap: 8,
                      transition: 'background 0.15s',
                    }}>
                    <BarChart3 size={16} /> My Events
                  </Link>

                  {/* Admin Panel link for mobile */}
                  {ADMIN_IDS.includes(user.$id) && (
                    <Link to="/admin/events"
                      onClick={() => setMobileMenuOpen(false)}
                      className="el-mob-link"
                      style={{
                        ...Fb, fontWeight: 500, fontSize: 15, color: C.red,
                        padding: '10px 12px', borderRadius: 8, textDecoration: 'none',
                        display: 'flex', alignItems: 'center', gap: 8,
                        transition: 'background 0.15s',
                      }}>
                      <Shield size={16} /> Admin Panel
                    </Link>
                  )}
                </>
              )}
              {/* Mobile sign in link in dropdown */}
              {!authLoading && !user && (
                <Link to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="el-mob-link"
                  style={{
                    ...Fb, fontWeight: 500, fontSize: 15, color: C.blue,
                    padding: '10px 12px', borderRadius: 8, textDecoration: 'none',
                    display: 'flex', alignItems: 'center', gap: 8,
                    transition: 'background 0.15s',
                  }}>
                  <LogIn size={16} /> Sign In
                </Link>
              )}
            </div>
          )}
        </nav>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 1 — HERO
        ══════════════════════════════════════════════════════════════════ */}
        <Hero />

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
                background: featuredEvent && getPosterUrl(featuredEvent)
                  ? `url(${getPosterUrl(featuredEvent)}) center/cover no-repeat`
                  : 'linear-gradient(135deg, #1A56DB 0%, #7C3AED 100%)',
                minHeight: 360,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ textAlign: 'center', color: C.white, padding: 40 }}>
                  <div style={{
                    ...Fm, fontSize: 14, background: 'rgba(var(--el-white-rgb, 255, 255, 255), 0.2)',
                    padding: '6px 16px', borderRadius: 8, display: 'inline-block', marginBottom: 16,
                  }}>FEATURED</div>
                  <h3 style={{ ...Fd, fontSize: 32, margin: '0 0 8px' }}>{featuredEvent?.title ?? 'Coming Soon'}</h3>
                  <p style={{ ...Fb, fontSize: 16, opacity: 0.9 }}>{featuredEvent?.description?.slice(0, 60) ?? ''}</p>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 20, flexWrap: 'wrap' }}>
                    {(featuredEvent?.tags?.length ? featuredEvent.tags : (featuredEvent ? [getEventType(featuredEvent)] : [])).map(t => (
                      <span key={t} style={{ ...Fb, fontSize: 12, background: 'rgba(var(--el-white-rgb, 255, 255, 255), 0.2)', padding: '4px 12px', borderRadius: 9999 }}>{t}</span>
                    ))}
                  </div>
                </div>
                {/* Play button overlay */}
                <div style={{
                  position: 'absolute', bottom: 20, right: 20,
                  width: 48, height: 48, borderRadius: '50%',
                  background: 'var(--el-bg-card)',
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
                    <p style={{ ...Fb, fontWeight: 600, fontSize: 14, color: C.dark, margin: 0 }}>{featuredEvent?.organizer ?? 'Organizer'}</p>
                    <p style={{ ...Fb, fontWeight: 400, fontSize: 12, color: C.muted, margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <CheckCircle size={12} color={C.green} /> Verified College
                    </p>
                  </div>
                </div>

                <h3 style={{ ...Fd, fontSize: 28, color: C.dark, margin: '0 0 12px', lineHeight: '36px' }}>
                  {featuredEvent?.title ?? 'No Featured Event'}
                </h3>

                <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
                  {(featuredEvent?.tags?.length ? featuredEvent.tags : (featuredEvent ? [getEventType(featuredEvent)] : [])).map(t => (
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
                    { icon: <Calendar size={16} color={C.muted} />, text: featuredEvent ? `${formatShortDate(featuredEvent.eventDate)}${featuredEvent.time ? (/^\\d{4}-\\d{2}-\\d{2}/.test(featuredEvent.time) ? ` till ${formatShortDate(featuredEvent.time)}` : ` at ${featuredEvent.time}`) : ''}` : 'TBA' },
                    { icon: <MapPin size={16} color={C.muted} />, text: featuredEvent?.location || featuredEvent?.platform || 'TBA' },
                    { icon: <Users size={16} color={C.muted} />, text: featuredEvent?.maxParticipants ? `${featuredEvent.maxParticipants} max participants` : `${featuredEvent?.participantCount ?? 0} participants` },
                    { icon: <Globe size={16} color={C.muted} />, text: featuredEvent?.registrationLink ? 'Registration Open' : 'Registration Closed' },
                  ].map((m, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {m.icon}
                      <span style={{ ...Fb, fontWeight: 400, fontSize: 14, color: C.body }}>{m.text}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <a href={featuredEvent?.registrationLink || '#'} target="_blank" rel="noopener noreferrer" className="el-cta-btn" style={{
                    background: C.blue, color: C.white,
                    ...Fb, fontWeight: 600, fontSize: 15,
                    height: 48, padding: '0 28px', borderRadius: 10,
                    border: 'none', cursor: 'pointer',
                    transition: 'background 0.15s',
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    textDecoration: 'none',
                  }}>Register Now <ArrowRight size={16} /></a>
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
              {eventsLoading ? (
                <p style={{ ...Fb, fontSize: 14, color: C.muted, padding: 40, textAlign: 'center', width: '100%' }}>Loading events...</p>
              ) : categories.length === 0 ? (
                <p style={{ ...Fb, fontSize: 14, color: C.muted, padding: 40, textAlign: 'center', width: '100%' }}>No upcoming events found.</p>
              ) : categories.map(cat => (
                <div key={cat.title} onClick={() => { setActiveFilter(cat.title); scrollTo('this-week'); }} className="el-cat-card el-card" style={{
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
                <button onClick={() => alert("Location filtering map coming soon!")} style={{
                  height: 48, padding: '0 16px', borderRadius: 10,
                  border: `0.8px solid ${C.border}`, background: C.white,
                  ...Fb, fontWeight: 500, fontSize: 14, color: C.body,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <MapPin size={16} /> Location <ChevronDown size={14} />
                </button>
                <button onClick={() => setShowCalendar(v => !v)} style={{
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
              <button onClick={() => setShowCalendar(v => !v)} style={{
                ...Fb, fontWeight: 500, fontSize: 14, color: C.blue,
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 4,
              }}>{showCalendar ? 'Hide calendar' : 'View calendar'} <ArrowRight size={14} /></button>
            </div>

            {showCalendar && (
              <div style={{ marginBottom: 32 }}>
                <EventCalendar
                  events={events}
                  onDateSelect={(date) => setSelectedDate(date)}
                />
              </div>
            )}

            {/* Timeline */}
            <div ref={timelineRef} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {eventsLoading ? (
                <p style={{ ...Fb, fontSize: 14, color: C.muted, padding: 40, textAlign: 'center' }}>Loading events...</p>
              ) : weekDays.length === 0 ? (
                <p style={{ ...Fb, fontSize: 14, color: C.muted, padding: 40, textAlign: 'center' }}>
                  {selectedDate ? 'No events on this date.' : 'No events scheduled this week.'}
                </p>
              ) : weekDays.map((wd, dayIdx) => (
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
                        overflow: 'hidden',
                        flex: '1 1 260px',
                        maxWidth: 340,
                        boxShadow: '0px 2px 8px rgba(0,0,0,0.04)',
                        transition: 'all 0.2s',
                      }}>
                        {evt.posterUrl && (
                          <img src={evt.posterUrl} alt={evt.title} style={{ width: '100%', height: 120, objectFit: 'cover', display: 'block' }} />
                        )}
                        <div style={{ padding: '16px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                            <span style={{
                              ...Fb, fontWeight: 500, fontSize: 12, color: C.blue,
                              display: 'flex', alignItems: 'center', gap: 4,
                            }}>
                              {(/^\\d{4}-\\d{2}-\\d{2}/.test(evt.time)) ? <Calendar size={12} /> : <Clock size={12} />} {(/hw\\d{4}-\\d{2}-\\d{2}/.test(evt.time)) ? `Till ${formatShortDate(evt.time)}` : evt.time}
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
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <a href={evt.registrationLink || '#'} target="_blank" rel="noopener noreferrer" className="el-cta-btn" style={{
                              background: C.blue, color: C.white,
                              ...Fb, fontWeight: 600, fontSize: 12,
                              height: 32, padding: '0 16px', borderRadius: 8,
                              border: 'none', cursor: 'pointer',
                              transition: 'background 0.15s',
                              textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
                            }}>Register</a>
                            {evt.videoUrl && (
                              <a href={evt.videoUrl} target="_blank" rel="noopener noreferrer" style={{
                                ...Fb, fontWeight: 500, fontSize: 12, color: C.blue,
                                display: 'inline-flex', alignItems: 'center', gap: 4,
                                textDecoration: 'none',
                              }}><Play size={12} /> Video</a>
                            )}
                          </div>
                        </div>
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
              <Link to="/events/register" className="el-cta-btn" style={{
                background: C.blue, color: C.white,
                ...Fb, fontWeight: 600, fontSize: 16,
                height: 52, padding: '0 36px', borderRadius: 12,
                border: 'none', cursor: 'pointer',
                boxShadow: '0px 10px 25px rgba(26,86,219,0.25)',
                transition: 'background 0.15s',
                display: 'inline-flex', alignItems: 'center', gap: 8,
                textDecoration: 'none',
              }}>Submit Your Event <ArrowRight size={18} /></Link>
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
                  <XAxis dataKey="day" tick={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, fill: C.muted }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, fill: C.muted }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      ...Fb, fontSize: 13, borderRadius: 8, border: `0.8px solid ${C.border}`,
                      boxShadow: '0px 4px 12px var(--el-shadow-1)',
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
                    <XAxis dataKey="hour" tick={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        ...Fb, fontSize: 13, borderRadius: 8, border: `0.8px solid ${C.border}`,
                        boxShadow: '0px 4px 12px var(--el-shadow-1)',
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
                      border: '0.8px solid rgba(var(--el-white-rgb, 255, 255, 255), 0.15)',
                      borderRadius: 10, padding: '0 16px',
                      ...Fb, fontWeight: 400, fontSize: 14,
                      color: C.white, background: 'rgba(var(--el-white-rgb, 255, 255, 255), 0.08)',
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

        {/* Common Footer */}
        <Footer />
      </div>
    </>
  );
}
