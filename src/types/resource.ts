export interface Resource {
  id: string;
  provider: string;
  title: string;
  category: string;
  description: string;
  discountOfferINR: string;
  validity: string;
  verificationMethod: string;
  claimLink: string;
  badge: string;
  savedId?: string; // Document ID in SAVED_RESOURCES collection for unsaving
}

export type ResourceCategory =
  | 'All'
  | 'Development'
  | 'Design'
  | 'Business'
  | 'AI & ML'
  | 'Cloud'
  | 'Productivity'
  | 'Data Science'
  | 'Marketing';

export type SortOption = 'popularity' | 'newest' | 'name';
