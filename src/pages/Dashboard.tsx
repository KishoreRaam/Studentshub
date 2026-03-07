import { useState, useEffect, useRef } from "react";
import {
  CheckCircle, Star, BookOpen, Plus, Bell, Loader2, Sparkles,
  LayoutDashboard, Gift, Library, Cpu, Settings, ChevronRight,
  Search, Package,
} from "lucide-react";
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
import "@/components/dashboard/dashboard-nm.css";

// ─── helpers ─────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name.split(" ").map(p => p[0]).join("").toUpperCase().slice(0, 2);
}

/** Button that injects a radial ripple on click */
function RippleButton({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const handle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = ref.current;
    if (btn) {
      const r = btn.getBoundingClientRect();
      const s = document.createElement("span");
      s.className = "ripple-wave";
      s.style.cssText = `width:60px;height:60px;left:${e.clientX - r.left - 30}px;top:${e.clientY - r.top - 30}px;background:radial-gradient(circle,rgba(26,86,219,0.3) 0%,transparent 70%);`;
      btn.appendChild(s);
      setTimeout(() => s.remove(), 700);
    }
    onClick?.(e);
  };
  return (
    <button ref={ref} onClick={handle} className={`relative overflow-hidden ${className ?? ""}`}>
      {children}
    </button>
  );
}

/** Neumorphic empty-state placeholder */
function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="nm-flat rounded-2xl p-14 text-center">
      <div className="nm-inset w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <Icon className="w-7 h-7 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">{title}</h3>
      <p className="text-sm text-gray-400 dark:text-gray-500">{description}</p>
    </div>
  );
}

// ─── types ───────────────────────────────────────────────────────────────────

type Section = "overview" | "perks" | "resources" | "ai-tools";

// ─── component ───────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { user: authUser } = useAuth();

  // UI state
  const [activeSection, setActiveSection] = useState<Section>("overview");

  // Data state — unchanged from original
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedPerks, setSavedPerks] = useState<SavedPerk[]>([]);
  const [savedResources, setSavedResources] = useState<SavedResource[]>([]);
  const [savedAITools, setSavedAITools] = useState<SavedAITool[]>([]);
  const [selectedPerk, setSelectedPerk] = useState<Perk | null>(null);
  const [statsData, setStatsData] = useState<Stat[]>([]);
  const [subscriptionsData, setSubscriptionsData] = useState<Subscription[]>([]);
  const [updatesData, setUpdatesData] = useState<Update[]>([]);

  // ── Load user profile ────────────────────────────────────────────────────
  useEffect(() => {
    async function loadUserProfile() {
      if (!authUser) { setLoading(false); return; }
      try {
        const profile = await getOrCreateProfile(authUser);
        setUserProfile({
          name: profile.name,
          stream: getStreamLabel(profile.stream) || "Not specified",
          initials: getInitials(profile.name),
        });
      } catch {
        setUserProfile({
          name: authUser.name || authUser.email.split("@")[0],
          stream: "Not specified",
          initials: getInitials(authUser.name || authUser.email),
        });
      } finally {
        setLoading(false);
      }
    }
    loadUserProfile();
  }, [authUser]);

  // ── Load saved items ─────────────────────────────────────────────────────
  useEffect(() => {
    async function loadSavedItems() {
      if (!authUser) return;
      try {
        const userId = authUser.$id;
        const [perks, resources, aiTools] = await Promise.all([
          getSavedPerks(userId),
          getSavedResources(userId),
          getSavedAITools(userId),
        ]);

        setSavedPerks(perks as any[]);
        setSavedResources(resources as any[]);
        setSavedAITools(aiTools as any[]);

        const totalSaved = perks.length + resources.length + aiTools.length;
        const claimedPerks = perks.filter((p: any) => p.claimed).length;

        setStatsData([
          { title: "Total Saved Items",  value: totalSaved,                       subtitle: "Perks, Resources & AI Tools", icon: CheckCircle },
          { title: "Saved Perks",        value: perks.length,                     subtitle: `${claimedPerks} claimed`,     icon: Star },
          { title: "Resources & Tools",  value: resources.length + aiTools.length, subtitle: "Available for access",       icon: BookOpen },
        ]);

        const subs: Subscription[] = perks
          .filter((p: any) => p.claimed)
          .slice(0, 5)
          .map((p: any) => ({
            id: p.id,
            title: p.title,
            category: p.category,
            icon: p.icon || "💎",
            expiryDate: p.validity || "N/A",
            status: "active" as const,
          }));
        setSubscriptionsData(subs);

        const updates: Update[] = [];
        if (perks.some((p: any) => !p.claimed)) {
          updates.push({ id: "1", type: "new-perk",       title: "Perks Available",   message: "You have saved perks ready to be claimed.", timestamp: "Recent", icon: Plus });
        }
        if (totalSaved > 0) {
          updates.push({ id: "2", type: "account-update", title: "Dashboard Updated", message: `You have ${totalSaved} saved items in your collection.`, timestamp: "Today", icon: Bell });
        }
        if (resources.length > 0) {
          updates.push({ id: "3", type: "new-perk",       title: "Resources Ready",   message: `Access ${resources.length} learning resources anytime.`, timestamp: "Today", icon: BookOpen });
        }
        setUpdatesData(updates);
      } catch (error) {
        console.error("Error loading saved items:", error);
      }
    }
    if (authUser && !loading) loadSavedItems();
  }, [authUser, loading]);

  // ── Perk conversion ──────────────────────────────────────────────────────
  const convertToPerk = (savedPerk: SavedPerk): Perk => ({
    id: savedPerk.id,
    title: savedPerk.title,
    description: savedPerk.description,
    category: savedPerk.category,
    image: (savedPerk as any).logo || savedPerk.icon || "",
    isPopular: false,
    discount: (savedPerk as any).discount || "",
    claimLink: (savedPerk as any).claimLink || "",
    validity: savedPerk.validity,
    website: (savedPerk as any).website || "",
    logo: (savedPerk as any).logo || "",
    color: (savedPerk as any).color || "#3B82F6",
  });

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleViewPerkDetails   = (perk: SavedPerk) => setSelectedPerk(convertToPerk(perk));

  const handleToggleSavePerk = async (perkId: string) => {
    try {
      const perk = savedPerks.find(p => p.id === perkId);
      if (!perk || !(perk as any).savedId) return;
      await unsavePerk((perk as any).savedId);
      setSavedPerks(prev => prev.filter(p => p.id !== perkId));
      if (selectedPerk?.id === perkId) setSelectedPerk(null);
    } catch (error) { console.error("Error toggling save perk:", error); }
  };

  const handlePerkModalChange = async () => {
    if (!authUser) return;
    try {
      const perks = await getSavedPerks(authUser.$id);
      setSavedPerks(perks as any[]);
      if (selectedPerk && !perks.some(p => p.id === selectedPerk.id)) setSelectedPerk(null);
    } catch (error) { console.error("Error refreshing saved perks:", error); }
  };

  const handleAccessResource = (resource: SavedResource) => {
    if (resource.claimLink) window.open(resource.claimLink, "_blank", "noopener,noreferrer");
  };

  const handleToggleSaveResource = async (resourceId: string) => {
    try {
      const resource = savedResources.find(r => r.id === resourceId);
      if (!resource || !(resource as any).savedId) return;
      await unsaveResource((resource as any).savedId);
      setSavedResources(prev => prev.filter(r => r.id !== resourceId));
    } catch (error) { console.error("Error toggling save resource:", error); }
  };

  const handleAccessAITool = (aiTool: SavedAITool) => {
    if (aiTool.link) window.open(aiTool.link, "_blank", "noopener,noreferrer");
  };

  const handleToggleSaveAITool = async (aiToolId: string) => {
    try {
      const aiTool = savedAITools.find(t => t.id === aiToolId);
      if (!aiTool || !(aiTool as any).savedId) return;
      await unsaveAITool((aiTool as any).savedId);
      setSavedAITools(prev => prev.filter(t => t.id !== aiToolId));
    } catch (error) { console.error("Error toggling save AI tool:", error); }
  };

  const handleRenewSubscription     = (id: string)              => console.log("Renew subscription:", id);
  const handleViewSubscriptionDetails = (sub: Subscription)     => console.log("View subscription details:", sub);

  // ── Nav config ───────────────────────────────────────────────────────────
  const navItems = [
    { id: "overview"  as Section, label: "Overview",    icon: LayoutDashboard, badge: undefined },
    { id: "perks"     as Section, label: "Saved Perks", icon: Gift,            badge: savedPerks.length },
    { id: "resources" as Section, label: "Resources",   icon: Library,         badge: savedResources.length },
    { id: "ai-tools"  as Section, label: "AI Tools",    icon: Cpu,             badge: savedAITools.length },
  ];

  const sectionSubtitles: Record<Section, string> = {
    "overview":  "Your student benefits command centre.",
    "perks":     "All your saved student perks and discounts.",
    "resources": "Learning resources you've bookmarked.",
    "ai-tools":  "AI-powered tools in your collection.",
  };

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="nm-bg min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="nm-inset w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-7 h-7 animate-spin text-[#1A56DB]" />
          </div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Loading your dashboard…
          </p>
        </div>
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="nm-bg h-screen flex flex-col pt-16 overflow-hidden">
      <div className="flex flex-1 overflow-hidden">

        {/* ── Sidebar ──────────────────────────────────────────────────── */}
        <aside className="nm-flat hidden lg:flex w-72 shrink-0 flex-col overflow-y-auto z-10">

          {/* Brand card */}
          <div className="m-5 mb-3">
            <div className="nm-flat rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1A56DB] to-[#00A63E] flex items-center justify-center shadow-lg flex-shrink-0">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">StudentsHub</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">Student Dashboard</p>
              </div>
            </div>
          </div>

          {/* User profile */}
          {userProfile && (
            <div className="mx-5 mb-3">
              <div className="nm-inset rounded-xl p-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1A56DB] to-[#00A63E] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {userProfile.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{userProfile.name}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{userProfile.stream}</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-[#00A63E] pulse-dot flex-shrink-0" />
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-5 py-2 space-y-1">
            {navItems.map((item) => (
              <RippleButton
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full nm-nav-link flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                  activeSection === item.id
                    ? "nm-nav-active text-[#1A56DB] dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <item.icon
                  className={`flex-shrink-0 ${activeSection === item.id ? "text-[#1A56DB] dark:text-blue-400" : ""}`}
                  style={{ width: 18, height: 18 }}
                />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="text-xs font-bold bg-gradient-to-r from-[#1A56DB] to-[#00A63E] text-white px-2 py-0.5 rounded-full min-w-[20px] text-center">
                    {item.badge}
                  </span>
                )}
              </RippleButton>
            ))}
          </nav>

          {/* Settings */}
          <div className="px-5 py-5">
            <div className="nm-divider mb-4" />
            <RippleButton className="nm-btn w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 cursor-pointer">
              <Settings className="w-4 h-4" />
              Settings
            </RippleButton>
          </div>
        </aside>

        {/* ── Main content ─────────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto">

          {/* Sticky internal header */}
          <div className="sticky top-0 z-20 nm-bg border-b border-[#a3b1c6]/30 dark:border-[#2a2d42]/50">
            <div className="flex items-center gap-4 px-6 lg:px-8 py-3">
              {/* Breadcrumb — "Dashboard" is clickable when not on overview */}
              <div className="flex items-center gap-2 text-sm flex-1 min-w-0">
                {activeSection !== "overview" ? (
                  <button
                    onClick={() => setActiveSection("overview")}
                    className="font-medium text-[#1A56DB] dark:text-blue-400 hover:underline underline-offset-2 transition-colors flex-shrink-0"
                  >
                    Dashboard
                  </button>
                ) : (
                  <span className="font-medium text-gray-400 dark:text-gray-500 flex-shrink-0">Dashboard</span>
                )}
                {activeSection !== "overview" && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 flex-shrink-0" />
                    <span className="text-gray-900 dark:text-white font-semibold truncate">
                      {navItems.find(n => n.id === activeSection)?.label}
                    </span>
                  </>
                )}
              </div>
              {/* Search */}
              <div className="nm-inset hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl w-60">
                <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <input
                  placeholder="Search anything…"
                  className="bg-transparent border-none outline-none text-sm text-gray-700 dark:text-gray-300 w-full placeholder-gray-400 dark:placeholder-gray-600"
                />
              </div>
            </div>

            {/* Mobile section tabs — only visible below lg where sidebar is hidden */}
            <div className="flex lg:hidden overflow-x-auto px-4 pb-2 gap-2 scrollbar-hide">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all duration-200 ${
                    activeSection === item.id
                      ? "nm-nav-active text-[#1A56DB] dark:text-blue-400"
                      : "nm-btn text-gray-600 dark:text-gray-400"
                  }`}
                >
                  <item.icon style={{ width: 14, height: 14 }} />
                  {item.label}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-0.5 text-xs font-bold bg-gradient-to-r from-[#1A56DB] to-[#00A63E] text-white px-1.5 py-0 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Page content */}
          <div className="px-6 lg:px-8 py-6">

            {/* Section heading */}
            <div className="mb-8 fade-up">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">
                {navItems.find(n => n.id === activeSection)?.label ?? "Dashboard"}
              </h1>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                {sectionSubtitles[activeSection]}
              </p>
            </div>

            {/* ── OVERVIEW ─────────────────────────────────────────────── */}
            {activeSection === "overview" && (
              <div key="overview">
                {/* Stats grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {statsData.map((stat, i) => (
                    <div key={i} className="fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                      <StatsCard stat={stat} />
                    </div>
                  ))}
                </div>

                {/* Quick actions */}
                <div className="mb-8 fade-up" style={{ animationDelay: "180ms" }}>
                  <p className="text-xs font-bold tracking-widest uppercase text-gray-400 dark:text-gray-500 mb-4">
                    Quick Actions
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { icon: Gift,    label: "+ Explore Perks",    fn: () => setActiveSection("perks") },
                      { icon: Library, label: "Browse Resources",   fn: () => setActiveSection("resources") },
                      { icon: Cpu,     label: "Discover AI Tools",  fn: () => setActiveSection("ai-tools") },
                    ].map((action, i) => (
                      <RippleButton
                        key={i}
                        onClick={action.fn}
                        className="nm-btn flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer"
                      >
                        <action.icon className="w-4 h-4" />
                        {action.label}
                      </RippleButton>
                    ))}
                  </div>
                </div>

                {/* Subscriptions + updates */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 fade-up" style={{ animationDelay: "240ms" }}>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                      Active Subscriptions
                    </h2>
                    {subscriptionsData.length === 0 ? (
                      <EmptyState icon={Package} title="No Active Subscriptions" description="Claim perks to track them here" />
                    ) : (
                      <div className="space-y-4">
                        {subscriptionsData.map(sub => (
                          <SubscriptionCard
                            key={sub.id}
                            subscription={sub}
                            onRenew={handleRenewSubscription}
                            onViewDetails={handleViewSubscriptionDetails}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="fade-up" style={{ animationDelay: "300ms" }}>
                    <RecentUpdates updates={updatesData} />
                  </div>
                </div>
              </div>
            )}

            {/* ── PERKS ────────────────────────────────────────────────── */}
            {activeSection === "perks" && (
              <div key="perks" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {savedPerks.length === 0 ? (
                  <div className="col-span-full">
                    <EmptyState icon={Star} title="No Saved Perks" description="Browse the perks page and save your favourites" />
                  </div>
                ) : (
                  savedPerks.map((perk, i) => (
                    <div key={perk.id} className="fade-up" style={{ animationDelay: `${i * 50}ms` }}>
                      <PerkCard perk={perk} onViewDetails={handleViewPerkDetails} onToggleSave={handleToggleSavePerk} />
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ── RESOURCES ────────────────────────────────────────────── */}
            {activeSection === "resources" && (
              <div key="resources" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {savedResources.length === 0 ? (
                  <div className="col-span-full">
                    <EmptyState icon={BookOpen} title="No Saved Resources" description="Browse the resources page and save your favourites" />
                  </div>
                ) : (
                  savedResources.map((resource, i) => (
                    <div key={resource.id} className="fade-up" style={{ animationDelay: `${i * 50}ms` }}>
                      <ResourceCard resource={resource} onAccessResource={handleAccessResource} onToggleSave={handleToggleSaveResource} />
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ── AI TOOLS ─────────────────────────────────────────────── */}
            {activeSection === "ai-tools" && (
              <div key="ai-tools" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {savedAITools.length === 0 ? (
                  <div className="col-span-full">
                    <EmptyState icon={Sparkles} title="No Saved AI Tools" description="Browse the AI tools page and save your favourites" />
                  </div>
                ) : (
                  savedAITools.map((tool, i) => (
                    <div key={tool.id} className="fade-up" style={{ animationDelay: `${i * 50}ms` }}>
                      <AIToolCard aiTool={tool} onAccessTool={handleAccessAITool} onToggleSave={handleToggleSaveAITool} />
                    </div>
                  ))
                )}
              </div>
            )}

          </div>
        </main>
      </div>

      {/* Perk detail modal */}
      <DetailedPerkCard
        perk={selectedPerk}
        isOpen={selectedPerk !== null}
        onClose={() => setSelectedPerk(null)}
        onSaveChange={handlePerkModalChange}
      />
    </div>
  );
}
