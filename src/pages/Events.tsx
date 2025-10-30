// Events Page - Main page for browsing and discovering student events
// Features: Hero section, search/filter, event grid, timeline view, categories

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import Papa from 'papaparse';
import {
  Search,
  Calendar,
  Video,
  Wrench,
  Users,
  TrendingUp,
  Loader2,
  SlidersHorizontal,
  Code,
  Sparkles,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import EventCard from '@/components/EventCard';
import { DetailedEventCard } from '@/components/DetailedEventCard';
import { Event, EventCategory, StudentStream, EventSortOption, isEventThisWeek, isEventThisMonth } from '@/types/event';
import { useSavedItems } from '@/hooks/useSavedItems';
import './Events.css';

// Event enhancement data with detailed information
const EVENT_ENHANCEMENTS: Record<string, {
  requirements: string[];
  agenda: string[];
  benefits: string[];
  speakers?: Array<{
    name: string;
    role: string;
    company?: string;
    photo?: string;
  }>;
}> = {
  'Smart India Hackathon 2025': {
    requirements: [
      'Team of 4-6 members',
      'Valid student ID from recognized institution',
      'Basic programming and problem-solving skills',
      'Laptop with development environment setup',
    ],
    agenda: [
      'Problem Statement Release',
      'Team Formation & Registration',
      'Mentoring Sessions (Days 1-2)',
      'Development Phase (48 hours)',
      'Final Presentation & Judging',
      'Winner Announcement',
    ],
    benefits: [
      'Win prizes up to ₹1 Lakh',
      'Certificate of participation',
      'Mentorship from industry experts',
      'Networking with government officials',
      'Opportunity to implement solutions nationally',
    ],
  },
  'HackIndia 2025 - Web3 & AI National Finals': {
    requirements: [
      'Team of 2-4 members',
      'Knowledge of Web3 technologies (Solidity, Ethereum, etc.)',
      'AI/ML basics (TensorFlow, PyTorch)',
      'Laptop with development tools',
    ],
    agenda: [
      'Opening Ceremony & Problem Statement',
      'Workshop on Web3 Integration',
      'AI/ML Session by Industry Experts',
      '36-hour Hacking Phase',
      'Demo Presentations',
      'Award Ceremony',
    ],
    benefits: [
      'Cash prizes totaling $150,000',
      'Internship opportunities with sponsors',
      'Access to exclusive Web3 APIs',
      'Networking with blockchain companies',
      'Certificate and swag kit',
    ],
  },
};

const DEFAULT_REQUIREMENTS = [
  'Valid student email or ID',
  'Currently enrolled in an educational institution',
  'Stable internet connection for virtual events',
  'Enthusiasm to learn and participate',
];

export default function Events() {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'All'>('All');
  const [selectedStream, setSelectedStream] = useState<StudentStream>('All');
  const [dateRange, setDateRange] = useState<'This Week' | 'This Month' | 'Upcoming' | 'All'>('All');
  const [sortOrder, setSortOrder] = useState<EventSortOption>('soonest');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Saved items hook for bookmarking
  const { isSaved, toggleSave, isSaving } = useSavedItems('event');

  // Load events from CSV
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoading(true);
        Papa.parse('/assets/student_events_2024_2025.csv', {
          download: true,
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const parsedEvents: Event[] = results.data.map((row: any) => {
              const eventId = row.id || `evt_${Math.random().toString(36).substr(2, 9)}`;
              const enhancement = EVENT_ENHANCEMENTS[row.title];

              // Parse streams from comma-separated string
              const streams = row.streams
                ? row.streams.split(',').map((s: string) => s.trim() as StudentStream)
                : ['All'];

              // Parse tags
              const tags = row.tags ? row.tags.split(',').map((t: string) => t.trim()) : [];

              // Map CSV status to EventStatus type
              let status: Event['status'] = 'Upcoming';
              if (row.status === 'live') status = 'Live Now';
              else if (row.status === 'registration-open') status = 'Registration Open';
              else if (row.status === 'upcoming') status = 'Upcoming';
              else if (row.status === 'completed') status = 'Completed';
              else if (row.status === 'registration-closed') status = 'Registration Closed';

              return {
                id: eventId,
                title: row.title || 'Untitled Event',
                description: row.description || '',
                category: (row.category?.charAt(0).toUpperCase() + row.category?.slice(1)) as EventCategory || 'Webinar',
                date: row.date || new Date().toISOString(),
                time: row.time || '12:00 PM',
                duration: row.duration || '2 hours',
                organizer: row.organizerName || 'Unknown Organizer',
                organizerLogo: row.organizerAvatar || '',
                organizerWebsite: row.organizerOrganization || '',
                participantCount: parseInt(row.participants) || 0,
                maxParticipants: parseInt(row.maxParticipants) || undefined,
                streams: streams,
                registrationLink: row.registrationLink || '',
                thumbnailUrl: row.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=450',
                status: status,
                isPopular: row.participants && parseInt(row.participants) > 1000,
                isFeatured: row.isFeatured === 'TRUE',
                location: row.location === 'online' ? 'Online' : row.location === 'in-person' ? row.venue : row.location,
                platform: row.location === 'online' ? 'Virtual Platform' : 'In-person',
                prerequisites: row.prerequisites ? row.prerequisites.split('|') : undefined,
                tags: tags,
                requirements: enhancement?.requirements || DEFAULT_REQUIREMENTS,
                agenda: enhancement?.agenda || [],
                speakers: enhancement?.speakers || [],
                benefits: enhancement?.benefits || [],
                recordingUrl: row.recordingLink || undefined,
                certificateOffered: row.certificateOffered === 'TRUE',
                isPaid: false,
              };
            });

            setAllEvents(parsedEvents);
            setFilteredEvents(parsedEvents);
            setIsLoading(false);
          },
          error: (error) => {
            console.error('Error loading events:', error);
            setIsLoading(false);
          },
        });
      } catch (error) {
        console.error('Error loading events:', error);
        setIsLoading(false);
      }
    };

    loadEvents();
  }, []);

  // Filter and sort events
  useEffect(() => {
    let filtered = [...allEvents];

    // Search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.organizer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((event) => event.category === selectedCategory);
    }

    // Stream filter
    if (selectedStream !== 'All') {
      filtered = filtered.filter((event) => event.streams.includes(selectedStream));
    }

    // Date range filter
    if (dateRange === 'This Week') {
      filtered = filtered.filter((event) => isEventThisWeek(event.date));
    } else if (dateRange === 'This Month') {
      filtered = filtered.filter((event) => isEventThisMonth(event.date));
    } else if (dateRange === 'Upcoming') {
      filtered = filtered.filter((event) => ['Upcoming', 'Registration Open', 'Live Now'].includes(event.status));
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortOrder) {
        case 'soonest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'popular':
          return b.participantCount - a.participantCount;
        case 'newest':
          return b.id.localeCompare(a.id);
        case 'az':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredEvents(filtered);
  }, [allEvents, searchTerm, selectedCategory, selectedStream, dateRange, sortOrder]);

  // Extract categories for filter buttons
  const categories = useMemo(() => {
    const cats = new Set(allEvents.map((event) => event.category));
    return Array.from(cats);
  }, [allEvents]);

  // Calculate stats
  const stats = useMemo(() => {
    return {
      webinars: allEvents.filter((e) => e.category === 'Webinar').length,
      hackathons: allEvents.filter((e) => e.category === 'Hackathon').length,
      workshops: allEvents.filter((e) => e.category === 'Workshop').length,
      total: allEvents.length,
    };
  }, [allEvents]);

  return (
    <div className="events-page min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="hero-section relative overflow-hidden py-16 md:py-24 px-4">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"
            animate={{
              y: [0, 30, 0],
              x: [0, 20, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-green-400/10 rounded-full blur-3xl"
            animate={{
              y: [0, -40, 0],
              x: [0, -30, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 px-4 leading-tight">
              Discover Events That{' '}
              <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                Matter
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto px-4">
              Join webinars, hackathons, and workshops designed for students
            </p>

            {/* Quick Stats Badges */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-4 py-2 text-base border-0">
                <Video className="w-4 h-4 mr-2" />
                {stats.webinars}+ Webinars
              </Badge>
              <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 px-4 py-2 text-base border-0">
                <Code className="w-4 h-4 mr-2" />
                {stats.hackathons} Hackathons
              </Badge>
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-4 py-2 text-base border-0">
                <Wrench className="w-4 h-4 mr-2" />
                {stats.workshops}+ Workshops
              </Badge>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white text-lg px-8 shadow-lg hover:shadow-xl transition-all"
                onClick={() => {
                  document.getElementById('events-grid')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Calendar className="w-5 h-5 mr-2" />
                Browse Events
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 border-2"
                onClick={() => {
                  window.location.href = '/dashboard';
                }}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                View My Events
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search & Filters Section */}
      <section className="sticky top-16 z-40 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-md py-4 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-base rounded-full"
              />
            </div>

            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden w-full"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Filter Chips - Desktop always visible, Mobile collapsible */}
          <div className={`${showFilters ? 'block' : 'hidden md:block'}`}>
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 mb-3">
              <Button
                variant={selectedCategory === 'All' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('All')}
                className="rounded-full"
              >
                All Events
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category as EventCategory)}
                  className="rounded-full"
                >
                  {category === 'Hackathon' && <Code className="w-4 h-4 mr-1" />}
                  {category === 'Webinar' && <Video className="w-4 h-4 mr-1" />}
                  {category === 'Workshop' && <Wrench className="w-4 h-4 mr-1" />}
                  {category === 'Conference' && <Users className="w-4 h-4 mr-1" />}
                  {category}
                </Button>
              ))}
            </div>

            {/* Dropdown Filters */}
            <div className="flex flex-wrap gap-3">
              <Select value={selectedStream} onValueChange={(value) => setSelectedStream(value as StudentStream)}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Stream" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Streams</SelectItem>
                  <SelectItem value="CSE">CSE</SelectItem>
                  <SelectItem value="AI/ML">AI/ML</SelectItem>
                  <SelectItem value="Web Development">Web Development</SelectItem>
                  <SelectItem value="Mechatronics">Mechatronics</SelectItem>
                  <SelectItem value="Data Science">Data Science</SelectItem>
                  <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateRange} onValueChange={(value) => setDateRange(value as any)}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Dates</SelectItem>
                  <SelectItem value="This Week">This Week</SelectItem>
                  <SelectItem value="This Month">This Month</SelectItem>
                  <SelectItem value="Upcoming">Upcoming Only</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as EventSortOption)}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="soonest">Soonest First</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="az">A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section id="events-grid" className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Loading events...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-20">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">No events found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Try adjusting your filters or search term
              </p>
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                  setSelectedStream('All');
                  setDateRange('All');
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {filteredEvents.length} {filteredEvents.length === 1 ? 'Event' : 'Events'} Found
                </h2>
                <TrendingUp className="w-6 h-6 text-gray-400" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <EventCard
                      event={event}
                      isSaved={isSaved(event.id)}
                      onViewDetails={setSelectedEvent}
                      onToggleSave={() => toggleSave({
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
                      })}
                      isSaving={isSaving(event.id)}
                    />
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Detailed Event Modal */}
      <DetailedEventCard
        event={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onSaveChange={() => {
          // Optionally refresh saved state
        }}
      />
    </div>
  );
}
