export type Stat = {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
};

export type SavedPerk = {
  id: string;
  title: string;
  category: string;
  icon: string;
  validity: string;
  description: string;
  website?: string;
  logo?: string;
  color?: string;
  discount?: string;
  claimLink?: string;
  isSaved: boolean;
  claimed?: boolean;
  savedId?: string;
};

export type SavedResource = {
  id: string;
  title: string;
  provider?: string;
  category: string;
  description: string;
  claimLink?: string;
  badge?: string;
  validity?: string;
  isSaved: boolean;
  savedId?: string;
};

export type SavedAITool = {
  id: string;
  name: string;
  description: string;
  logo: string;
  logo_url?: string;
  category: string[];
  pricing: string;
  features: string[];
  link: string;
  isOpenSource?: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  requiresVerification?: boolean;
  isSaved: boolean;
  savedId?: string;
};

export type Subscription = {
  id: string;
  title: string;
  category: string;
  icon: string;
  expiryDate: string;
  status: 'active' | 'expiring-soon' | 'expired';
};

export type Update = {
  id: string;
  type: 'expiring-soon' | 'new-perk' | 'renewal-reminder' | 'account-update';
  title: string;
  message: string;
  timestamp: string;
  icon: React.ComponentType<{ className?: string }>;
};

export type UserProfile = {
  name: string;
  stream: string;
  initials: string;
};
