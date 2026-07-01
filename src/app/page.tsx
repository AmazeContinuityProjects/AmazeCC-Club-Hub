"use client";
import { useState, useEffect } from "react";
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
          setActiveClubId(storedRoles[0].club_id);
        }
      } catch (e) { }
    }
  }, []);

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
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-900 midnight:bg-black text-gray-900 dark:text-gray-100 midnight:text-gray-100 flex flex-col md:flex-row relative">
      
      {/* Background decoration from AmazeCC */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f080_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f080_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />
      
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white/80 dark:bg-slate-950/80 midnight:bg-black/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 midnight:border-gray-800/50 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="AmazeCC Logo" className="h-6 w-6 rounded-md object-contain" />
          <h1 className="text-base font-bold text-gray-900 dark:text-white midnight:text-white">Club Hub</h1>
        </div>
        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          <button onClick={handleLogout} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Floating Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-50 bg-gray-100/90 dark:bg-gray-900/90 midnight:bg-[#0a0a0a]/90 backdrop-blur-lg border border-gray-200 dark:border-gray-800 midnight:border-white/10 rounded-2xl shadow-xl p-2 grid grid-flow-col auto-cols-fr gap-1 overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <button onClick={() => setActiveTab("feed")} className={`flex flex-col items-center p-2 rounded-xl transition-all duration-200 ${activeTab === "feed" ? "text-black dark:text-white midnight:text-white bg-gray-200 dark:bg-gray-800 midnight:bg-white/[0.03]" : "text-gray-500 dark:text-gray-400 midnight:text-gray-400"}`}>
          <MessageSquare className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-medium">Feed</span>
        </button>
        <button onClick={() => setActiveTab("details")} className={`flex flex-col items-center p-2 rounded-xl transition-all duration-200 ${activeTab === "details" ? "text-black dark:text-white midnight:text-white bg-gray-200 dark:bg-gray-800 midnight:bg-white/[0.03]" : "text-gray-500 dark:text-gray-400 midnight:text-gray-400"}`}>
          <Info className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-medium">Details</span>
        </button>
        <button onClick={() => setActiveTab("landing")} className={`flex flex-col items-center p-2 rounded-xl transition-all duration-200 ${activeTab === "landing" ? "text-black dark:text-white midnight:text-white bg-gray-200 dark:bg-gray-800 midnight:bg-white/[0.03]" : "text-gray-500 dark:text-gray-400 midnight:text-gray-400"}`}>
          <LayoutTemplate className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-medium">Landing</span>
        </button>
        {isSuperRep && (
          <button onClick={() => setActiveTab("reps")} className={`flex flex-col items-center p-2 rounded-xl transition-all duration-200 ${activeTab === "reps" ? "text-black dark:text-white midnight:text-white bg-gray-200 dark:bg-gray-800 midnight:bg-white/[0.03]" : "text-gray-500 dark:text-gray-400 midnight:text-gray-400"}`}>
            <Users className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium">Reps</span>
          </button>
        )}
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block z-40">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          roles={roles}
          activeClubId={activeClubId}
          setActiveClubId={setActiveClubId}
          handleLogout={handleLogout}
          isSuperRep={isSuperRep}
        />
      </div>
      
      <main className="flex-1 w-full min-h-screen md:pl-[18rem] pb-24 md:pb-6 overflow-y-auto overflow-x-hidden bg-gray-50 dark:bg-slate-900 midnight:bg-black">
        {/* Page Header Container */}
        <div className="bg-indigo-50/60 dark:bg-indigo-950/30 midnight:bg-white/[0.04] rounded-b-2xl shadow-sm px-6 py-6 sm:py-8 border-b border-indigo-100/50 dark:border-indigo-900/30 midnight:border-white/10 mb-8 max-w-7xl mx-auto w-full transition-all duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-indigo-950 dark:text-indigo-100 midnight:text-white font-[family-name:var(--font-outfit)]">
                {activeTab === "feed" && "Feed Manager"}
                {activeTab === "details" && "Club Details"}
                {activeTab === "landing" && "Landing Page Builder"}
                {activeTab === "reps" && "Manage Representatives"}
              </h2>
              <p className="mt-2 text-sm font-medium text-indigo-700/80 dark:text-indigo-300/80 midnight:text-gray-400 max-w-xl">
                {activeTab === "feed" && "Post updates, events, and galleries to your community feed."}
                {activeTab === "details" && "Manage public information displayed on AmazeCC."}
                {activeTab === "landing" && "Customize your club's showcase landing page."}
                {activeTab === "reps" && "Add or remove club representatives."}
              </p>
            </div>
            
            {/* Inline metrics / quick status */}
            <div className="hidden sm:flex items-center gap-3 bg-white/50 dark:bg-black/20 midnight:bg-black/40 px-4 py-2.5 rounded-xl border border-indigo-100/50 dark:border-indigo-500/10 midnight:border-white/5 shadow-sm backdrop-blur-sm">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 midnight:text-gray-400">Status</span>
                <span className="text-xs font-semibold text-gray-900 dark:text-gray-100 midnight:text-white flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full space-y-6">
          {activeTab === "feed" && activeClubId && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <FeedManager clubId={activeClubId} />
            </div>
          )}
          {activeTab === "details" && activeClubId && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ClubDetailsEditor clubId={activeClubId} />
            </div>
          )}
          {activeTab === "landing" && activeClubId && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <LandingPageBuilder clubId={activeClubId} />
            </div>
          )}
          {activeTab === "reps" && activeClubId && isSuperRep && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <RepManager clubId={activeClubId} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
