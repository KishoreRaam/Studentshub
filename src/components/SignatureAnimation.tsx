import { useEffect, useRef, useState } from 'react';
import { Heart } from 'lucide-react';

// ─── Signature paths ──────────────────────────────────────────────────────────
// Hand-crafted bezier curves for "Kishoreraam m" in a flowing cursive style.
// Each <path> is a natural pen stroke — stroke-dashoffset animation draws them
// in sequence, exactly as a pen would write the name.

const STROKES = [
  // ── K ────────────────────────────────────────────────────────────────────
  { d: 'M 14,62 C 13,55 12,42 12,18', dur: 0.33 },
  { d: 'M 12,40 C 18,34 25,26 34,18', dur: 0.27 },
  { d: 'M 18,37 C 24,44 30,52 36,62', dur: 0.24 },

  // ── connecting loop into i ────────────────────────────────────────────────
  { d: 'M 36,62 C 38,60 41,58 44,57', dur: 0.15 },

  // ── i ────────────────────────────────────────────────────────────────────
  { d: 'M 44,38 C 44,46 44,54 45,62', dur: 0.18 },
  { d: 'M 43,28 C 44,25 47,25 46,28', dur: 0.1 },

  // ── s ─────────────────────────────────────────────────────────────────────
  { d: 'M 62,36 C 59,31 50,31 50,38 C 50,44 57,46 57,52 C 57,58 50,60 47,57', dur: 0.33 },

  // ── connecting + h ───────────────────────────────────────────────────────
  { d: 'M 47,57 C 53,54 58,50 62,48', dur: 0.12 },
  { d: 'M 64,20 C 64,35 64,50 65,62', dur: 0.24 },
  { d: 'M 64,44 C 67,37 73,34 77,36 C 81,38 82,44 82,50 L 82,62', dur: 0.27 },

  // ── o ─────────────────────────────────────────────────────────────────────
  { d: 'M 99,40 C 99,30 90,26 86,32 C 82,38 82,55 87,60 C 92,65 99,61 99,52 C 99,48 97,43 95,41', dur: 0.36 },

  // ── r ─────────────────────────────────────────────────────────────────────
  { d: 'M 105,62 C 105,54 104,45 104,36 C 104,36 108,30 115,34', dur: 0.27 },

  // ── e ─────────────────────────────────────────────────────────────────────
  { d: 'M 126,48 C 120,46 116,48 116,53 C 116,60 120,64 125,62 C 130,60 132,55 130,50 C 128,44 124,38 124,36', dur: 0.33 },

  // ── connecting + r ───────────────────────────────────────────────────────
  { d: 'M 124,36 C 130,38 134,40 136,42', dur: 0.12 },
  { d: 'M 138,62 C 138,54 137,45 137,36 C 137,36 141,30 148,34', dur: 0.27 },

  // ── a ─────────────────────────────────────────────────────────────────────
  { d: 'M 166,42 C 166,32 158,28 153,34 C 148,40 148,56 153,61 C 158,66 166,62 166,53', dur: 0.33 },
  { d: 'M 166,42 L 167,62', dur: 0.15 },

  // ── a (second) ────────────────────────────────────────────────────────────
  { d: 'M 186,42 C 186,32 178,28 173,34 C 168,40 168,56 173,61 C 178,66 186,62 186,53', dur: 0.33 },
  { d: 'M 186,42 L 187,62 C 190,58 194,54 198,52', dur: 0.21 },

  // ── m ─────────────────────────────────────────────────────────────────────
  // upstroke into first hump
  { d: 'M 198,62 C 198,50 199,38 202,33 C 205,28 212,28 214,34 C 215,38 215,50 215,58 L 215,62', dur: 0.3 },
  // second hump
  { d: 'M 215,46 C 216,36 219,29 225,29 C 231,29 232,36 232,46 L 232,62', dur: 0.28 },
  // trailing flourish
  { d: 'M 232,62 C 237,58 244,54 250,54 C 254,54 255,58 252,61 C 247,65 237,63 232,62', dur: 0.28 },
];

// Total animation time (sum of all stroke durations + gaps)
const GAP = 0.04; // seconds between each stroke
const TOTAL = STROKES.reduce((sum, s) => sum + s.dur + GAP, 0);

// ─── Component ───────────────────────────────────────────────────────────────

export function SignatureAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [nibPos, setNibPos] = useState({ x: 14, y: 62 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setStarted(true), 300);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Move the nib dot to the start of each upcoming stroke so it
  // feels like an actual pen moving to start the next letter.
  useEffect(() => {
    if (!started) return;
    let elapsed = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    STROKES.forEach((stroke) => {
      // Parse the first M coordinate to position the nib at stroke start
      const m = stroke.d.match(/M\s*([\d.]+)[,\s]([\d.]+)/);
      if (m) {
        const x = parseFloat(m[1]);
        const y = parseFloat(m[2]);
        timers.push(
          setTimeout(() => setNibPos({ x, y }), elapsed * 1000)
        );
      }
      elapsed += stroke.dur + GAP;
    });

    timers.push(
      setTimeout(() => setDone(true), (TOTAL + 0.3) * 1000)
    );

    return () => timers.forEach(clearTimeout);
  }, [started]);

  // Per-stroke animation delay (seconds from when `started` fires)
  let cumulativeDelay = 0;
  const strokeDelays = STROKES.map((stroke) => {
    const delay = cumulativeDelay;
    cumulativeDelay += stroke.dur + GAP;
    return delay;
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');

        @keyframes drawStroke {
          to { stroke-dashoffset: 0; }
        }

        .sig-stroke {
          fill: none;
          stroke: rgba(220, 230, 242, 0.88);
          stroke-width: 1.6;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        @keyframes nibPulse {
          0%, 100% { r: 2.5; opacity: 0.9; }
          50%       { r: 3.5; opacity: 1;   }
        }

        .sig-nib {
          animation: nibPulse 0.6s ease-in-out infinite;
          filter: drop-shadow(0 0 4px rgba(148,163,184,0.9))
                  drop-shadow(0 0 10px rgba(148,163,184,0.5));
        }

        @keyframes fadeNib {
          to { opacity: 0; transform: scale(0); }
        }

        .sig-nib-done {
          animation: fadeNib 0.4s ease forwards;
        }

        @keyframes drawUnderline {
          from { stroke-dashoffset: 220; }
          to   { stroke-dashoffset: 0;   }
        }

        .sig-underline {
          stroke-dasharray: 220;
          stroke-dashoffset: 220;
          animation: drawUnderline 1s cubic-bezier(0.4,0,0.2,1) forwards;
        }
      `}</style>

      <div ref={containerRef} className="flex flex-col items-center space-y-3">
        {/* "Crafted with ❤️ by" */}
        <div className="flex items-center space-x-2 text-gray-400">
          <span className="text-sm">Crafted with</span>
          <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
          <span className="text-sm">by</span>
        </div>

        {/* Signature canvas */}
        <svg
          width="300"
          height="90"
          viewBox="0 10 266 80"
          xmlns="http://www.w3.org/2000/svg"
          style={{ overflow: 'visible' }}
        >
          {/* Soft ambient glow behind the strokes */}
          {started && STROKES.map((stroke, i) => (
            <path
              key={`glow-${i}`}
              d={stroke.d}
              fill="none"
              stroke="rgba(148,163,184,0.15)"
              strokeWidth="6"
              strokeLinecap="round"
              style={{ filter: 'blur(4px)' }}
            />
          ))}

          {/* Actual animated strokes */}
          {started && STROKES.map((stroke, i) => {
            // We calculate path length at render time via a dummy
            // For animation we use a large enough dasharray
            return (
              <path
                key={`stroke-${i}`}
                d={stroke.d}
                className="sig-stroke"
                style={{
                  strokeDasharray: 600,
                  strokeDashoffset: 600,
                  animation: `drawStroke ${stroke.dur}s cubic-bezier(0.4, 0, 0.3, 1) ${strokeDelays[i]}s forwards`,
                }}
              />
            );
          })}

          {/* Pen nib dot — moves to each stroke start, pulses while writing */}
          {started && !done && (
            <circle
              cx={nibPos.x}
              cy={nibPos.y}
              r="2.5"
              fill="rgba(226, 232, 240, 0.95)"
              className="sig-nib"
              style={{
                transition: `cx ${GAP * 0.8}s ease-in-out, cy ${GAP * 0.8}s ease-in-out`,
              }}
            />
          )}

          {/* Underline flourish — appears after signing is done */}
          {done && (
            <path
              d="M 20,74 C 60,72 130,70 160,70 C 190,70 230,71 252,72"
              fill="none"
              stroke="rgba(148,163,184,0.45)"
              strokeWidth="1"
              strokeLinecap="round"
              className="sig-underline"
            />
          )}
        </svg>
      </div>
    </>
  );
}
