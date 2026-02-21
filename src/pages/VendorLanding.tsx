import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  ClipboardList, ShieldCheck, MapPin, BarChart3,
  Users, Clock, TrendingUp, DollarSign,
  Check, Upload, Building2, Phone, Mail, MapPinned,
  Eye, MousePointerClick, GraduationCap, Ruler,
  ChevronUp, Quote,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { day: 'Mon', engagement: 310 },
  { day: 'Tue', engagement: 340 },
  { day: 'Wed', engagement: 300 },
  { day: 'Thu', engagement: 350 },
  { day: 'Fri', engagement: 420 },
  { day: 'Sat', engagement: 490 },
  { day: 'Sun', engagement: 560 },
];

const steps = [
  {
    num: 1,
    title: 'Register Business',
    desc: 'Submit business name, category, location, and discount percentage.',
    icon: ClipboardList,
  },
  {
    num: 2,
    title: 'Get Verified',
    desc: 'Upload business registration proof. Approval within 48 hours.',
    icon: ShieldCheck,
  },
  {
    num: 3,
    title: 'Appear on Map',
    desc: 'Your discount goes live. Students discover you through location-based search.',
    icon: MapPin,
  },
  {
    num: 4,
    title: 'Monitor Analytics',
    desc: 'Access real-time data on impressions, clicks, and student visits.',
    icon: BarChart3,
  },
];

const benefits = [
  {
    icon: ShieldCheck,
    title: 'Verified Students Only',
    desc: 'Every user is a verified college student with .edu email confirmation — no bots, no spam.',
  },
  {
    icon: Users,
    title: 'Foot Traffic When It Counts',
    desc: "Students discover you when they're nearby — peak visibility during lunch and after class.",
  },
  {
    icon: TrendingUp,
    title: 'Performance Insights',
    desc: 'Track impressions, clicks, peak hours, and nearby college engagement in real time.',
  },
  {
    icon: DollarSign,
    title: 'Free to Start',
    desc: 'Basic listing is always free. Upgrade to featured placement when ready.',
  },
];

const testimonials = [
  {
    quote: '"We saw a 40% increase in student footfall within 2 weeks of listing. The heatmap feature helped us adjust our discount timing perfectly."',
    name: 'Rajesh Kumar',
    business: 'CopyQuick Print Hub, Anna Nagar',
    tag: '📄 Print',
    initials: 'RK',
  },
  {
    quote: '"StudentPerks brought a whole new demographic to our cafe. During exam week, our orders tripled. The location-based discovery is a game changer."',
    name: 'Priya Lakshmi',
    business: 'BrewBean Cafe, Adyar',
    tag: '☕ Cafe',
    initials: 'PL',
  },
  {
    quote: '"The analytics dashboard showed us exactly when students shop. We now run flash discounts during peak hours and our revenue is up 25%."',
    name: 'Vikram Sundaram',
    business: 'StudyMart Stationery, T. Nagar',
    tag: '📝 Stationery',
    initials: 'VS',
  },
];

const stats = [
  { label: 'Map Impressions', value: '2,847', change: '+18% ↑', positive: true, icon: Eye },
  { label: 'Detail Views', value: '412', change: '+24% ↑', positive: true, icon: Eye },
  { label: 'Click-Throughs', value: '89', change: '+9% ↑', positive: true, icon: MousePointerClick },
  { label: 'Peak Hour', value: '1:30 PM', change: 'Steady', positive: false, icon: Clock },
  { label: 'Nearby Colleges', value: '3', change: 'campuses', positive: false, icon: GraduationCap },
  { label: 'Avg. Distance', value: '0.4 km', change: 'from colleges', positive: false, icon: Ruler },
];

const basicFeatures = ['Map placement', 'Discount badge', 'Basic analytics', 'Category filters', 'Email support'];
const premiumFeatures = [
  'Everything in Basic',
  'Priority map placement',
  'Heatmap boost during peak hours',
  'Advanced analytics dashboard',
  'Nearby college insights',
  'Dedicated account manager',
];

export default function VendorLanding() {
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white font-['DM_Sans',sans-serif]">
      {/* ─── Navigation ─── */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-[1140px] mx-auto px-6 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
              <span className="text-white font-bold text-sm font-['Playfair_Display',serif]">S</span>
            </div>
            <span className="font-semibold text-gray-900 text-lg font-['DM_Sans',sans-serif]">StudentPerks</span>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">For Vendors</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo('how-it-works')} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">How It Works</button>
            <button onClick={() => scrollTo('benefits')} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Benefits</button>
            <button onClick={() => scrollTo('pricing')} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Pricing</button>
            <button onClick={() => scrollTo('apply')} className="bg-gray-900 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors">Apply Now</button>
          </div>
        </div>
      </nav>

      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50/80 via-white to-emerald-50/40">
        <div className="max-w-[1140px] mx-auto px-6 pt-16 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-block text-xs font-semibold tracking-[1.5px] uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-6">FOR BUSINESSES</span>
              <h1 className="font-['Playfair_Display',serif] font-bold text-[42px] leading-[1.2] text-gray-950 mb-6">
                Reach 10,000+ Verified Students Around Your Shop
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed mb-10 max-w-[520px]">
                Join Tamil Nadu's leading student discount network. Get discovered by nearby college students, boost footfall, and track results — all from a single dashboard.
              </p>

              {/* Stat boxes */}
              <div className="flex gap-4 mb-10">
                {[
                  { value: '5,664', label: 'Colleges' },
                  { value: '50K+', label: 'Students' },
                  { value: 'TN', label: 'Tamil Nadu Wide' },
                ].map((s) => (
                  <div key={s.label} className="bg-white border border-gray-200 rounded-xl px-4 py-3">
                    <p className="font-bold text-2xl text-gray-900 font-['JetBrains_Mono',monospace]">{s.value}</p>
                    <p className="text-sm text-gray-500">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-4">
                <button
                  onClick={() => scrollTo('apply')}
                  className="inline-flex items-center justify-center bg-blue-600 text-white font-medium px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors w-fit text-base"
                >
                  Become a Partner →
                </button>
                <button
                  onClick={() => scrollTo('how-it-works')}
                  className="text-sm text-blue-600 hover:text-blue-700 underline underline-offset-2 w-fit"
                >
                  See how it works ↓
                </button>
              </div>
            </motion.div>

            {/* Right - Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                {/* Verified badge floating */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="absolute -top-3 -left-3 z-10 bg-white rounded-xl shadow-lg border border-gray-100 px-3 py-2.5 flex items-center gap-2.5"
                >
                  <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">Verified Partner</p>
                    <p className="text-[11px] text-gray-500">Active</p>
                  </div>
                </motion.div>

                {/* Main dashboard card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                  {/* Title bar */}
                  <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-600" />
                      <span className="text-sm font-medium text-gray-700">StudentPerks Vendor Dashboard</span>
                    </div>
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-gray-200" />
                      <div className="w-3 h-3 rounded-full bg-gray-200" />
                      <div className="w-3 h-3 rounded-full bg-gray-200" />
                    </div>
                  </div>

                  {/* Map grid mockup */}
                  <div className="px-6 py-5">
                    <div className="relative bg-gray-50 rounded-xl h-[280px] border border-gray-100 overflow-hidden">
                      {/* Grid lines */}
                      <div className="absolute inset-0">
                        <div className="absolute left-1/3 top-0 bottom-0 w-px bg-gray-200" />
                        <div className="absolute left-2/3 top-0 bottom-0 w-px bg-gray-200" />
                        <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-200" />
                      </div>
                      {/* Circular zones */}
                      <div className="absolute left-[22%] top-[28%] w-32 h-32 rounded-full bg-blue-100/40 border border-blue-200/30" />
                      <div className="absolute left-[45%] top-[48%] w-24 h-24 rounded-full bg-blue-100/30 border border-blue-200/20" />
                      {/* Discount pins */}
                      {[
                        { pct: '15%', left: '17%', top: '23%' },
                        { pct: '25%', left: '50%', top: '37%' },
                        { pct: '10%', left: '30%', top: '60%' },
                        { pct: '20%', left: '67%', top: '53%' },
                      ].map((pin) => (
                        <div key={pin.pct + pin.left} className="absolute w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center" style={{ left: pin.left, top: pin.top }}>
                          <span className="text-[11px] font-semibold text-gray-700">{pin.pct}</span>
                        </div>
                      ))}
                      {/* Featured pin with tooltip */}
                      <div className="absolute left-[38%] top-[12%]">
                        <div className="w-12 h-12 rounded-full bg-blue-600 shadow-lg flex items-center justify-center border-2 border-white">
                          <span className="text-xs font-bold text-white">30%</span>
                        </div>
                        {/* Tooltip */}
                        <div className="absolute -top-[110px] left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-xl border border-gray-200 p-3 w-[180px]">
                          <p className="text-sm font-semibold text-gray-900">CopyQuick Print Hub</p>
                          <div className="flex gap-1.5 mt-1.5">
                            <span className="text-[11px] font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">30% OFF</span>
                            <span className="text-[11px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Medium</span>
                          </div>
                          <button className="mt-2 w-full bg-blue-600 text-white text-xs font-medium py-1.5 rounded-lg">View Deal</button>
                          <div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 bg-white border-r border-b border-gray-200 rotate-45" />
                        </div>
                      </div>
                    </div>

                    {/* Bottom stats */}
                    <div className="flex gap-4 mt-4">
                      {[
                        { icon: Eye, value: '2.8K', label: 'Impressions' },
                        { icon: GraduationCap, value: '3 colleges', label: 'Nearby' },
                        { icon: ShieldCheck, value: '100%', label: 'Verified' },
                      ].map((s) => (
                        <div key={s.label} className="flex-1 bg-gray-50 rounded-xl p-3 flex items-center gap-2.5">
                          <s.icon className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{s.value}</p>
                            <p className="text-[11px] text-gray-500">{s.label}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Weekly trend floating card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                  className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg border border-gray-100 p-4 w-[150px]"
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-medium text-gray-700">Weekly Trend</span>
                  </div>
                  <div className="flex gap-1 items-end h-10 mb-2">
                    {[12, 18, 14, 22, 20, 26, 28].map((h, i) => (
                      <div key={i} className="flex-1 bg-blue-500 rounded-sm" style={{ height: `${h}px` }} />
                    ))}
                  </div>
                  <p className="text-[11px] text-emerald-600 font-medium">+24% ↑ this week</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-[1140px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-xs font-semibold tracking-[1.5px] uppercase text-gray-500 mb-3">SIMPLE PROCESS</p>
            <h2 className="font-['Playfair_Display',serif] font-bold text-4xl text-gray-950 mb-4">
              Start Appearing in Front of Students in 3 Steps
            </h2>
            <p className="text-lg text-gray-500">From registration to live visibility in under 48 hours.</p>
          </motion.div>

          {/* Step connector line */}
          <div className="relative">
            <div className="hidden md:block absolute top-[60px] left-[14%] right-[14%] h-0.5 bg-gray-200" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {steps.map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="relative bg-white border border-gray-200 rounded-2xl p-8"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                      <span className="text-xl font-bold text-blue-600 font-['JetBrains_Mono',monospace]">{step.num}</span>
                    </div>
                    <step.icon className="w-7 h-7 text-gray-300" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Map Preview Section ─── */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-[1140px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="font-['Playfair_Display',serif] font-bold text-4xl text-gray-950 mb-4">
              See How Your Business Appears
            </h2>
            <p className="text-lg text-gray-500 max-w-[640px]">
              Interactive map placement with discount badge, crowd density indicator, and one-tap deal view for students.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Map mockup (larger) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3 bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="relative bg-gray-50 rounded-xl h-[480px] border border-gray-100 overflow-hidden">
                  {/* Grid */}
                  <div className="absolute inset-0">
                    <div className="absolute left-[30%] top-0 bottom-0 w-px bg-gray-200" />
                    <div className="absolute left-[75%] top-0 bottom-0 w-px bg-gray-200" />
                    <div className="absolute top-[40%] left-0 right-0 h-px bg-gray-200" />
                    <div className="absolute left-[10%] top-[60%] right-[30%] h-0.5 bg-gray-200" />
                    <div className="absolute left-[55%] top-[20%] bottom-[30%] w-0.5 bg-gray-200" />
                  </div>
                  {/* Heatmap zones */}
                  <div className="absolute left-[28%] top-[22%] w-40 h-40 rounded-full bg-blue-100/40" />
                  <div className="absolute left-[58%] top-[45%] w-32 h-32 rounded-full bg-blue-100/30" />
                  <div className="absolute left-[12%] top-[55%] w-24 h-24 rounded-full bg-orange-100/30" />
                  {/* Discount pins */}
                  {[
                    { pct: '15%', x: '13%', y: '17%' },
                    { pct: '10%', x: '20%', y: '53%' },
                    { pct: '25%', x: '62%', y: '42%' },
                    { pct: '20%', x: '48%', y: '67%' },
                  ].map((pin) => (
                    <div key={pin.pct + pin.x} className="absolute w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center" style={{ left: pin.x, top: pin.y }}>
                      <span className="text-[11px] font-semibold text-gray-700">{pin.pct}</span>
                    </div>
                  ))}
                  {/* Main featured pin */}
                  <div className="absolute left-[35%] top-[30%]">
                    <div className="w-12 h-12 rounded-full bg-blue-600 shadow-lg flex items-center justify-center border-2 border-white">
                      <span className="text-xs font-bold text-white">30%</span>
                    </div>
                    <div className="absolute -top-[115px] left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-xl border border-gray-200 p-3 w-[190px]">
                      <p className="text-sm font-semibold text-gray-900">CopyQuick Print Hub</p>
                      <div className="flex gap-1.5 mt-1.5">
                        <span className="text-[11px] font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">30% OFF</span>
                        <span className="text-[11px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Medium</span>
                      </div>
                      <button className="mt-2 w-full bg-blue-600 text-white text-xs font-medium py-2 rounded-lg">View Deal</button>
                      <div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 bg-white border-r border-b border-gray-200 rotate-45" />
                    </div>
                  </div>
                  {/* Traffic legend */}
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-4 text-[11px]">
                    <span className="font-medium text-gray-500">Traffic:</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-emerald-400" /> Low</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-400" /> Medium</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-400" /> High</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Feature list (right) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2 flex flex-col gap-5"
            >
              {[
                {
                  icon: MapPinned,
                  title: 'Prime Placement',
                  desc: 'Appear when students filter by category and distance. Your business shown prominently on the map.',
                },
                {
                  icon: Eye,
                  title: 'Highlight Your Offer',
                  desc: 'Your discount % prominently displayed on every marker. Attract attention instantly.',
                },
                {
                  icon: TrendingUp,
                  title: 'Traffic Intelligence',
                  desc: 'Get featured during high-traffic periods automatically. Maximise student visibility.',
                },
              ].map((f, i) => (
                <div key={f.title} className="bg-white rounded-2xl border border-gray-200 p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <f.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{f.title}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Benefits ─── */}
      <section id="benefits" className="py-24 px-6">
        <div className="max-w-[1140px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-['Playfair_Display',serif] font-bold text-4xl text-gray-950 mb-4">
              Why Local Businesses Choose StudentPerks
            </h2>
            <p className="text-lg text-gray-500">Data-driven exposure. Verified student traffic. Measurable results.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-gray-200 rounded-2xl p-10"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
                  <b.icon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="font-semibold text-xl text-gray-900 mb-3">{b.title}</h3>
                <p className="text-gray-500 leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Analytics Dashboard ─── */}
      <section className="py-24 px-6" style={{ background: 'linear-gradient(143deg, #ebf2ff 0%, #ecfdf5 100%)' }}>
        <div className="max-w-[1140px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <p className="text-xs font-semibold tracking-[1.5px] uppercase text-gray-500 mb-2">VENDOR DASHBOARD</p>
            <h2 className="font-['Playfair_Display',serif] font-bold text-4xl text-gray-950 mb-3">Track What Matters</h2>
            <p className="text-lg text-gray-600">Real-time analytics dashboard included with every partnership.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl border border-gray-200 shadow-xl p-8"
          >
            {/* Stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {stats.map((s) => (
                <div key={s.label} className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                  <p className="text-xs font-medium tracking-wider uppercase text-gray-500 mb-2">{s.label}</p>
                  <p className="text-2xl font-bold text-gray-950 font-['JetBrains_Mono',monospace] mb-2">{s.value}</p>
                  <p className={`text-sm font-medium ${s.positive ? 'text-emerald-500' : 'text-gray-500'}`}>{s.change}</p>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">Weekly Engagement</h4>
                <span className="text-sm font-medium text-emerald-500">+18% this week</span>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="engagementGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} domain={[0, 600]} ticks={[0, 150, 300, 450, 600]} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px' }}
                  />
                  <Area type="monotone" dataKey="engagement" stroke="#3b82f6" strokeWidth={2} fill="url(#engagementGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="py-24 px-6">
        <div className="max-w-[1140px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-['Playfair_Display',serif] font-bold text-4xl text-gray-950">
              Trusted by Tamil Nadu Businesses
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm"
              >
                <Quote className="w-8 h-8 text-gray-200 mb-4" />
                <p className="italic text-gray-600 leading-relaxed mb-8">{t.quote}</p>
                <div className="border-t border-gray-200 pt-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">{t.initials}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-[15px]">{t.name}</p>
                      <p className="text-xs text-gray-500">{t.business}</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">{t.tag}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing ─── */}
      <section id="pricing" className="py-24 px-6 bg-gray-50">
        <div className="max-w-[1000px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-['Playfair_Display',serif] font-bold text-4xl text-gray-950 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-500">Start free. Upgrade when you're ready.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Basic */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white border border-gray-200 rounded-2xl p-10"
            >
              <span className="inline-block text-xs font-semibold tracking-wider uppercase text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full mb-6">ALWAYS FREE</span>
              <h3 className="font-semibold text-2xl text-gray-900 mb-4">Basic Listing</h3>
              <div className="flex items-baseline gap-1 mb-10">
                <span className="text-5xl font-bold text-gray-950 font-['JetBrains_Mono',monospace]">₹0</span>
                <span className="text-lg text-gray-400">/ month</span>
              </div>
              <ul className="space-y-4 mb-10">
                {basicFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <Check className="w-[18px] h-[18px] text-emerald-500 shrink-0" />
                    <span className="text-gray-600">{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => scrollTo('apply')}
                className="w-full py-3.5 rounded-xl border-2 border-gray-900 text-gray-900 font-medium hover:bg-gray-900 hover:text-white transition-colors"
              >
                Get Started Free
              </button>
            </motion.div>

            {/* Premium */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="bg-gray-950 text-white rounded-2xl p-10 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl" />
              <span className="relative inline-block text-xs font-semibold tracking-wider uppercase text-blue-400 bg-blue-950 px-3 py-1.5 rounded-full mb-6">RECOMMENDED</span>
              <h3 className="relative font-semibold text-2xl text-white mb-4">Featured Premium</h3>
              <div className="relative flex items-baseline gap-1 mb-10">
                <span className="text-5xl font-bold text-white font-['JetBrains_Mono',monospace]">₹499</span>
                <span className="text-lg text-gray-400">/ month</span>
              </div>
              <ul className="relative space-y-4 mb-10">
                {premiumFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <Check className="w-[18px] h-[18px] text-blue-400 shrink-0" />
                    <span className="text-gray-300">{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => scrollTo('apply')}
                className="relative w-full py-3.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-500 transition-colors"
              >
                Start 14-Day Trial
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Application Form ─── */}
      <section id="apply" className="py-24 px-6">
        <div className="max-w-[800px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-['Playfair_Display',serif] font-bold text-4xl text-gray-950 mb-4">
              Ready to Partner with Us?
            </h2>
            <p className="text-lg text-gray-500 max-w-[600px] mx-auto">
              Fill out the form below. We'll verify your business and have you live on the student map within 48 hours.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white border border-gray-200 rounded-2xl p-12 shadow-sm"
          >
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              {/* Business Name */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                  <Building2 className="w-4 h-4" />
                  Business Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., CopyQuick Print Hub"
                  className="w-full h-12 px-4 rounded-xl border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Category <span className="text-red-500">*</span>
                </label>
                <select className="w-full h-12 px-4 rounded-xl border border-gray-300 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors appearance-none">
                  <option value="">Select a category</option>
                  <option>Food & Beverages</option>
                  <option>Print & Stationery</option>
                  <option>Books & Education</option>
                  <option>Electronics</option>
                  <option>Clothing & Fashion</option>
                  <option>Health & Fitness</option>
                  <option>Entertainment</option>
                  <option>Other</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Location <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" />
                  <input
                    type="text"
                    placeholder="Street Address, City, Tamil Nadu"
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* Discount + Phone row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Discount Percentage <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="e.g., 25"
                      className="w-full h-12 px-4 pr-10 rounded-xl border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">%</span>
                  </div>
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                    <Phone className="w-4 h-4" />
                    Contact Phone <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">+91</span>
                    <input
                      type="tel"
                      placeholder="XXXXX XXXXX"
                      className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                  <Mail className="w-4 h-4" />
                  Contact Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="you@business.com"
                  className="w-full h-12 px-4 rounded-xl border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* File upload */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Business Registration Proof
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600">Upload GST certificate or business registration</p>
                  <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG (max 5MB)</p>
                </div>
              </div>

              {/* Checkbox */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">
                  I agree to StudentPerks Vendor Terms & Conditions
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-blue-600 text-white font-semibold text-base hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!agreed}
              >
                Submit Application →
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* ─── FAQ / Contact ─── */}
      <section className="py-20 px-6 bg-gray-950 text-white">
        <div className="max-w-[900px] mx-auto text-center">
          <h3 className="font-['Playfair_Display',serif] font-bold text-3xl mb-4">Have Questions?</h3>
          <p className="text-gray-400 mb-8 max-w-[560px] mx-auto">
            Our partnership team is here to help. Email us at partnerships@studentperks.in or schedule a quick call.
          </p>
          <a
            href="mailto:partnerships@studentperks.in"
            className="inline-flex items-center justify-center border border-white/30 text-white font-medium px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </section>
    </div>
  );
}
