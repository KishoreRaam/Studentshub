import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "motion/react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Globe,
  Bookmark,
  ArrowRight,
  Users,
} from "lucide-react";

import { databases, DATABASE_ID, COLLECTIONS, eventMediaBucket } from "../../lib/appwrite";
import { Query } from "appwrite";

/* ═══════════════════════ Types ═══════════════════════ */

interface EventItem {
  id: string;
  title: string;
  category: "Hackathon" | "Workshop" | "Sports" | "Webinar" | "Competition" | "Cultural";
  dateShort: string;
  location: string;
  isOnline: boolean;
  description: string;
  spotsLeft: number;
  image: string;
  bookmarked: boolean;
}

/* ═══════════════════ Category Colors ═════════════════ */

const CAT_COLORS: Record<string, { bg: string; text: string; darkBg: string; darkText: string }> = {
  Hackathon: { bg: "bg-[#DBEAFE]", text: "text-[#1447E6]", darkBg: "dark:bg-blue-900/40", darkText: "dark:text-blue-300" },
  Workshop: { bg: "bg-[#D0FAE5]", text: "text-[#007A55]", darkBg: "dark:bg-emerald-900/40", darkText: "dark:text-emerald-300" },
  Sports: { bg: "bg-[#FFE4E6]", text: "text-[#C70036]", darkBg: "dark:bg-rose-900/40", darkText: "dark:text-rose-300" },
  Webinar: { bg: "bg-[#CEFAFE]", text: "text-[#007595]", darkBg: "dark:bg-cyan-900/40", darkText: "dark:text-cyan-300" },
  Competition: { bg: "bg-purple-100", text: "text-purple-700", darkBg: "dark:bg-purple-900/40", darkText: "dark:text-purple-300" },
  Cultural: { bg: "bg-amber-100", text: "text-amber-700", darkBg: "dark:bg-amber-900/40", darkText: "dark:text-amber-300" },
};

/* ═══════════════════ Sample Data ═════════════════════ */

const EVENTS: EventItem[] = [
  {
    id: "1",
    title: "National Hackathon 2026",
    category: "Hackathon",
    dateShort: "Feb 28",
    location: "Anna University, Chennai",
    isOnline: false,
    description: "48-hour coding marathon with ₹5L prize pool and industry mentors.",
    spotsLeft: 34,
    image: "https://images.unsplash.com/photo-1561089489-f13d5e730d72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=720&q=80",
    bookmarked: false,
  },
  {
    id: "2",
    title: "AI/ML Workshop: Build Your First Model",
    category: "Workshop",
    dateShort: "Mar 3",
    location: "IIT Madras",
    isOnline: false,
    description: "Hands-on workshop covering neural networks, TensorFlow & real-world datasets.",
    spotsLeft: 18,
    image: "https://images.unsplash.com/photo-1762158007836-25d13ab34c1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=720&q=80",
    bookmarked: true,
  },
  {
    id: "3",
    title: "Inter-College Basketball Tournament",
    category: "Sports",
    dateShort: "Mar 8",
    location: "SSN College, Chennai",
    isOnline: false,
    description: "Annual inter-college tournament featuring 32 teams across south India.",
    spotsLeft: 56,
    image: "https://images.unsplash.com/photo-1764535792393-6c1d37a3f422?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=720&q=80",
    bookmarked: false,
  },
  {
    id: "4",
    title: "Startup Funding 101 Webinar",
    category: "Webinar",
    dateShort: "Mar 12",
    location: "Online",
    isOnline: true,
    description: "Learn from VCs and angel investors about pitching, term sheets & valuation.",
    spotsLeft: 120,
    image: "https://images.unsplash.com/photo-1757876598533-749f56cd1c66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=720&q=80",
    bookmarked: false,
  },
  {
    id: "5",
    title: "Sangamam Cultural Fest 2026",
    category: "Cultural",
    dateShort: "Mar 15",
    location: "Loyola College",
    isOnline: false,
    description: "3-day cultural extravaganza with dance, music, drama & art competitions.",
    spotsLeft: 200,
    image: "https://images.unsplash.com/photo-1767979349910-655bdc4e2f4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=720&q=80",
    bookmarked: false,
  },
  {
    id: "6",
    title: "RoboWars: Engineering Competition",
    category: "Competition",
    dateShort: "Mar 20",
    location: "VIT Chennai",
    isOnline: false,
    description: "Build combat robots and compete for the ultimate engineering bragging rights.",
    spotsLeft: 12,
    image: "https://images.unsplash.com/photo-1768796370407-6d36619e7d6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=720&q=80",
    bookmarked: false,
  },
];

/* ═══════════════════ Constants ═══════════════════════ */

const CARD_W = 360;
const GAP = 24;
const VISIBLE = 3;

/* ═══════════════════ Event Card ══════════════════════ */

function EventCard({
  event,
  onToggleBookmark,
}: {
  event: EventItem;
  onToggleBookmark: (id: string) => void;
}) {
  const c = CAT_COLORS[event.category];
  const isLow = event.spotsLeft < 20;

  return (
    <div
      className="group flex flex-col h-full bg-white dark:bg-gray-800 rounded-[20px] overflow-hidden border border-[#F3F4F6] dark:border-gray-700 shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)]"
    >
      {/* ── Image: exactly 200px ── */}
      <div className="relative h-[200px] w-full flex-shrink-0 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {/* gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)",
          }}
        />

        {/* date badge — top-left */}
        <div
          className="absolute top-[12px] left-[12px] flex items-center bg-[rgba(255,255,255,0.95)] dark:bg-gray-900/95 backdrop-blur-sm rounded-[14px] px-[12px]"
          style={{
            height: 36,
            boxShadow: "0px 10px 15px rgba(0,0,0,0.1), 0px 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          <span className="font-body font-semibold text-[13px] leading-[19.5px] text-[#101828] dark:text-white">
            {event.dateShort}
          </span>
        </div>

        {/* bookmark — top-right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark(event.id);
          }}
          className="absolute top-[12px] right-[12px] w-[36px] h-[36px] flex items-center justify-center bg-[rgba(255,255,255,0.9)] dark:bg-gray-900/90 backdrop-blur-sm rounded-full cursor-pointer transition-transform duration-200 hover:scale-110"
          style={{
            boxShadow: "0px 10px 15px rgba(0,0,0,0.1), 0px 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          <Bookmark
            className={`w-[16px] h-[16px] ${event.bookmarked
                ? "fill-[#1A56DB] text-[#1A56DB] dark:fill-blue-400 dark:text-blue-400"
                : "text-[#6A7282] dark:text-gray-400"
              }`}
            strokeWidth={2}
          />
        </button>
      </div>

      {/* ── Content: pt-20 px-20 pb-0 ── */}
      <div className="flex flex-col gap-[12px] pt-[20px] px-[20px] pb-0 flex-1">
        {/* Row 1: category + location */}
        <div className="flex items-center gap-[8px]">
          <span
            className={`inline-flex items-center px-[10px] py-[2px] rounded-full font-body font-semibold text-[11px] leading-[16.5px] tracking-[0.275px] uppercase ${c.bg} ${c.text} ${c.darkBg} ${c.darkText}`}
          >
            {event.category}
          </span>
          <span className="flex items-center gap-[4px] font-body text-[12px] leading-[18px] text-[#6A7282] dark:text-gray-400">
            {event.isOnline ? (
              <>
                <Globe className="w-[12px] h-[12px] flex-shrink-0 text-[#009966]" strokeWidth={2} />
                <span className="text-[#009966] dark:text-emerald-400">Online</span>
              </>
            ) : (
              <>
                <MapPin className="w-[12px] h-[12px] flex-shrink-0" strokeWidth={2} />
                {event.location}
              </>
            )}
          </span>
        </div>

        {/* Row 2: title — 46px = 2 lines max, overflow hidden (no ellipsis) */}
        <div className="h-[46px] overflow-hidden">
          <h3 className="font-body font-bold text-[17px] leading-[22.95px] text-[#101828] dark:text-white">
            {event.title}
          </h3>
        </div>

        {/* Row 3: description — single line, truncated */}
        <div className="h-[19.5px] overflow-hidden">
          <p className="font-body text-[13px] leading-[19.5px] text-[#6A7282] dark:text-gray-400 whitespace-nowrap overflow-hidden text-ellipsis">
            {event.description}
          </p>
        </div>

        {/* Row 4: footer — border-top, pt-12, pb-20 */}
        <div
          className="flex items-center justify-between mt-auto pt-[12px] pb-[20px] border-t border-[#F3F4F6] dark:border-gray-700"
        >
          <span
            className={`flex items-center gap-[6px] font-body font-medium text-[12px] leading-[18px] ${isLow ? "text-[#EC003F] dark:text-rose-400" : "text-[#6A7282] dark:text-gray-400"
              }`}
          >
            <Users className="w-[14px] h-[14px]" strokeWidth={2} />
            {event.spotsLeft} spots left
          </span>
          <button className="flex items-center justify-center h-[30px] px-[16px] py-[6px] bg-[#1A56DB] hover:brightness-110 text-white font-body font-semibold text-[12px] leading-[18px] text-center rounded-[10px] cursor-pointer transition-all duration-200">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════ Pagination Dots ═════════════════ */

function Dots({
  total,
  active,
  onDot,
}: {
  total: number;
  active: number;
  onDot: (i: number) => void;
}) {
  return (
    <div className="flex items-center gap-[8px] justify-center">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onDot(i)}
          className="w-[10px] h-[10px] rounded-full cursor-pointer transition-colors duration-300"
          style={{
            backgroundColor: i === active ? "#1A56DB" : "#D1D5DC",
          }}
          aria-label={`Go to page ${i + 1}`}
        />
      ))}
    </div>
  );
}

/* ═══════════════════ Main Section ════════════════════ */

export function EventsPreviewSection() {
  const [events, setEvents] = useState<EventItem[]>(EVENTS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });

  useEffect(() => {
    const fetchLiveEvents = async () => {
      try {
        const now = new Date().toISOString();
        const response = await databases.listDocuments(
          DATABASE_ID,
          COLLECTIONS.EVENTS,
          [
            Query.greaterThanEqual('eventDate', now),
            Query.orderAsc('eventDate'),
            Query.limit(10),
          ]
        );

        const rawEvents = response.documents as any[];
        const approvedEvents = rawEvents.filter(e => e.approved === true);

        if (approvedEvents.length > 0) {
          const mappedEvents: EventItem[] = approvedEvents.map(evt => {
            // Determine Poster logic (Matches EventsLanding logic)
            let poster = "https://images.unsplash.com/photo-1561089489-f13d5e730d72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=720&q=80";
            if (evt.posterFileId && eventMediaBucket) {
              const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';
              const project = import.meta.env.VITE_APPWRITE_PROJECT || '';
              poster = `${endpoint}/storage/buckets/${eventMediaBucket}/files/${evt.posterFileId}/preview?project=${project}&width=600&height=400`;
            } else if (evt.thumbnailUrl) {
              poster = evt.thumbnailUrl;
            }

            // Figure out valid string category
            let rawCat = "Workshop";
            if (evt.category) {
              if (typeof evt.category === 'string' && evt.category.startsWith('[')) {
                try {
                  const parsed = JSON.parse(evt.category);
                  if (Array.isArray(parsed) && parsed.length > 0) rawCat = parsed[0];
                } catch (e) { }
              } else if (Array.isArray(evt.category) && evt.category.length > 0) {
                rawCat = evt.category[0];
              } else if (typeof evt.category === 'string') {
                rawCat = evt.category;
              }
            } else if (evt.eventType) {
              rawCat = evt.eventType;
            }

            // Constrain string category into the strictest type definitions we have layout colors for
            const validCategories = ["Hackathon", "Workshop", "Sports", "Webinar", "Competition", "Cultural"];
            const resolvedCat = validCategories.includes(rawCat) ? rawCat as any : "Workshop";

            return {
              id: evt.$id,
              title: evt.title || "Upcoming Event",
              category: resolvedCat,
              dateShort: new Date(evt.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              location: evt.platform || evt.location || "TBA",
              isOnline: !!evt.platform || evt.location === "Online",
              description: evt.description || "",
              spotsLeft: evt.maxParticipants ? Math.max(0, evt.maxParticipants - (evt.participantCount || 0)) : 100,
              image: poster,
              bookmarked: false,
            };
          });

          setEvents(mappedEvents);
        }
      } catch (err) {
        console.error("Failed to load generic events preview:", err);
      }
    };

    fetchLiveEvents();
  }, []);

  const maxIndex = Math.max(events.length - VISIBLE, 0);
  const dotCount = maxIndex + 1;

  const handlePrev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const handleNext = () => setCurrentIndex((i) => Math.min(maxIndex, i + 1));
  const goToDot = (page: number) => setCurrentIndex(Math.min(Math.max(page, 0), maxIndex));

  const toggleBookmark = (id: string) =>
    setEvents((es) =>
      es.map((e) => (e.id === id ? { ...e, bookmarked: !e.bookmarked } : e))
    );

  const trackTransform = `translateX(-${currentIndex * (CARD_W + GAP)}px)`;

  return (
    <section
      ref={sectionRef}
      className="relative bg-white dark:bg-gray-900 transition-colors duration-300"
    >
      {/* Section inner — px-8 (32px), flex-col, gap-64px */}
      <div className="relative mx-auto flex flex-col gap-[64px] py-[64px] px-[32px]">

        {/* ═══════════ BLOCK 1: Header Row ═══════════ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 w-full"
        >
          {/* Left: title area */}
          <div className="max-w-[576px]">
            <h2 className="font-display font-bold text-[32px] sm:text-[36px] md:text-[42px] md:leading-[50.4px] text-[#0A0A0A] dark:text-white">
              Discover Upcoming Events
            </h2>

            {/* Accent underline */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="origin-left rounded-full mt-[12px] h-[3px] w-[256px]"
              style={{
                background: "linear-gradient(to right, #1A56DB, #F59E0B, #1A56DB)",
              }}
            />

            {/* Subtitle */}
            <p className="mt-[19px] font-body font-normal text-[16px] sm:text-[18px] leading-[29.25px] text-[#4A5565] dark:text-gray-400 max-w-[511px]">
              Hackathons, workshops, competitions & campus experiences curated for students.
            </p>
          </div>

          {/* Right: Live Events badge */}
          <div
            className="hidden md:flex items-center gap-[8px] bg-white dark:bg-gray-800 rounded-[16px] h-[43px] px-[20px] border border-[#E5E7EB] dark:border-gray-700 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.1)]"
          >
            {/* Green dot with ping */}
            <span className="relative flex w-[10px] h-[10px]">
              <span className="animate-ping absolute inset-0 rounded-full bg-[#00D492] opacity-75" />
              <span className="relative inline-flex w-[10px] h-[10px] rounded-full bg-[#00BC7D]" />
            </span>
            <span className="font-body font-semibold text-[14px] leading-[21px] text-[#101828] dark:text-white">
              120+
            </span>
            <span className="font-body font-normal text-[14px] leading-[21px] text-[#6A7282] dark:text-gray-400">
              Live Events
            </span>
          </div>
        </motion.div>

        {/* ═══════════ BLOCK 2: Carousel Area ═══════════ */}
        <div className="relative w-full">

          {/* Cards viewport — full width, overflow hidden */}
          <div className="w-full overflow-hidden">
            {/* Cards track — slides via translateX */}
            <div
              className="flex"
              style={{
                gap: GAP,
                transform: trackTransform,
                transition: "transform 500ms cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              {events.map((ev) => (
                <div
                  key={ev.id}
                  className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[360px]"
                >
                  <EventCard event={ev} onToggleBookmark={toggleBookmark} />
                </div>
              ))}
            </div>
          </div>

          {/* Left arrow */}
          <button
            onClick={handlePrev}
            className={`hidden lg:flex absolute z-10 items-center justify-center bg-white dark:bg-gray-800 rounded-full cursor-pointer transition-all duration-200 hover:scale-105 border border-[#E5E7EB] dark:border-gray-700 shadow-[0_10px_15px_rgba(0,0,0,0.1),0_4px_6px_rgba(0,0,0,0.1)] w-[48px] h-[48px] top-[200px] -left-[24px] -translate-y-1/2 ${currentIndex === 0 ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            aria-label="Previous"
          >
            <ChevronLeft className="w-[20px] h-[20px] text-[#374151] dark:text-gray-300" strokeWidth={2} />
          </button>

          {/* Right arrow */}
          <button
            onClick={handleNext}
            className={`hidden lg:flex absolute z-10 items-center justify-center bg-white dark:bg-gray-800 rounded-full cursor-pointer transition-all duration-200 hover:scale-105 border border-[#E5E7EB] dark:border-gray-700 shadow-[0_10px_15px_rgba(0,0,0,0.1),0_4px_6px_rgba(0,0,0,0.1)] w-[48px] h-[48px] top-[200px] -right-[24px] -translate-y-1/2 ${currentIndex >= maxIndex ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            aria-label="Next"
          >
            <ChevronRight className="w-[20px] h-[20px] text-[#374151] dark:text-gray-300" strokeWidth={2} />
          </button>

          {/* Pagination dots */}
          <div className="mt-[32px]">
            <Dots total={dotCount} active={currentIndex} onDot={goToDot} />
          </div>
        </div>

        {/* ═══════════ BLOCK 3: CTA Button ═══════════ */}
        <div className="flex justify-center w-full">
          <Link
            to="/events"
            className="group inline-flex items-center gap-[8px] h-[52px] px-[32px] bg-[#1A56DB] text-white font-body font-semibold text-[16px] leading-[24px] rounded-[16px] shadow-[0_4px_16px_rgba(26,86,219,0.25)] cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:brightness-110"
          >
            Explore All Events
            <ArrowRight className="w-[20px] h-[20px] transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2} />
          </Link>
        </div>
      </div>
    </section>
  );
}
