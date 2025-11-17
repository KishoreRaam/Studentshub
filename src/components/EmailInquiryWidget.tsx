import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Mail, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ========================================
// CHARACTER AVATAR COMPONENTS (SVG)
// ========================================

const PeekingCharacter = () => (
  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="30" cy="30" r="28" fill="#3B82F6" opacity="0.1"/>
    <circle cx="30" cy="30" r="24" fill="#3B82F6"/>
    <circle cx="30" cy="26" r="18" fill="#F3E8D8"/>
    <ellipse cx="24" cy="24" rx="3" ry="4" fill="#2D3748"/>
    <ellipse cx="36" cy="24" rx="3" ry="4" fill="#2D3748"/>
    <path d="M20 32 Q30 36 40 32" stroke="#2D3748" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <path d="M15 20 Q12 18 10 22" stroke="#F3E8D8" strokeWidth="3" strokeLinecap="round"/>
    <ellipse cx="22" cy="28" rx="2" ry="3" fill="#FF6B9D" opacity="0.4"/>
    <ellipse cx="38" cy="28" rx="2" ry="3" fill="#FF6B9D" opacity="0.4"/>
  </svg>
);

const QuestionCharacter = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="22" fill="#3B82F6"/>
    <circle cx="24" cy="22" r="16" fill="#F3E8D8"/>
    <ellipse cx="19" cy="20" rx="2.5" ry="3.5" fill="#2D3748"/>
    <ellipse cx="29" cy="20" rx="2.5" ry="3.5" fill="#2D3748"/>
    <path d="M17 28 Q24 30 31 28" stroke="#2D3748" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <circle cx="17.5" cy="19.5" r="1" fill="white"/>
    <circle cx="27.5" cy="19.5" r="1" fill="white"/>
    <ellipse cx="20" cy="24" rx="1.5" ry="2" fill="#FF6B9D" opacity="0.4"/>
    <ellipse cx="28" cy="24" rx="1.5" ry="2" fill="#FF6B9D" opacity="0.4"/>
    <path d="M24 10 Q20 8 18 12" stroke="#2D3748" strokeWidth="2" strokeLinecap="round"/>
    <path d="M24 10 Q28 8 30 12" stroke="#2D3748" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const HappyCharacter = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="22" fill="#10B981"/>
    <circle cx="24" cy="22" r="16" fill="#F3E8D8"/>
    <path d="M17 22 Q19 18 21 22" stroke="#2D3748" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <path d="M27 22 Q29 18 31 22" stroke="#2D3748" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <path d="M16 26 Q24 32 32 26" stroke="#2D3748" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <ellipse cx="20" cy="24" rx="1.5" ry="2" fill="#FF6B9D" opacity="0.4"/>
    <ellipse cx="28" cy="24" rx="1.5" ry="2" fill="#FF6B9D" opacity="0.4"/>
    <path d="M24 10 Q20 8 18 12" stroke="#2D3748" strokeWidth="2" strokeLinecap="round"/>
    <path d="M24 10 Q28 8 30 12" stroke="#2D3748" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const SupportiveCharacter = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="22" fill="#8B5CF6"/>
    <circle cx="24" cy="22" r="16" fill="#F3E8D8"/>
    <ellipse cx="19" cy="21" rx="2.5" ry="3" fill="#2D3748"/>
    <ellipse cx="29" cy="21" rx="2.5" ry="3" fill="#2D3748"/>
    <path d="M18 27 Q24 29 30 27" stroke="#2D3748" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <circle cx="17.5" cy="20.5" r="1" fill="white"/>
    <circle cx="27.5" cy="20.5" r="1" fill="white"/>
    <ellipse cx="20" cy="25" rx="1.5" ry="2" fill="#FF6B9D" opacity="0.4"/>
    <ellipse cx="28" cy="25" rx="1.5" ry="2" fill="#FF6B9D" opacity="0.4"/>
    <path d="M24 10 Q20 8 18 12" stroke="#2D3748" strokeWidth="2" strokeLinecap="round"/>
    <path d="M24 10 Q28 8 30 12" stroke="#2D3748" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// ========================================
// CONFETTI ANIMATION COMPONENT
// ========================================

const Confetti = () => {
  const confettiPieces = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    x: Math.random() * 100 - 50,
    rotation: Math.random() * 360,
    color: ['#3B82F6', '#10B981', '#8B5CF6', '#EC4899'][Math.floor(Math.random() * 4)],
    delay: Math.random() * 0.2,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {confettiPieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: piece.color,
            left: '50%',
            top: '20%',
          }}
          initial={{
            x: 0,
            y: 0,
            opacity: 1,
            rotate: 0,
            scale: 1,
          }}
          animate={{
            x: piece.x,
            y: 100,
            opacity: 0,
            rotate: piece.rotation,
            scale: 0,
          }}
          transition={{
            duration: 1.5,
            delay: piece.delay,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );
};

// ========================================
// MAIN WIDGET COMPONENT
// ========================================

type WidgetState = 'collapsed' | 'expanded' | 'yes-response' | 'no-response';

export function EmailInquiryWidget() {
  const navigate = useNavigate();
  const [state, setState] = useState<WidgetState>('collapsed');
  const [isVisible, setIsVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // ========================================
  // EFFECTS
  // ========================================

  useEffect(() => {
    // Show widget after 2 seconds (reduced from 3 for faster testing)
    const timer = setTimeout(() => {
      console.log('Email Widget: Setting visible to true');
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Auto-dismiss YES response after 8 seconds
    if (state === 'yes-response') {
      const timer = setTimeout(() => {
        handleClose();
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [state]);

  // ========================================
  // HELPER FUNCTIONS
  // ========================================

  const checkShouldShow = () => {
    // Check if dismissed recently (within 7 days)
    const lastDismissed = localStorage.getItem('emailWidgetDismissed');
    if (lastDismissed && Date.now() - Number(lastDismissed) < 7 * 24 * 60 * 60 * 1000) {
      return false;
    }

    // Check if already answered
    const hasAnswered = sessionStorage.getItem('emailWidgetAnswered');
    if (hasAnswered) {
      return false;
    }

    return true;
  };

  // ========================================
  // EVENT HANDLERS
  // ========================================

  const handlePeekClick = () => {
    setState('expanded');
  };

  const handleYesClick = () => {
    setState('yes-response');
    setShowConfetti(true);
    sessionStorage.setItem('emailWidgetAnswered', 'yes');

    setTimeout(() => setShowConfetti(false), 1500);
  };

  const handleNoClick = () => {
    setState('no-response');
    sessionStorage.setItem('emailWidgetAnswered', 'no');
  };

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('emailWidgetDismissed', Date.now().toString());
  };

  const handleMaybeLater = () => {
    handleClose();
  };

  const handleExplorePerks = () => {
    // Navigate to perks page
    navigate('/perks');
    handleClose();
  };

  const handleLearnMore = () => {
    // Navigate to college portal page
    navigate('/college-portal');
    handleClose();
  };

  if (!isVisible) return null;

  // ========================================
  // RENDER
  // ========================================

  return (
    <div className="fixed bottom-24 right-6 z-[99999]">
      <div>
        <AnimatePresence mode="wait">

          {/* ========================================
              STATE 1: COLLAPSED (PEEKING)
              ======================================== */}
          {state === 'collapsed' && (
            <motion.div
              key="collapsed"
              initial={{ x: 100, y: 100, scale: 0.8, opacity: 0 }}
              animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                duration: 0.5
              }}
              className="relative cursor-pointer"
              onClick={handlePeekClick}
            >
              {/* Floating animation container */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {/* Pulse ring effect */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
                  }}
                  animate={{
                    scale: [1, 1.5],
                    opacity: [0.6, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                />

                {/* Avatar circle */}
                <div
                  className="relative w-[60px] h-[60px] bg-white rounded-full shadow-xl flex items-center justify-center overflow-hidden"
                  style={{
                    border: '2px solid transparent',
                    backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
                    backgroundOrigin: 'border-box',
                    backgroundClip: 'padding-box, border-box',
                  }}
                >
                  <PeekingCharacter />

                  {/* Notification badge */}
                  <motion.div
                    className="absolute -top-1 -right-1 w-5 h-5 bg-[#EC4899] rounded-full flex items-center justify-center text-white text-xs font-bold"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    ?
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* ========================================
              STATE 2: EXPANDED (QUESTION)
              ======================================== */}
          {state === 'expanded' && (
            <motion.div
              key="expanded"
              initial={{ scale: 0, opacity: 0, originX: 1, originY: 1 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-[360px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-blue-100 dark:border-gray-700 p-6 relative"
            >
              {/* Close button */}
              <motion.button
                onClick={handleClose}
                className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-5 h-5" />
              </motion.button>

              {/* Character avatar */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring" }}
                className="mb-4"
              >
                <QuestionCharacter />
              </motion.div>

              {/* Greeting */}
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2"
              >
                Hey there! Quick question...
              </motion.p>

              {/* Main question */}
              <motion.h3
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="text-lg font-bold text-gray-900 dark:text-white mb-5"
              >
                Does your college provide institutional email IDs?
              </motion.h3>

              {/* Buttons */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex gap-3 justify-center"
              >
                <motion.button
                  onClick={handleYesClick}
                  className="flex-1 h-12 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-lg hover:border-[#10B981] hover:bg-gray-50 dark:hover:bg-gray-600 transition-all flex items-center justify-center gap-2 font-semibold"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Check className="w-4 h-4" />
                  YES
                </motion.button>

                <motion.button
                  onClick={handleNoClick}
                  className="flex-1 h-12 text-white rounded-lg transition-all flex items-center justify-center gap-2 font-semibold"
                  style={{
                    background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
                  }}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)',
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Mail className="w-4 h-4" />
                  NO
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {/* ========================================
              STATE 3A: YES RESPONSE
              ======================================== */}
          {state === 'yes-response' && (
            <motion.div
              key="yes-response"
              initial={{ scale: 0, opacity: 0, originX: 1, originY: 1 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-[360px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-green-100 dark:border-gray-700 p-6 relative overflow-hidden"
            >
              {/* Confetti animation */}
              {showConfetti && <Confetti />}

              {/* Close button */}
              <motion.button
                onClick={handleClose}
                className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors z-10"
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-5 h-5" />
              </motion.button>

              {/* Character avatar */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring" }}
                className="mb-4"
              >
                <HappyCharacter />
              </motion.div>

              {/* Success message */}
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl font-bold text-gray-900 dark:text-white mb-2"
              >
                That's awesome! 🎉
              </motion.p>

              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="text-sm text-gray-600 dark:text-gray-400 mb-5"
              >
                Great to hear your college provides institutional emails. Don't forget to use it for exclusive perks!
              </motion.p>

              {/* CTA Button */}
              <motion.button
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                onClick={handleExplorePerks}
                className="w-full h-12 text-white rounded-lg transition-all flex items-center justify-center gap-2 font-semibold"
                style={{
                  background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
                }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)',
                }}
                whileTap={{ scale: 0.98 }}
              >
                Explore Perks
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )}

          {/* ========================================
              STATE 3B: NO RESPONSE
              ======================================== */}
          {state === 'no-response' && (
            <motion.div
              key="no-response"
              initial={{ scale: 0, opacity: 0, originX: 1, originY: 1 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-[360px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-purple-100 dark:border-gray-700 p-6 relative"
            >
              {/* Close button */}
              <motion.button
                onClick={handleClose}
                className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-5 h-5" />
              </motion.button>

              {/* Character avatar */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring" }}
                className="mb-4"
              >
                <SupportiveCharacter />
              </motion.div>

              {/* Message */}
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl font-bold text-gray-900 dark:text-white mb-2"
              >
                No worries, we can help!
              </motion.p>

              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="text-sm text-gray-600 dark:text-gray-400 mb-4"
              >
                We help colleges set up institutional email systems. Let's get your college onboard! ✨
              </motion.p>

              {/* Benefits list */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-5 space-y-2"
              >
                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-start gap-2 text-gray-700 dark:text-gray-300"
                >
                  <Check className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Professional @yourcollege.edu.in</span>
                </motion.div>
                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-start gap-2 text-gray-700 dark:text-gray-300"
                >
                  <Check className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Enhanced security & verification</span>
                </motion.div>
                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-start gap-2 text-gray-700 dark:text-gray-300"
                >
                  <Check className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Free for first 100 students</span>
                </motion.div>
              </motion.div>

              {/* Primary CTA */}
              <motion.button
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                onClick={handleLearnMore}
                className="w-full h-12 text-white rounded-lg transition-all flex items-center justify-center gap-2 mb-3 font-semibold"
                style={{
                  background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
                }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)',
                }}
                whileTap={{ scale: 0.98 }}
              >
                Learn More
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              {/* Secondary action */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                onClick={handleMaybeLater}
                className="w-full text-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors font-medium"
              >
                Maybe Later
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Responsive styles */}
      <style>{`
        /* Desktop - ensure widget is visible */
        @media (min-width: 769px) {
          .fixed.bottom-24 {
            bottom: 6rem !important;
            right: 1.5rem !important;
          }
        }

        /* Tablet and Mobile */
        @media (max-width: 768px) {
          .fixed.bottom-24 {
            right: 1rem !important;
            bottom: 5rem !important;
          }
        }

        @media (max-width: 640px) {
          .w-\\[360px\\] {
            width: calc(100vw - 2rem);
            max-width: 340px;
          }
        }
      `}</style>
    </div>
  );
}
