import { motion } from 'motion/react';
import ProfileHeader from '../components/profile/ProfileHeader';
import AccountInfoCard from '../components/profile/AccountInfoCard';
import BenefitsGrid from '../components/profile/BenefitsGrid';
import ActivityCard from '../components/profile/ActivityCard';
import BenefitsStats from '../components/profile/BenefitsStats';
import NotificationsCard from '../components/profile/NotificationsCard';
import {
  UserProfile,
  ClaimedPerk,
  RecentActivity,
  Notification,
  BenefitsStats as BenefitsStatsType,
} from '../types/profile.types';

// Mock data - Replace with actual Appwrite data later
const mockUser: UserProfile = {
  id: '1',
  name: 'Sarah Johnson',
  email: 'sarah.johnson@university.edu',
  university: 'University of California, Berkeley',
  stream: 'Computer Science',
  verificationStatus: 'approved',
  accountStatus: 'active',
  createdAt: new Date('2024-08-15'),
  lastLogin: new Date(),
  validityPeriod: {
    start: new Date('2024-08-01'),
    end: new Date('2028-05-31'),
  },
  linkedAccounts: [
    {
      provider: 'google',
      email: 'sarah.johnson@gmail.com',
      connectedAt: new Date('2024-08-15'),
    },
    {
      provider: 'microsoft',
      email: 'sarah.johnson@outlook.com',
      connectedAt: new Date('2024-09-01'),
    },
  ],
};

const mockBenefits: ClaimedPerk[] = [
  {
    id: '1',
    perkId: 'notion',
    userId: '1',
    perkName: 'Notion',
    perkLogo: '/assets/logos/notion.png',
    category: 'Productivity',
    claimedAt: new Date('2024-09-01'),
    validity: '1 year',
    status: 'active',
  },
  {
    id: '2',
    perkId: 'canva',
    userId: '1',
    perkName: 'Canva',
    perkLogo: '/assets/logos/canva.png',
    category: 'Design',
    claimedAt: new Date('2024-09-05'),
    validity: '1 year',
    status: 'active',
  },
  {
    id: '3',
    perkId: 'jetbrains',
    userId: '1',
    perkName: 'JetBrains',
    perkLogo: '/assets/logos/jetbrains.png',
    category: 'Development',
    claimedAt: new Date('2024-09-10'),
    validity: '1 year',
    status: 'active',
  },
  {
    id: '4',
    perkId: 'figma',
    userId: '1',
    perkName: 'Figma',
    perkLogo: '/assets/logos/figma.png',
    category: 'Design',
    claimedAt: new Date('2024-09-15'),
    validity: '1 year',
    status: 'active',
  },
  {
    id: '5',
    perkId: 'coursera',
    userId: '1',
    perkName: 'Coursera',
    perkLogo: '/assets/logos/coursera.png',
    category: 'Education',
    claimedAt: new Date('2024-10-01'),
    validity: '6 months',
    status: 'pending',
  },
  {
    id: '6',
    perkId: 'slack',
    userId: '1',
    perkName: 'Slack',
    perkLogo: '/assets/logos/slack.png',
    category: 'Communication',
    claimedAt: new Date('2024-10-10'),
    validity: '1 year',
    status: 'active',
  },
];

const mockActivities: RecentActivity[] = [
  {
    id: '1',
    perkId: 'notion',
    perkName: 'Notion',
    perkLogo: '/assets/logos/notion.png',
    accessedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    action: 'accessed',
  },
  {
    id: '2',
    perkId: 'figma',
    perkName: 'Figma',
    perkLogo: '/assets/logos/figma.png',
    accessedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    action: 'accessed',
  },
  {
    id: '3',
    perkId: 'coursera',
    perkName: 'Coursera',
    perkLogo: '/assets/logos/coursera.png',
    accessedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    action: 'pending',
  },
  {
    id: '4',
    perkId: 'canva',
    perkName: 'Canva',
    perkLogo: '/assets/logos/canva.png',
    accessedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    action: 'accessed',
  },
];

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'success',
    title: 'New benefit available',
    description: 'Adobe Creative Suite has been added to your account',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: false,
  },
  {
    id: '2',
    type: 'warning',
    title: 'Verification pending',
    description: 'Your Coursera benefit is awaiting verification',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    read: false,
  },
  {
    id: '3',
    type: 'info',
    title: 'Account updated',
    description: 'Your profile information has been successfully updated',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    read: true,
  },
];

const mockStats: BenefitsStatsType = {
  activated: 12,
  total: 20,
  available: 8,
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Page Title - Mobile Only */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6 md:hidden"
        >
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Profile
          </h1>
        </motion.div>

        {/* Profile Header */}
        <ProfileHeader user={mockUser} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width on desktop */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Information Card */}
            <AccountInfoCard user={mockUser} />

            {/* Available Benefits Grid */}
            <BenefitsGrid benefits={mockBenefits} />
          </div>

          {/* Right Column - 1/3 width on desktop */}
          <div className="space-y-6">
            {/* Benefits Stats Card */}
            <BenefitsStats stats={mockStats} />

            {/* Activity & Usage Card */}
            <ActivityCard
              activities={mockActivities}
              lastLogin={mockUser.lastLogin}
            />

            {/* Notifications Card */}
            <NotificationsCard notifications={mockNotifications} />
          </div>
        </div>
      </div>
    </div>
  );
}
