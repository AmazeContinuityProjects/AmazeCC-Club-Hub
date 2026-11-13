"use client";
import { useState, useEffect } from "react";
import {
  View, Text, Image, Button, OptionPicker, ThemeSwitcher,
  MobileBottomNav, type MobileBottomNavItem
} from "@/lib/ui";
import LoginPage from "@/components/LoginPage";
import FeedManager from "@/components/FeedManager";
import LandingPageBuilder from "@/components/LandingPageBuilder";
import Sidebar from "@/components/Sidebar";
import ClubDetailsEditor from "@/components/ClubDetailsEditor";
import RepManager from "@/components/RepManager";
import { getClubToken, signOut, apiFetch } from "@/lib/api";
import { ensureFreshAccessToken, trySilentSignIn, clearOidcStorage } from "@/lib/oauth2";
import { LogOut, MessageSquare, Info, LayoutTemplate, Users } from "lucide-react";

const TAB_LABELS: Record<string, string> = {
  feed: "Feed Manager",
  details: "Club Details",
  landing: "Landing Page Builder",
  reps: "Representatives",
};

const TAB_DESCRIPTIONS: Record<string, string> = {
  feed: "Post updates, events and galleries to your club's community feed.",
  details: "Public information shown on AmazeCC for this club.",
  landing: "Design the showcase page for this club.",
  reps: "Approve super-club-reps and manage your club's representatives.",
};

const deduplicateRoles = (rawRoles: { club_id: string; role: string }[]) => {
  const map = new Map<string, { club_id: string; role: string }>();
  for (const r of rawRoles || []) {
    if (!r?.club_id) continue;
    const existing = map.get(r.club_id);
    if (!existing || r.role === "super-club-rep") {
      map.set(r.club_id, r);
    }
  }
  return Array.from(map.values());
};

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [roles, setRoles] = useState<{ club_id: string; role: string }[]>([]);
  const [activeClubId, setActiveClubId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("feed");
  const [hydrating, setHydrating] = useState(true);
  const [linkRequired, setLinkRequired] = useState(false);

  // Hydrate from the shared store: Amaze ID tokens are the only source of truth.
  useEffect(() => {
    const hydrate = (storedToken: string) => {
      apiFetch("/api/club-admin/my-clubs")
        .then(async (res) => {
          if (res.status === 403) {
            const body = await res.json().catch(() => null);
            if (body?.error === "vtop_link_required") {
              setToken(storedToken); // keep token so the login screen's link gate renders
              setLinkRequired(true);
              clearOidcStorage();
              return;
            }
            // Not a club rep (anymore) - force re-login
            clearOidcStorage();
            localStorage.removeItem("club_roles");
            localStorage.removeItem("active_club_id");
            return;
          }
          if (!res.ok) return; // transient - stay on login screen
          const data = await res.json();
          const uniqueRoles = deduplicateRoles(data.clubs ?? []);
          setToken(storedToken);
          setRoles(uniqueRoles);
          localStorage.setItem("club_roles", JSON.stringify(uniqueRoles));
          const storedActive = localStorage.getItem("active_club_id");
          if (storedActive && uniqueRoles.find((r: { club_id: string }) => r.club_id === storedActive)) {
            setActiveClubId(storedActive);
          } else if (uniqueRoles[0]) {
            setActiveClubId(uniqueRoles[0].club_id);
            localStorage.setItem("active_club_id", uniqueRoles[0].club_id);
          }
        })
        .catch(() => {})
        .finally(() => setHydrating(false));
    };

    (async () => {
      let storedToken = getClubToken();
      if (!storedToken && typeof window !== "undefined" && localStorage.getItem("amaze_oidc_refresh_token")) {
        await ensureFreshAccessToken();
        storedToken = getClubToken();
      }
      if (storedToken) {
        hydrate(storedToken);
        return;
      }
      // No credentials - one silent SSO attempt per tab if the IdP session exists.
      if (trySilentSignIn()) return; // redirecting to the IdP
      setHydrating(false);
    })().catch(() => setHydrating(false));
  }, []);

  const switchClub = (newClubId: string) => {
    localStorage.setItem("active_club_id", newClubId);
    setActiveClubId(newClubId);
  };

  const handleLogout = () => {
    signOut().finally(() => {
      localStorage.removeItem("active_club_id");
      setToken(null);
      setRoles([]);
      setActiveClubId(null);
      setActiveTab("feed");
    });
  };

  if (hydrating) {
    return (
      <View className="min-h-screen bg-background flex items-center justify-center">
        <Text className="text-sm text-muted-foreground animate-pulse">Loading your club access…</Text>
      </View>
    );
  }

  if (linkRequired) {
    return <LoginPage vtopLinkRequired />;
  }

  if (!token) return <LoginPage />;

  const isSuperRep = roles.some((r) => r.role === "super-club-rep");

  const mobileNavItems: MobileBottomNavItem[] = [
    { id: "feed",    icon: <MessageSquare className="w-5 h-5" />, label: "Feed",    isActive: activeTab === "feed",    onClick: () => setActiveTab("feed") },
    { id: "details", icon: <Info className="w-5 h-5" />,          label: "Details", isActive: activeTab === "details", onClick: () => setActiveTab("details") },
    { id: "landing", icon: <LayoutTemplate className="w-5 h-5" />, label: "Landing", isActive: activeTab === "landing", onClick: () => setActiveTab("landing") },
    ...(isSuperRep ? [{ id: "reps", icon: <Users className="w-5 h-5" />, label: "Reps", isActive: activeTab === "reps", onClick: () => setActiveTab("reps") }] : []),
  ];

  return (
    <View className="min-h-screen bg-background text-foreground flex flex-col md:flex-row relative overflow-hidden">
      {/* Ambient grid background */}
      <View className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_70%_40%_at_50%_0%,#000_50%,transparent_100%)] pointer-events-none" />

      {/* Mobile Topbar */}
      <View className="md:hidden flex flex-row items-center justify-between px-4 py-3 bg-card/70 backdrop-blur-xl border-b border-border sticky top-0 z-50">
        <View className="flex flex-row items-center gap-2.5">
          <View className="relative">
            <View className="absolute inset-0 bg-primary/30 rounded-xl blur-md" />
            <Image src="/logo.png" alt="AmazeCC Logo" className="relative h-7 w-7 rounded-xl" />
          </View>
          <Text className="text-sm font-bold text-foreground leading-tight">Club Hub</Text>
        </View>

        <View className="flex flex-row items-center gap-2">
          {roles.length > 1 && (
            <OptionPicker
              value={activeClubId || ""}
              onChange={switchClub}
              options={roles.map((r) => ({ value: r.club_id, label: r.club_id }))}
              className="max-w-[120px]"
            />
          )}
          <ThemeSwitcher />
          <Button onClick={handleLogout} variant="ghost" size="icon" className="text-danger">
            <LogOut className="w-4 h-4" />
          </Button>
        </View>
      </View>

      {/* Mobile Bottom Nav (AmazeUI) */}
      <View className="md:hidden">
        <MobileBottomNav items={mobileNavItems} />
      </View>

      {/* Desktop Sidebar */}
      <View className="hidden md:block z-40">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          roles={roles}
          activeClubId={activeClubId}
          switchClub={switchClub}
          handleLogout={handleLogout}
          isSuperRep={isSuperRep}
        />
      </View>

      {/* Main Content */}
      <View className="flex-1 w-full min-h-screen md:pl-[18rem] pb-24 md:pb-6 overflow-y-auto overflow-x-hidden bg-background">
        {/* Sticky page header */}
        <View className="sticky top-0 md:top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
          <View className="flex flex-row items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 py-4">
            <View>
              <Text className="text-lg font-bold text-foreground tracking-tight font-sans">
                {TAB_LABELS[activeTab]}
              </Text>
              <Text className="text-sm text-muted-foreground mt-0.5">
                {TAB_DESCRIPTIONS[activeTab]}
              </Text>
            </View>
            <View className="hidden sm:flex flex-row items-center gap-2 bg-success/8 border border-success/20 rounded-full px-3 py-1.5">
              <View className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <Text className="text-xs font-semibold text-success">Active</Text>
            </View>
          </View>
        </View>

        {/* Tab content — keyed by clubId so switching clubs resets component state */}
        {activeTab === "feed" && activeClubId && (
          <View key={`feed-${activeClubId}`} className="flex-1 px-4 sm:px-6 lg:px-8 py-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
            <FeedManager key={activeClubId} clubId={activeClubId} />
          </View>
        )}
        {activeTab === "landing" && activeClubId && (
          <View key={`landing-${activeClubId}`} className="flex-1 px-4 sm:px-6 lg:px-8 py-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
            <LandingPageBuilder key={activeClubId} clubId={activeClubId} />
          </View>
        )}
        {activeTab === "reps" && activeClubId && isSuperRep && (
          <View key={`reps-${activeClubId}`} className="flex-1 px-4 sm:px-6 lg:px-8 py-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
            <RepManager key={activeClubId} clubId={activeClubId} />
          </View>
        )}
        {activeTab === "details" && activeClubId && (
          <View key={`details-${activeClubId}`} className="flex-1 px-4 sm:px-6 lg:px-8 py-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
            <ClubDetailsEditor key={activeClubId} clubId={activeClubId} />
          </View>
        )}
      </View>
    </View>
  );
}
