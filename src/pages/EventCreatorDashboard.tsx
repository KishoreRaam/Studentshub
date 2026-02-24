import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Query } from 'appwrite';
import { databases, DATABASE_ID, COLLECTIONS, storage, eventMediaBucket } from '../lib/appwrite';
import { useAuth } from '../contexts/AuthContext';
import {
  Eye, Heart, Users, TrendingUp, Plus, MoreHorizontal,
  Bell, Settings, Calendar, LayoutDashboard, ChevronDown, Menu, X,
} from 'lucide-react';

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
const responsiveCSS = `
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

// ── Mobile Event Card ────────────────────────────────────────────────────────
function MobileEventCard({ event }: { event: EventDocument }) {
  const poster = getPosterUrl(event);
  return (
    <div style={{
      background: '#1c1c22', border: '1px solid #2a2a32', borderRadius: 14, padding: 16,
    }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 10, flexShrink: 0,
          background: poster ? 'transparent' : '#2a2a32',
          overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {poster ? <img src={poster} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Calendar size={18} color="#55555f" />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#fff', margin: 0, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {event.title}
          </p>
          <p style={{ fontSize: 12, color: '#55555f', margin: '2px 0 0' }}>{event.organizer}</p>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <StatusBadge status={getEventStatus(event)} />
          <span style={{ fontSize: 12, color: '#8b8b95' }}>{formatDate(event.eventDate)}</span>
        </div>
        <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#55555f' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Eye size={12} /> {event.participantCount || 0}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Heart size={12} /> 0</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Users size={12} /> {event.participantCount || 0}</span>
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
    const totalViews = events.reduce((sum, e) => sum + (e.participantCount || 0), 0);
    const totalSaves = 0;
    const totalRegistrations = events.reduce((sum, e) => sum + (e.participantCount || 0), 0);
    const engagementRate = events.length > 0 ? Math.round((totalRegistrations / Math.max(totalViews, 1)) * 100) : 0;
    return { totalViews, totalSaves, totalRegistrations, engagementRate };
  }, [events]);

  const filteredEvents = useMemo(() => {
    if (statusFilter === 'All') return events;
    return events.filter(e => getEventStatus(e) === statusFilter);
  }, [events, statusFilter]);

  const statCards = [
    { label: 'Total Views', value: stats.totalViews, icon: <Eye size={20} color="#3b82f6" />, iconBg: 'rgba(59,130,246,0.15)', change: '+12%', positive: true },
    { label: 'Total Saves', value: stats.totalSaves, icon: <Heart size={20} color="#a855f7" />, iconBg: 'rgba(168,85,247,0.15)', change: '+8%', positive: true },
    { label: 'Total Registrations', value: stats.totalRegistrations, icon: <Users size={20} color="#10b981" />, iconBg: 'rgba(16,185,129,0.15)', change: '+24%', positive: true },
    { label: 'Engagement Rate', value: `${stats.engagementRate}%`, icon: <TrendingUp size={20} color="#f59e0b" />, iconBg: 'rgba(245,158,11,0.15)', change: '-2%', positive: false },
  ];

  const navItems = [
    { label: 'Dashboard', icon: <LayoutDashboard size={18} />, active: true, href: '/events/dashboard' },
    { label: 'Events', icon: <Calendar size={18} />, active: false, href: '/events' },
    { label: 'Notifications', icon: <Bell size={18} />, active: false, href: '#' },
    { label: 'Settings', icon: <Settings size={18} />, active: false, href: '#' },
  ];

  if (authLoading || loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0b0b0f', fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: '3px solid #2a2a32', borderTopColor: '#1a56db', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
          <p style={{ marginTop: 16, color: '#55555f', fontSize: 14 }}>Loading your dashboard...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0b0b0f', fontFamily: "'DM Sans', sans-serif", color: '#e5e5e5' }}>
      <style>{responsiveCSS}</style>

      {/* Header */}
      <header className="ecd-header" style={{ background: '#0b0b0f', borderBottom: '1px solid #2a2a32', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Left: Logo + Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #1a56db, #9333ea)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 700 }}>
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
                color: item.active ? '#1a56db' : '#8b8b95', transition: 'all 0.15s',
              }}>
                {item.icon}{item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: Bell + Avatar + Mobile burger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid #2a2a32', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#8b8b95' }}>
            <Bell size={18} />
          </button>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #1a56db, #9333ea)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 600 }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          {/* Mobile hamburger */}
          <button
            className="ecd-nav-mobile-btn"
            onClick={() => setMobileMenuOpen(v => !v)}
            style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid #2a2a32', background: 'transparent', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#8b8b95' }}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="ecd-nav-drawer" style={{
          display: 'flex', flexDirection: 'column', gap: 2,
          background: '#16161b', borderBottom: '1px solid #2a2a32', padding: '8px 16px 14px',
        }}>
          {navItems.map(item => (
            <Link key={item.label} to={item.href} onClick={() => setMobileMenuOpen(false)} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10,
              fontSize: 15, fontWeight: 500, textDecoration: 'none',
              background: item.active ? 'rgba(26,86,219,0.1)' : 'transparent',
              color: item.active ? '#1a56db' : '#8b8b95',
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
            <h1 className="ecd-title" style={{ fontWeight: 700, fontFamily: "'Playfair Display', serif", color: '#fff', margin: '0 0 4px' }}>
              Your Events Dashboard
            </h1>
            <p style={{ fontSize: 14, color: '#8b8b95', margin: 0 }}>Manage and track your submitted events</p>
          </div>
          <Link to="/events/register" className="ecd-cta-btn" style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 14,
            background: '#1a56db', color: '#fff', fontSize: 14, fontWeight: 600, textDecoration: 'none',
            boxShadow: '0 4px 12px rgba(26,86,219,0.3)', whiteSpace: 'nowrap', flexShrink: 0,
          }}>
            <Plus size={18} />Create New Event
          </Link>
        </div>

        {/* Stat Cards */}
        <div className="ecd-stats" style={{ display: 'grid', gap: 16, marginBottom: 32 }}>
          {statCards.map(card => (
            <div key={card.label} style={{ background: '#16161b', border: '1px solid #2a2a32', borderRadius: 16, padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: card.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {card.icon}
                </div>
                <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: card.positive ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: card.positive ? '#10b981' : '#ef4444' }}>
                  {card.change}
                </span>
              </div>
              <p className="ecd-stat-value" style={{ fontWeight: 700, color: '#fff', margin: '0 0 2px' }}>{card.value}</p>
              <p style={{ fontSize: 13, color: '#55555f', margin: 0 }}>{card.label}</p>
            </div>
          ))}
        </div>

        {/* Events Table */}
        <div style={{ background: '#16161b', border: '1px solid #2a2a32', borderRadius: 16, overflow: 'hidden' }}>
          {/* Table Header */}
          <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(42,42,50,0.5)', flexWrap: 'wrap', gap: 10 }}>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 600, color: '#fff', margin: '0 0 2px' }}>Your Events</h2>
              <p style={{ fontSize: 13, color: '#55555f', margin: 0 }}>{events.length} events</p>
            </div>
            <div style={{ position: 'relative' }}>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} style={{
                appearance: 'none', padding: '8px 32px 8px 14px', borderRadius: 10,
                border: '1px solid #2a2a32', background: '#0b0b0f', color: '#e5e5e5',
                fontSize: 13, fontWeight: 500, cursor: 'pointer', outline: 'none',
              }}>
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
              <ChevronDown size={14} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#55555f', pointerEvents: 'none' }} />
            </div>
          </div>

          {/* Desktop Table */}
          <div className="ecd-table-wrap">
            <table className="ecd-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(42,42,50,0.5)' }}>
                  {['EVENT NAME', 'DATE', 'STATUS', 'VIEWS', 'SAVES', 'REGISTRATIONS', 'ACTIONS'].map(col => (
                    <th key={col} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#55555f', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: 48, textAlign: 'center', color: '#55555f', fontSize: 14 }}>
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
                            <div style={{ width: 40, height: 40, borderRadius: 8, background: poster ? 'transparent' : '#2a2a32', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {poster ? <img src={poster} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Calendar size={16} color="#55555f" />}
                            </div>
                            <div>
                              <p style={{ fontSize: 14, fontWeight: 600, color: '#fff', margin: 0, lineHeight: 1.3 }}>{event.title}</p>
                              <p style={{ fontSize: 12, color: '#55555f', margin: 0 }}>{event.organizer}</p>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: 13, color: '#8b8b95' }}>{formatDate(event.eventDate)}</td>
                        <td style={{ padding: '12px 16px' }}><StatusBadge status={getEventStatus(event)} /></td>
                        <td style={{ padding: '12px 16px', fontSize: 13, color: '#8b8b95' }}>{event.participantCount || 0}</td>
                        <td style={{ padding: '12px 16px', fontSize: 13, color: '#8b8b95' }}>0</td>
                        <td style={{ padding: '12px 16px', fontSize: 13, color: '#8b8b95' }}>{event.participantCount || 0}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <button style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #2a2a32', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#55555f' }}>
                            <MoreHorizontal size={16} />
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
              <div style={{ textAlign: 'center', padding: 32, color: '#55555f', fontSize: 14 }}>
                {events.length === 0 ? (
                  <div>
                    <p style={{ marginBottom: 12 }}>You haven't submitted any events yet</p>
                    <Link to="/events/register" style={{ color: '#1a56db', textDecoration: 'none', fontWeight: 600 }}>Create your first event</Link>
                  </div>
                ) : 'No events match the selected filter'}
              </div>
            ) : (
              filteredEvents.map(event => <MobileEventCard key={event.$id} event={event} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
