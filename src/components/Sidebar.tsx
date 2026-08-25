import { Button, OptionPicker, View, Text, Image, Sidebar as ReusableSidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarItem, SidebarFooter, ThemeSwitcher, Badge } from "@/lib/ui";
import { MessageSquare, LogOut, Info, Users, LayoutTemplate } from "lucide-react";

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
            <View className="relative shrink-0">
              <View className="absolute inset-0 bg-primary/30 rounded-xl blur-md" />
              <Image src="/logo.png" alt="AmazeCC Logo" className="relative h-7 w-7 rounded-xl shadow-sm" />
            </View>
            <Text className="truncate text-sm font-bold tracking-tight text-foreground">Club Hub</Text>
          </View>
          <ThemeSwitcher />
        </View>
      </SidebarHeader>

      {/* Club selector */}
      <View className="px-3 py-2">
        {roles.length > 1 ? (
          <OptionPicker
            value={activeClubId || ""}
            onChange={(v) => { setActiveClubId(v); window.location.reload(); }}
            options={roles.map(r => ({ value: r.club_id, label: r.club_id }))}
          />
        ) : (
          <View className="w-full rounded-xl px-3 py-2 bg-primary/8 border border-primary/15">
            <Text className="text-xs font-bold text-primary text-center uppercase tracking-widest">{activeClubId}</Text>
          </View>
        )}
      </View>

      <SidebarContent>
        <SidebarGroup>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <SidebarItem
                key={tab.id}
                icon={<Icon className="w-4 h-4" />}
                label={tab.label}
                isActive={isActive}
                onClick={() => setActiveTab(tab.id)}
                rightElement={tab.id === "reps" && isSuperRep ? (
                  <Badge variant="warning" size="sm">Admin</Badge>
                ) : undefined}
              />
            );
          })}
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {/* icon+text wrapped in flex-row View to fix RN-Web column stacking */}
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start px-3 py-2.5 rounded-xl text-sm font-medium text-danger hover:bg-danger/8 hover:text-danger"
        >
          <View className="flex-row items-center gap-3">
            <LogOut className="w-4 h-4 opacity-80" />
            <Text className="font-medium text-danger">Logout</Text>
          </View>
        </Button>
      </SidebarFooter>
    </ReusableSidebar>
  );
}
