import { Home, Layers, Settings, MessageSquare, LogOut, Info, Users, LayoutTemplate } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

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
    <aside className="fixed left-4 top-4 z-40 hidden h-[calc(100vh-2rem)] w-64 flex-col overflow-visible rounded-[24px] border border-gray-200 dark:border-gray-800 midnight:border-gray-800/80 bg-gray-100 dark:bg-gray-900 midnight:bg-gray-900/80 shadow-lg dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] midnight:shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300 md:flex">
      <div className="flex flex-col border-b border-gray-200 dark:border-gray-800 midnight:border-white/10/50 shrink-0 px-4 pb-4 pt-5">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2.5 min-w-0">
            <img src="/logo.png" alt="AmazeCC Logo" className="h-7 w-7 rounded-lg object-contain shadow-sm" />
            <h1 className="truncate text-sm font-semibold tracking-tight text-gray-900 dark:text-white midnight:text-white">
              Club Hub
            </h1>
          </div>
          <ThemeSwitcher />
        </div>
      </div>

      <div className="px-4 py-2">
        {roles.length > 1 ? (
          <select 
            value={activeClubId || ""}
            onChange={(e) => setActiveClubId(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-900 midnight:bg-black border border-gray-200 dark:border-gray-800 midnight:border-white/10 rounded-xl px-3 py-2 text-sm font-semibold focus:ring-2 focus:ring-blue-500/20"
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
              className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${ isActive ? "bg-gray-200 dark:bg-gray-800 midnight:bg-white/[0.03] text-black dark:text-white midnight:text-white" : "text-gray-600 dark:text-gray-400 midnight:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900/50 midnight:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-200" }`}
            >
              <Icon className={`w-5 h-5 z-10 ${isActive ? "text-black dark:text-white midnight:text-white" : "opacity-70"}`} />
              <span className="z-10">{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-gray-200 dark:bg-gray-800 midnight:bg-white/[0.03] rounded-xl"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100 dark:border-gray-800 midnight:border-white/10/50">
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
