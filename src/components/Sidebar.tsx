import { Button, OptionPicker, View, Text, Image, Sidebar as ReusableSidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarItem, SidebarFooter } from "@amazecontinuityprojects/amazeui";
import { Home, Layers, Settings, MessageSquare, LogOut, Info, Users, LayoutTemplate } from "lucide-react";
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
    <ReusableSidebar>
      <SidebarHeader>
        <View className="flex flex-row items-center justify-between w-full">
          <View className="flex flex-row items-center gap-2.5 min-w-0">
            <Image src="/logo.png" alt="AmazeCC Logo" className="h-7 w-7 rounded-lg shadow-sm" />
            <Text className="truncate text-sm font-semibold tracking-tight text-foreground">Club Hub</Text>
          </View>
          <ThemeSwitcher />
        </View>
      </SidebarHeader>

      <View className="px-3 py-2">
        {roles.length > 1 ? (
          <OptionPicker value={activeClubId || ""} onChange={(v) => { setActiveClubId(v); window.location.reload(); }} options={roles.map(r => ({ value: r.club_id, label: r.club_id }))} />
        ) : (
          <View className="w-full bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-xl px-3 py-2">
            <Text className="text-sm font-semibold text-blue-800 dark:text-blue-300 text-center uppercase tracking-wider">{activeClubId}</Text>
          </View>
        )}
      </View>

      <SidebarContent>
        <SidebarGroup>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <SidebarItem key={tab.id} icon={<Icon className="w-5 h-5" />} label={tab.label} isActive={isActive} onClick={() => setActiveTab(tab.id)} />
            );
          })}
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <Button onClick={handleLogout} variant="ghost" className="w-full flex flex-row items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-danger hover:bg-danger-surface justify-start">
          <LogOut className="w-5 h-5 opacity-80" />
          Logout
        </Button>
      </SidebarFooter>
    </ReusableSidebar>
  );
}
