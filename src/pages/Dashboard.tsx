import { useState } from "react";
import { CheckCircle, Clock, DollarSign, Star, BookOpen, AlertTriangle, Plus, Bell } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import PerkCard from "@/components/dashboard/PerkCard";
import ResourceCard from "@/components/dashboard/ResourceCard";
import SubscriptionCard from "@/components/dashboard/SubscriptionCard";
import RecentUpdates from "@/components/dashboard/RecentUpdates";
import type { Stat, SavedPerk, SavedResource, Subscription, Update, UserProfile } from "@/types/dashboard";

// Mock Data
const userProfile: UserProfile = {
  name: "Sarah Johnson",
  stream: "Computer Science",
  initials: "SJ",
};

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

const savedPerksData: SavedPerk[] = [
  {
    id: "1",
    title: "GitHub Student Developer Pack",
    category: "Productivity",
    icon: "💻",
    validity: "Valid until Graduation",
    description: "Free access to developer tools and services including GitHub Pro, cloud credits, and more.",
    isSaved: true,
  },
  {
    id: "2",
    title: "Canva Pro",
    category: "Design",
    icon: "🎨",
    validity: "Valid until Dec 2025",
    description: "Professional design tools with unlimited downloads, premium templates, and brand kit features.",
    isSaved: true,
  },
  {
    id: "3",
    title: "Spotify Premium",
    category: "Entertainment",
    icon: "🎵",
    validity: "Valid until Graduation",
    description: "Ad-free music streaming with offline downloads and high-quality audio at student pricing.",
    isSaved: true,
  },
];

const savedResourcesData: SavedResource[] = [
  {
    id: "1",
    title: "Coursera Free Courses",
    category: "Education",
    icon: "🎓",
    description: "Access thousands of free courses from top universities and companies worldwide.",
    isPremium: false,
    isSaved: true,
    link: "https://www.coursera.org",
  },
  {
    id: "2",
    title: "IEEE Xplore",
    category: "Research",
    icon: "📚",
    description: "Access research papers, journals, and conference proceedings in technology and engineering.",
    isPremium: true,
    isSaved: true,
    link: "https://ieeexplore.ieee.org",
  },
  {
    id: "3",
    title: "LinkedIn Learning",
    category: "Professional Development",
    icon: "💼",
    description: "Unlimited access to expert-led courses in business, technology, and creative skills.",
    isPremium: true,
    isSaved: true,
    link: "https://www.linkedin.com/learning",
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
  const [savedPerks, setSavedPerks] = useState(savedPerksData);
  const [savedResources, setSavedResources] = useState(savedResourcesData);

  // Handler functions
  const handleViewPerkDetails = (perk: SavedPerk) => {
    console.log("View perk details:", perk);
  };

  const handleToggleSavePerk = (perkId: string) => {
    setSavedPerks((prev) =>
      prev.map((perk) =>
        perk.id === perkId ? { ...perk, isSaved: !perk.isSaved } : perk
      )
    );
    console.log("Toggle save perk:", perkId);
  };

  const handleAccessResource = (resource: SavedResource) => {
    console.log("Access resource:", resource);
    if (resource.link) {
      window.open(resource.link, "_blank", "noopener,noreferrer");
    }
  };

  const handleToggleSaveResource = (resourceId: string) => {
    setSavedResources((prev) =>
      prev.map((resource) =>
        resource.id === resourceId ? { ...resource, isSaved: !resource.isSaved } : resource
      )
    );
    console.log("Toggle save resource:", resourceId);
  };

  const handleRenewSubscription = (subscriptionId: string) => {
    console.log("Renew subscription:", subscriptionId);
  };

  const handleViewSubscriptionDetails = (subscription: Subscription) => {
    console.log("View subscription details:", subscription);
  };

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
