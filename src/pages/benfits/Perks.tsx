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
  DiscountOfferINR?: string;
  DiscountOffer?: string;
  ClaimLink?: string;
  Validity?: string;
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

            const validityText = row.Validity?.trim();
            const verificationText = row.VerificationMethod?.trim();
            const descriptionText = row.Description?.trim() || 'Student offer.';
            const benefitsList = descriptionText.includes(',')
              ? descriptionText.split(',').map((part) => part.trim()).filter(Boolean)
              : undefined;

            return {
              id: String(index),
              title,
              description: descriptionText,
              category,
              image: getImagePath(title),
              isPopular: Math.random() < 0.3,
              discount: row.DiscountOfferINR?.trim() || row.DiscountOffer?.trim() || 'See Offer',
              claimLink: normalizeClaimLink(row.ClaimLink),
              validity: validityText || undefined,
              verification: verificationText || undefined,
              benefits: benefitsList,
              verificationSteps: verificationText ? [`Verify using ${verificationText}.`] : undefined,
              validityType: validityText && /\d{4}/.test(validityText) ? 'date' : validityText ? 'duration' : undefined,
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
