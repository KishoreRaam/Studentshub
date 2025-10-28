import { useEffect, useMemo, useState, useCallback } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, SyntheticEvent } from 'react';
import Papa from 'papaparse';
import { DetailedPerkCard } from '@/components/DetailedPerkCard';
import './Perks.css';

type CsvPerkRow = {
  Name?: string;
  title?: string;
  Category?: string;
  category?: string;
  Description?: string;
  description?: string;
  DiscountOfferINR?: string;
  DiscountOffer?: string;
  ClaimLink?: string;
  claimlink?: string;
  Validity?: string;
  validity?: string;
  VerificationMethod?: string;
};

export type Perk = {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  isPopular: boolean;
  discount: string;
  claimLink: string;
  validity?: string;
  verification?: string;
  benefits?: string[];
  verificationSteps?: string[];
  validityType?: 'date' | 'duration';
  requirements?: string[];
};

const LOGO_BASE_PATH = '/assets/Logos';

const LOGO_FILES: Record<string, string> = {
  'StudentGithub Pack': `${LOGO_BASE_PATH}/studentgithub-pack.png`,
  'GitHub Student Pack': `${LOGO_BASE_PATH}/student-github-pack.png`,
  'Amazon Prime Student': `${LOGO_BASE_PATH}/amazon-prime-student.jpg`,
  Figma: `${LOGO_BASE_PATH}/figma.png`,
  Todoist: `${LOGO_BASE_PATH}/todoist.jpg`,
  Evernote: `${LOGO_BASE_PATH}/evernote.jpg`,
  'Dell Student Store': `${LOGO_BASE_PATH}/dell.png`,
  'HP Student Store': `${LOGO_BASE_PATH}/hp-student-store.jpg`,
  'Disney+ Hotstar': `${LOGO_BASE_PATH}/disney-hotstar.webp`,
  "Domino’s Pizza": `${LOGO_BASE_PATH}/dominos.png`,
  "McDonald’s": `${LOGO_BASE_PATH}/mcdonalds.png`,
};

const FALLBACK_IMAGE = 'https://source.unsplash.com/400x300/?abstract';

const CSV_PATH = '/assets/Name-Category-Description-DiscountOfferINR-VerificationMethod-Validity-ClaimLink.csv';

// Enhanced perk data with requirements, benefits, and verification steps
const PERK_ENHANCEMENTS: Record<string, {
  requirements: string[];
  benefits: string[];
  verificationSteps: string[];
}> = {
  'StudentGithub Pack': {
    requirements: [
      'Valid student email address (.edu or institutional)',
      'Currently enrolled in a degree or diploma program',
      'GitHub account (free to create)',
      'Must be at least 13 years old'
    ],
    benefits: [
      'Free access to GitHub Pro features',
      'Unlimited private repositories',
      'Advanced code review tools',
      'GitHub Copilot access',
      'Free domains from Namecheap',
      'Cloud credits from DigitalOcean, Azure, AWS',
      '100+ developer tools and services'
    ],
    verificationSteps: [
      'Visit education.github.com/pack',
      'Sign in with your GitHub account',
      'Verify your academic status with student email',
      'Get instant access to all benefits',
      'Explore partner offers and activate services'
    ]
  },
  'Apple Music': {
    requirements: [
      'Currently enrolled at a college or university',
      'Valid student email or UNiDAYS verification',
      'Apple ID account',
      'Available in eligible countries'
    ],
    benefits: [
      'Ad-free music streaming',
      'Access to 100M+ songs',
      'Download music for offline listening',
      'Lossless and spatial audio',
      'Apple Music Sing with lyrics',
      'Personalized playlists and radio'
    ],
    verificationSteps: [
      'Open Apple Music app or visit website',
      'Select Student subscription option',
      'Verify student status via UNiDAYS',
      'Complete payment setup at student pricing',
      'Enjoy unlimited music streaming'
    ]
  },
  'Amazon Prime Student': {
    requirements: [
      'Valid .edu email address or student ID',
      'Currently enrolled in college or university',
      'Amazon account (free to create)',
      'Must be 18 years or older'
    ],
    benefits: [
      'Free and fast shipping on eligible items',
      'Prime Video streaming access',
      'Prime Music with millions of songs',
      'Prime Reading with free ebooks',
      'Exclusive deals and discounts',
      '50% off Prime subscription after trial'
    ],
    verificationSteps: [
      'Visit amazon.in/prime/student',
      'Sign in with your Amazon account',
      'Verify student status with email or ID',
      'Start 6-month free trial',
      'Enjoy all Prime benefits at student pricing'
    ]
  },
  'Disney+ Hotstar': {
    requirements: [
      'Currently enrolled student status',
      'Valid student email or SheerID verification',
      'Hotstar account',
      'Available in India'
    ],
    benefits: [
      'Access to Disney+ originals',
      'Live sports streaming (IPL, cricket)',
      'Bollywood and regional movies',
      'Star network TV shows',
      'Ad-free viewing on Premium',
      'Multiple device support'
    ],
    verificationSteps: [
      'Visit hotstar.com student offers page',
      'Create or sign in to Hotstar account',
      'Verify student status through SheerID',
      'Choose student subscription plan',
      'Start streaming your favorite content'
    ]
  },
  'Notion': {
    requirements: [
      'Valid student email address',
      'Currently enrolled in educational institution',
      'Notion account (free to create)'
    ],
    benefits: [
      'Free Notion Personal Pro plan',
      'Unlimited blocks and file uploads',
      'Version history access',
      'Collaborative workspace features',
      'Advanced permissions and sharing',
      'Priority customer support',
      'All integrations included'
    ],
    verificationSteps: [
      'Create free Notion account',
      'Visit notion.so/students',
      'Verify with your student email',
      'Get instant upgrade to Pro features',
      'Start organizing your studies and projects'
    ]
  },
  'Evernote': {
    requirements: [
      'Valid student email or verification',
      'Currently enrolled student',
      'Evernote account'
    ],
    benefits: [
      '50% off Evernote Premium',
      'Unlimited devices sync',
      'Offline access to notes',
      'Advanced search in PDFs and documents',
      'Email notes to Evernote',
      '10GB monthly upload limit'
    ],
    verificationSteps: [
      'Visit evernote.com/students',
      'Sign up or log in to Evernote',
      'Verify student status with email',
      'Apply student discount code',
      'Start taking better notes'
    ]
  },
  'Todoist': {
    requirements: [
      'Valid student email address',
      'Currently enrolled student status',
      'Todoist account'
    ],
    benefits: [
      'Free Todoist Pro for students',
      'Unlimited projects and tasks',
      'Labels and filters',
      'Reminders and due dates',
      'File uploads and comments',
      'Productivity tracking',
      'Theme customization'
    ],
    verificationSteps: [
      'Create Todoist account',
      'Visit todoist.com/education',
      'Verify with student email',
      'Get Pro features activated',
      'Start managing tasks efficiently'
    ]
  },
  'Figma': {
    requirements: [
      'Valid educational email address',
      'Enrolled in accredited institution',
      'Figma account (free to create)',
      'Verification of academic status'
    ],
    benefits: [
      'Unlimited Figma and FigJam files',
      'Unlimited version history',
      'Real-time collaboration features',
      'Advanced prototyping tools',
      'Design system libraries',
      'Developer handoff features',
      'Plugin ecosystem access'
    ],
    verificationSteps: [
      'Create free Figma account',
      'Apply for Figma for Education',
      'Verify academic email address',
      'Wait for approval (usually instant)',
      'Start designing with professional features'
    ]
  },
  'JetBrains Student Pack': {
    requirements: [
      'Valid student email or ISIC card',
      'Currently enrolled in degree program',
      'JetBrains account',
      'Annual renewal required'
    ],
    benefits: [
      'Free access to all JetBrains IDEs',
      'IntelliJ IDEA Ultimate',
      'PyCharm Professional',
      'WebStorm, PhpStorm, and more',
      'Code completion and refactoring',
      'Integrated debugging tools',
      'Version control integration'
    ],
    verificationSteps: [
      'Visit jetbrains.com/student',
      'Create JetBrains account',
      'Verify student status with email or ISIC',
      'Download your preferred IDE',
      'Activate with student license'
    ]
  },
  'Dell Student Store': {
    requirements: [
      'Valid student email or UNiDAYS verification',
      'Currently enrolled student',
      'Must be 18+ years old'
    ],
    benefits: [
      'Up to 20% off laptops and PCs',
      'Exclusive student discounts',
      'Special financing options',
      'Free shipping on select items',
      'Extended warranty options',
      'Access to latest technology'
    ],
    verificationSteps: [
      'Visit dell.com/students',
      'Verify student status via UNiDAYS',
      'Browse student-exclusive deals',
      'Add items to cart with discount',
      'Complete purchase with student pricing'
    ]
  },
  'HP Student Store': {
    requirements: [
      'Valid student email address',
      'Currently enrolled in educational institution',
      'Must be 18+ years old'
    ],
    benefits: [
      'Student discounts on laptops',
      'Exclusive HP Pavilion and Envy deals',
      'Printer and accessory discounts',
      'Extended warranty offers',
      'Free shipping options',
      'Latest HP technology access'
    ],
    verificationSteps: [
      'Visit HP Student Store website',
      'Verify student status with email',
      'Browse exclusive student offers',
      'Apply student discount at checkout',
      'Enjoy savings on HP products'
    ]
  },
  'Autodesk': {
    requirements: [
      'Valid student email or enrollment proof',
      'Currently enrolled in degree program',
      'Autodesk account',
      'Annual renewal available'
    ],
    benefits: [
      'Free access to AutoCAD',
      'Fusion 360 for 3D design',
      'Maya for animation',
      'Revit for architecture',
      '3ds Max for modeling',
      'All professional Autodesk tools',
      'Cloud collaboration features'
    ],
    verificationSteps: [
      'Visit autodesk.com/education',
      'Create Autodesk account',
      'Verify student status',
      'Download software of your choice',
      'Activate with education license'
    ]
  },
  'MATLAB': {
    requirements: [
      'Currently enrolled student',
      'Valid student email or verification',
      'MathWorks account'
    ],
    benefits: [
      'MATLAB and Simulink access',
      'Signal and image processing tools',
      'Machine learning capabilities',
      'Data analysis and visualization',
      'Algorithm development tools',
      'Technical support access'
    ],
    verificationSteps: [
      'Visit mathworks.com/academia',
      'Create MathWorks account',
      'Verify student eligibility',
      'Download MATLAB installer',
      'Activate with student license'
    ]
  },
  'Dropbox': {
    requirements: [
      'Valid .edu email address',
      'Currently enrolled student',
      'Dropbox account'
    ],
    benefits: [
      'Free Dropbox Plus upgrade',
      '2TB of cloud storage',
      'Advanced file sharing',
      'Remote device wipe',
      'Priority email support',
      'Smart Sync feature'
    ],
    verificationSteps: [
      'Create Dropbox account',
      'Visit dropbox.com/edu',
      'Verify with student email',
      'Get storage upgrade',
      'Start backing up your files'
    ]
  },
  '1Password': {
    requirements: [
      'Valid student email address',
      'Currently enrolled student',
      '1Password account'
    ],
    benefits: [
      'Free 1Password for 1 year',
      'Unlimited password storage',
      'Secure password generator',
      'Multi-device sync',
      'Watchtower security alerts',
      'Travel Mode for security'
    ],
    verificationSteps: [
      'Visit 1password.com/students',
      'Sign up with student email',
      'Verify student status',
      'Download 1Password apps',
      'Start securing your passwords'
    ]
  },
  'LastPass': {
    requirements: [
      'Valid student email address',
      'Currently enrolled student',
      'LastPass account'
    ],
    benefits: [
      'Free LastPass Premium for 1 year',
      'Unlimited password storage',
      'Multi-device sync',
      'Dark web monitoring',
      'Secure password sharing',
      'Priority customer support'
    ],
    verificationSteps: [
      'Visit lastpass.com/education',
      'Create or sign in to LastPass account',
      'Verify student status with email',
      'Get premium features activated',
      'Secure your digital life'
    ]
  },
  'Hulu': {
    requirements: [
      'Currently enrolled at a U.S. college or university',
      'Valid .edu email or SheerID verification',
      'Hulu account',
      'Must be 18+ years old'
    ],
    benefits: [
      'Discounted Hulu streaming subscription',
      'Access to full Hulu library',
      'Current season TV episodes',
      'Hulu Originals content',
      'Personalized recommendations',
      'Multiple device support'
    ],
    verificationSteps: [
      'Visit hulu.com/student',
      'Sign up or sign in to Hulu',
      'Verify student status via SheerID',
      'Get student discount applied',
      'Start streaming your favorite shows'
    ]
  },
  'Google Workspace for Education': {
    requirements: [
      'Valid school email address',
      'Currently enrolled in educational institution',
      'School must be eligible for Google Education'
    ],
    benefits: [
      'Gmail with custom school domain',
      'Unlimited Google Drive storage',
      'Google Docs, Sheets, Slides',
      'Google Meet for video calls',
      'Google Classroom integration',
      'Collaboration tools',
      'Enhanced security features'
    ],
    verificationSteps: [
      'Contact your school IT administrator',
      'Receive school email credentials',
      'Sign in to Google Workspace',
      'Access all Google apps',
      'Start collaborating with classmates'
    ]
  },
  'Coursera': {
    requirements: [
      'Valid student email address',
      'Currently enrolled student',
      'Coursera account'
    ],
    benefits: [
      'Access to thousands of courses',
      'Certificates from top universities',
      'Hands-on projects',
      'Flexible learning schedule',
      'Career-focused content',
      'Mobile app access'
    ],
    verificationSteps: [
      'Visit coursera.org',
      'Create account with student email',
      'Browse available courses',
      'Enroll in courses of interest',
      'Learn from world-class instructors'
    ]
  },
  'Udemy': {
    requirements: [
      'Valid student email address',
      'Udemy account'
    ],
    benefits: [
      'Access to thousands of courses',
      'Lifetime course access',
      'Video lectures and resources',
      'Certificates of completion',
      'Mobile and TV access',
      'Frequent student discounts'
    ],
    verificationSteps: [
      'Visit udemy.com',
      'Create account with student email',
      'Look for student discount codes',
      'Purchase courses at reduced rates',
      'Learn at your own pace'
    ]
  },
  'LinkedIn Learning': {
    requirements: [
      'Valid student email address',
      'LinkedIn account',
      'Currently enrolled student'
    ],
    benefits: [
      'Access to expert-led courses',
      'Business and tech skills training',
      'Professional development content',
      'Certificates to LinkedIn profile',
      'Personalized recommendations',
      'Mobile app access'
    ],
    verificationSteps: [
      'Visit linkedin.com/learning',
      'Sign in with LinkedIn account',
      'Apply for student access',
      'Verify student status',
      'Start learning professional skills'
    ]
  },
  'Apple Education Store': {
    requirements: [
      'Currently enrolled student or accepted student',
      'Valid student ID or UNiDAYS verification',
      'Must be 18+ years old'
    ],
    benefits: [
      'Student discount on Macs and iPads',
      'Free AirPods with Mac purchase',
      'AppleCare+ student pricing',
      'Free engraving on devices',
      'Education bundle offers',
      '20% off AppleCare+'
    ],
    verificationSteps: [
      'Visit apple.com/education-store',
      'Browse student offers',
      'Verify student status',
      'Add products to cart with discount',
      'Complete purchase with savings'
    ]
  },
  'Lenovo Student Store': {
    requirements: [
      'Valid student email or ID.me verification',
      'Currently enrolled student',
      'Must be 18+ years old'
    ],
    benefits: [
      'Up to 20% off laptops and tablets',
      'Exclusive student deals',
      'Free shipping offers',
      'Extended warranty options',
      'Financing available',
      'Latest ThinkPad and Yoga models'
    ],
    verificationSteps: [
      'Visit lenovo.com/education-store',
      'Verify student status via ID.me',
      'Browse student-exclusive offers',
      'Apply discount at checkout',
      'Get your new Lenovo device'
    ]
  },
  'Samsung Student Offers': {
    requirements: [
      'Valid student email or UNiDAYS verification',
      'Currently enrolled student',
      'Samsung account'
    ],
    benefits: [
      'Student discounts on Galaxy devices',
      'Laptop and tablet deals',
      'Accessories discounts',
      'Trade-in bonus offers',
      'Free shipping',
      'Extended payment options'
    ],
    verificationSteps: [
      'Visit samsung.com/education',
      'Create or sign in to Samsung account',
      'Verify student status via UNiDAYS',
      'Browse student offers',
      'Purchase with student discount'
    ]
  },
  'SolidWorks': {
    requirements: [
      'Valid student email address',
      'Enrolled in engineering program',
      'SolidWorks account',
      'Annual renewal required'
    ],
    benefits: [
      'Free SolidWorks software',
      '3D CAD design tools',
      'Simulation capabilities',
      'Technical drawing features',
      'Cloud collaboration',
      'Learning resources included'
    ],
    verificationSteps: [
      'Visit solidworks.com/education',
      'Create SolidWorks account',
      'Verify student status',
      'Download SolidWorks installer',
      'Activate with education license'
    ]
  },
  'RoboForm': {
    requirements: [
      'Valid student email address',
      'Currently enrolled student',
      'RoboForm account'
    ],
    benefits: [
      'Free RoboForm Premium',
      'Unlimited password storage',
      'Cross-platform sync',
      'Secure form filling',
      'Password generator',
      'Emergency access feature'
    ],
    verificationSteps: [
      'Visit roboform.com/students',
      'Create RoboForm account',
      'Verify student status with email',
      'Download RoboForm apps',
      'Secure your passwords'
    ]
  },
  'Alibaba Cloud Academy': {
    requirements: [
      'Valid student email address',
      'Currently enrolled student',
      'Alibaba Cloud account'
    ],
    benefits: [
      'Free cloud computing courses',
      'Professional certifications',
      'Cloud credits for projects',
      'Hands-on labs access',
      'Industry-recognized credentials',
      'Career resources'
    ],
    verificationSteps: [
      'Visit alibabacloud.com/students',
      'Create Alibaba Cloud account',
      'Verify student status',
      'Access free courses and credits',
      'Build your cloud skills'
    ]
  }
};

// Default requirements for perks without specific data
const DEFAULT_REQUIREMENTS = [
  'Valid student email address or student ID',
  'Currently enrolled in an accredited educational institution',
  'Verification through student status platform (UNiDAYS, SheerID, or email)'
];

const normalizeClaimLink = (link?: string) => {
  if (!link) {
    return '';
  }

  const trimmedLink = link.trim();
  if (!trimmedLink) {
    return '';
  }

  return /^https?:\/\//i.test(trimmedLink) ? trimmedLink : `https://${trimmedLink}`;
};

const getImagePath = (name?: string) => {
  if (!name) return '';
  const trimmedName = name.trim();
  const mappedLogo = LOGO_FILES[trimmedName];
  if (mappedLogo) {
    return mappedLogo;
  }

  const slug = trimmedName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return `${LOGO_BASE_PATH}/${slug}.png`;
};

const handleImageError = (event: SyntheticEvent<HTMLImageElement>) => {
  const target = event.currentTarget;
  target.onerror = null;
  target.src = FALLBACK_IMAGE;
};

type PerkCardProps = {
  perk: Perk;
  onSelect: (perk: Perk) => void;
};

const PerkCard = ({ perk, onSelect }: PerkCardProps) => {
  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect(perk);
    }
  };

  return (
    <article
      className="perk-card"
      role="button"
      tabIndex={0}
      onClick={() => onSelect(perk)}
      onKeyDown={onKeyDown}
    >
      <div className="perk-card__media">
        <img src={perk.image} alt={perk.title} loading="lazy" onError={handleImageError} />
        {perk.isPopular ? <span className="perk-card__popular">Most Popular</span> : null}
      </div>
      <div className="perk-card__body">
        <div className="perk-card__tags">
          <span className="perk-card__category">{perk.category}</span>
          {perk.discount ? <span className="perk-card__discount">{perk.discount}</span> : null}
        </div>
        <h3 className="perk-card__title">{perk.title}</h3>
        <p className="perk-card__description">{perk.description}</p>
        <span className="perk-card__link">See details</span>
      </div>
    </article>
  );
};

export default function Perks() {
  const [allPerks, setAllPerks] = useState<Perk[]>([]);
  const [filteredPerks, setFilteredPerks] = useState<Perk[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'popular' | 'az'>('popular');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPerk, setSelectedPerk] = useState<Perk | null>(null);

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);

    Papa.parse<CsvPerkRow>(CSV_PATH, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (isCancelled) {
          return;
        }

        const perksData = results.data
          .map<Perk | null>((row, index) => {
            const title = row.Name?.trim() || row.title?.trim();
            if (!title) {
              return null;
            }

            const category = row.Category?.trim() || row.category?.trim() || 'General';

            const validityText = row.Validity?.trim() || row.validity?.trim();
            const verificationText = row.VerificationMethod?.trim();
            const descriptionText = row.Description?.trim() || row.description?.trim() || 'Student offer.';

            // Get enhanced data for this perk if available
            const enhancement = PERK_ENHANCEMENTS[title];

            // Use enhanced benefits if available, otherwise parse from description
            const benefitsList = enhancement?.benefits || (
              descriptionText.includes(',')
                ? descriptionText.split(',').map((part) => part.trim()).filter(Boolean)
                : undefined
            );

            // Use enhanced verification steps if available
            const verificationStepsList = enhancement?.verificationSteps || (
              verificationText ? [`Verify using ${verificationText}.`] : undefined
            );

            // Extract claim link - check both lowercase and camelCase
            const claimLinkRaw = (row as any).claimlink || (row as any).ClaimLink || (row as any).claim_link;

            return {
              id: String(index),
              title,
              description: descriptionText,
              category,
              image: getImagePath(title),
              isPopular: Math.random() < 0.3,
              discount: row.DiscountOfferINR?.trim() || row.DiscountOffer?.trim() || 'See Offer',
              claimLink: normalizeClaimLink(claimLinkRaw),
              validity: validityText || undefined,
              verification: verificationText || undefined,
              benefits: benefitsList,
              verificationSteps: verificationStepsList,
              validityType: validityText && /\d{4}/.test(validityText) ? 'date' : validityText ? 'duration' : undefined,
              requirements: enhancement?.requirements || DEFAULT_REQUIREMENTS,
            };
          })
          .filter((perk): perk is Perk => Boolean(perk));

        setAllPerks(perksData);
        setIsLoading(false);
      },
      error: (error) => {
        console.error('Failed to load perks data.', error);
        if (!isCancelled) {
          setIsLoading(false);
        }
      },
    });

    return () => {
      isCancelled = true;
    };
  }, []);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(allPerks.map((perk) => perk.category)))],
    [allPerks],
  );

  useEffect(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    let results = allPerks.slice();
    if (normalizedSearch) {
      results = results.filter((perk) => {
        const titleMatch = perk.title.toLowerCase().includes(normalizedSearch);
        const descriptionMatch = perk.description.toLowerCase().includes(normalizedSearch);
        return titleMatch || descriptionMatch;
      });
    }

    if (selectedCategory !== 'All') {
      results = results.filter((perk) => perk.category === selectedCategory);
    }

    if (sortOrder === 'popular') {
      results.sort((a, b) => Number(b.isPopular) - Number(a.isPopular));
    } else {
      results.sort((a, b) => a.title.localeCompare(b.title));
    }

    setFilteredPerks(results);
  }, [allPerks, searchTerm, selectedCategory, sortOrder]);

  const handleCategoryClick = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  const handleResetSelection = useCallback(() => {
    setSelectedPerk(null);
  }, []);

  return (
    <div className="benefits-page">
      <header className="benefits-header">
        <div className="benefits-container">
          <h1>Explore All Student Benefits</h1>
          <p>Search, filter, and discover exclusive offers on software, services, and more.</p>
        </div>
      </header>

      <div className="benefits-container">
        <div className="controls-bar">
          <div className="search-wrapper">
            <input
              type="text"
              id="perk-search"
              placeholder="Search perks (e.g., GitHub, Canva)..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <span className="search-icon" aria-hidden="true">
              🔍
            </span>
          </div>
          <div className="filter-wrapper">
            <label htmlFor="perk-sort">Sort By:</label>
            <select
              id="perk-sort"
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value as 'popular' | 'az')}
            >
              <option value="popular">Popularity</option>
              <option value="az">A-Z</option>
            </select>
          </div>
        </div>

        <div className="category-filters">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="loading-indicator">Loading Perks...</div>
        ) : (
          <div className="benefits-grid">
            {filteredPerks.length > 0 ? (
              filteredPerks.map((perk) => <PerkCard key={perk.id} perk={perk} onSelect={setSelectedPerk} />)
            ) : (
              <div className="no-results">
                <h3>No perks found</h3>
                <p>Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <DetailedPerkCard perk={selectedPerk} isOpen={Boolean(selectedPerk)} onClose={handleResetSelection} />
    </div>
  );
}
