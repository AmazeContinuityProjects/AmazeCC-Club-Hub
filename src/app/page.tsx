"use client";
import { useState, useEffect } from "react";
import LoginPage from "@/components/LoginPage";
import FeedManager from "@/components/FeedManager";
import LandingPageBuilder from "@/components/LandingPageBuilder";
import Sidebar from "@/components/Sidebar";
import ClubDetailsEditor from "@/components/ClubDetailsEditor";
import RepManager from "@/components/RepManager";
import { getClubToken, apiFetch } from "@/lib/api";
import { Menu, X } from "lucide-react";

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [roles, setRoles] = useState<any[]>([]);
  const [activeClubId, setActiveClubId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("feed");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#03060F] text-gray-900 dark:text-gray-100 flex flex-col md:flex-row relative">
      
      {/* Background decoration from AmazeCC */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f080_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f080_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />
      
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50">
        <h1 className="text-lg font-bold">Club Hub</h1>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white dark:bg-black pt-16">
           <Sidebar 
            activeTab={activeTab} 
            setActiveTab={(t) => { setActiveTab(t); setMobileMenuOpen(false); }}
            roles={roles}
            activeClubId={activeClubId}
            setActiveClubId={setActiveClubId}
            handleLogout={handleLogout}
            isSuperRep={isSuperRep}
          />
        </div>
      )}

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
      
      <main className="flex-1 w-full min-h-screen pt-4 md:pl-[18rem] pb-6 overflow-y-auto overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full space-y-6">
          {activeTab === "feed" && activeClubId && (
            <div className="fade-in">
              <h2 className="text-2xl font-bold mb-2">Feed Manager</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8">Post updates, events, and galleries to your community feed.</p>
              <FeedManager clubId={activeClubId} />
            </div>
          )}
          {activeTab === "details" && activeClubId && (
            <div className="fade-in">
              <h2 className="text-2xl font-bold mb-2">Club Details</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8">Manage public information displayed on AmazeCC.</p>
              <ClubDetailsEditor clubId={activeClubId} />
            </div>
          )}
          {activeTab === "landing" && activeClubId && (
            <div className="fade-in">
              <h2 className="text-2xl font-bold mb-2">Landing Page Builder</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8">Customize your club's showcase landing page.</p>
              <LandingPageBuilder clubId={activeClubId} />
            </div>
          )}
          {activeTab === "reps" && activeClubId && isSuperRep && (
            <div className="fade-in">
              <h2 className="text-2xl font-bold mb-2">Manage Representatives</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8">Add or remove club representatives.</p>
              <RepManager clubId={activeClubId} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
