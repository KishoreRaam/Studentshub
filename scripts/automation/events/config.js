'use strict';

const SOURCES = {
  devfolio:   'https://devfolio.co/hackathons',
  unstopHack: 'https://unstop.com/hackathons?activeTab=open',
  unstopComp: 'https://unstop.com/competitions?activeTab=open',
  mlh:        'https://mlh.io/seasons/2025/events',
  eventbriteHack: 'https://www.eventbrite.com/d/india/student-hackathon/?page=1',
  eventbriteWorkshop: 'https://www.eventbrite.com/d/india/coding-workshop/?page=1',
};

const FALLBACK_IMAGES = {
  Hackathon:   'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop',
  Workshop:    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=400&fit=crop',
  Competition: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=400&fit=crop',
  Webinar:     'https://images.unsplash.com/photo-1587825140708-dfaf18c4f4d4?w=800&h=400&fit=crop',
  Conference:  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
  default:     'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&h=400&fit=crop',
};

const VALID_CATEGORIES = [
  'Hackathon','Workshop','Webinar','Competition','Conference',
  'Technical','Seminar','Cultural','Sports','Symposium'
];

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';
const SCRAPER_TIMEOUT_MS    = 20000;
const REQUEST_DELAY_MS      = 2000;
const MAX_DESCRIPTION_LENGTH = 4500;

module.exports = {
  SOURCES,
  FALLBACK_IMAGES,
  VALID_CATEGORIES,
  USER_AGENT,
  SCRAPER_TIMEOUT_MS,
  REQUEST_DELAY_MS,
  MAX_DESCRIPTION_LENGTH,
};
