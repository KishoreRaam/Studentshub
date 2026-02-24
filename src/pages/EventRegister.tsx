import React, { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowRight, Upload, Users, CheckCircle, Eye, Sparkles, Shield,
  Megaphone, ChevronRight, Star, Calendar, Clock, MapPin, X, Menu,
  FileText, Mail, Phone, Search, Rocket, LogIn, User,
} from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import { useEventForm } from '../hooks/useEventForm';
import { useAuth } from '../contexts/AuthContext';
import { Footer } from '../components/Footer';

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
  purple: 'var(--el-purple, #7C3AED)',
  purpleLight: 'var(--el-purpleLight, #F3E8FF)',
  red: 'var(--el-red, #EF4444)',
};

// ── Font helpers ──────────────────────────────────────────────────────────────
const Fd: React.CSSProperties = { fontFamily: '"Playfair Display", serif', fontWeight: 700 };
const Fb: React.CSSProperties = { fontFamily: '"DM Sans", sans-serif' };
const Fm: React.CSSProperties = { fontFamily: '"JetBrains Mono", monospace', fontWeight: 700 };

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({ children, id, style, className }: {
  children: React.ReactNode; id?: string; style?: React.CSSProperties; className?: string;
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

// ── Categories ────────────────────────────────────────────────────────────────
const CATEGORIES = ['Webinar', 'Hackathon', 'Workshop', 'Conference'] as const;

// ── Testimonials ──────────────────────────────────────────────────────────────
const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Student Council, VIT Chennai',
    text: 'We hosted our annual hackathon through StudentPerks and saw 3x the registrations compared to last year. The reach is unbelievable!',
    rating: 5,
  },
  {
    name: 'Arun Kumar',
    role: 'Coding Club Lead, SRM University',
    text: 'The submission process is so easy. Within 24 hours our workshop was live and students from 8 different colleges signed up.',
    rating: 5,
  },
  {
    name: 'Meera Patel',
    role: 'Event Coordinator, Anna University',
    text: 'StudentPerks gave us the visibility we needed. Our cultural night reached students we never could have reached on our own.',
    rating: 5,
  },
];

export default function EventRegister() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const posterInputRef = useRef<HTMLInputElement>(null);

  const {
    formData, updateField,
    posterFile, setPosterFile, removePoster, posterPreview,
    fieldErrors, submitEvent,
    isSubmitting, isSuccess, progress,
  } = useEventForm();

  // Redirect after success
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => navigate('/events'), 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

  const handlePosterSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        return;
      }
      setPosterFile(file);
    }
  };

  const handlePosterDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size <= 10 * 1024 * 1024) {
        setPosterFile(file);
      }
    }
  };

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <>
      {/* ─ CSS Variables ─ */}
      <style>{`
        :root {
          --el-blue: #1A56DB; --el-blueDark: #1548c7; --el-dark: #0A0A0A;
          --el-body: #374151; --el-muted: #6B7280; --el-border: #E5E7EB;
          --el-blueLight: #EBF2FF; --el-white: #FFFFFF; --el-grayBg: #F9FAFB;
          --el-green: #10B981; --el-greenLight: #ECFDF5; --el-purple: #7C3AED;
          --el-purpleLight: #F3E8FF; --el-red: #EF4444;
          --el-bg-overlay: rgba(255,255,255,0.92);
          --el-shadow-1: rgba(0,0,0,0.08);
        }
        .dark {
          --el-blue: #1A56DB; --el-blueDark: #1548c7; --el-dark: #FFFFFF;
          --el-body: #D1D5DB; --el-muted: #9CA3AF; --el-border: #374151;
          --el-blueLight: rgba(26,86,219,0.15); --el-white: #0A0A0A;
          --el-grayBg: #111827; --el-green: #10B981;
          --el-greenLight: rgba(16,185,129,0.15); --el-purple: #7C3AED;
          --el-purpleLight: rgba(124,58,237,0.15); --el-red: #EF4444;
          --el-bg-overlay: rgba(10,10,10,0.92);
          --el-shadow-1: rgba(0,0,0,0.4);
        }
        .er-cta:hover { background: #1548c7 !important; }
        .er-card:hover { transform: translateY(-2px); box-shadow: 0px 8px 20px rgba(0,0,0,0.10) !important; }
        .er-input:focus { border-color: #1A56DB !important; box-shadow: 0 0 0 3px rgba(26,86,219,0.1) !important; }
        .er-desktop-nav { display: flex !important; }
        .er-mobile-nav { display: none !important; }
        @media (max-width: 767px) {
          .er-desktop-nav { display: none !important; }
          .er-mobile-nav { display: flex !important; }
        }
        @media (max-width: 900px) {
          .er-feat-grid { grid-template-columns: 1fr 1fr !important; }
          .er-steps-grid { flex-direction: column !important; }
          .er-steps-line { display: none !important; }
        }
        @media (max-width: 640px) {
          .er-feat-grid { grid-template-columns: 1fr !important; }
          .er-form-row { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ background: C.white, minHeight: '100vh', ...Fb }}>

        {/* ═══════════════════════════════════════════════════════════════
            NAVIGATION
        ═══════════════════════════════════════════════════════════════ */}
        <nav style={{
          position: 'sticky', top: 0, zIndex: 50,
          background: 'var(--el-bg-overlay)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: `0.8px solid ${C.border}`,
        }}>
          <div style={{
            maxWidth: 1183, margin: '0 auto', padding: '0 24px', height: 64,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }} className="er-desktop-nav">
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
              <div style={{
                width: 32, height: 32, background: C.blue, borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ ...Fd, fontSize: 16, color: '#FFFFFF' }}>S</span>
              </div>
              <span style={{ ...Fb, fontWeight: 700, fontSize: 18, color: C.dark }}>StudentPerks</span>
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
              <Link to="/events" style={{ ...Fb, fontWeight: 500, fontSize: 14, color: C.body, textDecoration: 'none' }}>Events</Link>
              <button onClick={() => scrollTo('how-it-works')} style={{ ...Fb, fontWeight: 500, fontSize: 14, color: C.body, background: 'none', border: 'none', cursor: 'pointer' }}>How It Works</button>
              <button onClick={() => scrollTo('submit-form')} style={{ ...Fb, fontWeight: 500, fontSize: 14, color: C.body, background: 'none', border: 'none', cursor: 'pointer' }}>Submit</button>
              <ThemeToggle />
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
              <Link to="/events" className="er-cta" style={{
                background: C.blue, color: '#FFFFFF',
                ...Fb, fontWeight: 600, fontSize: 14,
                height: 41, padding: '0 20px', borderRadius: 10,
                border: 'none', cursor: 'pointer', transition: 'background 0.15s',
                display: 'inline-flex', alignItems: 'center', textDecoration: 'none',
              }}>Browse Events</Link>
            </div>
          </div>

          {/* Mobile nav */}
          <div className="er-mobile-nav" style={{
            display: 'none', padding: '0 16px', height: 56,
            alignItems: 'center', justifyContent: 'space-between',
          }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
              <div style={{ width: 28, height: 28, background: C.blue, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ ...Fd, fontSize: 14, color: '#FFFFFF' }}>S</span>
              </div>
              <span style={{ ...Fb, fontWeight: 700, fontSize: 16, color: C.dark }}>StudentPerks</span>
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
              <button onClick={() => setMobileMenuOpen(v => !v)} style={{
                width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'none', border: `0.8px solid ${C.border}`, borderRadius: 8, cursor: 'pointer',
              }}>
                {mobileMenuOpen ? <X size={18} color={C.body} /> : <Menu size={18} color={C.body} />}
              </button>
            </div>
          </div>
          {mobileMenuOpen && (
            <div className="er-mobile-nav" style={{
              display: 'flex', flexDirection: 'column', padding: '8px 16px 14px',
              borderTop: `0.8px solid ${C.border}`, gap: 2, background: C.white,
            }}>
              <Link to="/events" onClick={() => setMobileMenuOpen(false)} style={{ ...Fb, fontWeight: 500, fontSize: 15, color: C.body, padding: '10px 12px', textDecoration: 'none' }}>Events</Link>
              <button onClick={() => { scrollTo('how-it-works'); setMobileMenuOpen(false); }} style={{ ...Fb, fontWeight: 500, fontSize: 15, color: C.body, background: 'none', border: 'none', cursor: 'pointer', padding: '10px 12px', textAlign: 'left' }}>How It Works</button>
              <button onClick={() => { scrollTo('submit-form'); setMobileMenuOpen(false); }} style={{ ...Fb, fontWeight: 500, fontSize: 15, color: C.body, background: 'none', border: 'none', cursor: 'pointer', padding: '10px 12px', textAlign: 'left' }}>Submit Event</button>
              {/* Mobile sign in link in dropdown */}
              {!authLoading && !user && (
                <Link to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    ...Fb, fontWeight: 500, fontSize: 15, color: C.blue,
                    padding: '10px 12px', textDecoration: 'none',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                  <LogIn size={16} /> Sign In
                </Link>
              )}
            </div>
          )}
        </nav>

        {/* ═══════════════════════════════════════════════════════════════
            HERO SECTION
        ═══════════════════════════════════════════════════════════════ */}
        <section style={{
          position: 'relative', overflow: 'hidden',
          padding: '100px 24px 80px', textAlign: 'center',
        }}>
          {/* Decorative blurred circles */}
          <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(26,86,219,0.1) 0%, transparent 70%)', filter: 'blur(60px)' }} />
          <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(147,51,234,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }} />
          <div style={{ position: 'absolute', top: '30%', right: '15%', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)', filter: 'blur(50px)' }} />

          <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 2 }}>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span style={{
                ...Fm, fontSize: 11, letterSpacing: 1.5,
                background: C.purpleLight, color: C.purple,
                padding: '6px 16px', borderRadius: 9999,
                display: 'inline-block',
              }}>FOR EVENT ORGANIZERS & CLUBS</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              style={{
                ...Fd, fontSize: 'clamp(36px, 5vw, 60px)',
                color: C.dark, margin: '24px 0 16px', lineHeight: 1.15,
              }}
            >
              Host Your Event on{' '}
              <span style={{
                background: 'linear-gradient(135deg, #1A56DB, #9333EA)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>StudentPerks</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              style={{
                ...Fb, fontWeight: 400, fontSize: 'clamp(16px, 1.3vw, 20px)',
                color: C.body, lineHeight: 1.6, maxWidth: 600, margin: '0 auto',
              }}
            >
              Reach 50,000+ verified students across Tamil Nadu. Submit your event
              in minutes, get instant visibility, and track engagement in real-time.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 40, flexWrap: 'wrap' }}
            >
              <button
                onClick={() => scrollTo('submit-form')}
                className="er-cta"
                style={{
                  background: C.blue, color: '#FFFFFF',
                  ...Fb, fontWeight: 600, fontSize: 16,
                  height: 56, padding: '0 32px', borderRadius: 12,
                  border: 'none', cursor: 'pointer', transition: 'background 0.15s',
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  boxShadow: '0px 12px 28px rgba(26,86,219,0.25)',
                }}
              >Submit Your Event <ArrowRight size={18} /></button>
              <button
                onClick={() => scrollTo('how-it-works')}
                style={{
                  background: 'transparent', color: C.dark,
                  ...Fb, fontWeight: 600, fontSize: 16,
                  height: 56, padding: '0 32px', borderRadius: 12,
                  border: `2px solid ${C.blue}`, cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >See How It Works</button>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            WHY HOST WITH US
        ═══════════════════════════════════════════════════════════════ */}
        <Section style={{ background: C.grayBg, padding: '80px 24px' }}>
          <div style={{ maxWidth: 1183, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <span style={{
                ...Fb, fontWeight: 500, fontSize: 12, color: C.blue,
                background: C.blueLight, padding: '4px 14px', borderRadius: 9999,
                letterSpacing: 0.5, textTransform: 'uppercase',
              }}>WHY STUDENTPERKS</span>
              <h2 style={{ ...Fd, fontSize: 36, color: C.dark, margin: '16px 0 12px' }}>Why Host With Us</h2>
              <p style={{ ...Fb, fontWeight: 400, fontSize: 16, color: C.muted, maxWidth: 500, margin: '0 auto' }}>
                Everything you need to make your campus event a success
              </p>
            </div>

            <div className="er-feat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
              {[
                { icon: <Users size={24} color={C.blue} />, color: C.blueLight, title: 'Reach Verified Students', desc: 'Access 50,000+ verified college students across 12 campuses in Tamil Nadu.' },
                { icon: <Megaphone size={24} color={C.purple} />, color: C.purpleLight, title: 'Promote Across Campuses', desc: 'Your event gets visibility across all partner colleges simultaneously.' },
                { icon: <Shield size={24} color={C.green} />, color: C.greenLight, title: 'Easy Approval Process', desc: 'Simple submission form with quick review. Verified colleges get instant approval.' },
                { icon: <Eye size={24} color="#D97706" />, color: '#FFFBEB', title: 'Boost Event Visibility', desc: 'Featured placements, search optimization, and social sharing built in.' },
              ].map(card => (
                <div key={card.title} className="er-card" style={{
                  background: C.white, border: `0.8px solid ${C.border}`,
                  borderRadius: 16, padding: 28,
                  boxShadow: '0px 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.2s',
                }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14, background: card.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20,
                  }}>{card.icon}</div>
                  <h3 style={{ ...Fb, fontWeight: 600, fontSize: 18, color: C.dark, margin: '0 0 8px' }}>{card.title}</h3>
                  <p style={{ ...Fb, fontWeight: 400, fontSize: 14, color: C.muted, margin: 0, lineHeight: '22px' }}>{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ═══════════════════════════════════════════════════════════════
            HOW IT WORKS
        ═══════════════════════════════════════════════════════════════ */}
        <Section id="how-it-works" style={{ padding: '100px 24px', background: C.white }}>
          <div style={{ maxWidth: 952, margin: '0 auto' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <span style={{
                ...Fb, fontWeight: 600, fontSize: 12, color: '#9333EA',
                background: '#F3E8FF', padding: '6px 18px', borderRadius: 9999,
                letterSpacing: 0.5, textTransform: 'uppercase', display: 'inline-block',
              }}>3 SIMPLE STEPS</span>
              <h2 style={{ ...Fd, fontSize: 38, color: C.dark, margin: '20px 0 0' }}>How It Works</h2>
            </div>

            {/* Steps */}
            <div className="er-steps-grid" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 40, position: 'relative' }}>
              {/* Progress line (behind circles) */}
              <div className="er-steps-line" style={{
                position: 'absolute', top: 55, left: '17%', right: '17%',
                height: 3, background: '#E5E7EB',
                borderRadius: 2, zIndex: 0,
              }} />
              <div className="er-steps-line" style={{
                position: 'absolute', top: 55, left: '17%', right: '17%',
                height: 3, background: 'linear-gradient(90deg, #1A56DB, #9333EA 50%, #10B981)',
                borderRadius: 2, zIndex: 0,
              }} />

              {[
                {
                  step: '01',
                  icon: <FileText size={30} color="#FFFFFF" strokeWidth={2} />,
                  gradient: 'linear-gradient(135deg, #1A56DB, #3B82F6)',
                  shadow: 'rgba(26,86,219,0.3)',
                  title: 'Submit Details',
                  desc: 'Fill out the event form with all details, poster, and registration link.',
                },
                {
                  step: '02',
                  icon: <Search size={30} color="#FFFFFF" strokeWidth={2} />,
                  gradient: 'linear-gradient(135deg, #9333EA, #C026D3)',
                  shadow: 'rgba(147,51,234,0.3)',
                  title: 'Review & Approval',
                  desc: 'Our team reviews your submission within 24 hours for quality and compliance.',
                },
                {
                  step: '03',
                  icon: <Rocket size={30} color="#FFFFFF" strokeWidth={2} />,
                  gradient: 'linear-gradient(135deg, #10B981, #14B8A6)',
                  shadow: 'rgba(16,185,129,0.3)',
                  title: 'Event Goes Live',
                  desc: 'Your event is published, promoted, and visible to thousands of students.',
                },
              ].map(step => (
                <div key={step.step} style={{ flex: 1, textAlign: 'center', position: 'relative', zIndex: 1 }}>
                  {/* Icon circle */}
                  <div style={{
                    width: 110, height: 110, borderRadius: '50%',
                    background: step.gradient,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto', boxShadow: `0 14px 36px ${step.shadow}`,
                  }}>
                    {step.icon}
                  </div>
                  {/* Step label */}
                  <p style={{
                    ...Fm, fontSize: 13, color: '#9CA3AF',
                    letterSpacing: 1.5, margin: '27px 0 0', lineHeight: '19.5px',
                  }}>STEP {step.step}</p>
                  {/* Title */}
                  <h3 style={{ ...Fb, fontWeight: 700, fontSize: 20, color: C.dark, margin: '10px 0 8px', lineHeight: '30px' }}>{step.title}</h3>
                  {/* Description */}
                  <p style={{ ...Fb, fontWeight: 400, fontSize: 14, color: '#6B7280', margin: 0, lineHeight: '23px', maxWidth: 260, marginLeft: 'auto', marginRight: 'auto' }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ═══════════════════════════════════════════════════════════════
            EVENT SUBMISSION FORM
        ═══════════════════════════════════════════════════════════════ */}
        <Section id="submit-form" style={{ background: C.grayBg, padding: '80px 24px' }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <span style={{
                ...Fb, fontWeight: 500, fontSize: 12, color: C.blue,
                background: C.blueLight, padding: '4px 14px', borderRadius: 9999,
                letterSpacing: 0.5, textTransform: 'uppercase',
              }}>EVENT SUBMISSION</span>
              <h2 style={{ ...Fd, fontSize: 36, color: C.dark, margin: '16px 0 12px' }}>Submit Your Event</h2>
              <p style={{ ...Fb, fontWeight: 400, fontSize: 16, color: C.muted, maxWidth: 460, margin: '0 auto' }}>
                Fill in the details below and your event will be reviewed within 24 hours
              </p>
            </div>

            {/* Auth gate - show login prompt if not authenticated */}
            {!authLoading && !user ? (
              <div style={{
                background: C.white, border: `0.8px solid ${C.border}`,
                borderRadius: 20, padding: '60px 36px',
                boxShadow: '0px 12px 40px var(--el-shadow-1)',
                textAlign: 'center',
              }}>
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: C.blueLight,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 24px',
                }}>
                  <LogIn size={32} color={C.blue} />
                </div>
                <h3 style={{ ...Fd, fontSize: 28, color: C.dark, margin: '0 0 12px' }}>
                  Sign in to Submit an Event
                </h3>
                <p style={{ ...Fb, fontWeight: 400, fontSize: 16, color: C.muted, maxWidth: 420, margin: '0 auto 32px', lineHeight: '26px' }}>
                  You need to be logged in to submit events. This helps us verify organizers and ensure event quality.
                </p>
                <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link
                    to="/login"
                    className="er-cta"
                    style={{
                      background: C.blue, color: '#FFFFFF',
                      ...Fb, fontWeight: 600, fontSize: 16,
                      height: 52, padding: '0 32px', borderRadius: 12,
                      border: 'none', cursor: 'pointer', transition: 'background 0.15s',
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      textDecoration: 'none',
                      boxShadow: '0px 10px 25px rgba(26,86,219,0.25)',
                    }}
                  >
                    <LogIn size={18} /> Sign In
                  </Link>
                  <Link
                    to="/signup"
                    style={{
                      background: 'transparent', color: C.dark,
                      ...Fb, fontWeight: 600, fontSize: 16,
                      height: 52, padding: '0 32px', borderRadius: 12,
                      border: `2px solid ${C.border}`, cursor: 'pointer',
                      transition: 'all 0.15s',
                      display: 'inline-flex', alignItems: 'center',
                      textDecoration: 'none',
                    }}
                  >
                    Create Account
                  </Link>
                </div>
              </div>
            ) : (

            <div style={{
              background: C.white, border: `0.8px solid ${C.border}`,
              borderRadius: 20, padding: '40px 36px',
              boxShadow: '0px 12px 40px var(--el-shadow-1)',
            }}>
              {/* Progress bar */}
              <div style={{ marginBottom: 32 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ ...Fb, fontWeight: 500, fontSize: 13, color: C.body }}>Form Progress</span>
                  <span style={{ ...Fm, fontSize: 13, color: C.blue }}>{progress}%</span>
                </div>
                <div style={{ height: 6, background: C.grayBg, borderRadius: 3, overflow: 'hidden' }}>
                  <motion.div
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4 }}
                    style={{
                      height: '100%', borderRadius: 3,
                      background: progress === 100 ? C.green : `linear-gradient(90deg, ${C.blue}, ${C.purple})`,
                    }}
                  />
                </div>
              </div>

              {/* Event Title */}
              <FieldWrapper label="Event Title" required error={fieldErrors.title}>
                <input
                  className="er-input"
                  value={formData.title}
                  onChange={e => updateField('title', e.target.value)}
                  placeholder="e.g., National Hackathon 2026"
                  maxLength={255}
                  style={inputStyle}
                />
              </FieldWrapper>

              {/* Organizer */}
              <FieldWrapper label="Organizing Club / Name" required error={fieldErrors.organizer}>
                <input
                  className="er-input"
                  value={formData.organizer}
                  onChange={e => updateField('organizer', e.target.value)}
                  placeholder="e.g., VIT Coding Club"
                  maxLength={255}
                  style={inputStyle}
                />
              </FieldWrapper>

              {/* Email + Phone (2-col) */}
              <div className="er-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <FieldWrapper label="Organizer Email" icon={<Mail size={16} color={C.muted} />}>
                  <input
                    className="er-input"
                    type="email"
                    value={formData.organizerEmail}
                    onChange={e => updateField('organizerEmail', e.target.value)}
                    placeholder="club@college.edu"
                    style={inputStyle}
                  />
                </FieldWrapper>
                <FieldWrapper label="Phone Number" icon={<Phone size={16} color={C.muted} />}>
                  <input
                    className="er-input"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={e => updateField('phoneNumber', e.target.value)}
                    placeholder="+91 98765 43210"
                    style={inputStyle}
                  />
                </FieldWrapper>
              </div>

              {/* Category */}
              <FieldWrapper label="Category" required error={fieldErrors.category}>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => updateField('category', cat)}
                      style={{
                        ...Fb, fontWeight: 500, fontSize: 13,
                        padding: '8px 20px', borderRadius: 9999,
                        background: formData.category === cat ? C.blue : C.grayBg,
                        color: formData.category === cat ? '#FFFFFF' : C.body,
                        border: `1px solid ${formData.category === cat ? C.blue : C.border}`,
                        cursor: 'pointer', transition: 'all 0.15s',
                      }}
                    >{cat}</button>
                  ))}
                </div>
              </FieldWrapper>

              {/* Date + Time (2-col) */}
              <div className="er-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <FieldWrapper label="Event Date" required error={fieldErrors.eventDate} icon={<Calendar size={16} color={C.muted} />}>
                  <input
                    className="er-input"
                    type="date"
                    value={formData.eventDate}
                    onChange={e => updateField('eventDate', e.target.value)}
                    min={todayStr}
                    style={inputStyle}
                  />
                </FieldWrapper>
                <FieldWrapper label="Time" required error={fieldErrors.time} icon={<Clock size={16} color={C.muted} />}>
                  <input
                    className="er-input"
                    type="time"
                    value={formData.time}
                    onChange={e => updateField('time', e.target.value)}
                    style={inputStyle}
                  />
                </FieldWrapper>
              </div>

              {/* Location */}
              <FieldWrapper label="Event Location" icon={<MapPin size={16} color={C.muted} />}>
                <input
                  className="er-input"
                  value={formData.location}
                  onChange={e => updateField('location', e.target.value)}
                  placeholder="e.g., Main Auditorium, VIT Chennai or 'Online'"
                  maxLength={255}
                  style={inputStyle}
                />
              </FieldWrapper>

              {/* Description */}
              <FieldWrapper label="Short Description" required error={fieldErrors.description}>
                <textarea
                  className="er-input"
                  value={formData.description}
                  onChange={e => updateField('description', e.target.value)}
                  placeholder="Describe your event, what attendees can expect, prerequisites..."
                  maxLength={5000}
                  style={{
                    ...inputStyle,
                    height: 120, padding: '12px 14px', resize: 'vertical' as const,
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
                  <span style={{
                    ...Fm, fontSize: 11,
                    color: formData.description.length > 4500 ? C.red : C.muted,
                  }}>{formData.description.length}/5000</span>
                </div>
              </FieldWrapper>

              {/* Poster Upload */}
              <FieldWrapper label="Upload Event Poster">
                <input
                  ref={posterInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handlePosterSelect}
                  style={{ display: 'none' }}
                />
                {posterPreview ? (
                  <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: `0.8px solid ${C.border}` }}>
                    <img src={posterPreview} alt="Poster preview" style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }} />
                    <button
                      type="button"
                      onClick={removePoster}
                      style={{
                        position: 'absolute', top: 10, right: 10,
                        width: 32, height: 32, borderRadius: '50%',
                        background: 'rgba(0,0,0,0.6)', color: '#fff',
                        border: 'none', cursor: 'pointer', fontSize: 16,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    ><X size={16} /></button>
                  </div>
                ) : (
                  <div
                    onClick={() => posterInputRef.current?.click()}
                    onDragOver={e => e.preventDefault()}
                    onDrop={handlePosterDrop}
                    style={{
                      border: `2px dashed ${C.border}`,
                      borderRadius: 12, padding: '32px 0',
                      textAlign: 'center', cursor: 'pointer',
                      background: C.grayBg, transition: 'border-color 0.15s',
                    }}
                  >
                    <Upload size={28} color={C.muted} />
                    <p style={{ ...Fb, fontWeight: 500, fontSize: 14, color: C.body, margin: '12px 0 4px' }}>
                      Click to upload or drag and drop
                    </p>
                    <p style={{ ...Fb, fontWeight: 400, fontSize: 12, color: C.muted, margin: 0 }}>
                      JPG, PNG, GIF, WebP up to 10MB
                    </p>
                  </div>
                )}
              </FieldWrapper>

              {/* Registration Link */}
              <FieldWrapper label="Registration Link" error={fieldErrors.registrationLink}>
                <input
                  className="er-input"
                  value={formData.registrationLink}
                  onChange={e => updateField('registrationLink', e.target.value)}
                  placeholder="https://forms.google.com/... (optional)"
                  maxLength={500}
                  style={inputStyle}
                />
              </FieldWrapper>

              {/* Submit Button */}
              <button
                type="button"
                onClick={submitEvent}
                disabled={isSubmitting || progress < 100}
                className={progress === 100 && !isSubmitting ? 'er-cta' : ''}
                style={{
                  width: '100%', height: 52, marginTop: 8,
                  background: isSubmitting ? C.muted : progress < 100 ? '#9CA3AF' : C.blue,
                  color: '#FFFFFF',
                  ...Fb, fontWeight: 600, fontSize: 16,
                  borderRadius: 12, border: 'none',
                  cursor: isSubmitting || progress < 100 ? 'not-allowed' : 'pointer',
                  transition: 'background 0.15s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  boxShadow: progress === 100 ? '0px 10px 25px rgba(26,86,219,0.25)' : 'none',
                }}
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }}
                    />
                    Submitting...
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle size={18} /> Event Submitted!
                  </>
                ) : (
                  <>Submit Event <ArrowRight size={16} /></>
                )}
              </button>

              {progress < 100 && !isSubmitting && (
                <p style={{ ...Fb, fontSize: 12, color: C.muted, textAlign: 'center', margin: '12px 0 0' }}>
                  Please fill all required fields to enable submission
                </p>
              )}
            </div>

            )}
          </div>
        </Section>

        {/* ═══════════════════════════════════════════════════════════════
            TESTIMONIALS
        ═══════════════════════════════════════════════════════════════ */}
        <Section style={{ padding: '80px 24px' }}>
          <div style={{ maxWidth: 1183, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <span style={{
                ...Fb, fontWeight: 500, fontSize: 12, color: C.green,
                background: C.greenLight, padding: '4px 14px', borderRadius: 9999,
                letterSpacing: 0.5, textTransform: 'uppercase',
              }}>TESTIMONIALS</span>
              <h2 style={{ ...Fd, fontSize: 36, color: C.dark, margin: '16px 0 12px' }}>
                Trusted by Event Organizers
              </h2>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: C.greenLight, padding: '6px 16px', borderRadius: 9999,
                marginTop: 8,
              }}>
                <CheckCircle size={14} color={C.green} />
                <span style={{ ...Fm, fontSize: 12, color: C.green }}>50+ events hosted successfully</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }} className="er-feat-grid">
              {testimonials.map(t => (
                <div key={t.name} className="er-card" style={{
                  background: C.white, border: `0.8px solid ${C.border}`,
                  borderRadius: 16, padding: 28,
                  boxShadow: '0px 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.2s',
                }}>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={16} color="#F59E0B" fill="#F59E0B" />
                    ))}
                  </div>
                  <p style={{ ...Fb, fontWeight: 400, fontSize: 14, color: C.body, margin: '0 0 20px', lineHeight: '22px' }}>
                    "{t.text}"
                  </p>
                  <div>
                    <p style={{ ...Fb, fontWeight: 600, fontSize: 14, color: C.dark, margin: 0 }}>{t.name}</p>
                    <p style={{ ...Fb, fontWeight: 400, fontSize: 12, color: C.muted, margin: '2px 0 0' }}>{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Common Footer */}
        <Footer />
      </div>
    </>
  );
}

// ── Input style helper ────────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: '100%', height: 44,
  border: '0.8px solid var(--el-border)',
  borderRadius: 10, padding: '0 14px',
  fontFamily: '"DM Sans", sans-serif', fontWeight: 400, fontSize: 14,
  color: 'var(--el-body)', background: 'var(--el-white)',
  outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.15s, box-shadow 0.15s',
};

// ── FieldWrapper component ────────────────────────────────────────────────────
function FieldWrapper({ label, children, required, error, icon }: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  error?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{
        fontFamily: '"DM Sans", sans-serif', fontWeight: 500, fontSize: 13,
        color: 'var(--el-body)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6,
      }}>
        {icon}
        {label}
        {required && <span style={{ color: 'var(--el-red)' }}>*</span>}
      </label>
      {children}
      {error && (
        <p style={{
          fontFamily: '"DM Sans", sans-serif', fontWeight: 400, fontSize: 12,
          color: 'var(--el-red)', margin: '4px 0 0',
        }}>{error}</p>
      )}
    </div>
  );
}
