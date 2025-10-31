export interface AITool {
  id: string;
  name: string;
  description: string;
  logo: string;
  logo_url?: string;
  logo_source?: string;
  category: string[];
  pricing: 'Free' | 'Freemium' | 'Student Discount' | 'Paid';
  features: string[];
  link: string;
  isOpenSource: boolean;
  isPopular: boolean;
  isNew: boolean;
  requiresVerification: boolean;
  savedId?: string; // Document ID in SAVED_AI_TOOLS collection for unsaving
}

export type SortOption = 'most-popular' | 'recently-added' | 'a-z' | 'best-student-discounts' | 'free-first';

export type SecondaryFilter = 'Free' | 'Freemium' | 'Student Discount' | 'Paid' | 'Open Source' | 'Most Popular' | 'Recently Added';
