// Dashboard EventCard Component
// Displays saved events in the dashboard with countdown and quick actions

import { Calendar, Clock, MapPin, Bookmark, ExternalLink, Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatEventDate, getDaysUntilEvent } from '@/types/event';

export interface SavedEvent {
  id: string;
  title: string;
  category: string;
  description: string;
  date: string;
  time: string;
  thumbnailUrl?: string;
  registrationLink?: string;
  organizer?: string;
  duration?: string;
  location?: string;
  isSaved: boolean;
  registered?: boolean;
  savedId: string;
}

interface EventCardProps {
  event: SavedEvent;
  onViewDetails: (event: SavedEvent) => void;
  onToggleSave: (eventId: string) => void;
}

export default function EventCard({ event, onViewDetails, onToggleSave }: EventCardProps) {
  const daysUntil = getDaysUntilEvent(event.date);
  const eventDate = new Date(event.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  eventDate.setHours(0, 0, 0, 0);

  const isPast = eventDate < today;
  const isToday = eventDate.getTime() === today.getTime();
  const isUpcoming = daysUntil > 0 && daysUntil <= 7;

  // Get category color
  const getCategoryColor = () => {
    switch (event.category.toLowerCase()) {
      case 'hackathon':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case 'webinar':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'workshop':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'conference':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 p-6 relative group">
      {/* Bookmark Icon */}
      <button
        type="button"
        onClick={() => onToggleSave(event.id)}
        className="absolute top-4 right-4 p-2 rounded-full bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
        aria-label="Toggle bookmark"
      >
        <Bookmark
          className={`w-5 h-5 ${
            event.isSaved
              ? 'fill-blue-600 text-blue-600 dark:fill-blue-400 dark:text-blue-400'
              : 'text-blue-600 dark:text-blue-400'
          }`}
        />
      </button>

      {/* Thumbnail or Icon */}
      {event.thumbnailUrl ? (
        <div className="w-full h-40 mb-4 rounded-lg overflow-hidden">
          <img
            src={event.thumbnailUrl}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 rounded-xl shadow-md flex items-center justify-center mb-4">
          <Calendar className="w-8 h-8 text-white" />
        </div>
      )}

      {/* Content */}
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2 pr-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
            {event.title}
          </h3>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <Badge className={`${getCategoryColor()} border-0`}>{event.category}</Badge>

          {event.registered && (
            <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-0">
              ✓ Registered
            </Badge>
          )}

          {isToday && (
            <Badge className="bg-red-500 text-white border-0 animate-pulse">
              Today!
            </Badge>
          )}

          {isUpcoming && !isToday && (
            <Badge className="bg-yellow-500 text-white border-0">
              {daysUntil} day{daysUntil === 1 ? '' : 's'} left
            </Badge>
          )}

          {isPast && (
            <Badge className="bg-gray-400 text-white border-0">
              Past Event
            </Badge>
          )}
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
          {event.description}
        </p>

        {/* Event Details */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span className="font-medium">{formatEventDate(event.date)}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Clock className="w-4 h-4 text-green-500" />
            <span>{event.time}</span>
            {event.duration && <span className="text-gray-500">• {event.duration}</span>}
          </div>

          {event.location && (
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <MapPin className="w-4 h-4 text-purple-500" />
              <span className="truncate">{event.location}</span>
            </div>
          )}

          {event.organizer && (
            <div className="text-gray-600 dark:text-gray-400">
              <span className="text-xs">by </span>
              <span className="text-xs font-medium">{event.organizer}</span>
            </div>
          )}
        </div>
      </div>

      {/* Countdown Display for Upcoming Events */}
      {!isPast && daysUntil >= 0 && (
        <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {isToday ? 'Event is Today!' : `Starts in ${daysUntil} day${daysUntil === 1 ? '' : 's'}`}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={() => onViewDetails(event)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-gradient-to-r dark:from-blue-600 dark:to-purple-700 dark:hover:from-blue-700 dark:hover:to-purple-800 text-white shadow-md hover:shadow-lg transition-all font-semibold"
          size="sm"
        >
          View Details
        </Button>

        {event.registrationLink && !isPast && (
          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20"
          >
            <a href={event.registrationLink} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
