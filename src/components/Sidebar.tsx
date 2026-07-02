import { Button, Select, View, Text, Image } from "@amazecontinuityprojects/amazeui";
import { Home, Layers, Settings, MessageSquare, LogOut, Info, Users, LayoutTemplate } from "lucide-react";
import { motion } from "framer-motion";
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

export default function Sidebar({ activeTab, setActiveTab, roles, activeClubId, setActiveClubId, handleLogout, isSuperRep }: SidebarProps) {
  const tabs = [
    { id: "feed", label: "Feed Manager", icon: MessageSquare },
    { id: "details", label: "Club Details", icon: Info },
    { id: "landing", label: "Landing Page", icon: LayoutTemplate },
  ];

  if (isSuperRep) tabs.push({ id: "reps", label: "Manage Reps", icon: Users });

  return (
    <View className="fixed left-4 top-4 z-40 hidden h-[calc(100vh-2rem)] w-64 flex-col overflow-visible rounded-[24px] border border-border bg-card/80 shadow-lg dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300 md:flex">
      <View className="flex flex-col border-b border-border shrink-0 px-4 pb-4 pt-5">
        <View className="flex flex-row items-center justify-between w-full">
          <View className="flex flex-row items-center gap-2.5 min-w-0">
            <Image src="/logo.png" alt="AmazeCC Logo" className="h-7 w-7 rounded-lg shadow-sm" />
            <Text className="truncate text-sm font-semibold tracking-tight text-foreground">Club Hub</Text>
          </View>
          <ThemeSwitcher />
        </View>
      </View>

      <View className="px-4 py-2">
        {roles.length > 1 ? (
          <Select value={activeClubId || ""} onChange={(v) => setActiveClubId(v)} options={roles.map(r => ({ value: r.club_id, label: r.club_id }))} />
        ) : (
          <View className="w-full bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl px-3 py-2">
            <Text className="text-sm font-semibold text-blue-800 dark:text-blue-300 text-center uppercase tracking-wider">{activeClubId}</Text>
          </View>
        )}
      </View>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <Button key={tab.id} onClick={() => setActiveTab(tab.id)} variant="ghost" className={`relative w-full flex flex-row items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 justify-start ${isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}>
              <Icon className={`w-5 h-5 z-10 ${isActive ? "text-foreground" : "opacity-70"}`} />
              <Text className="z-10">{tab.label}</Text>
              {isActive && (
                <motion.div layoutId="sidebar-active" className="absolute inset-0 bg-muted rounded-xl" initial={false} transition={{ type: "spring", stiffness: 300, damping: 30 }} />
              )}
            </Button>
          );
        })}
      </nav>

      <View className="p-4 border-t border-border">
        <Button onClick={handleLogout} variant="ghost" className="w-full flex flex-row items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-danger hover:bg-danger-surface justify-start">
          <LogOut className="w-5 h-5 opacity-80" />
          Logout
        </Button>
      </View>
    </View>
  );
}
