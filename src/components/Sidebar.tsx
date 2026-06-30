import { Home, Layers, Settings, MessageSquare, LogOut, Info, Users, LayoutTemplate } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  roles: any[];
  activeClubId: string | null;
  setActiveClubId: (id: string) => void;
  handleLogout: () => void;
  isSuperRep?: boolean;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  roles,
  activeClubId,
  setActiveClubId,
  handleLogout,
  isSuperRep
}: SidebarProps) {
  const tabs = [
    { id: "feed", label: "Feed Manager", icon: MessageSquare },
    { id: "details", label: "Club Details", icon: Info },
    { id: "landing", label: "Landing Page", icon: LayoutTemplate },
  ];

  if (isSuperRep) {
    tabs.push({ id: "reps", label: "Manage Reps", icon: Users });
  }

  return (
    <aside className="w-64 bg-white dark:bg-black border-r border-gray-100 dark:border-gray-800/50 flex flex-col h-screen fixed md:sticky top-0 z-40 shadow-sm hidden md:flex">
      <div className="p-6 pb-2">
        <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
          <Layers className="w-6 h-6 text-blue-600" />
          Club Hub
        </h1>
      </div>

      <div className="px-4 py-2">
        {roles.length > 1 ? (
          <select 
            value={activeClubId || ""}
            onChange={(e) => setActiveClubId(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 text-sm font-semibold focus:ring-2 focus:ring-blue-500/20"
          >
            {roles.map(r => (
              <option key={r.club_id} value={r.club_id}>{r.club_id}</option>
            ))}
          </select>
        ) : (
          <div className="w-full bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl px-3 py-2 text-sm font-semibold text-blue-800 dark:text-blue-300 text-center uppercase tracking-wider">
            {activeClubId}
          </div>
        )}
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive 
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400" 
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900/50 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-blue-600 dark:text-blue-400" : "opacity-70"}`} />
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 w-1 h-8 bg-blue-600 dark:bg-blue-500 rounded-r-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100 dark:border-gray-800/50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/10 transition-colors"
        >
          <LogOut className="w-5 h-5 opacity-80" />
          Logout
        </button>
      </div>
    </aside>
  );
}
