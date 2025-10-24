import { useEffect, useRef } from 'react';
import { Code, Sparkles, Heart } from 'lucide-react';
import gsap from 'gsap';

export function CreatorBadge() {
  const textRef = useRef<HTMLSpanElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const sparklesRef = useRef<SVGSVGElement>(null);
  const heartRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!textRef.current || !badgeRef.current || !iconRef.current) return;

    // Create GSAP context for cleanup
    const ctx = gsap.context(() => {
      // 1. Gradient shimmer animation
      gsap.to(textRef.current, {
        backgroundPosition: '200% center',
        duration: 3,
        ease: 'none',
        repeat: -1,
        yoyo: true,
      });

      // 2. Badge floating animation
      gsap.to(badgeRef.current, {
        y: -5,
        duration: 2,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true,
      });

      // 3. Icon rotation
      gsap.to(iconRef.current, {
        rotation: 360,
        duration: 8,
        ease: 'none',
        repeat: -1,
      });

      // 4. Sparkles twinkling
      if (sparklesRef.current) {
        gsap.to(sparklesRef.current, {
          opacity: 0.3,
          scale: 0.8,
          duration: 0.8,
          ease: 'power2.inOut',
          repeat: -1,
          yoyo: true,
        });
      }

      // 5. Heart beat animation
      if (heartRef.current) {
        gsap.to(heartRef.current, {
          scale: 1.2,
          duration: 0.6,
          ease: 'power2.inOut',
          repeat: -1,
          yoyo: true,
          repeatDelay: 0.5,
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative group">
      {/* Glowing background effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-green-500 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>

      {/* Main Badge */}
      <div
        ref={badgeRef}
        className="relative flex items-center gap-4 px-8 py-4 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-800 dark:via-gray-850 dark:to-gray-800 border-2 border-gray-300/50 dark:border-gray-600/50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 backdrop-blur-md"
      >
        {/* Animated Icon */}
        <div
          ref={iconRef}
          className="relative flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg"
        >
          <Code className="w-6 h-6 text-white" />
          <Sparkles
            ref={sparklesRef}
            className="w-4 h-4 text-yellow-300 absolute -top-1 -right-1"
          />
        </div>

        {/* Creator Text */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Crafted with
            </span>
            <Heart
              ref={heartRef}
              className="w-4 h-4 text-red-500 fill-red-500"
            />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              by
            </span>
          </div>
          <span
            ref={textRef}
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-green-500 via-purple-500 to-blue-600 bg-clip-text text-transparent tracking-wide"
            style={{
              backgroundSize: '200% 200%',
              backgroundPosition: '0% center',
            }}
          >
            Kishoreraam
          </span>
        </div>

        {/* Decorative corner accents */}
        <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full opacity-50"></div>
        <div className="absolute bottom-2 left-2 w-2 h-2 bg-green-500 rounded-full opacity-50"></div>
      </div>
    </div>
  );
}
