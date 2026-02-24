import React from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

interface EventDocument {
  $id: string;
  eventDate: string;
  title: string;
  [key: string]: any;
}

interface EventCalendarProps {
  events: EventDocument[];
  onDateSelect: (dateStr: string | null) => void;
}

export function EventCalendar({ events, onDateSelect }: EventCalendarProps) {
  // Extract dates that have events
  const eventDates = events.map(e => {
    const d = new Date(e.eventDate);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  });

  const handleDayClick = (day: Date) => {
    const dateStr = day.toISOString().slice(0, 10);
    const hasEvents = events.some(e => e.eventDate.slice(0, 10) === dateStr);
    onDateSelect(hasEvents ? dateStr : null);
  };

  return (
    <div style={{
      background: 'var(--el-white)',
      border: '0.8px solid var(--el-border)',
      borderRadius: 16,
      padding: 24,
      boxShadow: '0px 2px 8px rgba(0,0,0,0.04)',
      display: 'inline-block',
    }}>
      <DayPicker
        mode="single"
        onSelect={(day) => day && handleDayClick(day)}
        modifiers={{ hasEvent: eventDates }}
        modifiersStyles={{
          hasEvent: {
            background: 'var(--el-blueLight)',
            color: 'var(--el-blue)',
            fontWeight: 700,
            borderRadius: '50%',
          }
        }}
        styles={{
          caption: { fontFamily: '"DM Sans", sans-serif', fontWeight: 600, color: 'var(--el-dark)' },
          day: { fontFamily: '"DM Sans", sans-serif', fontSize: 14 },
        }}
        fromDate={new Date()}
      />
      <div style={{
        marginTop: 12,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontFamily: '"DM Sans", sans-serif',
        fontSize: 12,
        color: 'var(--el-muted)',
      }}>
        <span style={{
          width: 10, height: 10, borderRadius: '50%',
          background: 'var(--el-blueLight)',
          border: '1px solid var(--el-blue)',
          display: 'inline-block',
        }} />
        Has events
        <button
          onClick={() => onDateSelect(null)}
          style={{
            marginLeft: 'auto',
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 12,
            color: 'var(--el-blue)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Clear filter
        </button>
      </div>
    </div>
  );
}
