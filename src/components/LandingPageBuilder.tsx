"use client";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, Input, Textarea, Label, Button, Select, View, Text } from "@amazecontinuityprojects/amazeui";
import { apiFetch } from "@/lib/api";
import { Plus, Trash2, Save, Layout, Calendar, Star, Palette } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LandingPageBuilder({ clubId }: { clubId: string }) {
  const [themeColor, setThemeColor] = useState("#3B82F6");
  const [themeMode, setThemeMode] = useState("light");
  const [showcaseProjects, setShowcaseProjects] = useState<any[]>([]);
  const [popularEvents, setPopularEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { if (clubId) fetchLandingPage(); }, [clubId]);

  const fetchLandingPage = async () => {
    try {
      const res = await apiFetch(`/api/club-admin/landing-page?club_id=${encodeURIComponent(clubId)}`);
      const data = await res.json();
      if (data.success && data.landingPage) {
        const lp = data.landingPage;
        if (lp.theme) { setThemeColor(lp.theme.primary_color || "#3B82F6"); setThemeMode(lp.theme.mode || "light"); }
        setShowcaseProjects(lp.showcase_projects || []);
        setPopularEvents(lp.popular_events || []);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await apiFetch("/api/club-admin/landing-page", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme: { primary_color: themeColor, mode: themeMode },
          showcase_projects: showcaseProjects, popular_events: popularEvents
        })
      });
      const data = await res.json();
      if (data.success) alert("Landing page settings saved successfully!");
      else alert(data.error || "Failed to save");
    } catch (err) { alert("Error saving settings"); }
    finally { setIsSaving(false); }
  };

  const addProject = () => setShowcaseProjects([...showcaseProjects, { title: "", description: "", link: "", image_url: "" }]);
  const updateProject = (index: number, field: string, value: string) => {
    const updated = [...showcaseProjects]; updated[index][field] = value; setShowcaseProjects(updated);
  };
  const removeProject = (index: number) => setShowcaseProjects(showcaseProjects.filter((_, i) => i !== index));
  const addEvent = () => setPopularEvents([...popularEvents, { name: "", year: "", description: "" }]);
  const updateEvent = (index: number, field: string, value: string) => {
    const updated = [...popularEvents]; updated[index][field] = value; setPopularEvents(updated);
  };
  const removeEvent = (index: number) => setPopularEvents(popularEvents.filter((_, i) => i !== index));

  if (loading) return <Text className="text-muted-foreground animate-pulse">Loading settings...</Text>;

  return (
    <View className="max-w-4xl mx-auto pb-24 space-y-8">
      <Card>
        <CardHeader>
          <View className="flex flex-row items-center gap-3">
            <Palette className="w-5 h-5 text-blue-600" />
            <CardTitle>Theme Identity</CardTitle>
          </View>
        </CardHeader>
        <CardContent>
          <View className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <View>
              <Label className="mb-2">Primary Color</Label>
              <View className="flex flex-row items-center gap-3">
                <View className="relative w-12 h-12 rounded-xl overflow-hidden shadow-inner border border-border">
                  <Input type="color" value={themeColor} onChange={(e: any) =>  setThemeColor(e.target.value)} className="absolute -inset-2 w-16 h-16 cursor-pointer p-0 border-none" />
                </View>
                <Input value={themeColor} onChange={(e: any) =>  setThemeColor(e.target.value)} className="w-32 uppercase font-mono" />
              </View>
            </View>
            <View>
              <Label className="mb-2">Preferred Mode</Label>
              <Select value={themeMode} onChange={setThemeMode} options={[
                { value: "light", label: "Light Mode" },
                { value: "dark", label: "Dark Mode" },
                { value: "system", label: "System Default" },
              ]} />
            </View>
          </View>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <View className="flex flex-row flex-wrap items-center justify-between gap-4 w-full">
            <View className="flex flex-row items-center gap-3">
              <Star className="w-5 h-5 text-purple-600" />
              <CardTitle>Showcase Projects</CardTitle>
            </View>
            <Button onClick={addProject} variant="ghost" className="text-purple-600 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40">
              <Plus className="w-4 h-4" /> Add Project
            </Button>
          </View>
        </CardHeader>
        <CardContent>
          {showcaseProjects.length === 0 ? (
            <View className="text-center py-10 bg-muted/30 rounded-2xl border border-dashed border-border">
              <Text className="text-muted-foreground font-medium">No projects added yet. Showcase your club's best work!</Text>
            </View>
          ) : (
            <View className="space-y-4">
              <AnimatePresence>
                {showcaseProjects.map((proj, idx) => (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} key={idx} className="p-5 bg-muted/30 rounded-2xl border border-border relative group transition-all hover:border-purple-200 dark:hover:border-purple-900/50">
                    <Button onClick={() => removeProject(idx)} variant="ghost" size="icon" className="absolute top-4 right-4 text-muted-foreground hover:text-danger hover:bg-danger-surface p-2 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <View className="grid grid-cols-1 sm:grid-cols-2 gap-4 pr-10">
                      <View>
                        <Label className="text-xs text-muted-foreground mb-1">Title</Label>
                        <Input placeholder="Project Title" value={proj.title} onChange={(e: any) =>  updateProject(idx, "title", e.target.value)} />
                      </View>
                      <View>
                        <Label className="text-xs text-muted-foreground mb-1">Link</Label>
                        <Input type="url" placeholder="Project Link (e.g. GitHub)" value={proj.link} onChange={(e: any) =>  updateProject(idx, "link", e.target.value)} />
                      </View>
                      <View className="sm:col-span-2">
                        <Label className="text-xs text-muted-foreground mb-1">Image URL</Label>
                        <Input type="url" placeholder="Image URL (Optional)" value={proj.image_url} onChange={(e: any) =>  updateProject(idx, "image_url", e.target.value)} />
                      </View>
                      <View className="sm:col-span-2">
                        <Label className="text-xs text-muted-foreground mb-1">Description</Label>
                        <Textarea placeholder="Short Description" value={proj.description} onChange={(e: any) =>  updateProject(idx, "description", e.target.value)} className="h-24 resize-none" />
                      </View>
                    </View>
                  </motion.div>
                ))}
              </AnimatePresence>
            </View>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <View className="flex flex-row flex-wrap items-center justify-between gap-4 w-full">
            <View className="flex flex-row items-center gap-3">
              <Calendar className="w-5 h-5 text-pink-600" />
              <CardTitle>Popular Events</CardTitle>
            </View>
            <Button onClick={addEvent} variant="ghost" className="text-pink-600 bg-pink-50 dark:bg-pink-900/20 hover:bg-pink-100 dark:hover:bg-pink-900/40">
              <Plus className="w-4 h-4" /> Add Event
            </Button>
          </View>
        </CardHeader>
        <CardContent>
          {popularEvents.length === 0 ? (
            <View className="text-center py-10 bg-muted/30 rounded-2xl border border-dashed border-border">
              <Text className="text-muted-foreground font-medium">No events added yet.</Text>
            </View>
          ) : (
            <View className="space-y-4">
              <AnimatePresence>
                {popularEvents.map((ev, idx) => (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} key={idx} className="p-5 bg-muted/30 rounded-2xl border border-border relative group transition-all hover:border-pink-200 dark:hover:border-pink-900/50">
                    <Button onClick={() => removeEvent(idx)} variant="ghost" size="icon" className="absolute top-4 right-4 text-muted-foreground hover:text-danger hover:bg-danger-surface p-2 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <View className="grid grid-cols-1 sm:grid-cols-2 gap-4 pr-10">
                      <View>
                        <Label className="text-xs text-muted-foreground mb-1">Event Name</Label>
                        <Input placeholder="e.g. Hackathon 2024" value={ev.name} onChange={(e: any) =>  updateEvent(idx, "name", e.target.value)} />
                      </View>
                      <View>
                        <Label className="text-xs text-muted-foreground mb-1">Year / Term</Label>
                        <Input placeholder="e.g. Fall 2024" value={ev.year} onChange={(e: any) =>  updateEvent(idx, "year", e.target.value)} />
                      </View>
                      <View className="sm:col-span-2">
                        <Label className="text-xs text-muted-foreground mb-1">Description</Label>
                        <Textarea placeholder="Event Highlight Description" value={ev.description} onChange={(e: any) =>  updateEvent(idx, "description", e.target.value)} className="h-24 resize-none" />
                      </View>
                    </View>
                  </motion.div>
                ))}
              </AnimatePresence>
            </View>
          )}
        </CardContent>
      </Card>

      <View className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-8 z-40 bg-card/90 backdrop-blur-md border border-border p-3 rounded-2xl shadow-xl flex flex-row items-center gap-4">
        <Button onClick={handleSave} disabled={isSaving} variant="default">
          {isSaving ? <Text className="w-5 h-5 border-2 border-border/30 border-t-foreground rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
          Save Configuration
        </Button>
      </View>
    </View>
  );
}

