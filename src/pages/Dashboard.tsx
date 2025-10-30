import { useState, useEffect } from "react";
import { CheckCircle, Clock, DollarSign, Star, BookOpen, AlertTriangle, Plus, Bell, Loader2, Sparkles } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import PerkCard from "@/components/dashboard/PerkCard";
import ResourceCard from "@/components/dashboard/ResourceCard";
import AIToolCard from "@/components/dashboard/AIToolCard";
import SubscriptionCard from "@/components/dashboard/SubscriptionCard";
import RecentUpdates from "@/components/dashboard/RecentUpdates";
import type { Stat, SavedPerk, SavedResource, SavedAITool, Subscription, Update, UserProfile } from "@/types/dashboard";
import { useAuth } from "@/contexts/AuthContext";
import { getOrCreateProfile } from "@/services/profile.service";
import { getSavedPerks, getSavedResources, getSavedAITools, unsavePerk, unsaveResource, unsaveAITool } from "@/services/saved-items.service";

// Helper function to get user initials
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const statsData: Stat[] = [
  {
    title: "Active Subscriptions",
    value: 5,
    subtitle: "Currently active perks",
    icon: CheckCircle,
  },
  {
    title: "Expiring Soon",
    value: 2,
    subtitle: "Require attention",
    icon: Clock,
  },
  {
    title: "Total Savings",
    value: "₹26,000",
    subtitle: "This academic year",
    icon: DollarSign,
  },
];

const subscriptionsData: Subscription[] = [
  {
    id: "1",
    title: "Spotify Premium",
    category: "Entertainment",
    icon: "🎵",
    expiryDate: "Dec 20, 2024",
    status: "expiring-soon",
  },
  {
    id: "2",
    title: "Adobe Creative Cloud",
    category: "Design",
    icon: "🎨",
    expiryDate: "Aug 15, 2025",
    status: "active",
  },
];

const updatesData: Update[] = [
  {
    id: "1",
    type: "expiring-soon",
    title: "Expiring Soon",
    message: "Your Spotify Premium perk expires in 5 days. Renew now to continue enjoying ad-free music.",
    timestamp: "2 hours ago",
    icon: AlertTriangle,
  },
  {
    id: "2",
    type: "new-perk",
    title: "New Perk Added",
    message: "Notion Pro is now available for students. Get unlimited blocks and advanced features.",
    timestamp: "1 day ago",
    icon: Plus,
  },
  {
    id: "3",
    type: "renewal-reminder",
    title: "Renewal Reminder",
    message: "GitHub Student Pack expires next week. Make sure to verify your student status.",
    timestamp: "2 days ago",
    icon: AlertTriangle,
  },
  {
    id: "4",
    type: "account-update",
    title: "Account Update",
    message: "Your student verification has been renewed successfully. Valid until June 2025.",
    timestamp: "3 days ago",
    icon: Bell,
  },
];

export default function Dashboard() {
  const { user: authUser } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedPerks, setSavedPerks] = useState<SavedPerk[]>([]);
  const [savedResources, setSavedResources] = useState<SavedResource[]>([]);
  const [savedAITools, setSavedAITools] = useState<SavedAITool[]>([]);

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
          stream: profile.stream || 'Not specified',
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
      } catch (error) {
        console.error('Error loading saved items:', error);
      }
    }

    if (authUser && !loading) {
      loadSavedItems();
    }
  }, [authUser, loading]);

  // Handler functions
  const handleViewPerkDetails = (perk: SavedPerk) => {
    console.log("View perk details:", perk);
  };

  const handleToggleSavePerk = async (perkId: string) => {
    try {
      const perk = savedPerks.find(p => p.id === perkId);
      if (!perk || !(perk as any).savedId) return;

      // Unsave the perk
      await unsavePerk((perk as any).savedId);

      // Remove from state
      setSavedPerks(prev => prev.filter(p => p.id !== perkId));
    } catch (error) {
      console.error("Error toggling save perk:", error);
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
                <p className="text-sm text-gray-600 dark:text-gray-400">
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

        {/* Saved Perks Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Saved Perks
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Quick access to the perks you've saved for later.
          </p>

          {savedPerks.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-12 text-center">
              <Star className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Saved Perks Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Start exploring perks and save your favorites to access them quickly from here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedPerks.map((perk) => (
                <PerkCard
                  key={perk.id}
                  perk={perk}
                  onViewDetails={handleViewPerkDetails}
                  onToggleSave={handleToggleSavePerk}
                />
              ))}
            </div>
          )}
        </div>

        {/* Saved Resources Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Saved Resources
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Educational resources and tools you've bookmarked.
          </p>

          {savedResources.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Saved Resources Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Discover educational resources and bookmark them to access them quickly from here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedResources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  onAccessResource={handleAccessResource}
                  onToggleSave={handleToggleSaveResource}
                />
              ))}
            </div>
          )}
        </div>

        {/* Saved AI Tools Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Saved AI Tools
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            AI-powered tools and assistants to boost your productivity.
          </p>

          {savedAITools.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-12 text-center">
              <Sparkles className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Saved AI Tools Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Explore AI-powered tools and save them to boost your productivity.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedAITools.map((aiTool) => (
                <AIToolCard
                  key={aiTool.id}
                  aiTool={aiTool}
                  onAccessTool={handleAccessAITool}
                  onToggleSave={handleToggleSaveAITool}
                />
              ))}
            </div>
          )}
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
    </div>
  );
}
