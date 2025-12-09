import { useState, useEffect } from "react";
import { CheckCircle, Clock, DollarSign, Star, BookOpen, AlertTriangle, Plus, Bell, Loader2, Sparkles } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import PerkCard from "@/components/dashboard/PerkCard";
import ResourceCard from "@/components/dashboard/ResourceCard";
import AIToolCard from "@/components/dashboard/AIToolCard";
import SubscriptionCard from "@/components/dashboard/SubscriptionCard";
import RecentUpdates from "@/components/dashboard/RecentUpdates";
import { DetailedPerkCard } from "@/components/DetailedPerkCard";
import type { Stat, SavedPerk, SavedResource, SavedAITool, Subscription, Update, UserProfile } from "@/types/dashboard";
import type { Perk } from "@/pages/benfits/Perks";
import { useAuth } from "@/contexts/AuthContext";
import { getOrCreateProfile } from "@/services/profile.service";
import { getSavedPerks, getSavedResources, getSavedAITools, unsavePerk, unsaveResource, unsaveAITool } from "@/services/saved-items.service";
import { getStreamLabel } from "@/utils/streamUtils";

// Helper function to get user initials
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}



export default function Dashboard() {
  const { user: authUser } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedPerks, setSavedPerks] = useState<SavedPerk[]>([]);
  const [savedResources, setSavedResources] = useState<SavedResource[]>([]);
  const [savedAITools, setSavedAITools] = useState<SavedAITool[]>([]);
  const [selectedPerk, setSelectedPerk] = useState<Perk | null>(null);
  const [statsData, setStatsData] = useState<Stat[]>([]);
  const [subscriptionsData, setSubscriptionsData] = useState<Subscription[]>([]);
  const [updatesData, setUpdatesData] = useState<Update[]>([]);

  // Load user profile on mount
  useEffect(() => {
    async function loadUserProfile() {
      if (!authUser) {
        setLoading(false);
        return;
      }

      try {
        const profile = await getOrCreateProfile(authUser);
        setUserProfile({
          name: profile.name,
          stream: getStreamLabel(profile.stream) || 'Not specified',
          initials: getInitials(profile.name),
        });
      } catch (error) {
        console.error('Error loading user profile:', error);
        // Fallback to basic info from auth user
        setUserProfile({
          name: authUser.name || authUser.email.split('@')[0],
          stream: 'Not specified',
          initials: getInitials(authUser.name || authUser.email),
        });
      } finally {
        setLoading(false);
      }
    }

    loadUserProfile();
  }, [authUser]);

  // Load saved items
  useEffect(() => {
    async function loadSavedItems() {
      if (!authUser) return;

      try {
        const userId = authUser.$id;

        // Fetch all saved items in parallel
        const [perks, resources, aiTools] = await Promise.all([
          getSavedPerks(userId),
          getSavedResources(userId),
          getSavedAITools(userId),
        ]);

        setSavedPerks(perks as any[]);
        setSavedResources(resources as any[]);
        setSavedAITools(aiTools as any[]);
        
        // Calculate live stats
        const totalSaved = perks.length + resources.length + aiTools.length;
        const claimedPerks = perks.filter((p: any) => p.claimed).length;
        
        const calculatedStats: Stat[] = [
          {
            title: "Total Saved Items",
            value: totalSaved,
            subtitle: "Perks, Resources & AI Tools",
            icon: CheckCircle,
          },
          {
            title: "Saved Perks",
            value: perks.length,
            subtitle: `${claimedPerks} claimed`,
            icon: Star,
          },
          {
            title: "Resources & Tools",
            value: resources.length + aiTools.length,
            subtitle: "Available for access",
            icon: BookOpen,
          },
        ];
        setStatsData(calculatedStats);
        
        // Generate subscriptions from claimed perks
        const subs: Subscription[] = perks
          .filter((p: any) => p.claimed)
          .slice(0, 5)
          .map((p: any) => ({
            id: p.id,
            title: p.title,
            category: p.category,
            icon: p.icon || '💎',
            expiryDate: p.validity || 'N/A',
            status: 'active' as const,
          }));
        setSubscriptionsData(subs);
        
        // Generate updates
        const updates: Update[] = [];
        if (perks.some((p: any) => !p.claimed)) {
          updates.push({
            id: "1",
            type: "new-perk",
            title: "Perks Available",
            message: "You have saved perks ready to be claimed. Check them out!",
            timestamp: "Recent",
            icon: Plus,
          });
        }
        if (totalSaved > 0) {
          updates.push({
            id: "2",
            type: "account-update",
            title: "Dashboard Updated",
            message: `You have ${totalSaved} saved items in your collection.`,
            timestamp: "Today",
            icon: Bell,
          });
        }
        if (resources.length > 0) {
          updates.push({
            id: "3",
            type: "new-perk",
            title: "Resources Available",
            message: `Access ${resources.length} learning resources anytime.`,
            timestamp: "Today",
            icon: BookOpen,
          });
        }
        setUpdatesData(updates);
      } catch (error) {
        console.error('Error loading saved items:', error);
      }
    }

    if (authUser && !loading) {
      loadSavedItems();
    }
  }, [authUser, loading]);

  // Convert SavedPerk to Perk type for the detailed modal
  const convertToPerk = (savedPerk: SavedPerk): Perk => {
    return {
      id: savedPerk.id,
      title: savedPerk.title,
      description: savedPerk.description,
      category: savedPerk.category,
      image: (savedPerk as any).logo || savedPerk.icon || '',
      isPopular: false,
      discount: (savedPerk as any).discount || '',
      claimLink: (savedPerk as any).claimLink || '',
      validity: savedPerk.validity,
      website: (savedPerk as any).website || '',
      logo: (savedPerk as any).logo || '',
      color: (savedPerk as any).color || '#3B82F6',
    };
  };

  // Handler functions
  const handleViewPerkDetails = (perk: SavedPerk) => {
    setSelectedPerk(convertToPerk(perk));
  };

  const handleToggleSavePerk = async (perkId: string) => {
    try {
      const perk = savedPerks.find(p => p.id === perkId);
      if (!perk || !(perk as any).savedId) return;

      // Unsave the perk
      await unsavePerk((perk as any).savedId);

      // Remove from state
      setSavedPerks(prev => prev.filter(p => p.id !== perkId));

      // Close modal if this perk was open
      if (selectedPerk && selectedPerk.id === perkId) {
        setSelectedPerk(null);
      }
    } catch (error) {
      console.error("Error toggling save perk:", error);
    }
  };

  // Refresh saved perks when modal saves/unsaves
  const handlePerkModalChange = async () => {
    if (!authUser) return;

    try {
      const userId = authUser.$id;
      const perks = await getSavedPerks(userId);
      setSavedPerks(perks as any[]);

      // Close modal if current perk was unsaved
      if (selectedPerk) {
        const stillSaved = perks.some(p => p.id === selectedPerk.id);
        if (!stillSaved) {
          setSelectedPerk(null);
        }
      }
    } catch (error) {
      console.error('Error refreshing saved perks:', error);
    }
  };

  const handleAccessResource = (resource: SavedResource) => {
    console.log("Access resource:", resource);
    if (resource.link) {
      window.open(resource.link, "_blank", "noopener,noreferrer");
    }
  };

  const handleToggleSaveResource = async (resourceId: string) => {
    try {
      const resource = savedResources.find(r => r.id === resourceId);
      if (!resource || !(resource as any).savedId) return;

      // Unsave the resource
      await unsaveResource((resource as any).savedId);

      // Remove from state
      setSavedResources(prev => prev.filter(r => r.id !== resourceId));
    } catch (error) {
      console.error("Error toggling save resource:", error);
    }
  };

  const handleAccessAITool = (aiTool: SavedAITool) => {
    console.log("Access AI tool:", aiTool);
    if (aiTool.link) {
      window.open(aiTool.link, "_blank", "noopener,noreferrer");
    }
  };

  const handleToggleSaveAITool = async (aiToolId: string) => {
    try {
      const aiTool = savedAITools.find(t => t.id === aiToolId);
      if (!aiTool || !(aiTool as any).savedId) return;

      // Unsave the AI tool
      await unsaveAITool((aiTool as any).savedId);

      // Remove from state
      setSavedAITools(prev => prev.filter(t => t.id !== aiToolId));
    } catch (error) {
      console.error("Error toggling save AI tool:", error);
    }
  };

  const handleRenewSubscription = (subscriptionId: string) => {
    console.log("Renew subscription:", subscriptionId);
  };

  const handleViewSubscriptionDetails = (subscription: Subscription) => {
    console.log("View subscription details:", subscription);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center pt-16">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 pt-16">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              My Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              View and manage your student perks subscriptions.
            </p>
          </div>

          {/* User Profile */}
          {userProfile && (
            <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 dark:from-cyan-600 dark:to-blue-700 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                {userProfile.initials}
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {userProfile.name}
                </p>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {userProfile.stream}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <StatsCard key={index} stat={stat} />
          ))}
        </div>

        {/* Three Column Layout for Saved Items */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Saved Perks Column */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Saved Perks
              </h2>
            </div>

            <div className="flex-1 space-y-4">
              {savedPerks.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-8 text-center">
                  <Star className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                    No Saved Perks
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Save perks to see them here
                  </p>
                </div>
              ) : (
                savedPerks.map((perk) => (
                  <PerkCard
                    key={perk.id}
                    perk={perk}
                    onViewDetails={handleViewPerkDetails}
                    onToggleSave={handleToggleSavePerk}
                  />
                ))
              )}
            </div>
          </div>

          {/* Saved Resources Column */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Saved Resources
              </h2>
            </div>

            <div className="flex-1 space-y-4">
              {savedResources.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-8 text-center">
                  <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                    No Saved Resources
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Save resources to see them here
                  </p>
                </div>
              ) : (
                savedResources.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    onAccessResource={handleAccessResource}
                    onToggleSave={handleToggleSaveResource}
                  />
                ))
              )}
            </div>
          </div>

          {/* Saved AI Tools Column */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Saved AI Tools
              </h2>
            </div>

            <div className="flex-1 space-y-4">
              {savedAITools.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-8 text-center">
                  <Sparkles className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                    No Saved AI Tools
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Save AI tools to see them here
                  </p>
                </div>
              ) : (
                savedAITools.map((aiTool) => (
                  <AIToolCard
                    key={aiTool.id}
                    aiTool={aiTool}
                    onAccessTool={handleAccessAITool}
                    onToggleSave={handleToggleSaveAITool}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Active Subscriptions and Recent Updates */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Subscriptions (2/3 width) */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Active Subscriptions
            </h2>
            <div className="space-y-4">
              {subscriptionsData.map((subscription) => (
                <SubscriptionCard
                  key={subscription.id}
                  subscription={subscription}
                  onRenew={handleRenewSubscription}
                  onViewDetails={handleViewSubscriptionDetails}
                />
              ))}
            </div>
          </div>

          {/* Recent Updates (1/3 width) */}
          <div className="lg:col-span-1">
            <RecentUpdates updates={updatesData} />
          </div>
        </div>
      </div>

      {/* Detailed Perk Modal */}
      <DetailedPerkCard
        perk={selectedPerk}
        isOpen={selectedPerk !== null}
        onClose={() => setSelectedPerk(null)}
        onSaveChange={handlePerkModalChange}
      />
    </div>
  );
}
