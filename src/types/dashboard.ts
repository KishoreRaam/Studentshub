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
  isSaved: boolean;
};

export type SavedResource = {
  id: string;
  title: string;
  category: string;
  icon: string;
  description: string;
  isPremium: boolean;
  isSaved: boolean;
  link?: string;
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
