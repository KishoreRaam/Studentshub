// Events Page - Redesigned to match Figma prototype
// Sections: Hero, Featured Event, Explore by Category, Happening This Week,
// Host Events CTA, Effortless Event Publishing, Track What Works, Never Miss an Event

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import Papa from 'papaparse';
import {
  Search,
  Calendar,
  MapPin,
  Clock,
  Users,
  Loader2,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Bookmark,
  Star,
  Zap,
  BarChart3,
  Bell,
  CheckCircle2,
  TrendingUp,
  Eye,
  MousePointerClick,
  Mail,
} from 'lucide-react';
import { Event, EventCategory, StudentStream } from '@/types/event';
import { useSavedItems } from '@/hooks/useSavedItems';
import { DetailedEventCard } from '@/components/DetailedEventCard';
import './Events.css';

// ─── Category Data ────────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    title: 'Tech Events',
    count: '12 upcoming',
    gradient: 'linear-gradient(135deg, #1a56db 0%, #3b82f6 100%)',
    shadowColor: 'rgba(26,86,219,0.3)',
    borderColor: '#1a56db',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    events: [
      { name: 'National Hackathon 2026', detail: 'Feb 20 · Anna University' },
      { name: 'AI/ML Summit', detail: 'Feb 25 · IIT Madras' },
      { name: 'Cloud Computing Workshop', detail: 'Mar 1 · VIT Chennai' },
    ],
    buttonLabel: 'View All Tech Events',
  },
  {
    title: 'Cultural Events',
    count: '8 upcoming',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
    shadowColor: 'rgba(245,158,11,0.3)',
    borderColor: '#d97706',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    ),
    events: [
      { name: 'Sangamam Cultural Fest', detail: 'Feb 22 · Loyola College' },
      { name: 'Classical Dance Night', detail: 'Feb 28 · Stella Maris' },
      { name: 'Battle of Bands', detail: 'Mar 5 · SRM University' },
    ],
    buttonLabel: 'View All Cultural Events',
  },
  {
    title: 'Sports Events',
    count: '6 upcoming',
    gradient: 'linear-gradient(135deg, #9333ea 0%, #c026d3 100%)',
    shadowColor: 'rgba(147,51,234,0.3)',
    borderColor: '#9333ea',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" />
      </svg>
    ),
    events: [
      { name: 'Inter-College Cricket', detail: 'Feb 21 · MCC Chennai' },
      { name: 'Marathon 2026', detail: 'Mar 2 · Marina Beach' },
      { name: 'Basketball Tournament', detail: 'Mar 8 · SSN College' },
    ],
    buttonLabel: 'View All Sports Events',
  },
  {
    title: 'Workshops',
    count: '15 upcoming',
    gradient: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
    shadowColor: 'rgba(16,185,129,0.3)',
    borderColor: '#10b981',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    events: [
      { name: 'UI/UX Design Workshop', detail: 'Feb 19 · Anna University' },
      { name: 'Full Stack Bootcamp', detail: 'Feb 24 · SRM University' },
      { name: 'Data Science Intro', detail: 'Mar 3 · IIT Madras' },
    ],
    buttonLabel: 'View All Workshops',
  },
];

// ─── Hero Floating Cards ──────────────────────────────────────────────────────
const FLOATING_CARDS = [
  { title: 'Hackathon 2026', date: 'Feb 20', gradient: 'linear-gradient(140deg, #1a56db 0%, #3b82f6 100%)', left: '4%', top: '15%', opacity: 0.5 },
  { title: 'Cultural Night', date: 'Feb 22', gradient: 'linear-gradient(140deg, #f59e0b 0%, #f97316 100%)', left: '2%', top: '55%', opacity: 0.55 },
  { title: 'AI Workshop', date: 'Feb 25', gradient: 'linear-gradient(140deg, #10b981 0%, #14b8a6 100%)', right: '4%', top: '20%', opacity: 0.6 },
  { title: 'Sports Meet', date: 'Mar 1', gradient: 'linear-gradient(140deg, #9333ea 0%, #c026d3 100%)', right: '2%', top: '58%', opacity: 0.65 },
  { title: 'Web Dev Bootcamp', date: 'Feb 28', gradient: 'linear-gradient(140deg, #6366f1 0%, #8b5cf6 100%)', left: '8%', top: '80%', opacity: 0.7 },
];

// ─── Week Timeline Data ───────────────────────────────────────────────────────
const WEEK_TIMELINE = [
  {
    day: 'THU', date: 12, isToday: true,
    events: [
      { time: '10:00 AM', title: 'React Native Crash Course', venue: 'IIT Madras · Online' },
      { time: '3:00 PM', title: 'Photography Contest', venue: 'Loyola College · Auditorium' },
    ],
  },
  {
    day: 'FRI', date: 13, isToday: false,
    events: [
      { time: '9:00 AM', title: 'Data Science Hackathon Day 1', venue: 'Anna University · CEG Campus' },
    ],
  },
  {
    day: 'SAT', date: 14, isToday: false,
    events: [
      { time: '11:00 AM', title: 'Sangamam Cultural Fest', venue: 'SRM University · Main Stage' },
      { time: '2:00 PM', title: 'Robotics Workshop', venue: 'VIT Chennai · Lab Block' },
      { time: '6:00 PM', title: 'Open Mic Night', venue: 'MCC Chennai · Quadrangle' },
    ],
  },
  {
    day: 'SUN', date: 15, isToday: false,
    events: [
      { time: '8:00 AM', title: 'Marathon 2026', venue: 'Marina Beach · Start Line' },
      { time: '4:00 PM', title: 'Startup Pitch Competition', venue: 'IIT Madras · IC&SR Hall' },
    ],
  },
  {
    day: 'MON', date: 16, isToday: false,
    events: [
      { time: '10:00 AM', title: 'Cloud Computing Workshop', venue: 'Anna University · Online' },
      { time: '2:00 PM', title: 'Resume Building Session', venue: 'SRM University · Placement Cell' },
    ],
  },
  {
    day: 'TUE', date: 17, isToday: false,
    events: [
      { time: '11:00 AM', title: 'UI/UX Design Masterclass', venue: 'VIT Chennai · Design Lab' },
    ],
  },
  {
    day: 'WED', date: 18, isToday: false,
    events: [
      { time: '9:00 AM', title: 'Blockchain 101 Webinar', venue: 'Online · Zoom' },
      { time: '5:00 PM', title: 'Inter-College Cricket Final', venue: 'MCC Chennai · Sports Ground' },
    ],
  },
];

// ─── Happening This Week Event Grid Data ──────────────────────────────────────
const HAPPENING_EVENTS = [
  {
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop',
    category: 'Workshop',
    catColor: '#1a56db',
    catBg: '#ebf2ff',
    title: 'AI/ML Workshop: Build Your First Model',
    date: 'Feb 15, 2026',
    time: '10:00 AM - 4:00 PM',
    location: 'Anna University, Chennai',
    registered: '340+ registered',
    featured: true,
  },
  {
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=250&fit=crop',
    category: 'Cultural',
    catColor: '#d97706',
    catBg: '#fef3c7',
    title: 'Sangamam Cultural Fest 2026',
    date: 'Feb 16, 2026',
    time: '9:00 AM - 9:00 PM',
    location: 'SRM University, Kattankulathur',
    registered: '520+ registered',
    featured: false,
  },
  {
    image: 'https://images.unsplash.com/photo-1461896836934-bd45ba6ba73f?w=400&h=250&fit=crop',
    category: 'Sports',
    catColor: '#9333ea',
    catBg: '#f3e8ff',
    title: 'Inter-College Basketball Tournament',
    date: 'Feb 17, 2026',
    time: '8:00 AM - 6:00 PM',
    location: 'MCC, Chennai',
    registered: '180+ registered',
    featured: false,
  },
  {
    image: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&h=250&fit=crop',
    category: 'Bootcamp',
    catColor: '#10b981',
    catBg: '#ecfdf5',
    title: 'Full-Stack Development Bootcamp',
    date: 'Feb 18, 2026',
    time: '9:00 AM - 5:00 PM',
    location: 'IIT Madras, Chennai',
    registered: '290+ registered',
    featured: false,
  },
  {
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=250&fit=crop',
    category: 'Webinar',
    catColor: '#1a56db',
    catBg: '#ebf2ff',
    title: 'Startup Funding 101 Webinar',
    date: 'Feb 19, 2026',
    time: '3:00 PM - 5:00 PM',
    location: 'Online · Zoom',
    registered: '215+ registered',
    featured: false,
  },
  {
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop',
    category: 'Workshop',
    catColor: '#1a56db',
    catBg: '#ebf2ff',
    title: 'Cloud Computing & DevOps Workshop',
    date: 'Feb 20, 2026',
    time: '10:00 AM - 3:00 PM',
    location: 'VIT Chennai',
    registered: '195+ registered',
    featured: false,
  },
];

// ─── Publishing Features ──────────────────────────────────────────────────────
const PUBLISHING_FEATURES = [
  {
    icon: <Zap className="w-6 h-6 text-white" />,
    iconBg: 'bg-blue-600',
    title: 'Quick Event Setup',
    description: 'Create and publish events in under 2 minutes with our intuitive form builder.',
  },
  {
    icon: <Users className="w-6 h-6 text-white" />,
    iconBg: 'bg-emerald-500',
    title: 'Smart Audience Targeting',
    description: 'Reach the right students based on their interests, department, and campus.',
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-white" />,
    iconBg: 'bg-purple-600',
    title: 'Real-time Analytics',
    description: 'Track registrations, views, and engagement with a live dashboard.',
  },
  {
    icon: <Bell className="w-6 h-6 text-white" />,
    iconBg: 'bg-amber-500',
    title: 'Automated Reminders',
    description: 'Send email and push reminders so attendees never miss your event.',
  },
];

// ─── Analytics Data ───────────────────────────────────────────────────────────
const COLLEGE_STATS = [
  { name: 'Anna University', count: 450, max: 450 },
  { name: 'IIT Madras', count: 380, max: 450 },
  { name: 'VIT Chennai', count: 320, max: 450 },
  { name: 'SRM University', count: 270, max: 450 },
  { name: 'Loyola College', count: 220, max: 450 },
  { name: 'MCC Chennai', count: 180, max: 450 },
];

export default function Events() {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const { isSaved, toggleSave, isSaving } = useSavedItems('event');

  // Load events from CSV
  useEffect(() => {
    Papa.parse('/assets/student_events_2024_2025.csv', {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedEvents: Event[] = results.data.map((row: any) => {
          const eventId = row.id || `evt_${Math.random().toString(36).substr(2, 9)}`;
          const streams = row.streams ? row.streams.split(',').map((s: string) => s.trim() as StudentStream) : ['All'];
          const tags = row.tags ? row.tags.split(',').map((t: string) => t.trim()) : [];
          let status: Event['status'] = 'Upcoming';
          if (row.status === 'live') status = 'Live Now';
          else if (row.status === 'registration-open') status = 'Registration Open';
          else if (row.status === 'upcoming') status = 'Upcoming';
          else if (row.status === 'completed') status = 'Completed';
          else if (row.status === 'registration-closed') status = 'Registration Closed';

          return {
            id: eventId,
            title: row.title || 'Untitled Event',
            description: row.description || '',
            category: (row.category?.charAt(0).toUpperCase() + row.category?.slice(1)) as EventCategory || 'Webinar',
            date: row.date || new Date().toISOString(),
            time: row.time || '12:00 PM',
            duration: row.duration || '2 hours',
            organizer: row.organizerName || 'Unknown Organizer',
            organizerLogo: row.organizerAvatar || '',
            organizerWebsite: row.organizerOrganization || '',
            participantCount: parseInt(row.participants) || 0,
            maxParticipants: parseInt(row.maxParticipants) || undefined,
            streams,
            registrationLink: row.registrationLink || '',
            thumbnailUrl: row.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=450',
            status,
            isPopular: row.participants && parseInt(row.participants) > 1000,
            isFeatured: row.isFeatured === 'TRUE',
            location: row.location === 'online' ? 'Online' : row.location === 'in-person' ? row.venue : row.location,
            platform: row.location === 'online' ? 'Virtual Platform' : 'In-person',
            prerequisites: row.prerequisites ? row.prerequisites.split('|') : undefined,
            tags,
            requirements: ['Valid student email or ID', 'Currently enrolled in an educational institution'],
            agenda: [],
            speakers: [],
            benefits: [],
            recordingUrl: row.recordingLink || undefined,
            certificateOffered: row.certificateOffered === 'TRUE',
            isPaid: false,
          };
        });
        setAllEvents(parsedEvents);
        setIsLoading(false);
      },
      error: () => setIsLoading(false),
    });
  }, []);

  const featuredEvent = useMemo(() => allEvents.find((e) => e.isFeatured) || allEvents[0], [allEvents]);

  return (
    <div className="events-page-v2 bg-white">
      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 1: HERO
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="events-hero relative overflow-hidden" style={{ minHeight: 900, background: 'linear-gradient(180deg, #f9fafb 0%, #eff6ff 100%)' }}>
        {/* Background blurs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute rounded-full" style={{ width: 300, height: 300, left: '15%', top: 90, background: '#1a56db', opacity: 0.07, filter: 'blur(80px)' }} />
          <div className="absolute" style={{ width: 250, height: 250, right: '12%', top: 540, background: '#9333ea', opacity: 0.06, filter: 'blur(80px)', borderRadius: 40 }} />
          <div className="absolute rounded-full" style={{ width: 200, height: 200, left: '40%', top: 565, background: '#10b981', opacity: 0.05, filter: 'blur(80px)' }} />
          <div className="absolute" style={{ width: 180, height: 180, right: '8%', top: 270, background: '#f59e0b', opacity: 0.08, filter: 'blur(80px)', borderRadius: 30 }} />
        </div>

        {/* Floating event cards (decorative) */}
        <div className="absolute inset-0 pointer-events-none hidden lg:block" style={{ top: 30 }}>
          {FLOATING_CARDS.map((card, i) => (
            <motion.div
              key={i}
              className="absolute rounded-2xl shadow-[0px_20px_40px_rgba(0,0,0,0.08)]"
              style={{
                width: 200,
                left: card.left,
                right: card.right,
                top: card.top,
                opacity: card.opacity,
                background: 'rgba(255,255,255,0.6)',
                border: '0.8px solid rgba(229,231,235,0.5)',
              }}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="p-4">
                <div className="rounded-xl h-[140px] mb-3" style={{ background: card.gradient }} />
                <p className="font-semibold text-sm text-[#0a0a0a] font-['DM_Sans',sans-serif]">{card.title}</p>
                <span className="inline-block mt-1.5 bg-[#ebf2ff] rounded-lg px-2 py-0.5 text-[11px] font-bold text-[#1a56db] font-['JetBrains_Mono',monospace]">
                  {card.date}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Center content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6" style={{ paddingTop: 220 }}>
          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white rounded-full px-5 py-1.5 shadow-[0px_4px_12px_rgba(0,0,0,0.06)] border border-gray-200 mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[13px] font-medium text-[#1a56db] font-['DM_Sans',sans-serif]">LIVE EVENTS PLATFORM</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-['Playfair_Display',serif] font-bold text-[#0a0a0a] leading-tight mb-6"
            style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}
          >
            Discover What's<br />Happening Near You
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#374151] text-lg md:text-xl max-w-xl mx-auto mb-10 font-['DM_Sans',sans-serif]"
          >
            Find hackathons, workshops, cultural fests, and more — all in one place. Never miss a campus moment.
          </motion.p>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full max-w-2xl mx-auto mb-8"
          >
            <div className="flex items-center bg-white rounded-2xl shadow-[0px_8px_32px_rgba(0,0,0,0.08)] border border-gray-200 p-2">
              <Search className="w-5 h-5 text-gray-400 ml-4 shrink-0" />
              <input
                type="text"
                placeholder="Search events, hackathons, workshops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-3 text-base bg-transparent border-none outline-none text-gray-900 placeholder:text-gray-400 font-['DM_Sans',sans-serif]"
              />
              <button className="bg-[#1a56db] text-white rounded-xl px-6 py-3 text-sm font-medium hover:bg-blue-700 transition-colors shrink-0 font-['DM_Sans',sans-serif]">
                Search Events
              </button>
            </div>
          </motion.div>

          {/* Quick filter chips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {['Hackathons', 'Workshops', 'Cultural Fests', 'Webinars', 'Sports'].map((chip) => (
              <button
                key={chip}
                className="bg-white border border-gray-200 rounded-full px-5 py-2 text-sm text-[#374151] hover:border-[#1a56db] hover:text-[#1a56db] transition-all shadow-sm font-['DM_Sans',sans-serif] font-medium"
              >
                {chip}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 2: FEATURED EVENT SPOTLIGHT
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-[1136px] mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Star className="w-5 h-5 text-[#1a56db]" />
            <h2 className="font-['DM_Sans',sans-serif] font-semibold text-[#374151] text-sm tracking-wide uppercase">Featured Event</h2>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
          ) : featuredEvent ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-3xl border border-gray-200 shadow-[0px_20px_60px_rgba(0,0,0,0.08)] overflow-hidden"
            >
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/2 relative overflow-hidden">
                  <img
                    src={featuredEvent.thumbnailUrl}
                    alt={featuredEvent.title}
                    className="w-full h-64 lg:h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-[#1a56db] text-white rounded-lg px-3 py-1 text-xs font-bold font-['JetBrains_Mono',monospace] flex items-center gap-1.5">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
                    </span>
                    Registration Open
                  </div>
                </div>
                <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-sm">
                      {featuredEvent.organizer?.charAt(0) || 'E'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#0a0a0a] font-['DM_Sans',sans-serif]">{featuredEvent.organizer}</p>
                      <p className="text-xs text-[#6b7280] font-['DM_Sans',sans-serif]">Event Organizer</p>
                    </div>
                  </div>
                  <h3 className="font-['Playfair_Display',serif] font-bold text-2xl lg:text-3xl text-[#0a0a0a] mb-4 leading-tight">
                    {featuredEvent.title}
                  </h3>
                  <p className="text-[#6b7280] text-base mb-6 font-['DM_Sans',sans-serif] line-clamp-2">
                    {featuredEvent.description}
                  </p>
                  <div className="flex flex-wrap gap-4 mb-8 text-sm text-[#374151] font-['DM_Sans',sans-serif]">
                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-[#1a56db]" />{new Date(featuredEvent.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#1a56db]" />{featuredEvent.time}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-[#1a56db]" />{featuredEvent.location}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setSelectedEvent(featuredEvent)}
                      className="bg-[#1a56db] text-white rounded-xl px-8 py-3 text-sm font-medium hover:bg-blue-700 transition-colors font-['DM_Sans',sans-serif]"
                    >
                      View Details & Register
                    </button>
                    <button className="border border-gray-200 rounded-xl p-3 hover:bg-gray-50 transition-colors">
                      <Bookmark className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 3: EXPLORE BY CATEGORY
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6" style={{ background: '#f9fafb' }}>
        <div className="max-w-[1136px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-['Playfair_Display',serif] font-bold text-[42px] text-[#0a0a0a] mb-4">
              Explore by Category
            </h2>
            <p className="text-[#374151] text-lg max-w-lg mx-auto font-['DM_Sans',sans-serif]">
              From tech marathons to cultural nights — there's something for everyone.
            </p>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-4 pl-12 scrollbar-thin">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-[20px] border border-gray-200 shadow-[0px_10px_30px_rgba(0,0,0,0.08)] shrink-0 flex flex-col"
                style={{ width: 380, minHeight: 508 }}
              >
                <div className="p-8 flex-1">
                  {/* Icon */}
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-8"
                    style={{ background: cat.gradient, boxShadow: `0px 8px 16px ${cat.shadowColor}` }}
                  >
                    {cat.icon}
                  </div>
                  {/* Title */}
                  <h3 className="font-['DM_Sans',sans-serif] font-bold text-2xl text-[#0a0a0a] mb-1">{cat.title}</h3>
                  <p className="text-[#6b7280] text-[13px] font-medium font-['DM_Sans',sans-serif] mb-8">{cat.count}</p>

                  {/* Event list */}
                  <div className="space-y-0">
                    {cat.events.map((evt, j) => (
                      <div key={j} className={`py-3 ${j < cat.events.length - 1 ? 'border-b border-gray-200' : ''}`}>
                        <p className="text-sm font-medium text-[#374151] font-['DM_Sans',sans-serif]">{evt.name}</p>
                        <p className="text-xs text-[#6b7280] font-['DM_Sans',sans-serif] mt-1">{evt.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Button */}
                <div className="px-8 pb-8">
                  <button
                    className="w-full h-11 rounded-[10px] border text-sm font-medium flex items-center justify-center gap-2 transition-colors font-['DM_Sans',sans-serif]"
                    style={{ borderColor: cat.borderColor, color: cat.borderColor }}
                  >
                    {cat.buttonLabel} <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 4: HAPPENING THIS WEEK (Event Grid)
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-[1136px] mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-['Playfair_Display',serif] font-bold text-4xl text-[#0a0a0a]">
              Happening This Week
            </h2>
            <button className="text-[#1a56db] text-sm font-medium flex items-center gap-1 hover:underline font-['DM_Sans',sans-serif]">
              View calendar <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Timeline */}
          <div className="space-y-0">
            {WEEK_TIMELINE.map((day, dayIdx) => (
              <div key={dayIdx} className="flex gap-10">
                {/* Date circle with connector line */}
                <div className="flex flex-col items-center shrink-0" style={{ width: 60 }}>
                  <div
                    className={`w-[60px] h-[60px] rounded-full flex flex-col items-center justify-center relative ${
                      day.isToday
                        ? 'bg-white border-2 border-[#1a56db] shadow-[0px_0px_0px_6px_rgba(26,86,219,0.15)]'
                        : 'bg-white border-2 border-gray-200'
                    }`}
                  >
                    <span className="text-[11px] font-semibold text-[#6b7280] font-['DM_Sans',sans-serif]">{day.day}</span>
                    <span className="text-xl font-bold text-[#0a0a0a] font-['DM_Sans',sans-serif]">{day.date}</span>
                  </div>
                  {dayIdx < WEEK_TIMELINE.length - 1 && (
                    <div className="w-0.5 bg-gray-200 flex-1 min-h-[137px]" />
                  )}
                </div>

                {/* Event cards for this day */}
                <div className="flex gap-4 overflow-x-auto pb-8 flex-1 min-w-0">
                  {day.events.map((evt, evtIdx) => (
                    <div
                      key={evtIdx}
                      className="bg-white rounded-xl border border-gray-200 shrink-0 p-5 flex flex-col"
                      style={{
                        width: 280,
                        minHeight: 165,
                        boxShadow: day.isToday
                          ? '0px 4px 20px rgba(26,86,219,0.1)'
                          : '0px 2px 8px rgba(0,0,0,0.04)',
                      }}
                    >
                      <p className="text-xs font-medium text-[#1a56db] font-['JetBrains_Mono',monospace] mb-4">{evt.time}</p>
                      <h4 className="text-[15px] font-semibold text-[#0a0a0a] font-['DM_Sans',sans-serif] mb-2">{evt.title}</h4>
                      <p className="text-xs text-[#6b7280] font-['DM_Sans',sans-serif] mb-4">{evt.venue}</p>
                      <div className="mt-auto">
                        <button className="border border-gray-200 rounded-lg px-4 py-1.5 text-xs font-medium text-[#1a56db] hover:bg-blue-50 transition-colors font-['DM_Sans',sans-serif]">
                          Register
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 5: EVENT GRID (Happening Events Cards)
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6" style={{ background: 'linear-gradient(125deg, #ebf2ff 0%, #ecfdf5 100%)' }}>
        <div className="max-w-[1136px] mx-auto">
          {/* Tab bar */}
          <div className="flex items-center gap-1 mb-8 bg-gray-100 rounded-xl p-1 w-fit">
            {['All Events', 'Workshops', 'Hackathons', 'Cultural', 'Sports', 'Webinars'].map((tab, i) => (
              <button
                key={tab}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all font-['DM_Sans',sans-serif] ${
                  i === 0 ? 'bg-white text-[#0a0a0a] shadow-sm' : 'text-[#6b7280] hover:text-[#374151]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Event grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {HAPPENING_EVENTS.map((evt, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-white rounded-2xl border border-gray-200 shadow-[0px_4px_20px_rgba(0,0,0,0.06)] overflow-hidden group hover:shadow-[0px_10px_30px_rgba(0,0,0,0.1)] transition-shadow"
              >
                <div className="relative overflow-hidden">
                  <img src={evt.image} alt={evt.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                  {evt.featured && (
                    <div className="absolute top-3 left-3 bg-[#1a56db] text-white rounded-md px-2.5 py-1 text-[11px] font-bold font-['JetBrains_Mono',monospace]">
                      FEATURED
                    </div>
                  )}
                  <button className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg p-2 hover:bg-white transition-colors">
                    <Bookmark className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                <div className="p-5">
                  <span
                    className="inline-block text-[11px] font-bold rounded-md px-2.5 py-1 mb-3 font-['JetBrains_Mono',monospace]"
                    style={{ background: evt.catBg, color: evt.catColor }}
                  >
                    {evt.category}
                  </span>
                  <h3 className="font-['DM_Sans',sans-serif] font-semibold text-base text-[#0a0a0a] mb-3">{evt.title}</h3>
                  <div className="space-y-2 text-[13px] text-[#6b7280] font-['DM_Sans',sans-serif]">
                    <p className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-[#1a56db]" />{evt.date}</p>
                    <p className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-[#1a56db]" />{evt.time}</p>
                    <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-[#1a56db]" />{evt.location}</p>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded-full bg-[#1a56db] border-2 border-white" />
                        <div className="w-6 h-6 rounded-full bg-[#10b981] border-2 border-white" />
                        <div className="w-6 h-6 rounded-full bg-[#f59e0b] border-2 border-white" />
                      </div>
                      <span className="text-xs text-[#6b7280] font-medium font-['DM_Sans',sans-serif]">{evt.registered}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2">
            <button className="w-9 h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50">
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                className={`w-9 h-9 rounded-lg text-sm font-medium font-['DM_Sans',sans-serif] ${
                  n === currentPage ? 'bg-[#1a56db] text-white' : 'bg-white border border-gray-200 text-[#374151] hover:bg-gray-50'
                }`}
                onClick={() => setCurrentPage(n)}
              >
                {n}
              </button>
            ))}
            <span className="text-sm text-[#6b7280] font-['DM_Sans',sans-serif]">...</span>
            <button className="w-9 h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50">
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 6: HOST EVENTS CTA BANNER
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1a56db 50%, #3b82f6 100%)' }}>
        <div className="max-w-[1136px] mx-auto px-6 py-20 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-white">
              <h2 className="font-['Playfair_Display',serif] font-bold text-4xl lg:text-5xl mb-6 leading-tight">
                Host Events. Reach 50,000+ Students.
              </h2>
              <p className="text-blue-100 text-lg mb-8 font-['DM_Sans',sans-serif] max-w-lg">
                Whether you're a student club, department, or organization — publish your event and connect with students across 100+ colleges.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-white text-[#1a56db] rounded-xl px-8 py-3.5 text-sm font-semibold hover:bg-blue-50 transition-colors font-['DM_Sans',sans-serif]">
                  Start Publishing — Free
                </button>
                <button className="border border-white/30 text-white rounded-xl px-8 py-3.5 text-sm font-medium hover:bg-white/10 transition-colors font-['DM_Sans',sans-serif]">
                  See How It Works
                </button>
              </div>
            </div>
            <div className="flex-1 relative">
              <img
                src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&h=400&fit=crop"
                alt="Students at event"
                className="rounded-2xl shadow-2xl w-full max-w-md mx-auto"
              />
              {/* Stats overlay */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-[#1a56db]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0a0a0a] font-['DM_Sans',sans-serif]">2,400+</p>
                  <p className="text-xs text-[#6b7280] font-['DM_Sans',sans-serif]">Events Published</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 7: EFFORTLESS EVENT PUBLISHING
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-[1136px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-['Playfair_Display',serif] font-bold text-4xl text-[#0a0a0a] mb-4">
              Effortless Event Publishing
            </h2>
            <p className="text-[#374151] text-lg max-w-xl mx-auto font-['DM_Sans',sans-serif]">
              Everything you need to create, promote, and manage successful campus events.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PUBLISHING_FEATURES.map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-[0px_10px_30px_rgba(0,0,0,0.08)] transition-shadow"
              >
                <div className={`w-12 h-12 rounded-xl ${feat.iconBg} flex items-center justify-center mb-5`}>
                  {feat.icon}
                </div>
                <h3 className="font-['DM_Sans',sans-serif] font-semibold text-lg text-[#0a0a0a] mb-2">{feat.title}</h3>
                <p className="text-[#6b7280] text-sm font-['DM_Sans',sans-serif] leading-relaxed">{feat.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Mock dashboard preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-12 bg-white rounded-2xl border border-gray-200 shadow-[0px_10px_40px_rgba(0,0,0,0.06)] overflow-hidden"
          >
            {/* Dashboard header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="bg-gray-100 rounded-lg px-4 py-1.5 text-xs text-gray-500 font-['DM_Sans',sans-serif]">
                events.studentperks.com/dashboard
              </div>
              <div className="w-20" />
            </div>
            {/* Dashboard content */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                  { label: 'Total Events', value: '24', change: '+3 this month', icon: <Calendar className="w-5 h-5 text-[#1a56db]" /> },
                  { label: 'Total Registrations', value: '3,842', change: '+18% vs last month', icon: <Users className="w-5 h-5 text-emerald-500" /> },
                  { label: 'Page Views', value: '12,450', change: '+24% vs last month', icon: <Eye className="w-5 h-5 text-purple-500" /> },
                  { label: 'Click-through Rate', value: '8.2%', change: '+2.1% vs last month', icon: <MousePointerClick className="w-5 h-5 text-amber-500" /> },
                ].map((stat, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-[#6b7280] font-medium font-['DM_Sans',sans-serif]">{stat.label}</span>
                      {stat.icon}
                    </div>
                    <p className="text-2xl font-bold text-[#0a0a0a] font-['DM_Sans',sans-serif] mb-1">{stat.value}</p>
                    <p className="text-xs text-emerald-500 font-medium font-['DM_Sans',sans-serif]">{stat.change}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 8: TRACK WHAT WORKS (Analytics)
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6" style={{ background: '#f9fafb' }}>
        <div className="max-w-[1136px] mx-auto">
          <div className="mb-12">
            <h2 className="font-['Playfair_Display',serif] font-bold text-4xl text-[#0a0a0a] mb-4">
              Track What Works
            </h2>
            <p className="text-[#374151] text-lg max-w-xl font-['DM_Sans',sans-serif]">
              Understand your audience with real-time analytics and actionable insights.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Colleges by Registration */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl border border-gray-200 p-8 shadow-[0px_4px_20px_rgba(0,0,0,0.04)]"
            >
              <h3 className="font-['DM_Sans',sans-serif] font-semibold text-base text-[#0a0a0a] mb-6">
                Top Colleges by Registration
              </h3>
              <div className="space-y-4">
                {COLLEGE_STATS.map((college, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[13px] font-medium text-[#374151] font-['DM_Sans',sans-serif]">{college.name}</span>
                      <span className="text-[13px] font-bold text-[#0a0a0a] font-['JetBrains_Mono',monospace]">{college.count}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(college.count / college.max) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        className="h-full rounded-full bg-gradient-to-r from-[#1a56db] to-[#3b82f6]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Peak Registration Hours */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl border border-gray-200 p-8 shadow-[0px_4px_20px_rgba(0,0,0,0.04)]"
            >
              <h3 className="font-['DM_Sans',sans-serif] font-semibold text-base text-[#0a0a0a] mb-6">
                Peak Registration Hours
              </h3>
              {/* Chart visualization */}
              <div className="flex items-end gap-2 h-48">
                {[
                  { label: '6am', height: 15 },
                  { label: '8am', height: 25 },
                  { label: '10am', height: 55 },
                  { label: '12pm', height: 70 },
                  { label: '2pm', height: 45 },
                  { label: '4pm', height: 35 },
                  { label: '6pm', height: 85 },
                  { label: '8pm', height: 60 },
                  { label: '10pm', height: 30 },
                ].map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <motion.div
                      initial={{ height: 0 }}
                      whileInView={{ height: `${bar.height}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: i * 0.05 }}
                      className="w-full rounded-t-md bg-gradient-to-t from-[#1a56db] to-[#3b82f6]"
                      style={{ minHeight: 4 }}
                    />
                    <span className="text-[11px] text-[#6b7280] font-['DM_Sans',sans-serif]">{bar.label}</span>
                  </div>
                ))}
              </div>
              {/* Trend line description */}
              <div className="mt-6 flex items-center gap-4 text-xs text-[#6b7280] font-['DM_Sans',sans-serif]">
                <span className="flex items-center gap-1.5">
                  <div className="w-3 h-0.5 bg-gradient-to-r from-[#1a56db] to-[#3b82f6] rounded" />
                  This Week
                </span>
                <span className="flex items-center gap-1.5">
                  <div className="w-3 h-0.5 bg-gray-300 rounded" />
                  Last Week
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 9: NEVER MISS AN EVENT AGAIN (CTA Footer)
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1a56db 50%, #3b82f6 100%)' }}>
        <div className="max-w-[1136px] mx-auto px-6 py-24 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-['Playfair_Display',serif] font-bold text-4xl lg:text-5xl text-white mb-6">
              Never Miss an Event Again
            </h2>
            <p className="text-blue-100 text-lg max-w-xl mx-auto mb-10 font-['DM_Sans',sans-serif]">
              Get personalized event recommendations, reminders, and exclusive early access — all delivered to your inbox.
            </p>

            {/* Email signup */}
            <div className="flex flex-col sm:flex-row items-center gap-3 max-w-lg mx-auto mb-8">
              <div className="flex items-center bg-white/10 border border-white/20 rounded-xl flex-1 w-full px-4">
                <Mail className="w-5 h-5 text-white/50 shrink-0" />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-3 py-3.5 bg-transparent text-white placeholder:text-white/50 outline-none text-sm font-['DM_Sans',sans-serif]"
                />
              </div>
              <button className="bg-white text-[#1a56db] rounded-xl px-8 py-3.5 text-sm font-semibold hover:bg-blue-50 transition-colors font-['DM_Sans',sans-serif] w-full sm:w-auto whitespace-nowrap">
                Get Notified
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-6 text-white/70 text-sm font-['DM_Sans',sans-serif]">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Free forever
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> No spam, ever
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Unsubscribe anytime
              </span>
            </div>
          </motion.div>
        </div>
        {/* Decorative circles */}
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-white/5 rounded-full translate-y-1/2" />
      </section>

      {/* Detailed Event Modal */}
      <DetailedEventCard
        event={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onSaveChange={() => {}}
      />
    </div>
  );
}
