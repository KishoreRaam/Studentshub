// EventCard Component for Events Page Grid
// Displays event information with thumbnail, badges, and action buttons

import { Calendar, Users, GraduationCap, Bookmark, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Event } from '@/types/event';
import { formatEventDate } from '@/types/event';

interface EventCardProps {
  event: Event;
  isSaved?: boolean;
  onViewDetails: (event: Event) => void;
  onToggleSave: (event: Event) => void;
  isSaving?: boolean;
}

export default function EventCard({
  event,
  isSaved = false,
  onViewDetails,
  onToggleSave,
  isSaving = false,
}: EventCardProps) {
  // Get status badge styling
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Live Now':
        return 'bg-red-500 text-white animate-pulse';
      case 'Registration Open':
        return 'bg-green-500 text-white';
      case 'Upcoming':
        return 'bg-yellow-500 text-white';
      case 'Registration Closed':
        return 'bg-gray-500 text-white';
      case 'Completed':
        return 'bg-gray-400 text-white';
      default:
        return 'bg-blue-500 text-white';
    }
  };

  // Get category badge styling
  const getCategoryBadgeStyle = (category: string) => {
    switch (category) {
      case 'Hackathon':
        return 'bg-purple-500 text-white';
      case 'Webinar':
        return 'bg-blue-500 text-white';
      case 'Workshop':
        return 'bg-green-500 text-white';
      case 'Conference':
        return 'bg-orange-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  // Format participant count with "k" suffix for thousands
  const formatParticipantCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k+`;
    }
    return `${count}+`;
  };

  return (
    <article
      className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer flex flex-col h-full"
      onClick={() => onViewDetails(event)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onViewDetails(event);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${event.title}`}
    >
      {/* Thumbnail Image */}
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <img
          src={event.thumbnailUrl}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Category Badge - Top Left */}
        <Badge
          className={`absolute top-3 left-3 ${getCategoryBadgeStyle(event.category)} border-0 shadow-md px-3 py-1 text-xs font-semibold`}
        >
          {event.category}
        </Badge>

        {/* Status Badge - Top Right */}
        <Badge
          className={`absolute top-3 right-3 ${getStatusBadgeStyle(event.status)} border-0 shadow-md px-3 py-1 text-xs font-semibold`}
        >
          {event.status}
        </Badge>

        {/* Featured Star */}
        {event.isFeatured && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 rounded-full px-3 py-1 text-xs font-bold shadow-lg flex items-center gap-1">
            ⭐ Featured
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 flex-1">
          {event.description}
        </p>

        {/* Event Details Row */}
        <div className="space-y-2 mb-4">
          {/* Date & Time */}
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span className="font-medium">{formatEventDate(event.date)}</span>
            <span className="text-gray-500">•</span>
            <span>{event.time}</span>
          </div>

          {/* Participants */}
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <Users className="w-4 h-4 text-green-500" />
            <span>{formatParticipantCount(event.participantCount)} Registered</span>
          </div>

          {/* Streams/Tags */}
          {event.streams && event.streams.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 flex-wrap">
              <GraduationCap className="w-4 h-4 text-purple-500 flex-shrink-0" />
              <div className="flex flex-wrap gap-1">
                {event.streams.slice(0, 3).map((stream, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                  >
                    {stream}
                  </Badge>
                ))}
                {event.streams.length > 3 && (
                  <Badge variant="outline" className="text-xs border-gray-300 dark:border-gray-600">
                    +{event.streams.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Organizer Info */}
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          {event.organizerLogo ? (
            <img
              src={event.organizerLogo}
              alt={event.organizer}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
              {event.organizer.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-500 dark:text-gray-400">Organized by</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {event.organizer}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(event);
            }}
            className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-md hover:shadow-lg transition-all font-semibold"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Register Now
          </Button>

          {/* Bookmark Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(event);
            }}
            disabled={isSaving}
            className={`flex-shrink-0 transition-all ${
              isSaved
                ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/50'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            aria-label={isSaved ? 'Remove bookmark' : 'Add bookmark'}
          >
            <Bookmark
              className={`w-5 h-5 transition-all ${
                isSaved
                  ? 'fill-blue-600 text-blue-600 dark:fill-blue-400 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            />
          </Button>
        </div>

        {/* Popular Badge (if applicable) */}
        {event.isPopular && (
          <div className="absolute bottom-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            🔥 Popular
          </div>
        )}
      </div>
    </article>
  );
}
