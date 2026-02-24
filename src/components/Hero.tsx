import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ChevronDown } from "lucide-react";

// ─── FLOATING CARD DATA ───────────────────────────────────────────────
// Each card is positioned absolutely within the middle parallax layer.
// `rotation` = CSS rotate in degrees. `left`/`right`/`top` = absolute positioning.
// `gradient` = poster placeholder fill.
const floatingCards = [
    {
        title: "Hackathon 2026",
        date: "Feb 20",
        rotation: -3,       // slight left tilt
        left: "4%",
        top: "15%",
        gradient: "linear-gradient(135deg, #1A56DB, #3B82F6)", // Tech blue
    },
    {
        title: "Cultural Night",
        date: "Feb 22",
        rotation: 5,         // right tilt
        left: "2%",
        top: "55%",
        gradient: "linear-gradient(135deg, #F59E0B, #F97316)", // Amber/orange
    },
    {
        title: "AI Workshop",
        date: "Feb 25",
        rotation: 2,
        right: "3%",
        top: "20%",
        gradient: "linear-gradient(135deg, #10B981, #14B8A6)", // Emerald/teal
    },
    {
        title: "Sports Meet",
        date: "Mar 1",
        rotation: -2,
        right: "5%",
        top: "58%",
        gradient: "linear-gradient(135deg, #9333EA, #C026D3)", // Purple/magenta
    },
    {
        title: "Web Dev Bootcamp",
        date: "Feb 28",
        rotation: 4,
        left: "8%",
        top: "80%",
        gradient: "linear-gradient(135deg, #6366F1, #8B5CF6)", // Indigo/violet
    },
];

// ─── STATS DATA ───────────────────────────────────────────────────────
const stats = [
    { number: "47", label: "Events This Week" },
    { number: "12", label: "Colleges Hosting" },
    { number: "3.2K", label: "Registrations" },
];

export function Hero() {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();

    // ─── PARALLAX TRANSFORMS ─────────────────────────────────────────
    // Background layer: moves at 0.5x scroll speed (450/900 = 0.5)
    const bgY = useTransform(scrollY, [0, 900], [0, 450]);
    // Middle floating cards: moves at 0.3x scroll speed (270/900 = 0.3)
    const midY = useTransform(scrollY, [0, 900], [0, 270]);
    // Floating cards fade out as you scroll past 600px
    const midOpacity = useTransform(scrollY, [0, 600], [1, 0]);

    return (
        <section
            ref={ref}
            className="relative h-screen min-h-[900px] overflow-hidden flex items-center justify-center"
        >
            {/* ════════════════════════════════════════════════════════════════
          LAYER 0: BACKGROUND (z-0, slowest parallax)
          - Gradient mesh: 2 radial gradients + 1 linear gradient
          - 4 scattered blurred geometric shapes at 5-8% opacity
          ════════════════════════════════════════════════════════════════ */}
            <motion.div className="absolute inset-0 z-0" style={{ y: bgY }}>
                {/* Gradient mesh fill */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: [
                            "radial-gradient(at 30% 20%, rgba(26,86,219,0.08), transparent 50%)",
                            "radial-gradient(at 70% 60%, rgba(147,51,234,0.06), transparent 50%)",
                            "linear-gradient(180deg, var(--el-grayBg) 0%, var(--el-white) 100%)",
                        ].join(", "),
                    }}
                />
                {/* Blurred shape: blue circle, top-left */}
                <div
                    className="absolute w-[300px] h-[300px] rounded-full top-[10%] left-[15%]"
                    style={{ background: "#1A56DB", filter: "blur(80px)", opacity: 0.07 }}
                />
                {/* Blurred shape: purple rounded-square, bottom-right */}
                <div
                    className="absolute w-[250px] h-[250px] rounded-[40px] top-[60%] right-[20%]"
                    style={{ background: "#9333EA", filter: "blur(80px)", opacity: 0.06 }}
                />
                {/* Blurred shape: emerald circle, bottom-center */}
                <div
                    className="absolute w-[200px] h-[200px] rounded-full bottom-[15%] left-[40%]"
                    style={{ background: "#10B981", filter: "blur(80px)", opacity: 0.05 }}
                />
                {/* Blurred shape: amber rounded-square, mid-right */}
                <div
                    className="absolute w-[180px] h-[180px] rounded-[30px] top-[30%] right-[10%]"
                    style={{ background: "#F59E0B", filter: "blur(80px)", opacity: 0.08 }}
                />
            </motion.div>

            {/* ════════════════════════════════════════════════════════════════
          LAYER 1: FLOATING EVENT CARDS (z-10, medium parallax)
          - 5 ghost/preview cards scattered on left/right edges
          - Each card: 200px wide, glassmorphism style
          - Hidden on screens < lg (1024px)
          - pointer-events: none (decorative only)
          ════════════════════════════════════════════════════════════════ */}
            <motion.div
                className="absolute inset-0 z-10 pointer-events-none hidden lg:block"
                style={{ y: midY, opacity: midOpacity }}
            >
                {floatingCards.map((card, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-[200px]"
                        style={{
                            left: card.left,
                            right: (card as any).right,
                            top: card.top,
                            transform: `rotate(${card.rotation}deg)`,
                        }}
                        // ─── ENTRANCE ANIMATION ───
                        // Each card fades in + slides up 40px
                        // Stagger: 150ms between each card, starting at 300ms
                        // Final opacity: 0.50 → 0.70 (slight variation per card)
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 0.5 + i * 0.05, y: 0 }}
                        transition={{
                            delay: 0.3 + i * 0.15,
                            duration: 0.8,
                            ease: "easeOut",
                        }}
                    >
                        {/* Card shell: glassmorphism */}
                        <div
                            className="rounded-[16px] p-4 border"
                            style={{
                                background: "var(--el-bg-card)",       // semi-transparent white
                                backdropFilter: "blur(20px)",                // glass blur
                                borderColor: "var(--el-border)",        // subtle border
                                boxShadow: "0 20px 40px var(--el-shadow-1)",  // floating shadow
                            }}
                        >
                            {/* Poster placeholder: gradient rectangle */}
                            <div
                                className="w-full h-[140px] rounded-[10px] mb-3"
                                style={{ background: card.gradient }}
                            />
                            {/* Event title */}
                            <p
                                style={{
                                    fontFamily: "'DM Sans', sans-serif",
                                    fontWeight: 600,
                                    fontSize: "14px",
                                    color: "var(--el-dark)",
                                }}
                            >
                                {card.title}
                            </p>
                            {/* Date badge */}
                            <span
                                className="inline-block mt-1 px-2 py-0.5 rounded-md"
                                style={{
                                    fontFamily: "'JetBrains Mono', monospace",
                                    fontWeight: 700,
                                    fontSize: "11px",
                                    color: "var(--el-blue)",
                                    background: "var(--el-blueLight)",
                                }}
                            >
                                {card.date}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* ════════════════════════════════════════════════════════════════
          LAYER 2: FOREGROUND CONTENT (z-20, normal scroll speed)
          - Centered text block, max-width 800px
          - Staggered fade-in + slide-up animations
          ════════════════════════════════════════════════════════════════ */}
            <div className="relative z-20 text-center max-w-[800px] mx-auto px-6">

                {/* ── EYEBROW BADGE ────────────────────────────────────────── */}
                {/* White pill with green pulsing dot + blue text              */}
                {/* Animation: fadeIn(0→1) + slideUp(20px→0), 0.6s, delay 0   */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border"
                    style={{
                        background: "var(--el-white)",
                        borderColor: "var(--el-border)",
                        boxShadow: "0 4px 12px var(--el-shadow-1)",
                    }}
                >
                    {/* Pulsing green dot — uses Tailwind animate-ping */}
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
                    </span>
                    <span
                        style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontWeight: 500,
                            fontSize: "13px",
                            color: "var(--el-blue)",
                        }}
                    >
                        LIVE EVENTS PLATFORM
                    </span>
                </motion.div>

                {/* ── H1 HEADLINE ──────────────────────────────────────────── */}
                {/* "Happening" has gradient text: blue→purple                 */}
                {/* Animation: fadeIn + slideUp(30px), 0.7s, delay 0.15s      */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.15 }}
                    className="mt-6"
                    style={{
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 700,
                        fontSize: "clamp(40px, 5vw, 72px)", // 40px mobile → 72px desktop
                        color: "var(--el-dark)",
                        lineHeight: 1.1,
                    }}
                >
                    Discover What's{" "}
                    <span
                        style={{
                            background: "linear-gradient(135deg, #1A56DB, #9333EA)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        Happening
                    </span>{" "}
                    Near You
                </motion.h1>

                {/* ── SUBHEADLINE ──────────────────────────────────────────── */}
                {/* Animation: fadeIn + slideUp(30px), 0.7s, delay 0.3s       */}
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="mt-5 mx-auto max-w-[640px]"
                    style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 400,
                        fontSize: "clamp(16px, 1.4vw, 20px)", // 16px mobile → 20px desktop
                        color: "var(--el-body)",
                        lineHeight: 1.6,
                    }}
                >
                    Hackathons. Tech fests. Workshops. Cultural programs. Find events
                    from 5,664 colleges across Tamil Nadu — all in one place.
                </motion.p>

                {/* ── CTA BUTTONS ──────────────────────────────────────────── */}
                {/* Animation: fadeIn + slideUp(30px), 0.7s, delay 0.45s      */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.45 }}
                    className="mt-10 flex flex-wrap justify-center gap-4"
                >
                    {/* Primary CTA: solid blue */}
                    <button
                        className="w-[200px] h-[56px] rounded-[12px] cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                        style={{
                            background: "var(--el-blue)",
                            color: "white",
                            fontFamily: "'DM Sans', sans-serif",
                            fontWeight: 600,
                            fontSize: "16px",
                            boxShadow: "0 12px 28px var(--el-shadow-1)",
                            border: "none",
                        }}
                    >
                        Explore Events →
                    </button>
                    {/* Secondary CTA: outlined blue */}
                    <button
                        className="w-[180px] h-[56px] rounded-[12px] cursor-pointer transition-all duration-200 hover:bg-[color:var(--el-blueLight)]"
                        style={{
                            background: "transparent",
                            border: "2px solid var(--el-blue)",
                            color: "var(--el-dark)",
                            fontFamily: "'DM Sans', sans-serif",
                            fontWeight: 600,
                            fontSize: "16px",
                        }}
                    >
                        Submit Event
                    </button>
                </motion.div>

                {/* ── STATS ROW ────────────────────────────────────────────── */}
                {/* 3 white pill cards with monospace numbers                  */}
                {/* Animation: fadeIn + slideUp(30px), 0.7s, delay 0.6s       */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.6 }}
                    className="mt-[60px] flex flex-wrap justify-center gap-6 md:gap-8"
                >
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            className="px-7 py-5 rounded-[16px] border"
                            style={{
                                background: "var(--el-white)",
                                borderColor: "var(--el-border)",
                                boxShadow: "0 4px 16px var(--el-shadow-1)",
                            }}
                        >
                            <span
                                style={{
                                    fontFamily: "'JetBrains Mono', monospace",
                                    fontWeight: 700,
                                    fontSize: "28px",
                                    color: "var(--el-dark)",
                                }}
                            >
                                {stat.number}
                            </span>
                            <p
                                style={{
                                    fontFamily: "'DM Sans', sans-serif",
                                    fontWeight: 400,
                                    fontSize: "13px",
                                    color: "var(--el-muted)",
                                    marginTop: "4px",
                                }}
                            >
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* ════════════════════════════════════════════════════════════════
          SCROLL INDICATOR (absolute bottom, centered)
          - Infinite bounce animation: y oscillates [0 → 8 → 0]
          - Duration: 2 seconds, easeInOut, repeats forever
          ════════════════════════════════════════════════════════════════ */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
                <span
                    style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 400,
                        fontSize: "13px",
                        color: "var(--el-muted)",
                    }}
                >
                    Scroll to explore
                </span>
                <ChevronDown size={20} color="var(--el-muted)" />
            </motion.div>
        </section>
    );
}
