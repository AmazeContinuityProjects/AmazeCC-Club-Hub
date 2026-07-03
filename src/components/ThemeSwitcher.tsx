"use client";
import * as React from "react";
import { Moon, Sun, Star } from "lucide-react";
import { useTheme, View, Text, Button, Pressable, ColorPalettePicker, useColorPalette } from "@amazecontinuityprojects/amazeui";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const { paletteId, setPaletteId } = useColorPalette();
  const [mounted, setMounted] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return (
      <View className="p-1.5 rounded-xl bg-card/60 backdrop-blur-md">
        <View className="w-5 h-5" />
      </View>
    );
  }

  const getIcon = () => {
    if (theme === "dark") return <Moon className="w-4 h-4 text-muted-foreground" />;
    if (theme === "midnight") return <Star className="w-4 h-4 text-purple-400" />;
    return <Sun className="w-4 h-4 text-amber-500" />;
  };

  return (
    <View className="relative">
      <Button onClick={() => setIsOpen(!isOpen)} variant="ghost" size="icon" className="rounded-xl bg-card/60 backdrop-blur-xl border border-border hover:bg-muted transition-all shadow-sm" title="Change theme">
        {getIcon()}
      </Button>

      {isOpen && (
        <>
          <Pressable className="fixed inset-0 z-40" onPress={() => setIsOpen(false)} />
          <View className="absolute right-0 top-12 mt-1 w-[260px] rounded-2xl bg-popover/80 backdrop-blur-2xl border border-border shadow-xl z-50 flex flex-col p-3">
            <Text className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2 px-1">Mode</Text>
            <View className="flex flex-row gap-1 mb-4">
              <Button onClick={() => setTheme("light")} variant="ghost" className={`flex flex-1 flex-row items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${theme === 'light' ? 'bg-accent text-accent-foreground shadow-sm' : 'text-muted-foreground hover:bg-accent/50'}`}>
                <Sun className="w-4 h-4" /> Light
              </Button>
              <Button onClick={() => setTheme("dark")} variant="ghost" className={`flex flex-1 flex-row items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${theme === 'dark' ? 'bg-accent text-accent-foreground shadow-sm' : 'text-muted-foreground hover:bg-accent/50'}`}>
                <Moon className="w-4 h-4" /> Dark
              </Button>
              <Button onClick={() => setTheme("midnight")} variant="ghost" className={`flex flex-1 flex-row items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${theme === 'midnight' ? 'bg-accent text-accent-foreground shadow-sm' : 'text-muted-foreground hover:bg-accent/50'}`}>
                <Star className="w-4 h-4" />
              </Button>
            </View>

            <Text className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2 px-1">Accent Color</Text>
            <ColorPalettePicker />
          </View>
        </>
      )}
    </View>
  );
}
