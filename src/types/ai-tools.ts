export interface AITool {
  id: string;
  name: string;
  description: string;
  logo: string;
  category: string[];
  pricing: 'Free' | 'Freemium' | 'Student Discount' | 'Paid';
  features: string[];
  link: string;
  isOpenSource: boolean;
  isPopular: boolean;
  isNew: boolean;
  requiresVerification: boolean;
}

export type SortOption = 'most-popular' | 'recently-added' | 'a-z' | 'best-student-discounts' | 'free-first';

export type SecondaryFilter = 'Free' | 'Freemium' | 'Student Discount' | 'Paid' | 'Open Source' | 'Most Popular' | 'Recently Added';
