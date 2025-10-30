// DetailedEventCard Component - Modal view for event details
// Adapted from DetailedPerkCard for events

import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Bookmark,
  ExternalLink,
  Check,
  Award,
  Video,
  FileText,
  ArrowLeft,
  Loader2,
  GraduationCap,
} from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './ui/dialog';
import { motion } from 'motion/react';
import { Event, formatEventDate, getDaysUntilEvent } from '@/types/event';
import { useSavedItems } from '@/hooks/useSavedItems';

interface DetailedEventCardProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveChange?: () => void;
}

const categoryColors: Record<string, string> = {
  Hackathon:
    'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800',
  Webinar:
    'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
  Workshop:
    'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
  Conference:
    'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800',
};

const renderAgenda = (event: Event) => {
  if (!event.agenda || event.agenda.length === 0) {
    return null;
  }

  return (
    <div className="px-6 py-6">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-blue-500" />
        Event Agenda
      </h3>
      <div className="space-y-3">
        {event.agenda.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start space-x-4 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg"
          >
            <div className="w-7 h-7 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {index + 1}
            </div>
            <span className="text-card-foreground leading-relaxed pt-0.5">{item}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const renderSpeakers = (event: Event) => {
  if (!event.speakers || event.speakers.length === 0) {
    return null;
  }

  return (
    <div className="px-6 py-6">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Users className="w-5 h-5 text-purple-500" />
        Speakers & Mentors
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {event.speakers.map((speaker, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start space-x-3 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            {speaker.photo ? (
              <img
                src={speaker.photo}
                alt={speaker.name}
                className="w-14 h-14 rounded-full object-cover"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                {speaker.name.charAt(0)}
              </div>
            )}
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 dark:text-white">{speaker.name}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{speaker.role}</p>
              {speaker.company && (
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{speaker.company}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const renderBenefits = (event: Event) => {
  if (!event.benefits || event.benefits.length === 0) {
    return null;
  }

  return (
    <div className="px-6 py-6">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Award className="w-5 h-5 text-green-500" />
        What You'll Gain
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {event.benefits.map((benefit, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start space-x-3"
          >
            <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-card-foreground leading-relaxed">{benefit}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const renderRequirements = (event: Event) => {
  if (!event.requirements || event.requirements.length === 0) {
    return null;
  }

  return (
    <div className="px-6 py-6">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <GraduationCap className="w-5 h-5 text-indigo-500" />
        Prerequisites & Requirements
      </h3>
      <div className="space-y-2">
        {event.requirements.map((requirement, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0" />
            <span className="text-card-foreground leading-relaxed">{requirement}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const renderResources = (event: Event) => {
  if (!event.resources || event.resources.length === 0) {
    return null;
  }

  return (
    <div className="px-6 py-6">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-teal-500" />
        Event Resources
      </h3>
      <div className="space-y-2">
        {event.resources.map((resource, index) => (
          <a
            key={index}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700 group"
          >
            <div className="flex items-center gap-3">
              {resource.type === 'Recording' && <Video className="w-5 h-5 text-red-500" />}
              {resource.type === 'Slides' && <FileText className="w-5 h-5 text-blue-500" />}
              {resource.type === 'Code' && <FileText className="w-5 h-5 text-green-500" />}
              {resource.type === 'Certificate' && <Award className="w-5 h-5 text-yellow-500" />}
              {!['Recording', 'Slides', 'Code', 'Certificate'].includes(resource.type) && (
                <FileText className="w-5 h-5 text-gray-500" />
              )}
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{resource.title}</p>
                {resource.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">{resource.description}</p>
                )}
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </a>
        ))}
      </div>
    </div>
  );
};

const renderStatsRow = (event: Event) => {
  const daysUntil = getDaysUntilEvent(event.date);
  const countdownText =
    daysUntil > 0
      ? `In ${daysUntil} day${daysUntil === 1 ? '' : 's'}`
      : daysUntil === 0
      ? 'Today!'
      : 'Event passed';

  return (
    <div className="px-6 py-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center border border-blue-100 dark:border-blue-800">
          <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <div className="text-sm text-blue-600 dark:text-blue-400">Event Date</div>
          <div className="text-blue-900 dark:text-blue-300 font-medium text-sm">
            {formatEventDate(event.date)}
          </div>
          <div className="text-xs text-blue-700 dark:text-blue-400 mt-1">{countdownText}</div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center border border-green-100 dark:border-green-800">
          <Clock className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <div className="text-sm text-green-600 dark:text-green-400">Duration</div>
          <div className="text-green-900 dark:text-green-300 font-medium">{event.duration}</div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 text-center border border-purple-100 dark:border-purple-800">
          <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <div className="text-sm text-purple-600 dark:text-purple-400">Participants</div>
          <div className="text-purple-900 dark:text-purple-300 font-medium">
            {event.participantCount}+ Registered
          </div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 text-center border border-orange-100 dark:border-orange-800">
          <MapPin className="w-6 h-6 text-orange-600 mx-auto mb-2" />
          <div className="text-sm text-orange-600 dark:text-orange-400">Location</div>
          <div className="text-orange-900 dark:text-orange-300 font-medium text-sm">
            {event.location || 'Online'}
          </div>
        </div>
      </div>
    </div>
  );
};

export function DetailedEventCard({ event, isOpen, onClose, onSaveChange }: DetailedEventCardProps) {
  const { isSaved, toggleSave, isSaving } = useSavedItems('event');

  if (!event) {
    return null;
  }

  const categoryClass =
    categoryColors[event.category as keyof typeof categoryColors] ??
    'bg-muted text-muted-foreground';

  const handleSaveClick = async () => {
    if (event) {
      await toggleSave({
        id: event.id,
        title: event.title,
        category: event.category,
        description: event.description,
        date: event.date,
        time: event.time,
        thumbnailUrl: event.thumbnailUrl,
        registrationLink: event.registrationLink,
        organizer: event.organizer,
        duration: event.duration,
        location: event.location,
      });

      if (onSaveChange) {
        onSaveChange();
      }
    }
  };

  const getCategoryButtonColor = () => {
    const categoryColorMap: Record<string, string> = {
      Hackathon: 'bg-purple-600 hover:bg-purple-700 active:bg-purple-800',
      Webinar: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800',
      Workshop: 'bg-green-600 hover:bg-green-700 active:bg-green-800',
      Conference: 'bg-orange-600 hover:bg-orange-700 active:bg-orange-800',
    };
    return categoryColorMap[event.category] || 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800';
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-4xl w-full mx-4 p-0 gap-0 bg-transparent rounded-2xl shadow-2xl border-0 max-h-[85vh] flex flex-col">
        <DialogTitle className="sr-only">{event.title} Details</DialogTitle>
        <DialogDescription className="sr-only">
          Detailed information about {event.title} including agenda, speakers, and registration details.
        </DialogDescription>

        {/* Background Image Overlay */}
        <div className="absolute inset-0 opacity-30 overflow-hidden pointer-events-none rounded-2xl">
          <img
            src={event.thumbnailUrl}
            alt={`${event.title} background`}
            className="w-full h-full object-cover scale-110 blur-sm"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-500/20" />
        </div>

        {/* Content container with backdrop blur */}
        <div className="relative bg-card/95 backdrop-blur-sm flex flex-col rounded-2xl overflow-hidden max-h-[85vh]">
          {/* Header - Fixed at top */}
          <div className="flex-shrink-0 p-6 border-b border-border">
            <div className="flex items-start space-x-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden shadow-lg bg-muted flex-shrink-0">
                <img
                  src={event.thumbnailUrl}
                  alt={`${event.title} logo`}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center flex-wrap gap-2 mb-2">
                  <Badge variant="secondary" className={categoryClass}>
                    {event.category}
                  </Badge>
                  <Badge
                    className={`${
                      event.status === 'Live Now'
                        ? 'bg-red-500 text-white animate-pulse'
                        : event.status === 'Registration Open'
                        ? 'bg-green-500 text-white'
                        : 'bg-yellow-500 text-white'
                    }`}
                  >
                    {event.status}
                  </Badge>
                  {event.isFeatured && (
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white">
                      ⭐ Featured
                    </Badge>
                  )}
                  {event.certificateOffered && (
                    <Badge className="bg-gradient-to-r from-green-400 to-teal-400 text-white">
                      🏆 Certificate
                    </Badge>
                  )}
                </div>

                <h2 className="text-2xl font-bold text-foreground mb-2">{event.title}</h2>

                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>{formatEventDate(event.date)}</span>
                  <span>•</span>
                  <span>{event.time}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div
            className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
            style={{ maxHeight: 'calc(85vh - 300px)' }}
          >
            <div className="space-y-6 px-6 py-6">
              {/* Main Description */}
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">About this event</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">{event.description}</p>
              </div>

              {/* Organizer Info */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  {event.organizerLogo ? (
                    <img
                      src={event.organizerLogo}
                      alt={event.organizer}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {event.organizer.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Organized by</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{event.organizer}</p>
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              {renderStatsRow(event)}

              {/* Agenda */}
              {renderAgenda(event)}

              {/* Speakers */}
              {renderSpeakers(event)}

              {/* Benefits */}
              {renderBenefits(event)}

              {/* Requirements */}
              {renderRequirements(event)}

              {/* Resources */}
              {renderResources(event)}

              {/* Streams/Tags */}
              {event.streams && event.streams.length > 0 && (
                <div className="px-6 py-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Target Audience</h3>
                  <div className="flex flex-wrap gap-2">
                    {event.streams.map((stream, index) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        {stream}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons - Fixed at bottom */}
          <div className="flex-shrink-0 p-6 border-t-2 border-border bg-card backdrop-blur-sm shadow-lg">
            <div className="flex flex-col sm:flex-row gap-3">
              {event.registrationLink && event.registrationLink.trim() !== '' ? (
                <a
                  href={event.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex-1 ${getCategoryButtonColor()} text-white font-semibold h-16 text-lg shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg flex items-center justify-center gap-2 no-underline`}
                >
                  <ExternalLink className="w-6 h-6" />
                  <span>Register Now</span>
                </a>
              ) : (
                <button
                  disabled
                  className="flex-1 bg-gray-400 text-white font-semibold h-16 text-lg opacity-50 cursor-not-allowed rounded-lg flex items-center justify-center gap-2"
                  type="button"
                >
                  <ExternalLink className="w-6 h-6" />
                  <span>Registration Closed</span>
                </button>
              )}
              <Button
                variant="outline"
                size="lg"
                onClick={handleSaveClick}
                disabled={isSaving(event.id)}
                className={`flex-1 h-16 font-semibold border-2 transition-all duration-200 ${
                  isSaved(event.id)
                    ? 'bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 text-green-700 dark:text-green-400 border-green-500 dark:border-green-600'
                    : 'bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
                type="button"
              >
                {isSaving(event.id) ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : isSaved(event.id) ? (
                  <>
                    <Bookmark className="w-5 h-5 mr-2 fill-current" />
                    Saved ✓
                  </>
                ) : (
                  <>
                    <Bookmark className="w-5 h-5 mr-2" />
                    Save for Later
                  </>
                )}
              </Button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors mt-4 w-full justify-center"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to all events
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
