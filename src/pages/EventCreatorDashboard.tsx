import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Query } from 'appwrite';
import { databases, DATABASE_ID, COLLECTIONS, storage, eventMediaBucket } from '../lib/appwrite';
import { useAuth } from '../contexts/AuthContext';
import {
  Eye, Heart, Users, TrendingUp, Plus, Edit3,
  Bell, Settings, Calendar, LayoutDashboard, ChevronDown, Menu, X,
} from 'lucide-react';
import { toast } from 'sonner';
import { ThemeToggle } from '../components/ThemeToggle';

const CATEGORIES = [
  'Webinar', 'Hackathon', 'Workshop', 'Conference',
  'Cultural', 'Sports', 'Technical', 'Seminar', 'Competition', 'Symposium',
];

// ── Types ────────────────────────────────────────────────────────────────────
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
  organizer: string;
  location?: string;
  registrationLink: string;
  thumbnailUrl?: string;
  posterFileId?: string;
  participantCount: number;
  maxParticipants?: number;
  tags?: string[];
  approved?: boolean;
  submittedBy?: string;
  createdByUserId?: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function getPosterUrl(evt: EventDocument): string | null {
  if (evt.posterFileId && eventMediaBucket) {
    const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';
    const project = import.meta.env.VITE_APPWRITE_PROJECT || '';
    return `${endpoint}/storage/buckets/${eventMediaBucket}/files/${evt.posterFileId}/preview?project=${project}&width=120&height=80`;
  }
  if (evt.thumbnailUrl) return evt.thumbnailUrl;
  return null;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getEventStatus(evt: EventDocument): 'Pending' | 'Approved' | 'Rejected' {
  if (evt.status === 'Rejected') return 'Rejected';
  if (evt.approved) return 'Approved';
  return 'Pending';
}

// ── Responsive CSS ───────────────────────────────────────────────────────────
const responsiveCSS = `\n:root {
  --ecd-bg: #f8f9fb;
  --ecd-surface: #ffffff;
  --ecd-border: rgba(0,0,0,0.08);
  --ecd-border-light: rgba(0,0,0,0.04);
  --ecd-text: #374151;
  --ecd-text-main: #030213;
  --ecd-text-muted: #6b7280;
  --ecd-text-light: #9ca3af;
  --ecd-card-bg: #ffffff;
  --ecd-nav-drawer: #ffffff;
  --ecd-primary: #1a56db;
  --ecd-nav-btn: #ffffff;
}
.dark {
  --ecd-bg: #0b0b0f;
  --ecd-surface: #16161b;
  --ecd-border: #2a2a32;
  --ecd-border-light: rgba(42,42,50,0.5);
  --ecd-text: #e5e5e5;
  --ecd-text-main: #fff;
  --ecd-text-muted: #8b8b95;
  --ecd-text-light: #55555f;
  --ecd-card-bg: #1c1c22;
  --ecd-nav-drawer: #16161b;
  --ecd-primary: #1a56db;
  --ecd-nav-btn: #16161b;
}
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap');

  .ecd-header { padding: 12px 32px; }
  .ecd-nav-full { display: flex; }
  .ecd-nav-mobile-btn { display: none; }
  .ecd-nav-drawer { display: none; }
  .ecd-content { padding: 32px 24px 64px; }
  .ecd-title-row { flex-direction: row; align-items: flex-start; }
  .ecd-title { font-size: 30px; }
  .ecd-stats { grid-template-columns: repeat(4, 1fr); }
  .ecd-stat-value { font-size: 28px; }
  .ecd-table-wrap { overflow-x: auto; }
  .ecd-table { display: table; }
  .ecd-table thead { display: table-header-group; }
  .ecd-table tbody { display: table-row-group; }
  .ecd-table tr { display: table-row; }
  .ecd-table th, .ecd-table td { display: table-cell; }
  .ecd-card-list { display: none; }

  @media (max-width: 1024px) {
    .ecd-stats { grid-template-columns: repeat(2, 1fr); }
  }

  @media (max-width: 768px) {
    .ecd-header { padding: 10px 16px; }
    .ecd-nav-full { display: none; }
    .ecd-nav-mobile-btn { display: flex; }
    .ecd-content { padding: 20px 16px 40px; }
    .ecd-title-row { flex-direction: column; gap: 16px; }
    .ecd-title { font-size: 24px; }
    .ecd-stats { grid-template-columns: repeat(2, 1fr); gap: 10px; }
    .ecd-stat-value { font-size: 22px; }
    .ecd-table { display: none; }
    .ecd-card-list { display: flex; flex-direction: column; gap: 10px; }
    .ecd-cta-btn { width: 100%; justify-content: center; }
  }

  @media (max-width: 480px) {
    .ecd-stats { grid-template-columns: 1fr 1fr; }
    .ecd-stat-value { font-size: 20px; }
  }
`;

// ── Status Badge (dark theme) ────────────────────────────────────────────────
const statusStyles = {
  Pending: { bg: 'rgba(254,243,199,0.15)', border: 'rgba(254,230,133,0.4)', text: '#fbbf24' },
  Approved: { bg: 'rgba(164,244,207,0.1)', border: 'rgba(164,244,207,0.3)', text: '#34d399' },
  Rejected: { bg: 'rgba(255,201,201,0.1)', border: 'rgba(255,201,201,0.3)', text: '#f87171' },
};

function StatusBadge({ status }: { status: 'Pending' | 'Approved' | 'Rejected' }) {
  const s = statusStyles[status];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
      background: s.bg, border: `1px solid ${s.border}`, color: s.text,
    }}>
      {status}
    </span>
  );
}

// ── Edit Event Modal ──────────────────────────────────────────────────────────
interface EditForm {
  title: string; organizer: string; description: string;
  category: string[]; eventDate: string; time: string;
  location: string; registrationLink: string;
}

function EditEventModal({
  event, onClose, onSave, saving,
}: {
  event: EventDocument;
  onClose: () => void;
  onSave: (id: string, data: EditForm) => Promise<void>;
  saving: boolean;
}) {
  const [form, setForm] = useState<EditForm>({
    title: event.title,
    organizer: event.organizer,
    description: event.description,
    category: Array.isArray(event.category)
      ? event.category
      : event.category ? [event.category] : [],
    eventDate: event.eventDate ? event.eventDate.slice(0, 10) : '',
    time: event.time || '',
    location: event.location || '',
    registrationLink: event.registrationLink !== 'N/A' ? (event.registrationLink || '') : '',
  });

  const set = (key: keyof EditForm, val: string) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const toggleCategory = (cat: string) =>
    setForm(prev => ({
      ...prev,
      category: prev.category.includes(cat)
        ? prev.category.filter(c => c !== cat)
        : [...prev.category, cat],
    }));

  const handleSubmit = () => {
    if (!form.title.trim() || !form.organizer.trim() || !form.description.trim() || !form.eventDate) {
      toast.error('Title, organizer, description and date are required');
      return;
    }
    onSave(event.$id, form);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px', borderRadius: 10,
    border: '1px solid var(--ecd-border)', background: 'var(--ecd-bg)',
    color: 'var(--ecd-text)', fontSize: 14, outline: 'none', boxSizing: 'border-box',
    fontFamily: 'inherit',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 12, fontWeight: 600,
    color: 'var(--ecd-text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em',
  };

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(4px)', padding: 16 }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: 'var(--ecd-surface)', borderRadius: 18, width: '100%', maxWidth: 560, maxHeight: '92vh', overflow: 'auto', padding: 28, boxShadow: '0 28px 64px rgba(0,0,0,0.35)' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--ecd-text-main)', margin: '0 0 2px' }}>Edit Event</h2>
            <p style={{ fontSize: 12, color: 'var(--ecd-text-light)', margin: 0 }}>{event.title}</p>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--ecd-border)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ecd-text-muted)' }}>
            <X size={16} />
          </button>
        </div>

        {/* Re-review notice */}
        <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(254,243,199,0.15)', border: '1px solid rgba(254,230,133,0.35)', marginBottom: 22 }}>
          <p style={{ fontSize: 12, color: '#fbbf24', margin: 0, lineHeight: 1.5 }}>
            Saving will re-submit this event for admin review. Poster and promo video are preserved.
          </p>
        </div>

        {/* Text fields */}
        {([
          { label: 'Event Title *', key: 'title', type: 'text', placeholder: 'Enter event title' },
          { label: 'Organizer *', key: 'organizer', type: 'text', placeholder: 'Organizer or club name' },
          { label: 'Event Date *', key: 'eventDate', type: 'date', placeholder: '' },
          { label: 'Till Date / End Time', key: 'time', type: 'text', placeholder: 'e.g. 2025-06-30 or 6:00 PM IST' },
          { label: 'Location', key: 'location', type: 'text', placeholder: 'Online or physical address' },
          { label: 'Registration Link', key: 'registrationLink', type: 'text', placeholder: 'https://...' },
        ] as { label: string; key: keyof EditForm; type: string; placeholder: string }[]).map(f => (
          <div key={f.key} style={{ marginBottom: 16 }}>
            <label style={labelStyle}>{f.label}</label>
            <input
              type={f.type}
              value={form[f.key] as string}
              onChange={e => set(f.key, e.target.value)}
              placeholder={f.placeholder}
              style={inputStyle}
            />
          </div>
        ))}

        {/* Description */}
        <div style={{ marginBottom: 18 }}>
          <label style={labelStyle}>Description *</label>
          <textarea
            value={form.description}
            onChange={e => set('description', e.target.value)}
            rows={5}
            maxLength={5000}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
          <p style={{ fontSize: 11, color: 'var(--ecd-text-light)', margin: '4px 0 0', textAlign: 'right' }}>
            {form.description.length}/5000
          </p>
        </div>

        {/* Categories */}
        <div style={{ marginBottom: 26 }}>
          <label style={labelStyle}>Category</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {CATEGORIES.map(cat => {
              const selected = form.category.includes(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  style={{
                    padding: '5px 13px', borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: 'pointer',
                    border: '1px solid', borderColor: selected ? '#1a56db' : 'var(--ecd-border)',
                    background: selected ? 'rgba(26,86,219,0.12)' : 'transparent',
                    color: selected ? '#1a56db' : 'var(--ecd-text-muted)', transition: 'all 0.15s',
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onClose}
            style={{ flex: 1, padding: '11px 0', borderRadius: 12, border: '1px solid var(--ecd-border)', background: 'transparent', color: 'var(--ecd-text-muted)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            style={{ flex: 2, padding: '11px 0', borderRadius: 12, border: 'none', background: saving ? '#555' : '#1a56db', color: '#fff', fontSize: 14, fontWeight: 600, cursor: saving ? 'wait' : 'pointer', transition: 'background 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            {saving ? (
              <>
                <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                Saving...
              </>
            ) : 'Save & Resubmit'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Mobile Event Card ────────────────────────────────────────────────────────
function MobileEventCard({ event, onEdit }: { event: EventDocument; onEdit: (e: EventDocument) => void }) {
  const poster = getPosterUrl(event);
  return (
    <div style={{
      background: 'var(--ecd-card-bg)', border: '1px solid #2a2a32', borderRadius: 14, padding: 16,
    }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 10, flexShrink: 0,
          background: poster ? 'transparent' : 'var(--ecd-border)',
          overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {poster ? <img src={poster} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Calendar size={18} color="#55555f" />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ecd-text-main)', margin: 0, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {event.title}
          </p>
          <p style={{ fontSize: 12, color: 'var(--ecd-text-light)', margin: '2px 0 0' }}>{event.organizer}</p>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <StatusBadge status={getEventStatus(event)} />
          <span style={{ fontSize: 12, color: 'var(--ecd-text-muted)' }}>{formatDate(event.eventDate)}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--ecd-text-light)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Eye size={12} /> {event.participantCount || 0}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Heart size={12} /> 0</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Users size={12} /> {event.participantCount || 0}</span>
          </div>
          <button
            onClick={() => onEdit(event)}
            title="Edit event"
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 8, border: '1px solid #2a2a32', background: 'transparent', color: '#1a56db', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
          >
            <Edit3 size={12} /> Edit
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function EventCreatorDashboard() {
  const { user, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventDocument | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate('/login');
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchMyEvents = async () => {
      try {
        setLoading(true);
        const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.EVENTS, [
          Query.equal('submittedBy', user.$id), Query.orderDesc('$createdAt'), Query.limit(100),
        ]);
        setEvents(response.documents as unknown as EventDocument[]);
      } catch (err) {
        console.error('Failed to fetch user events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyEvents();
  }, [user]);

  const stats = useMemo(() => {
    const totalViews = events.reduce((sum, e) => sum + ((e as any).views || 0), 0);
    const totalSaves = events.reduce((sum, e) => sum + ((e as any).saves || 0), 0);
    const totalRegistrations = events.reduce((sum, e) => sum + (e.participantCount || 0), 0);
    const engagementRate = events.length > 0 && Math.max(totalViews, 1) > 0 ? Math.round((totalRegistrations / Math.max(totalViews, 1)) * 100) : 0;
    return { totalViews, totalSaves, totalRegistrations, engagementRate };
  }, [events]);

  const handleSave = async (id: string, form: EditForm) => {
    setSaveLoading(true);
    try {
      const payload: Record<string, unknown> = {
        title: form.title.trim(),
        organizer: form.organizer.trim(),
        description: form.description.trim(),
        category: form.category,
        eventType: form.category.length > 0 ? form.category[0] : 'Other',
        eventDate: new Date(form.eventDate).toISOString(),
        time: form.time.trim(),
        location: form.location.trim() || 'Online',
        registrationLink: form.registrationLink.trim() || 'N/A',
        approved: false,
        status: 'Upcoming',
      };
      await databases.updateDocument(DATABASE_ID, COLLECTIONS.EVENTS, id, payload);
      setEvents(prev => prev.map(e =>
        e.$id === id ? { ...e, ...(payload as Partial<EventDocument>) } : e,
      ));
      setEditingEvent(null);
      toast.success('Event updated and resubmitted for review');
    } catch (err) {
      console.error('Failed to update event:', err);
      toast.error('Failed to update event. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  const filteredEvents = useMemo(() => {
    if (statusFilter === 'All') return events;
    return events.filter(e => getEventStatus(e) === statusFilter);
  }, [events, statusFilter]);

  const statCards = [
    { label: 'Total Views', value: stats.totalViews, icon: <Eye size={20} color="#3b82f6" />, iconBg: 'rgba(59,130,246,0.15)', change: 'Live', positive: true },
    { label: 'Total Saves', value: stats.totalSaves, icon: <Heart size={20} color="#a855f7" />, iconBg: 'rgba(168,85,247,0.15)', change: 'Live', positive: true },
    { label: 'Total Registrations', value: stats.totalRegistrations, icon: <Users size={20} color="#10b981" />, iconBg: 'rgba(16,185,129,0.15)', change: 'Live', positive: true },
    { label: 'Engagement Rate', value: `${stats.engagementRate}%`, icon: <TrendingUp size={20} color="#f59e0b" />, iconBg: 'rgba(245,158,11,0.15)', change: 'Live', positive: true },
  ];

  const navItems = [
    { label: 'Dashboard', icon: <LayoutDashboard size={18} />, active: true, href: '/events/dashboard' },
    { label: 'Events', icon: <Calendar size={18} />, active: false, href: '/events' },
    { label: 'Notifications', icon: <Bell size={18} />, active: false, href: '#' },
    { label: 'Settings', icon: <Settings size={18} />, active: false, href: '#' },
  ];

  if (authLoading || loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--ecd-bg)', fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: '3px solid #2a2a32', borderTopColor: '#1a56db', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
          <p style={{ marginTop: 16, color: 'var(--ecd-text-light)', fontSize: 14 }}>Loading your dashboard...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ecd-bg)', fontFamily: "'DM Sans', sans-serif", color: 'var(--ecd-text)' }}>
      <style>{responsiveCSS}</style>

      {/* Header */}
      <header className="ecd-header" style={{ background: 'var(--ecd-bg)', borderBottom: '1px solid #2a2a32', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Left: Logo + Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #1a56db, #9333ea)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ecd-text-main)', fontSize: 14, fontWeight: 700 }}>
              SP
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="ecd-nav-full" style={{ alignItems: 'center', gap: 4 }}>
            {navItems.map(item => (
              <Link key={item.label} to={item.href} style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 10,
                fontSize: 14, fontWeight: 500, textDecoration: 'none',
                background: item.active ? 'rgba(26,86,219,0.1)' : 'transparent',
                color: item.active ? '#1a56db' : 'var(--ecd-text-muted)', transition: 'all 0.15s',
              }}>
                {item.icon}{item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: Bell + Avatar + Mobile burger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ThemeToggle />
          <button style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid #2a2a32', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--ecd-text-muted)' }}>
            <Bell size={18} />
          </button>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #1a56db, #9333ea)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ecd-text-main)', fontSize: 14, fontWeight: 600 }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          {/* Mobile hamburger */}
          <button
            className="ecd-nav-mobile-btn"
            onClick={() => setMobileMenuOpen(v => !v)}
            style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid #2a2a32', background: 'transparent', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--ecd-text-muted)' }}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="ecd-nav-drawer" style={{
          display: 'flex', flexDirection: 'column', gap: 2,
          background: 'var(--ecd-surface)', borderBottom: '1px solid #2a2a32', padding: '8px 16px 14px',
        }}>
          {navItems.map(item => (
            <Link key={item.label} to={item.href} onClick={() => setMobileMenuOpen(false)} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10,
              fontSize: 15, fontWeight: 500, textDecoration: 'none',
              background: item.active ? 'rgba(26,86,219,0.1)' : 'transparent',
              color: item.active ? '#1a56db' : 'var(--ecd-text-muted)',
            }}>
              {item.icon}{item.label}
            </Link>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="ecd-content" style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Title Row */}
        <div className="ecd-title-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <h1 className="ecd-title" style={{ fontWeight: 700, fontFamily: "'Playfair Display', serif", color: 'var(--ecd-text-main)', margin: '0 0 4px' }}>
              Your Events Dashboard
            </h1>
            <p style={{ fontSize: 14, color: 'var(--ecd-text-muted)', margin: 0 }}>Manage and track your submitted events</p>
          </div>
          <Link to="/events/register" className="ecd-cta-btn" style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 14,
            background: '#1a56db', color: 'var(--ecd-text-main)', fontSize: 14, fontWeight: 600, textDecoration: 'none',
            boxShadow: '0 4px 12px rgba(26,86,219,0.3)', whiteSpace: 'nowrap', flexShrink: 0,
          }}>
            <Plus size={18} />Create New Event
          </Link>
        </div>

        {/* Stat Cards */}
        <div className="ecd-stats" style={{ display: 'grid', gap: 16, marginBottom: 32 }}>
          {statCards.map(card => (
            <div key={card.label} style={{ background: 'var(--ecd-surface)', border: '1px solid #2a2a32', borderRadius: 16, padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: card.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {card.icon}
                </div>
                <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: card.positive ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: card.positive ? '#10b981' : '#ef4444' }}>
                  {card.change}
                </span>
              </div>
              <p className="ecd-stat-value" style={{ fontWeight: 700, color: 'var(--ecd-text-main)', margin: '0 0 2px' }}>{card.value}</p>
              <p style={{ fontSize: 13, color: 'var(--ecd-text-light)', margin: 0 }}>{card.label}</p>
            </div>
          ))}
        </div>

        {/* Events Table */}
        <div style={{ background: 'var(--ecd-surface)', border: '1px solid #2a2a32', borderRadius: 16, overflow: 'hidden' }}>
          {/* Table Header */}
          <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(42,42,50,0.5)', flexWrap: 'wrap', gap: 10 }}>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--ecd-text-main)', margin: '0 0 2px' }}>Your Events</h2>
              <p style={{ fontSize: 13, color: 'var(--ecd-text-light)', margin: 0 }}>{events.length} events</p>
            </div>
            <div style={{ position: 'relative' }}>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} style={{
                appearance: 'none', padding: '8px 32px 8px 14px', borderRadius: 10,
                border: '1px solid #2a2a32', background: 'var(--ecd-bg)', color: 'var(--ecd-text)',
                fontSize: 13, fontWeight: 500, cursor: 'pointer', outline: 'none',
              }}>
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
              <ChevronDown size={14} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--ecd-text-light)', pointerEvents: 'none' }} />
            </div>
          </div>

          {/* Desktop Table */}
          <div className="ecd-table-wrap">
            <table className="ecd-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(42,42,50,0.5)' }}>
                  {['EVENT NAME', 'DATE', 'STATUS', 'VIEWS', 'SAVES', 'REGISTRATIONS', 'ACTIONS'].map(col => (
                    <th key={col} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--ecd-text-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: 48, textAlign: 'center', color: 'var(--ecd-text-light)', fontSize: 14 }}>
                      {events.length === 0 ? (
                        <div>
                          <p style={{ marginBottom: 12 }}>You haven't submitted any events yet</p>
                          <Link to="/events/register" style={{ color: '#1a56db', textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
                            Create your first event
                          </Link>
                        </div>
                      ) : 'No events match the selected filter'}
                    </td>
                  </tr>
                ) : (
                  filteredEvents.map(event => {
                    const poster = getPosterUrl(event);
                    return (
                      <tr key={event.$id} style={{ borderBottom: '1px solid rgba(42,42,50,0.5)', transition: 'background 0.15s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(26,86,219,0.04)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 8, background: poster ? 'transparent' : 'var(--ecd-border)', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {poster ? <img src={poster} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Calendar size={16} color="#55555f" />}
                            </div>
                            <div>
                              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ecd-text-main)', margin: 0, lineHeight: 1.3 }}>{event.title}</p>
                              <p style={{ fontSize: 12, color: 'var(--ecd-text-light)', margin: 0 }}>{event.organizer}</p>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--ecd-text-muted)' }}>{formatDate(event.eventDate)}</td>
                        <td style={{ padding: '12px 16px' }}><StatusBadge status={getEventStatus(event)} /></td>
                        <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--ecd-text-muted)' }}>{(event as any).views || 0}</td>
                        <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--ecd-text-muted)' }}>{(event as any).saves || 0}</td>
                        <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--ecd-text-muted)' }}>{event.participantCount || 0}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <button
                            onClick={() => setEditingEvent(event)}
                            title="Edit event"
                            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 8, border: '1px solid #2a2a32', background: 'transparent', color: '#1a56db', fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
                          >
                            <Edit3 size={13} /> Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="ecd-card-list" style={{ padding: 12 }}>
            {filteredEvents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 32, color: 'var(--ecd-text-light)', fontSize: 14 }}>
                {events.length === 0 ? (
                  <div>
                    <p style={{ marginBottom: 12 }}>You haven't submitted any events yet</p>
                    <Link to="/events/register" style={{ color: '#1a56db', textDecoration: 'none', fontWeight: 600 }}>Create your first event</Link>
                  </div>
                ) : 'No events match the selected filter'}
              </div>
            ) : (
              filteredEvents.map(event => <MobileEventCard key={event.$id} event={event} onEdit={setEditingEvent} />)
            )}
          </div>
        </div>
      </div>

      {editingEvent && (
        <EditEventModal
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onSave={handleSave}
          saving={saveLoading}
        />
      )}
    </div>
  );
}
