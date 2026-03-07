import { useEffect, useRef } from 'react';
import { motion, useSpring } from 'motion/react';

export function FloatingCharacter() {
    const containerRef = useRef<HTMLDivElement>(null);

    // Body sway springs (gentle cursor parallax)
    const bodyX = useSpring(0, { damping: 25, stiffness: 80 });
    const bodyY = useSpring(0, { damping: 25, stiffness: 80 });

    // Pupil tracking springs — snappier for responsiveness
    const lPX = useSpring(0, { damping: 18, stiffness: 220 });
    const lPY = useSpring(0, { damping: 18, stiffness: 220 });
    const rPX = useSpring(0, { damping: 18, stiffness: 220 });
    const rPY = useSpring(0, { damping: 18, stiffness: 220 });

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            // Gentle body sway based on cursor position in viewport
            bodyX.set(((e.clientX / window.innerWidth) * 2 - 1) * 18);
            bodyY.set(((e.clientY / window.innerHeight) * 2 - 1) * 12);

            if (!containerRef.current) return;

            // Get the current visual center of the character
            const rect = containerRef.current.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;

            // SVG rendered at width=200 height=143, viewBox="0 0 140 100"
            // Scale factors for mapping SVG coords → screen coords
            const sx = 200 / 140;
            const sy = 143 / 100;
            const svgL = cx - 100;   // half of 200
            const svgT = cy - 71.5;  // half of 143

            // Max pupil travel (SVG units) — stays within eye circle
            const maxR = 3.2;

            // Left eye center at SVG (40, 57) → compute screen position
            const leX = svgL + 40 * sx;
            const leY = svgT + 57 * sy;
            const la = Math.atan2(e.clientY - leY, e.clientX - leX);
            lPX.set(Math.cos(la) * maxR);
            lPY.set(Math.sin(la) * maxR);

            // Right eye center at SVG (100, 57)
            const reX = svgL + 100 * sx;
            const reY = svgT + 57 * sy;
            const ra = Math.atan2(e.clientY - reY, e.clientX - reX);
            rPX.set(Math.cos(ra) * maxR);
            rPY.set(Math.sin(ra) * maxR);
        };

        window.addEventListener('mousemove', onMouseMove);
        return () => window.removeEventListener('mousemove', onMouseMove);
    }, [bodyX, bodyY, lPX, lPY, rPX, rPY]);

    return (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-0">
            {/* Outer vertical float — independent of body sway */}
            <motion.div
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
                {/* Body sway from cursor parallax */}
                <motion.div
                    ref={containerRef}
                    className="relative"
                    style={{ x: bodyX, y: bodyY }}
                >
                    {/* Distant fog halo — blends sphere into background */}
                    <div
                        className="absolute rounded-full"
                        style={{
                            width: '500px',
                            height: '500px',
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            background:
                                'radial-gradient(ellipse, rgba(165,243,252,0.10) 0%, rgba(196,181,253,0.08) 45%, transparent 70%)',
                            filter: 'blur(48px)',
                        }}
                    />

                    {/* Aurora sphere */}
                    <motion.div
                        animate={{ scale: [1, 1.045, 1] }}
                        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                        className="relative"
                        style={{
                            width: '300px',
                            height: '300px',
                            borderRadius: '50%',
                            background: `radial-gradient(ellipse at 38% 30%,
                                rgba(165,243,252,0.90) 0%,
                                rgba(139,92,246,0.62) 38%,
                                rgba(147,197,253,0.50) 65%,
                                rgba(255,255,255,0.03) 100%)`,
                            boxShadow: `
                                0 0 40px 12px rgba(165,243,252,0.18),
                                0 0 80px 30px rgba(139,92,246,0.10),
                                inset 0 0 55px rgba(255,255,255,0.07)`,
                            filter: 'blur(1.5px)',
                        }}
                    >
                        {/* Cyan aurora blob */}
                        <motion.div
                            animate={{ scale: [1, 1.22, 1], rotate: [0, 22, 0] }}
                            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
                            style={{
                                position: 'absolute',
                                top: '5%',
                                left: '5%',
                                width: '55%',
                                height: '55%',
                                borderRadius: '50%',
                                background: 'radial-gradient(circle, rgba(103,232,249,0.68), transparent)',
                                filter: 'blur(18px)',
                            }}
                        />
                        {/* Violet aurora blob */}
                        <motion.div
                            animate={{ scale: [1, 1.3, 1], x: [0, 12, 0] }}
                            transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                            style={{
                                position: 'absolute',
                                bottom: '8%',
                                right: '8%',
                                width: '50%',
                                height: '50%',
                                borderRadius: '50%',
                                background: 'radial-gradient(circle, rgba(167,139,250,0.78), transparent)',
                                filter: 'blur(16px)',
                            }}
                        />
                        {/* Soft blue accent */}
                        <motion.div
                            animate={{ scale: [1.05, 1, 1.05], y: [0, -10, 0] }}
                            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                            style={{
                                position: 'absolute',
                                top: '28%',
                                right: '14%',
                                width: '44%',
                                height: '44%',
                                borderRadius: '50%',
                                background: 'radial-gradient(circle, rgba(147,197,253,0.55), transparent)',
                                filter: 'blur(14px)',
                            }}
                        />
                    </motion.div>

                    {/* Face SVG — centered over sphere */}
                    <div
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            pointerEvents: 'none',
                        }}
                    >
                        <svg
                            width="200"
                            height="143"
                            viewBox="0 0 140 100"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{
                                filter:
                                    'drop-shadow(0 0 6px rgba(255,255,255,1)) drop-shadow(0 0 14px rgba(200,240,255,0.75))',
                            }}
                        >
                            {/* Left eyebrow — high sweeping Notion-style curve */}
                            <path
                                d="M 20 42 Q 40 21 58 37"
                                stroke="white"
                                strokeWidth="4"
                                strokeLinecap="round"
                                fill="none"
                            />
                            {/* Right eyebrow */}
                            <path
                                d="M 82 37 Q 100 21 120 42"
                                stroke="white"
                                strokeWidth="4"
                                strokeLinecap="round"
                                fill="none"
                            />

                            {/* Left eye — white sclera */}
                            <circle cx="40" cy="57" r="6.5" fill="white" />
                            {/* Left eye — pupil follows cursor */}
                            <motion.circle
                                cx="40"
                                cy="57"
                                r="2.8"
                                fill="rgba(100,215,255,0.96)"
                                style={{ x: lPX, y: lPY }}
                            />

                            {/* Right eye */}
                            <circle cx="100" cy="57" r="6.5" fill="white" />
                            <motion.circle
                                cx="100"
                                cy="57"
                                r="2.8"
                                fill="rgba(100,215,255,0.96)"
                                style={{ x: rPX, y: rPY }}
                            />

                            {/* L-shaped nose */}
                            <path
                                d="M 70 50 L 70 70 L 84 70"
                                stroke="white"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                fill="none"
                            />
                        </svg>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
