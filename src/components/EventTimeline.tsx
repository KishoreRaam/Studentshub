// EventTimeline Component - Vertical timeline view of upcoming events
// Displays events chronologically with date markers and connecting lines

import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Event, formatEventDate, getDaysUntilEvent } from '@/types/event';
import { motion } from 'motion/react';

interface EventTimelineProps {
  events: Event[];
  onEventClick: (event: Event) => void;
}

export default function EventTimeline({ events, onEventClick }: EventTimelineProps) {
  // Group events by month
  const groupedByMonth = events.reduce((acc, event) => {
    const date = new Date(event.date);
    const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="timeline-container max-w-4xl mx-auto py-8">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
        Upcoming Events Timeline
      </h2>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500" />

        {Object.entries(groupedByMonth).map(([monthYear, monthEvents], monthIndex) => (
          <div key={monthYear} className="mb-12">
            {/* Month Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative z-10 bg-blue-600 dark:bg-blue-500 text-white px-6 py-2 rounded-full shadow-lg font-semibold text-sm">
                {monthYear}
              </div>
              <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
            </div>

            {/* Events in this month */}
            <div className="space-y-6">
              {monthEvents.map((event, eventIndex) => {
                const eventDate = new Date(event.date);
                eventDate.setHours(0, 0, 0, 0);
                const isToday = eventDate.getTime() === today.getTime();
                const isPast = eventDate < today;
                const daysUntil = getDaysUntilEvent(event.date);

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: (monthIndex * 0.2) + (eventIndex * 0.1) }}
                    className="relative pl-20"
                  >
                    {/* Timeline Dot */}
                    <div
                      className={`absolute left-6 top-6 w-5 h-5 rounded-full border-4 ${
                        isToday
                          ? 'bg-green-500 border-green-200 dark:border-green-800 animate-pulse'
                          : isPast
                          ? 'bg-gray-400 border-gray-200 dark:border-gray-700'
                          : 'bg-blue-500 border-blue-200 dark:border-blue-800'
                      }`}
                    />

                    {/* Connector Line to Card */}
                    <div className="absolute left-8 top-8 w-12 h-px bg-gray-300 dark:bg-gray-700" />

                    {/* Event Card */}
                    <div
                      className={`bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border-l-4 cursor-pointer ${
                        isToday
                          ? 'border-green-500'
                          : isPast
                          ? 'border-gray-400 opacity-60'
                          : 'border-blue-500'
                      } hover:-translate-y-1`}
                      onClick={() => onEventClick(event)}
                    >
                      {/* Event Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <Badge
                              className={`${
                                event.category === 'Hackathon'
                                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                                  : event.category === 'Webinar'
                                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                  : event.category === 'Workshop'
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                  : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                              } border-0`}
                            >
                              {event.category}
                            </Badge>

                            {isToday && (
                              <Badge className="bg-green-500 text-white border-0 animate-pulse">
                                📍 Today
                              </Badge>
                            )}

                            {!isPast && !isToday && daysUntil <= 7 && (
                              <Badge className="bg-yellow-500 text-white border-0">
                                ⏰ In {daysUntil} day{daysUntil === 1 ? '' : 's'}
                              </Badge>
                            )}

                            {event.status === 'Live Now' && (
                              <Badge className="bg-red-500 text-white border-0 animate-pulse">
                                🔴 Live Now
                              </Badge>
                            )}
                          </div>

                          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                            {event.title}
                          </h3>

                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                            {event.description}
                          </p>
                        </div>

                        {event.thumbnailUrl && (
                          <img
                            src={event.thumbnailUrl}
                            alt={event.title}
                            className="w-20 h-20 rounded-lg object-cover ml-4 flex-shrink-0"
                          />
                        )}
                      </div>

                      {/* Event Details */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          <span>{formatEventDate(event.date)}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <Clock className="w-4 h-4 text-green-500" />
                          <span>{event.time}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <MapPin className="w-4 h-4 text-purple-500" />
                          <span className="truncate">{event.location || 'Online'}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <Users className="w-4 h-4 text-orange-500" />
                          <span>{event.participantCount}+ registered</span>
                        </div>
                      </div>

                      {/* Organizer */}
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                        <span>by</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{event.organizer}</span>
                      </div>

                      {/* Action Button */}
                      <Button
                        size="sm"
                        className={`w-full ${
                          isPast
                            ? 'bg-gray-400 hover:bg-gray-500'
                            : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600'
                        } text-white`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick(event);
                        }}
                      >
                        {isPast ? 'View Details' : 'View & Register'}
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No upcoming events in timeline</p>
        </div>
      )}
    </div>
  );
}
