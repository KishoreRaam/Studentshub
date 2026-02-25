// Event Type Definitions for StudentHub Events Page

export type EventCategory = 'Webinar' | 'Hackathon' | 'Workshop' | 'Conference';

export type EventStatus = 'Live Now' | 'Upcoming' | 'Registration Open' | 'Registration Closed' | 'Completed';

export type StudentStream = 'All' | 'CSE' | 'Mechatronics' | 'AI/ML' | 'Data Science' | 'Cybersecurity' | 'Web Development' | 'Mobile Development' | 'DevOps' | 'Design';

export interface Event {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  date: string; // ISO format date
  time: string; // e.g., "6:00 PM IST"
  duration: string; // e.g., "2 hours"
  organizer: string;
  organizerLogo?: string;
  organizerWebsite?: string;
  participantCount: number;
  maxParticipants?: number;
  streams: StudentStream[]; // Target audience streams
  registrationLink: string; // External registration URL
  thumbnailUrl: string;
  status: EventStatus;
  isPopular?: boolean;
  isFeatured?: boolean;
  location?: string; // "Online" or physical location
  platform?: string; // e.g., "Zoom", "Google Meet", "In-person"
  prerequisites?: string[];
  tags?: string[];
  // Enhanced data
  requirements?: string[];
  agenda?: string[];
  speakers?: EventSpeaker[];
  benefits?: string[];
  resources?: EventResource[];
  recordingUrl?: string; // For past events
  certificateOffered?: boolean;
  isPaid?: boolean;
  price?: string;
  views?: number;
  saves?: number;
}

export interface EventSpeaker {
  name: string;
  role: string;
  company?: string;
  photo?: string;
  bio?: string;
  linkedin?: string;
  twitter?: string;
}

export interface EventResource {
  title: string;
  type: 'Slides' | 'Recording' | 'Code' | 'Documentation' | 'Certificate' | 'Other';
  url: string;
  description?: string;
}

export interface EventEnhancement {
  requirements: string[];
  agenda: string[];
  speakers: EventSpeaker[];
  benefits: string[];
  resources?: EventResource[];
}

// Saved Event (Appwrite Collection Schema)
export interface SavedEvent {
  $id: string; // Appwrite document ID
  $createdAt: string;
  $updatedAt: string;
  userID: string;
  eventID: string;
  title: string;
  category: EventCategory;
  description: string;
  date: string;
  time: string;
  thumbnailUrl?: string;
  registrationLink?: string;
  organizer?: string;
  registered: boolean; // Whether user clicked "Register"
  registeredDate?: string | null;
  reminderSent?: boolean;
  notes?: string; // User's personal notes
}

// For dashboard display
export interface EventCardData {
  id: string;
  title: string;
  category: EventCategory;
  date: string;
  time: string;
  organizer: string;
  thumbnailUrl: string;
  registrationLink: string;
  status: EventStatus;
  registered?: boolean;
  daysUntilEvent?: number;
}

// Filter & Sort options
export interface EventFilters {
  category: EventCategory | 'All';
  stream: StudentStream;
  dateRange: 'This Week' | 'This Month' | 'Upcoming' | 'All';
  status?: EventStatus;
}

export type EventSortOption = 'newest' | 'soonest' | 'popular' | 'az';

// Default requirements for events without specific enhancement data
export const DEFAULT_EVENT_REQUIREMENTS = [
  'Valid student email address or student ID',
  'Currently enrolled in an accredited educational institution',
  'Basic understanding of the topic (if intermediate/advanced level)',
  'Stable internet connection for online events',
];

// Export utility type guards
export const isUpcomingEvent = (event: Event): boolean => {
  return event.status === 'Upcoming' || event.status === 'Registration Open';
};

export const isPastEvent = (event: Event): boolean => {
  return event.status === 'Completed';
};

export const isLiveEvent = (event: Event): boolean => {
  return event.status === 'Live Now';
};

// Date utility functions
export const getEventDate = (dateString: string): Date => {
  return new Date(dateString);
};

export const getDaysUntilEvent = (dateString: string): number => {
  const eventDate = getEventDate(dateString);
  const today = new Date();
  const diffTime = eventDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const formatEventDate = (dateString: string): string => {
  const date = getEventDate(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const isEventThisWeek = (dateString: string): boolean => {
  const eventDate = getEventDate(dateString);
  const today = new Date();
  const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  return eventDate >= today && eventDate <= weekFromNow;
};

export const isEventThisMonth = (dateString: string): boolean => {
  const eventDate = getEventDate(dateString);
  const today = new Date();
  return (
    eventDate.getMonth() === today.getMonth() &&
    eventDate.getFullYear() === today.getFullYear()
  );
};
