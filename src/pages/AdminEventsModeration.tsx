import React, { useState, useEffect, useMemo } from 'react';
import { Query } from 'appwrite';
import { databases, DATABASE_ID, COLLECTIONS, storage, eventMediaBucket } from '../lib/appwrite';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import {
  Shield, Calendar, Clock, Users, XCircle,
  Check, X, Eye, Search, ArrowUpDown, ChevronDown,
  FileText, BarChart3,
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
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getEventStatus(evt: EventDocument): 'Pending' | 'Approved' | 'Rejected' {
  if (evt.status === 'Rejected') return 'Rejected';
  if (evt.approved) return 'Approved';
  return 'Pending';
}

function getCategory(evt: EventDocument): string {
  if (Array.isArray(evt.category) && evt.category.length > 0) return evt.category[0];
  if (typeof evt.category === 'string') return evt.category;
  return evt.eventType || 'Other';
}

// ── Responsive CSS ───────────────────────────────────────────────────────────
const responsiveCSS = `
  .adm-header { padding: 16px 32px; }
  .adm-header-sub { display: block; }
  .adm-content { padding: 24px 24px 48px; }
  .adm-stats { grid-template-columns: repeat(4, 1fr); }
  .adm-tabs { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  .adm-filter-row { flex-direction: row; }
  .adm-search { width: 260px; }
  .adm-table { display: table; }
  .adm-table thead { display: table-header-group; }
  .adm-table tbody { display: table-row-group; }
  .adm-table tr { display: table-row; }
  .adm-table th, .adm-table td { display: table-cell; }
  .adm-card-list { display: none; }

  @media (max-width: 1024px) {
    .adm-stats { grid-template-columns: repeat(2, 1fr); }
  }

  @media (max-width: 768px) {
    .adm-header { padding: 12px 16px; }
    .adm-header-sub { display: none; }
    .adm-content { padding: 16px 16px 32px; }
    .adm-stats { grid-template-columns: repeat(2, 1fr); gap: 10px; }
    .adm-filter-row { flex-direction: column; gap: 8px !important; }
    .adm-search { width: 100% !important; }
    .adm-table { display: none; }
    .adm-card-list { display: flex; flex-direction: column; gap: 10px; }
  }

  @media (max-width: 480px) {
    .adm-stats { grid-template-columns: 1fr 1fr; }
    .adm-stat-label { font-size: 11px !important; }
    .adm-stat-value { font-size: 20px !important; }
  }
`;

// ── Status Badge ─────────────────────────────────────────────────────────────
const statusStyles = {
  Pending: { bg: '#fffbeb', border: '#fee685', text: '#bb4d00' },
  Approved: { bg: '#ecfdf5', border: '#a4f4cf', text: '#007a55' },
  Rejected: { bg: '#fef2f2', border: '#ffc9c9', text: '#c10007' },
};

function StatusBadge({ status }: { status: 'Pending' | 'Approved' | 'Rejected' }) {
  const s = statusStyles[status];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
      background: s.bg, border: `1.5px solid ${s.border}`, color: s.text,
    }}>
      {status === 'Approved' && <Check size={12} />}
      {status === 'Pending' && <Clock size={12} />}
      {status === 'Rejected' && <X size={12} />}
      {status}
    </span>
  );
}

// ── Event Detail Modal ───────────────────────────────────────────────────────
function EventDetailModal({ event, onClose }: { event: EventDocument; onClose: () => void }) {
  const poster = getPosterUrl(event);
  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', padding: 16 }}
      onClick={onClose}
    >
      <div
        style={{ background: '#fff', borderRadius: 16, maxWidth: 600, width: '100%', maxHeight: '85vh', overflow: 'auto', padding: '24px', boxShadow: '0 24px 48px rgba(0,0,0,0.12)' }}
        onClick={e => e.stopPropagation()}
      >
        {poster && (
          <img src={poster} alt={event.title} style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 12, marginBottom: 16 }} />
        )}
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#030213', marginBottom: 4 }}>{event.title}</h2>
        <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>
          by {event.organizer} &middot; {formatDate(event.eventDate)}
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          <StatusBadge status={getEventStatus(event)} />
          <span style={{ fontSize: 12, padding: '4px 10px', borderRadius: 20, background: '#f3f4f6', color: '#374151' }}>{getCategory(event)}</span>
          {event.location && <span style={{ fontSize: 12, padding: '4px 10px', borderRadius: 20, background: '#f3f4f6', color: '#374151' }}>{event.location}</span>}
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: '#374151', whiteSpace: 'pre-wrap' }}>{event.description}</p>
        {event.registrationLink && event.registrationLink !== 'N/A' && (
          <a href={event.registrationLink} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: 16, padding: '8px 16px', borderRadius: 8, background: '#1a56db', color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
            Registration Link
          </a>
        )}
        <button onClick={onClose} style={{ display: 'block', margin: '20px auto 0', padding: '8px 24px', borderRadius: 8, background: '#f3f4f6', border: 'none', fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
          Close
        </button>
      </div>
    </div>
  );
}

// ── Mobile Event Card ────────────────────────────────────────────────────────
function EventCard({
  event,
  onApprove,
  onReject,
  onView,
  isProcessing,
}: {
  event: EventDocument;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onView: (e: EventDocument) => void;
  isProcessing: boolean;
}) {
  const eventStatus = getEventStatus(event);
  const isPending = eventStatus === 'Pending';
  const poster = getPosterUrl(event);

  return (
    <div style={{
      background: isPending ? 'rgba(255,251,235,0.4)' : '#fff',
      border: '1px solid rgba(0,0,0,0.06)',
      borderRadius: 14,
      padding: 16,
    }}>
      {/* Top: thumbnail + title */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 10, flexShrink: 0,
          background: poster ? 'transparent' : '#f3f4f6',
          overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {poster ? <img src={poster} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Calendar size={18} color="#9ca3af" />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#030213', margin: 0, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {event.title}
          </p>
          <p style={{ fontSize: 12, color: '#9ca3af', margin: '2px 0 0' }}>{getCategory(event)}</p>
        </div>
        <StatusBadge status={eventStatus} />
      </div>

      {/* Meta row */}
      <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#6b7280', marginBottom: 12, flexWrap: 'wrap' }}>
        <span>{formatDate(event.eventDate)}</span>
        <span>{event.organizer}</span>
        {event.location && <span>{event.location}</span>}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8 }}>
        {isPending && (
          <>
            <button
              onClick={() => onApprove(event.$id)}
              disabled={isProcessing}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                padding: '8px 0', borderRadius: 8, border: 'none',
                background: '#ecfdf5', color: '#096', fontSize: 13, fontWeight: 600,
                cursor: isProcessing ? 'wait' : 'pointer', opacity: isProcessing ? 0.6 : 1,
              }}
            >
              <Check size={14} /> Approve
            </button>
            <button
              onClick={() => onReject(event.$id)}
              disabled={isProcessing}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                padding: '8px 0', borderRadius: 8, border: 'none',
                background: '#fef2f2', color: '#d4183d', fontSize: 13, fontWeight: 600,
                cursor: isProcessing ? 'wait' : 'pointer', opacity: isProcessing ? 0.6 : 1,
              }}
            >
              <X size={14} /> Reject
            </button>
          </>
        )}
        <button
          onClick={() => onView(event)}
          style={{
            width: isPending ? 40 : '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '8px 0', borderRadius: 8, border: '1px solid rgba(0,0,0,0.08)',
            background: '#fff', color: '#6b7280', fontSize: 13, fontWeight: 500, cursor: 'pointer',
          }}
        >
          <Eye size={14} />{!isPending && ' View Details'}
        </button>
      </div>
    </div>
  );
}

const ADMIN_IDS = ['68ff4c5816bf5338810a', '68fe7498057792229b3d'];

// ── Main Component ───────────────────────────────────────────────────────────
export default function AdminEventsModeration() {
  const { user, loading: authLoading } = useAuth();
  const [events, setEvents] = useState<EventDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortNewest, setSortNewest] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [viewEvent, setViewEvent] = useState<EventDocument | null>(null);

  useEffect(() => {
    const fetchAllEvents = async () => {
      if (!user || !ADMIN_IDS.includes(user.$id)) return;
      try {
        setLoading(true);
        const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.EVENTS, [Query.limit(200), Query.orderDesc('$createdAt')]);
        setEvents(response.documents as unknown as EventDocument[]);
      } catch (err) {
        console.error('Failed to fetch events:', err);
        toast.error('Failed to load events');
      } finally {
        setLoading(false);
      }
    };
    fetchAllEvents();
  }, []);

  const stats = useMemo(() => {
    const total = events.length;
    const pending = events.filter(e => getEventStatus(e) === 'Pending').length;
    const approved = events.filter(e => getEventStatus(e) === 'Approved').length;
    const rejected = events.filter(e => getEventStatus(e) === 'Rejected').length;
    const rate = total > 0 ? Math.round((approved / total) * 100) : 0;
    return { total, pending, approved, rejected, rate };
  }, [events]);

  const filteredEvents = useMemo(() => {
    let result = events;
    if (activeTab !== 'All') result = result.filter(e => getEventStatus(e) === activeTab);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(e => e.title.toLowerCase().includes(q) || e.organizer.toLowerCase().includes(q) || (e.location || '').toLowerCase().includes(q));
    }
    return [...result].sort((a, b) => {
      const da = new Date(a.$createdAt).getTime();
      const db_ = new Date(b.$createdAt).getTime();
      return sortNewest ? db_ - da : da - db_;
    });
  }, [events, activeTab, searchQuery, sortNewest]);

  const handleApprove = async (eventId: string) => {
    setActionLoading(eventId);
    try {
      await databases.updateDocument(DATABASE_ID, COLLECTIONS.EVENTS, eventId, { approved: true });
      setEvents(prev => prev.map(e => (e.$id === eventId ? { ...e, approved: true, status: e.status === 'Rejected' ? 'Upcoming' : e.status } : e)));
      toast.success('Event approved successfully');
    } catch (err) {
      console.error('Failed to approve event:', err);
      toast.error('Failed to approve event. Check collection permissions.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (eventId: string) => {
    setActionLoading(eventId);
    try {
      await databases.updateDocument(DATABASE_ID, COLLECTIONS.EVENTS, eventId, { approved: false, status: 'Rejected' });
      setEvents(prev => prev.map(e => (e.$id === eventId ? { ...e, approved: false, status: 'Rejected' } : e)));
      toast.success('Event rejected');
    } catch (err) {
      console.error('Failed to reject event:', err);
      toast.error('Failed to reject event. Check collection permissions.');
    } finally {
      setActionLoading(null);
    }
  };

  const tabs = [
    { key: 'All' as const, label: 'All' },
    { key: 'Pending' as const, label: 'Pending', count: stats.pending },
    { key: 'Approved' as const, label: 'Approved' },
    { key: 'Rejected' as const, label: 'Rejected' },
  ];

  const statCards = [
    { label: 'Total Submitted', value: stats.total, icon: <FileText size={20} color="#3b82f6" />, iconBg: '#dbeafe' },
    { label: 'Pending Review', value: stats.pending, icon: <Clock size={20} color="#d97706" />, iconBg: '#fef3c6' },
    { label: 'Approval Rate', value: `${stats.rate}%`, icon: <BarChart3 size={20} color="#10b981" />, iconBg: '#d0fae5' },
    { label: 'Rejected', value: stats.rejected, icon: <XCircle size={20} color="#ef4444" />, iconBg: '#ffe2e2' },
  ];

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fb', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: '3px solid #e5e7eb', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
          <p style={{ marginTop: 16, color: '#6b7280', fontSize: 14 }}>Loading events...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (!user || !ADMIN_IDS.includes(user.$id)) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fb', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <Shield size={48} color="#ef4444" style={{ margin: '0 auto', marginBottom: 16 }} />
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#030213', margin: '0 0 8px 0' }}>Access Denied</h2>
          <p style={{ color: '#6b7280', margin: 0 }}>You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fb', fontFamily: 'Inter, sans-serif' }}>
      <style>{responsiveCSS}</style>

      {/* Header */}
      <header className="adm-header" style={{ background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Shield size={20} color="#4f46e5" />
          </div>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: '#030213', margin: 0 }}>Event Moderation</h1>
            <p className="adm-header-sub" style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>Review and manage submitted events</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {stats.pending > 0 && (
            <span style={{ padding: '4px 12px', borderRadius: 20, background: '#fef3c6', color: '#bb4d00', fontSize: 13, fontWeight: 600 }}>
              {stats.pending} pending
            </span>
          )}
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 600 }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
        </div>
      </header>

      <div className="adm-content" style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Stat Cards */}
        <div className="adm-stats" style={{ display: 'grid', gap: 16, marginBottom: 24 }}>
          {statCards.map(card => (
            <div key={card.label} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: card.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {card.icon}
              </div>
              <div>
                <p className="adm-stat-label" style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>{card.label}</p>
                <p className="adm-stat-value" style={{ fontSize: 24, fontWeight: 700, color: '#030213', margin: 0 }}>{card.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="adm-tabs" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, paddingBottom: 4 }}>
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, border: 'none',
              fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
              background: activeTab === tab.key ? '#030213' : '#fff',
              color: activeTab === tab.key ? '#fff' : '#374151',
              boxShadow: activeTab !== tab.key ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
              transition: 'all 0.15s',
            }}>
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span style={{ padding: '1px 8px', borderRadius: 10, fontSize: 11, fontWeight: 700, background: activeTab === tab.key ? 'rgba(255,255,255,0.2)' : '#fef3c6', color: activeTab === tab.key ? '#fff' : '#bb4d00' }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Filter Row */}
        <div className="adm-filter-row" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <button onClick={() => setSortNewest(!sortNewest)} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10,
            border: '1px solid rgba(0,0,0,0.08)', background: '#fff', fontSize: 13, color: '#374151', cursor: 'pointer', fontWeight: 500, whiteSpace: 'nowrap',
          }}>
            <ArrowUpDown size={14} />
            {sortNewest ? 'Newest first' : 'Oldest first'}
          </button>
          <div style={{ flex: 1 }} />
          <div className="adm-search" style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input
              type="text" placeholder="Search events, creators..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              style={{ padding: '8px 14px 8px 36px', borderRadius: 10, border: '1px solid rgba(0,0,0,0.08)', background: '#fff', fontSize: 13, width: '100%', outline: 'none', color: '#030213', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        {/* Desktop Table */}
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <table className="adm-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                {['Event Name', 'Submitted By', 'College', 'Date', 'Status', 'Actions'].map(col => (
                  <th key={col} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredEvents.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: 48, textAlign: 'center', color: '#9ca3af', fontSize: 14 }}>No events found</td></tr>
              ) : (
                filteredEvents.map(event => {
                  const eventStatus = getEventStatus(event);
                  const poster = getPosterUrl(event);
                  const isPending = eventStatus === 'Pending';
                  const isProcessing = actionLoading === event.$id;
                  return (
                    <tr key={event.$id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)', background: isPending ? 'rgba(255,251,235,0.4)' : '#fff' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 8, background: poster ? 'transparent' : '#f3f4f6', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {poster ? <img src={poster} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Calendar size={16} color="#9ca3af" />}
                          </div>
                          <div>
                            <p style={{ fontSize: 14, fontWeight: 600, color: '#030213', margin: 0, lineHeight: 1.3 }}>{event.title}</p>
                            <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>{getCategory(event)}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#374151' }}>{event.submittedBy || event.createdByUserId || 'Unknown'}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#374151' }}>{event.location || '—'}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#374151' }}>{formatDate(event.eventDate)}</td>
                      <td style={{ padding: '12px 16px' }}><StatusBadge status={eventStatus} /></td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          {isPending && (
                            <>
                              <button onClick={() => handleApprove(event.$id)} disabled={isProcessing} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 8, border: 'none', background: '#ecfdf5', color: '#096', fontSize: 12, fontWeight: 600, cursor: isProcessing ? 'wait' : 'pointer', opacity: isProcessing ? 0.6 : 1 }}>
                                <Check size={14} /> Approve
                              </button>
                              <button onClick={() => handleReject(event.$id)} disabled={isProcessing} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 8, border: 'none', background: '#fef2f2', color: '#d4183d', fontSize: 12, fontWeight: 600, cursor: isProcessing ? 'wait' : 'pointer', opacity: isProcessing ? 0.6 : 1 }}>
                                <X size={14} /> Reject
                              </button>
                            </>
                          )}
                          <button onClick={() => setViewEvent(event)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 8, border: '1px solid rgba(0,0,0,0.08)', background: '#fff', cursor: 'pointer', color: '#6b7280' }}>
                            <Eye size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* Mobile Card List */}
          <div className="adm-card-list" style={{ padding: 12 }}>
            {filteredEvents.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: 14, padding: 32 }}>No events found</p>
            ) : (
              filteredEvents.map(event => (
                <EventCard
                  key={event.$id}
                  event={event}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onView={setViewEvent}
                  isProcessing={actionLoading === event.$id}
                />
              ))
            )}
          </div>

          {/* Footer */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(0,0,0,0.06)', fontSize: 13, color: '#9ca3af' }}>
            Showing {filteredEvents.length} of {events.length} events
          </div>
        </div>
      </div>

      {viewEvent && <EventDetailModal event={viewEvent} onClose={() => setViewEvent(null)} />}
    </div>
  );
}
