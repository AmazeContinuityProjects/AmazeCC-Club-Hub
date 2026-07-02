"use client";
import { useState, useEffect } from "react";
import { Header, Title, Description, View, Text, Button, Image, Select } from "@amazecontinuityprojects/amazeui";
import LoginPage from "@/components/LoginPage";
import FeedManager from "@/components/FeedManager";
import LandingPageBuilder from "@/components/LandingPageBuilder";
import Sidebar from "@/components/Sidebar";
import ClubDetailsEditor from "@/components/ClubDetailsEditor";
import RepManager from "@/components/RepManager";
import { getClubToken, apiFetch } from "@/lib/api";
import { LogOut, MessageSquare, Info, LayoutTemplate, Users } from "lucide-react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

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
    if (activeClubId) {
      localStorage.setItem("active_club_id", activeClubId);
    }
  }, [activeClubId]);

  const handleLogin = (newToken: string, newRoles: any[]) => {
    setToken(newToken);
    setRoles(newRoles);
    if (newRoles.length > 0) {
      setActiveClubId(newRoles[0].club_id);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("club_token");
    localStorage.removeItem("club_roles");
    setToken(null);
    setRoles([]);
    setActiveClubId(null);
  };

  if (!token) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const activeRole = roles.find(r => r.club_id === activeClubId)?.role;
  const isSuperRep = activeRole === 'super-club-rep';

  return (
    <View className="min-h-screen bg-background text-foreground flex flex-col md:flex-row relative">
      <View className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f080_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f080_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

      {/* Mobile Topbar */}
      <View className="md:hidden flex flex-row items-center justify-between p-4 bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <View className="flex flex-row items-center gap-2">
          <Image src="/logo.png" alt="AmazeCC Logo" className="h-6 w-6 rounded-md" />
          <View className="flex flex-col">
            <Text className="text-base font-bold text-foreground leading-tight">Club Hub</Text>
            {roles.length === 1 && (
              <Text className="text-[10px] font-semibold text-primary uppercase tracking-wider">{activeClubId}</Text>
            )}
          </View>
        </View>
        <View className="flex flex-row items-center gap-2 sm:gap-3">
          {roles.length > 1 && (
            <Select value={activeClubId || ""} onChange={(v) => setActiveClubId(v)} options={roles.map(r => ({ value: r.club_id, label: r.club_id }))} className="max-w-[100px] text-xs" />
          )}
          <ThemeSwitcher />
          <Button onClick={handleLogout} variant="ghost" size="icon" className="text-danger">
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </View>
      </View>

      {/* Floating Mobile Bottom Nav */}
      <View className="md:hidden fixed bottom-4 left-4 right-4 z-50 bg-card/90 backdrop-blur-lg border border-border rounded-2xl shadow-xl p-2 flex flex-row gap-1 overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <Button onClick={() => setActiveTab("feed")} variant="ghost" className={`flex flex-col items-center p-2 rounded-xl flex-1 ${activeTab === "feed" ? "text-foreground bg-muted" : "text-muted-foreground"}`}>
          <MessageSquare className="w-5 h-5 mb-1" />
          <Text className="text-[10px] font-medium">Feed</Text>
        </Button>
        <Button onClick={() => setActiveTab("details")} variant="ghost" className={`flex flex-col items-center p-2 rounded-xl flex-1 ${activeTab === "details" ? "text-foreground bg-muted" : "text-muted-foreground"}`}>
          <Info className="w-5 h-5 mb-1" />
          <Text className="text-[10px] font-medium">Details</Text>
        </Button>
        <Button onClick={() => setActiveTab("landing")} variant="ghost" className={`flex flex-col items-center p-2 rounded-xl flex-1 ${activeTab === "landing" ? "text-foreground bg-muted" : "text-muted-foreground"}`}>
          <LayoutTemplate className="w-5 h-5 mb-1" />
          <Text className="text-[10px] font-medium">Landing</Text>
        </Button>
        {isSuperRep && (
          <Button onClick={() => setActiveTab("reps")} variant="ghost" className={`flex flex-col items-center p-2 rounded-xl flex-1 ${activeTab === "reps" ? "text-foreground bg-muted" : "text-muted-foreground"}`}>
            <Users className="w-5 h-5 mb-1" />
            <Text className="text-[10px] font-medium">Reps</Text>
          </Button>
        )}
      </View>

      {/* Desktop Sidebar */}
      <View className="hidden md:block z-40">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} roles={roles} activeClubId={activeClubId} setActiveClubId={setActiveClubId} handleLogout={handleLogout} isSuperRep={isSuperRep} />
      </View>

      <View className="flex-1 w-full min-h-screen md:pl-[18rem] pb-24 md:pb-6 overflow-y-auto overflow-x-hidden bg-background">
        <Header>
          <View className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <View>
              <Title>
                {activeTab === "feed" && "Feed Manager"}
                {activeTab === "details" && "Club Details"}
                {activeTab === "landing" && "Landing Page Builder"}
                {activeTab === "reps" && "Manage Representatives"}
              </Title>
              <Description>
                {activeTab === "feed" && "Post updates, events, and galleries to your community feed."}
                {activeTab === "details" && "Manage public information displayed on AmazeCC."}
                {activeTab === "landing" && "Customize your club's showcase landing page."}
                {activeTab === "reps" && "Add or remove club representatives."}
              </Description>
            </View>
            <View className="hidden sm:flex flex-row items-center gap-3 bg-card/50 px-4 py-2.5 rounded-xl border border-border shadow-sm backdrop-blur-sm">
              <View className="flex flex-col">
                <Text className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Status</Text>
                <Text className="text-xs font-semibold text-foreground flex flex-row items-center gap-1.5">
                  <Text className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  Active
                </Text>
              </View>
            </View>
          </View>
        </Header>

        <View className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full space-y-6">
          {activeTab === "feed" && activeClubId && (
            <View className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <FeedManager clubId={activeClubId} />
            </View>
          )}
          {activeTab === "details" && activeClubId && (
            <View className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ClubDetailsEditor clubId={activeClubId} />
            </View>
          )}
          {activeTab === "landing" && activeClubId && (
            <View className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <LandingPageBuilder clubId={activeClubId} />
            </View>
          )}
          {activeTab === "reps" && activeClubId && isSuperRep && (
            <View className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <RepManager clubId={activeClubId} />
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
