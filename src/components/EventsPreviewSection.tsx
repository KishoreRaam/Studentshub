import React, { useState } from 'react';
import { Bookmark, BookmarkCheck, MapPin, Globe, Users, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const categoryColors: Record<string, { bg: string; text: string }> = {
    Hackathon: { bg: 'bg-[#DBEAFE]', text: 'text-[#1447E6]' },
    Workshop: { bg: 'bg-[#D0FAE5]', text: 'text-[#007A55]' },
    Sports: { bg: 'bg-[#FFE4E6]', text: 'text-[#C70036]' },
    Webinar: { bg: 'bg-[#CEFAFE]', text: 'text-[#007595]' },
};

const events = [
    {
        id: '1',
        title: 'National Hackathon 2026',
        description: '48-hour coding marathon with ₹5L prize pool and industry mentors.',
        date: 'Feb 28',
        category: 'Hackathon',
        location: 'Anna University, Chennai',
        isOnline: false,
        spotsLeft: 34,
        imageUrl: '/events/hackathon.jpg',
        isSaved: false,
    },
    {
        id: '2',
        title: 'AI/ML Workshop: Build Your First Model',
        description: 'Hands-on workshop covering neural networks, TensorFlow & real-world datasets.',
        date: 'Mar 3',
        category: 'Workshop',
        location: 'IIT Madras',
        isOnline: false,
        spotsLeft: 18,
        imageUrl: '/events/workshop.jpg',
        isSaved: true,
    },
    {
        id: '3',
        title: 'Inter-College Basketball Tournament',
        description: 'Annual inter-college tournament featuring 32 teams across south India.',
        date: 'Mar 8',
        category: 'Sports',
        location: 'SSN College, Chennai',
        isOnline: false,
        spotsLeft: 56,
        imageUrl: '/events/basketball.jpg',
        isSaved: false,
    },
    {
        id: '4',
        title: 'Startup Funding 101 Webinar',
        description: 'Learn from VCs and angel investors about pitching, term sheets & valuation.',
        date: 'Mar 12',
        category: 'Webinar',
        location: 'Online',
        isOnline: true,
        spotsLeft: 120,
        imageUrl: '/events/webinar.jpg',
        isSaved: false,
    },
];

export default function EventsPreviewSection() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const visibleCards = 3;
    const cardWidth = 360;
    const cardGap = 24;
    const maxIndex = events.length > visibleCards ? events.length - visibleCards : 0;

    const handlePrev = () => setCurrentIndex(prev => Math.max(0, prev - 1));
    const handleNext = () => setCurrentIndex(prev => Math.min(maxIndex, prev + 1));

    const trackTransform = `translateX(-${currentIndex * (cardWidth + cardGap)}px)`;

    // Pagination Dots logic (show spots equal to number of slides we can make + 1)
    const dotsCount = maxIndex + 1;

    return (
        <section
            className="w-full px-8 flex flex-col gap-[64px] bg-transparent pb-0 pt-0"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
            {/* Block 1: Header Row */}
            <div className="flex justify-between items-end w-full min-h-[140px]">
                <div className="max-w-[576px]">
                    <h2
                        className="font-bold text-[42px] leading-[50.4px] text-[#0A0A0A] m-0"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Discover Upcoming Events
                    </h2>
                    <div className="w-[256px] h-[3px] rounded-full bg-gradient-to-r from-[#1A56DB] via-[#F59E0B] to-[#1A56DB] mt-[12px]" />
                    <p className="font-normal text-[18px] leading-[29.25px] text-[#4A5565] max-w-[511px] mt-[19px] m-0">
                        Hackathons, workshops, competitions & campus experiences curated for students.
                    </p>
                </div>

                <div className="bg-white border-[0.8px] border-[#E5E7EB] rounded-[16px] shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_rgba(0,0,0,0.1)] px-[20px] py-[10px] h-[43px] flex items-center gap-[8px]">
                    <div className="w-[10px] h-[10px] bg-[#00BC7D] rounded-full" />
                    <span className="font-semibold text-[14px] text-[#101828]">120+</span>
                    <span className="font-normal text-[14px] text-[#6A7282]">Live Events</span>
                </div>
            </div>

            {/* Block 2: Carousel Area */}
            <div className="w-full flex flex-col items-center">
                <div className="w-full relative">
                    {/* Navigation Arrows */}
                    <button
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                        className={`absolute left-[-24px] top-[218px] transform -translate-y-1/2 w-[48px] h-[48px] bg-white border-[0.8px] border-[#E5E7EB] rounded-full shadow-[0px_10px_15px_rgba(0,0,0,0.1),0px_4px_6px_rgba(0,0,0,0.1)] flex items-center justify-center cursor-pointer z-10 transition-opacity duration-300 ${currentIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                    >
                        <ChevronLeft size={20} color="#374151" />
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={currentIndex >= maxIndex}
                        className={`absolute right-[-24px] top-[218px] transform -translate-y-1/2 w-[48px] h-[48px] bg-white border-[0.8px] border-[#E5E7EB] rounded-full shadow-[0px_10px_15px_rgba(0,0,0,0.1),0px_4px_6px_rgba(0,0,0,0.1)] flex items-center justify-center cursor-pointer z-10 transition-opacity duration-300 ${currentIndex >= maxIndex ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                    >
                        <ChevronRight size={20} color="#374151" />
                    </button>

                    <div className="w-full h-[436px] overflow-hidden relative">
                        {/* Cards Track */}
                        <div
                            className="flex gap-[24px] transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
                            style={{ transform: trackTransform }}
                        >
                            {events.map((event) => {
                                const colors = categoryColors[event.category] || { bg: 'bg-[#DBEAFE]', text: 'text-[#1447E6]' };
                                const isFewSpots = event.spotsLeft < 20;

                                return (
                                    <div key={event.id} className="min-w-[360px] w-[360px] flex-shrink-0 bg-white border-[0.8px] border-[#F3F4F6] rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col">
                                        {/* Image Section */}
                                        <div className="w-full h-[200px] overflow-hidden relative bg-gray-100 flex-shrink-0">
                                            <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent from-0% to-50%" />

                                            <div className="absolute top-[12px] left-[12px] bg-white/95 rounded-[14px] shadow-[0px_10px_15px_rgba(0,0,0,0.1),0px_4px_6px_rgba(0,0,0,0.1)] px-[12px] py-[8px] font-semibold text-[13px] text-[#101828]">
                                                {event.date}
                                            </div>

                                            <div className="absolute top-[12px] right-[12px] w-[36px] h-[36px] bg-white/90 rounded-full shadow-[0px_10px_15px_rgba(0,0,0,0.1),0px_4px_6px_rgba(0,0,0,0.1)] flex items-center justify-center cursor-pointer">
                                                {event.isSaved ? (
                                                    <BookmarkCheck size={16} fill="#1A56DB" stroke="#1A56DB" />
                                                ) : (
                                                    <Bookmark size={16} color="#101828" />
                                                )}
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="pt-[20px] px-[20px] pb-0 flex flex-col gap-[12px] flex-1">
                                            {/* Row 1: Category + Location */}
                                            <div className="flex items-center h-[21px]">
                                                <span className={`px-[10px] py-[2px] rounded-full font-semibold text-[11px] uppercase tracking-[0.275px] ${colors.bg} ${colors.text}`}>
                                                    {event.category}
                                                </span>

                                                <div className="flex items-center gap-[4px] ml-[8px]">
                                                    {event.isOnline ? (
                                                        <>
                                                            <Globe size={12} strokeWidth={2} color="#009966" />
                                                            <span className="font-normal text-[12px] text-[#009966]">Online</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <MapPin size={12} strokeWidth={2} color="#6A7282" />
                                                            <span className="font-normal text-[12px] text-[#6A7282] overflow-hidden whitespace-nowrap text-ellipsis max-w-[150px]">
                                                                {event.location}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Row 2: Title */}
                                            <h3 className="font-bold text-[17px] leading-[22.95px] text-[#101828] max-h-[46px] overflow-hidden m-0">
                                                {event.title}
                                            </h3>

                                            {/* Row 3: Description */}
                                            <p className="font-normal text-[13px] leading-[19.5px] text-[#6A7282] h-[19.5px] overflow-hidden whitespace-nowrap text-ellipsis m-0">
                                                {event.description}
                                            </p>

                                            {/* Row 4: Footer */}
                                            <div className="border-t-[0.8px] border-[#F3F4F6] pt-[12px] pb-[20px] flex justify-between items-center mt-auto">
                                                <div className="flex items-center gap-[6px]">
                                                    <Users size={14} color={isFewSpots ? "#EC003F" : "#6A7282"} />
                                                    <span className={`font-medium text-[12px] ${isFewSpots ? "text-[#EC003F]" : "text-[#6A7282]"}`}>
                                                        {event.spotsLeft} spots left
                                                    </span>
                                                </div>

                                                <button className="bg-[#1A56DB] rounded-[10px] h-[30px] px-[16px] py-[6px] flex items-center justify-center font-semibold text-[12px] text-white cursor-pointer hover:brightness-110 hover:opacity-90 transition-all border-none">
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Pagination Dots */}
                <div className="flex gap-[8px] justify-center mt-[32px]">
                    {Array.from({ length: dotsCount }).map((_, i) => (
                        <div
                            key={i}
                            className={`w-[10px] h-[10px] rounded-full transition-colors duration-300 ${i === currentIndex ? 'bg-[#1A56DB]' : 'bg-[#D1D5DC]'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Block 3: CTA Button */}
            <div className="flex justify-center w-full">
                <button className="bg-[#1A56DB] rounded-[16px] shadow-[0px_4px_16px_rgba(26,86,219,0.25)] h-[52px] px-[32px] py-[14px] inline-flex items-center justify-center gap-[8px] cursor-pointer hover:scale-[1.02] hover:brightness-110 transition-transform border-none w-auto">
                    <span className="font-semibold text-[16px] text-white">Explore All Events</span>
                    <ArrowRight size={20} color="white" />
                </button>
            </div>
        </section>
    );
}
