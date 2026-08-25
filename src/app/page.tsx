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
import { getClubToken } from "@/lib/api";
import { LogOut, MessageSquare, Info, LayoutTemplate, Users } from "lucide-react";

const TAB_LABELS: Record<string, string> = {
  feed: "Feed Manager",
  details: "Club Details",
  landing: "Landing Page Builder",
  reps: "Manage Representatives",
};

const TAB_DESCRIPTIONS: Record<string, string> = {
  feed: "Post updates, events, and galleries to your community feed.",
  details: "Manage public information displayed on AmazeCC.",
  landing: "Customize your club's showcase landing page.",
  reps: "Add or remove club representatives.",
};

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [roles, setRoles] = useState<any[]>([]);
  const [activeClubId, setActiveClubId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("feed");

  useEffect(() => {
    const storedToken = getClubToken();
    if (storedToken) {
      setToken(storedToken);
      try {
        const storedRoles = JSON.parse(localStorage.getItem("club_roles") || "[]");
        setRoles(storedRoles);
        if (storedRoles.length > 0) {
          const storedActive = localStorage.getItem("active_club_id");
          if (storedActive && storedRoles.find((r: any) => r.club_id === storedActive)) {
            setActiveClubId(storedActive);
          } else {
            setActiveClubId(storedRoles[0].club_id);
          }
        }
      } catch (e) { }
    }
  }, []);

  useEffect(() => {
    if (activeClubId) localStorage.setItem("active_club_id", activeClubId);
  }, [activeClubId]);

  const handleLogin = (newToken: string, newRoles: any[]) => {
    setToken(newToken);
    setRoles(newRoles);
    if (newRoles.length > 0) setActiveClubId(newRoles[0].club_id);
  };

  const handleLogout = () => {
    localStorage.removeItem("club_token");
    localStorage.removeItem("club_roles");
    setToken(null);
    setRoles([]);
    setActiveClubId(null);
  };

  if (!token) return <LoginPage onLogin={handleLogin} />;

  const activeRole = roles.find(r => r.club_id === activeClubId)?.role;
  const isSuperRep = activeRole === "super-club-rep";

  const mobileNavItems: MobileBottomNavItem[] = [
    { id: "feed",    icon: <MessageSquare className="w-5 h-5" />,  label: "Feed",    isActive: activeTab === "feed",    onClick: () => setActiveTab("feed") },
    { id: "details", icon: <Info className="w-5 h-5" />,           label: "Details", isActive: activeTab === "details", onClick: () => setActiveTab("details") },
    { id: "landing", icon: <LayoutTemplate className="w-5 h-5" />, label: "Landing", isActive: activeTab === "landing", onClick: () => setActiveTab("landing") },
    ...(isSuperRep ? [{ id: "reps", icon: <Users className="w-5 h-5" />, label: "Reps", isActive: activeTab === "reps", onClick: () => setActiveTab("reps") }] : []),
  ];

  return (
    <View className="min-h-screen bg-background text-foreground flex flex-col md:flex-row relative">
      {/* Ambient grid background */}
      <View className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_70%_40%_at_50%_0%,#000_50%,transparent_100%)] pointer-events-none" />

      {/* ── Mobile Topbar ──────────────────────────────────────── */}
      <View className="md:hidden flex flex-row items-center justify-between px-4 py-3 bg-card/70 backdrop-blur-xl border-b border-border sticky top-0 z-50">
        <View className="flex flex-row items-center gap-2.5">
          <View className="relative">
            <View className="absolute inset-0 bg-primary/30 rounded-xl blur-md" />
            <Image src="/logo.png" alt="AmazeCC Logo" className="relative h-7 w-7 rounded-xl" />
          </View>
          <View className="flex flex-col">
            <Text className="text-sm font-bold text-foreground leading-tight">Club Hub</Text>
            {roles.length === 1 && (
              <Text className="text-[10px] font-bold text-primary uppercase tracking-wider">{activeClubId}</Text>
            )}
          </View>
        </View>

        <View className="flex flex-row items-center gap-2">
          {roles.length > 1 && (
            <OptionPicker
              value={activeClubId || ""}
              onChange={(v) => { setActiveClubId(v); window.location.reload(); }}
              options={roles.map(r => ({ value: r.club_id, label: r.club_id }))}
              className="max-w-[120px]"
            />
          )}
          <ThemeSwitcher />
          {/* icon-only button — no stacking issue */}
          <Button onClick={handleLogout} variant="ghost" size="icon" className="text-danger">
            <LogOut className="w-4 h-4" />
          </Button>
        </View>
      </View>

      {/* ── Mobile Bottom Nav (AmazeUI) ───────────────────────── */}
      <View className="md:hidden">
        <MobileBottomNav items={mobileNavItems} />
      </View>

      {/* ── Desktop Sidebar ───────────────────────────────────── */}
      <View className="hidden md:block z-40">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          roles={roles}
          activeClubId={activeClubId}
          setActiveClubId={setActiveClubId}
          handleLogout={handleLogout}
          isSuperRep={isSuperRep}
        />
      </View>

      {/* ── Main Content ──────────────────────────────────────── */}
      <View className="flex-1 w-full min-h-screen md:pl-[18rem] pb-24 md:pb-6 overflow-y-auto overflow-x-hidden bg-background">
        {/* Sticky page header */}
        <View className="sticky top-0 md:top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
          <View className="flex flex-row items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 py-4">
            <View>
              <Text className="text-lg font-bold text-foreground tracking-tight">
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

        {/* Tab content */}
        {activeTab === "feed" && activeClubId && (
          <View className="flex-1 px-4 sm:px-6 lg:px-8 py-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
            <FeedManager clubId={activeClubId} />
          </View>
        )}
        {activeTab === "landing" && activeClubId && (
          <View className="flex-1 px-4 sm:px-6 lg:px-8 py-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
            <LandingPageBuilder clubId={activeClubId} />
          </View>
        )}
        {activeTab === "reps" && activeClubId && isSuperRep && (
          <View className="flex-1 px-4 sm:px-6 lg:px-8 py-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
            <RepManager clubId={activeClubId} />
          </View>
        )}
        {activeTab === "details" && activeClubId && (
          <View className="flex-1 px-4 sm:px-6 lg:px-8 py-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
            <ClubDetailsEditor clubId={activeClubId} />
          </View>
        )}
      </View>
    </View>
  );
}
