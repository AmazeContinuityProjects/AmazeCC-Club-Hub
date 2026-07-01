"use client";
import { useState, useEffect } from "react";
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

  useEffect(() => {
    if (clubId) fetchLandingPage();
  }, [clubId]);

  const fetchLandingPage = async () => {
    try {
      const res = await apiFetch(`/api/club-admin/landing-page?club_id=${encodeURIComponent(clubId)}`);
      const data = await res.json();
      if (data.success && data.landingPage) {
        const lp = data.landingPage;
        if (lp.theme) {
          setThemeColor(lp.theme.primary_color || "#3B82F6");
          setThemeMode(lp.theme.mode || "light");
        }
        setShowcaseProjects(lp.showcase_projects || []);
        setPopularEvents(lp.popular_events || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await apiFetch("/api/club-admin/landing-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme: { primary_color: themeColor, mode: themeMode },
          showcase_projects: showcaseProjects,
          popular_events: popularEvents
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("Landing page settings saved successfully!");
      } else {
        alert(data.error || "Failed to save");
      }
    } catch (err) {
      alert("Error saving settings");
    } finally {
      setIsSaving(false);
    }
  };

  const addProject = () => {
    setShowcaseProjects([...showcaseProjects, { title: "", description: "", link: "", image_url: "" }]);
  };

  const updateProject = (index: number, field: string, value: string) => {
    const updated = [...showcaseProjects];
    updated[index][field] = value;
    setShowcaseProjects(updated);
  };

  const removeProject = (index: number) => {
    setShowcaseProjects(showcaseProjects.filter((_, i) => i !== index));
  };

  const addEvent = () => {
    setPopularEvents([...popularEvents, { name: "", year: "", description: "" }]);
  };

  const updateEvent = (index: number, field: string, value: string) => {
    const updated = [...popularEvents];
    updated[index][field] = value;
    setPopularEvents(updated);
  };

  const removeEvent = (index: number) => {
    setPopularEvents(popularEvents.filter((_, i) => i !== index));
  };

  if (loading) {
    return <div className="text-gray-500 animate-pulse">Loading settings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <form onSubmit={handleSave} className="space-y-8">
        {/* Theme Settings */}
        <section className="bg-white dark:bg-gray-900 midnight:bg-[#0a0a0a] border border-gray-100 dark:border-gray-800 midnight:border-white/5 rounded-2xl p-6 sm:p-8 shadow-sm transition-all duration-200 hover:shadow-md">
          <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 midnight:border-white/10 pb-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 midnight:bg-blue-500/10 flex items-center justify-center">
              <Palette className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white midnight:text-white font-[family-name:var(--font-outfit)]">
              Theme Identity
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-gray-400 mb-2">Primary Color</label>
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-inner border border-gray-200 dark:border-gray-700 midnight:border-white/10">
                  <input
                    type="color"
                    value={themeColor}
                    onChange={e => setThemeColor(e.target.value)}
                    className="absolute -inset-2 w-16 h-16 cursor-pointer"
                  />
                </div>
                <input
                  type="text"
                  value={themeColor}
                  onChange={e => setThemeColor(e.target.value)}
                  className="px-4 py-2.5 bg-gray-50/50 dark:bg-black/50 midnight:bg-black border border-gray-200 dark:border-gray-800 midnight:border-white/10 rounded-xl text-sm w-32 uppercase font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-gray-400 mb-2">Preferred Mode</label>
              <select
                value={themeMode}
                onChange={e => setThemeMode(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50/50 dark:bg-black/50 midnight:bg-black border border-gray-200 dark:border-gray-800 midnight:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              >
                <option value="light">Light Mode</option>
                <option value="dark">Dark Mode</option>
                <option value="system">System Default</option>
              </select>
            </div>
          </div>
        </section>

        {/* Showcase Projects */}
        <section className="bg-white dark:bg-gray-900 midnight:bg-[#0a0a0a] border border-gray-100 dark:border-gray-800 midnight:border-white/5 rounded-2xl p-6 sm:p-8 shadow-sm transition-all duration-200 hover:shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 midnight:border-white/10 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/20 midnight:bg-purple-500/10 flex items-center justify-center">
                <Star className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white midnight:text-white font-[family-name:var(--font-outfit)]">
                Showcase Projects
              </h3>
            </div>
            <button type="button" onClick={addProject} className="text-sm font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 bg-purple-50 dark:bg-purple-900/20 midnight:bg-purple-500/10 hover:bg-purple-100 dark:hover:bg-purple-900/40 px-4 py-2 rounded-xl transition-all hover:-translate-y-0.5 border border-purple-100 dark:border-purple-800/50 midnight:border-white/5 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Project
            </button>
          </div>
          
          {showcaseProjects.length === 0 ? (
            <div className="text-center py-10 bg-gray-50/50 dark:bg-gray-900/50 midnight:bg-white/[0.02] rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 midnight:border-white/10">
              <p className="text-gray-500 dark:text-gray-400 font-medium">No projects added yet. Showcase your club's best work!</p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {showcaseProjects.map((proj, idx) => (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} key={idx} className="p-5 bg-gray-50/50 dark:bg-black/30 midnight:bg-black/50 rounded-2xl border border-gray-100 dark:border-gray-800 midnight:border-white/5 relative group transition-all hover:border-purple-200 dark:hover:border-purple-900/50 hover:shadow-sm">
                    <button type="button" onClick={() => removeProject(idx)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pr-10">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Title</label>
                        <input type="text" placeholder="Project Title" value={proj.title} onChange={e => updateProject(idx, "title", e.target.value)} className="px-4 py-2.5 bg-white dark:bg-gray-900 midnight:bg-[#0a0a0a] border border-gray-200 dark:border-gray-700 midnight:border-white/10 rounded-xl text-sm w-full focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Link</label>
                        <input type="url" placeholder="Project Link (e.g. GitHub)" value={proj.link} onChange={e => updateProject(idx, "link", e.target.value)} className="px-4 py-2.5 bg-white dark:bg-gray-900 midnight:bg-[#0a0a0a] border border-gray-200 dark:border-gray-700 midnight:border-white/10 rounded-xl text-sm w-full focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Image URL</label>
                        <input type="url" placeholder="Image URL (Optional)" value={proj.image_url} onChange={e => updateProject(idx, "image_url", e.target.value)} className="px-4 py-2.5 bg-white dark:bg-gray-900 midnight:bg-[#0a0a0a] border border-gray-200 dark:border-gray-700 midnight:border-white/10 rounded-xl text-sm w-full focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Description</label>
                        <textarea placeholder="Short Description" value={proj.description} onChange={e => updateProject(idx, "description", e.target.value)} className="px-4 py-3 bg-white dark:bg-gray-900 midnight:bg-[#0a0a0a] border border-gray-200 dark:border-gray-700 midnight:border-white/10 rounded-xl text-sm w-full h-24 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>

        {/* Popular Events */}
        <section className="bg-white dark:bg-gray-900 midnight:bg-[#0a0a0a] border border-gray-100 dark:border-gray-800 midnight:border-white/5 rounded-2xl p-6 sm:p-8 shadow-sm transition-all duration-200 hover:shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 midnight:border-white/10 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-pink-50 dark:bg-pink-900/20 midnight:bg-pink-500/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white midnight:text-white font-[family-name:var(--font-outfit)]">
                Popular Events
              </h3>
            </div>
            <button type="button" onClick={addEvent} className="text-sm font-semibold text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300 bg-pink-50 dark:bg-pink-900/20 midnight:bg-pink-500/10 hover:bg-pink-100 dark:hover:bg-pink-900/40 px-4 py-2 rounded-xl transition-all hover:-translate-y-0.5 border border-pink-100 dark:border-pink-800/50 midnight:border-white/5 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Event
            </button>
          </div>
          
          {popularEvents.length === 0 ? (
            <div className="text-center py-10 bg-gray-50/50 dark:bg-gray-900/50 midnight:bg-white/[0.02] rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 midnight:border-white/10">
              <p className="text-gray-500 dark:text-gray-400 font-medium">No events added yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {popularEvents.map((ev, idx) => (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} key={idx} className="p-5 bg-gray-50/50 dark:bg-black/30 midnight:bg-black/50 rounded-2xl border border-gray-100 dark:border-gray-800 midnight:border-white/5 relative group transition-all hover:border-pink-200 dark:hover:border-pink-900/50 hover:shadow-sm">
                    <button type="button" onClick={() => removeEvent(idx)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pr-10">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Event Name</label>
                        <input type="text" placeholder="e.g. Hackathon 2024" value={ev.name} onChange={e => updateEvent(idx, "name", e.target.value)} className="px-4 py-2.5 bg-white dark:bg-gray-900 midnight:bg-[#0a0a0a] border border-gray-200 dark:border-gray-700 midnight:border-white/10 rounded-xl text-sm w-full focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Year / Term</label>
                        <input type="text" placeholder="e.g. Fall 2024" value={ev.year} onChange={e => updateEvent(idx, "year", e.target.value)} className="px-4 py-2.5 bg-white dark:bg-gray-900 midnight:bg-[#0a0a0a] border border-gray-200 dark:border-gray-700 midnight:border-white/10 rounded-xl text-sm w-full focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Description</label>
                        <textarea placeholder="Event Highlight Description" value={ev.description} onChange={e => updateEvent(idx, "description", e.target.value)} className="px-4 py-3 bg-white dark:bg-gray-900 midnight:bg-[#0a0a0a] border border-gray-200 dark:border-gray-700 midnight:border-white/10 rounded-xl text-sm w-full h-24 resize-none focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>

        {/* Floating Action Bar */}
        <div className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-8 z-40 bg-white/90 dark:bg-gray-900/90 midnight:bg-[#111]/90 backdrop-blur-md border border-gray-200 dark:border-gray-700 midnight:border-white/10 p-3 rounded-2xl shadow-xl shadow-indigo-500/10 flex items-center gap-4 transition-all animate-in fade-in slide-in-from-bottom-4">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0 text-white font-medium rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all duration-150"
          >
            {isSaving ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <Save className="w-5 h-5" />}
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
