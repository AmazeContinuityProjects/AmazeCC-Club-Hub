"use client";

import * as React from "react";
import { Moon, Sun, Star } from "lucide-react";
import { useTheme } from "@amazecontinuityprojects/amazeui";
import { motion, AnimatePresence } from "framer-motion";
import { View, Text, Button } from "@amazecontinuityprojects/amazeui";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
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

  const toggleOpen = () => setIsOpen(!isOpen);

  const handleSelect = (newTheme: string) => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  const getIcon = () => {
    if (theme === "dark") return <Moon className="w-4 h-4 text-muted-foreground" />;
    if (theme === "midnight") return <Star className="w-4 h-4 text-purple-400" />;
    return <Sun className="w-4 h-4 text-amber-500" />;
  };

  return (
    <View className="relative">
      <Button onClick={toggleOpen} variant="ghost" size="icon" className="rounded-xl bg-card/60 backdrop-blur-xl border border-border hover:bg-muted transition-all shadow-sm" title="Change theme">
        {getIcon()}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-12 mt-1 w-36 rounded-2xl bg-popover/80 backdrop-blur-2xl border border-border shadow-xl overflow-hidden z-50 flex flex-col p-1"
          >
            <Button onClick={() => handleSelect("light")} variant="ghost" className={`flex flex-row items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors justify-start ${theme === 'light' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent/50'}`}>
              <Sun className="w-4 h-4" /> Light
            </Button>
            <Button onClick={() => handleSelect("dark")} variant="ghost" className={`flex flex-row items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors justify-start ${theme === 'dark' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent/50'}`}>
              <Moon className="w-4 h-4" /> Dark
            </Button>
            <Button onClick={() => handleSelect("midnight")} variant="ghost" className={`flex flex-row items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors justify-start ${theme === 'midnight' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent/50'}`}>
              <Star className="w-4 h-4" /> Midnight
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </View>
  );
}
