// Profile-related TypeScript interfaces and types

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  state?: string;
  district?: string;
  university: string;
  stream: string;
  avatar?: string;
  verificationStatus: 'pending' | 'approved' | 'denied';
  accountStatus: 'active' | 'inactive' | 'suspended';
  createdAt: Date;
  lastLogin: Date;
  validityPeriod: {
    start: Date;
    end: Date;
  };
  linkedAccounts: LinkedAccount[];
  onboardingComplete?: boolean;
}

export interface LinkedAccount {
  provider: 'google' | 'microsoft' | 'github';
  email: string;
  connectedAt: Date;
}

export interface ClaimedPerk {
  id: string;
  perkId: string;
  userId: string;
  perkName: string;
  perkLogo: string;
  category: string;
  claimedAt: Date;
  validity: string;
  status: 'active' | 'pending' | 'expired';
}

export interface Perk {
  id: string;
  title: string;
  description: string;
  category: string;
  logo: string;
  status: 'active' | 'pending' | 'expired';
}

export interface RecentActivity {
  id: string;
  perkId: string;
  perkName: string;
  perkLogo: string;
  accessedAt: Date;
  action: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  description: string;
  createdAt: Date;
  read: boolean;
}

export interface BenefitsStats {
  activated: number;
  total: number;
  available: number;
}
