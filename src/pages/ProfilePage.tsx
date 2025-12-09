import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ProfileHeader from '../components/profile/ProfileHeader';
import AccountInfoCard from '../components/profile/AccountInfoCard';
import BenefitsGrid from '../components/profile/BenefitsGrid';
import ActivityCard from '../components/profile/ActivityCard';
import BenefitsStats from '../components/profile/BenefitsStats';
import NotificationsCard from '../components/profile/NotificationsCard';
import EditProfileModal, { ProfileUpdateData } from '../components/profile/EditProfileModal';
import {
  UserProfile,
  ClaimedPerk,
  RecentActivity,
  Notification,
  BenefitsStats as BenefitsStatsType,
} from '../types/profile.types';
import {
  getOrCreateProfile,
  updateUserProfile,
  uploadAvatar,
} from '../services/profile.service';
import { account } from '../lib/appwrite';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getSavedPerks, getSavedResources, getSavedAITools } from '../services/saved-items.service';

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [error, setError] = useState<string>('');
  const [savedBenefits, setSavedBenefits] = useState<ClaimedPerk[]>([]);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<BenefitsStatsType>({ activated: 0, total: 0, available: 0 });

  // Load user profile on mount
  useEffect(() => {
    async function loadProfile() {
      if (!authUser) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const profile = await getOrCreateProfile(authUser);
        setUserProfile(profile);
        
        // Load saved items in parallel
        const [perks, resources, aiTools] = await Promise.all([
          getSavedPerks(authUser.$id),
          getSavedResources(authUser.$id),
          getSavedAITools(authUser.$id),
        ]);
        
        // Convert to ClaimedPerk format
        const benefits: ClaimedPerk[] = perks.map((perk: any) => ({
          id: perk.savedId,
          perkId: perk.id,
          userId: authUser.$id,
          perkName: perk.title,
          perkLogo: perk.logo || perk.icon,
          category: perk.category,
          claimedAt: perk.claimedDate ? new Date(perk.claimedDate) : new Date(),
          validity: perk.validity || 'N/A',
          status: perk.claimed ? 'active' : 'pending',
        }));
        
        setSavedBenefits(benefits);
        
        // Calculate stats
        const totalSaved = perks.length + resources.length + aiTools.length;
        const activatedCount = perks.filter((p: any) => p.claimed).length;
        setStats({
          activated: activatedCount,
          total: totalSaved,
          available: totalSaved - activatedCount,
        });
        
        // Generate recent activities from saved items
        const recentActivities: RecentActivity[] = [
          ...perks.slice(0, 3).map((perk: any, idx: number) => ({
            id: perk.savedId,
            perkId: perk.id,
            perkName: perk.title,
            perkLogo: perk.logo || perk.icon,
            accessedAt: new Date(Date.now() - (idx + 1) * 2 * 24 * 60 * 60 * 1000),
            action: perk.claimed ? 'accessed' : 'pending',
          })),
        ];
        setActivities(recentActivities);
        
        // Generate notifications
        const newNotifications: Notification[] = [];
        if (perks.some((p: any) => !p.claimed)) {
          newNotifications.push({
            id: '1',
            type: 'warning',
            title: 'Perks awaiting activation',
            description: 'You have saved perks that haven\'t been claimed yet',
            createdAt: new Date(),
            read: false,
          });
        }
        if (totalSaved > 0) {
          newNotifications.push({
            id: '2',
            type: 'success',
            title: 'Great progress!',
            description: `You have ${totalSaved} saved items in your dashboard`,
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
            read: false,
          });
        }
        setNotifications(newNotifications);
        
        setError('');
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Failed to load profile. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [authUser]);

  // Handle profile update
  const handleProfileUpdate = async (updates: ProfileUpdateData) => {
    if (!authUser || !userProfile) return;

    try {
      let avatarFileId: string | undefined = undefined;

      // Upload avatar if it's a file
      if (updates.avatar instanceof File) {
        toast.info('Uploading profile picture...');
        // Upload and get file ID (NOT full URL)
        avatarFileId = await uploadAvatar(updates.avatar, authUser.$id);
        console.log('Received file ID from upload:', avatarFileId);
      } else if (typeof updates.avatar === 'string' && updates.avatar) {
        // If avatar is already a string (existing file ID or URL), extract just the ID
        const urlMatch = updates.avatar.match(/files\/([^\/\?]+)/);
        avatarFileId = urlMatch ? urlMatch[1] : updates.avatar;
      }

      // Update profile in database with ONLY the file ID
      const updatedProfile = await updateUserProfile(authUser.$id, {
        name: updates.name,
        university: updates.university,
        stream: updates.stream,
        avatar: avatarFileId, // This will be just the file ID string
      });

      // Update user preferences (state, district)
      await account.updatePrefs({
        ...(authUser.prefs || {}),
        state: updates.state || '',
        district: updates.district || '',
        institution: updates.university || ''
      });

      setUserProfile(updatedProfile);
      setIsEditModalOpen(false);
      toast.success('Profile updated successfully!', {
        description: 'Your changes have been saved.',
      });
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error('Failed to update profile', {
        description: 'Please try again later.',
      });
      throw err; // Let the modal handle the error
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No profile state (shouldn't happen but just in case)
  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">No profile found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-8">
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
        <ProfileHeader user={userProfile} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width on desktop */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Information Card */}
            <AccountInfoCard
              user={userProfile}
              onEditClick={() => setIsEditModalOpen(true)}
            />

            {/* Available Benefits Grid */}
            <BenefitsGrid benefits={savedBenefits} />
          </div>

          {/* Right Column - 1/3 width on desktop */}
          <div className="space-y-6">
            {/* Benefits Stats Card */}
            <BenefitsStats stats={stats} />

            {/* Activity & Usage Card */}
            <ActivityCard
              activities={activities}
              lastLogin={userProfile.lastLogin}
            />

            {/* Notifications Card */}
            <NotificationsCard notifications={notifications} />
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={userProfile}
        onSave={handleProfileUpdate}
      />
    </div>
  );
}
