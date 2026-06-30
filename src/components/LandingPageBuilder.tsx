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
      const res = await apiFetch(`/api/club-admin/landing-page?club_id=${clubId}`);
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
    <form onSubmit={handleSave} className="space-y-8">
      {/* Theme Settings */}
      <section className="space-y-4">
        <h3 className="font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2 flex items-center gap-2">
          <Palette className="w-5 h-5 text-blue-500" /> Theme Identity
        </h3>
        <div className="flex items-center gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Primary Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={themeColor}
                onChange={e => setThemeColor(e.target.value)}
                className="w-10 h-10 rounded cursor-pointer border-0 p-0"
              />
              <input
                type="text"
                value={themeColor}
                onChange={e => setThemeColor(e.target.value)}
                className="px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm w-24 uppercase"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preferred Mode</label>
            <select
              value={themeMode}
              onChange={e => setThemeMode(e.target.value)}
              className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
            >
              <option value="light">Light Mode</option>
              <option value="dark">Dark Mode</option>
              <option value="system">System Default</option>
            </select>
          </div>
        </div>
      </section>

      {/* Showcase Projects */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
          <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-purple-500" /> Showcase Projects
          </h3>
          <button type="button" onClick={addProject} className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> Add Project
          </button>
        </div>
        
        {showcaseProjects.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No projects added yet.</p>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {showcaseProjects.map((proj, idx) => (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} key={idx} className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-700 relative group transition-colors hover:border-gray-300 dark:hover:border-gray-600">
                  <button type="button" onClick={() => removeProject(idx)} className="absolute top-3 right-3 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                    <input type="text" placeholder="Project Title" value={proj.title} onChange={e => updateProject(idx, "title", e.target.value)} className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm w-full focus:outline-none focus:border-blue-500 transition-colors" />
                    <input type="url" placeholder="Project Link (e.g. GitHub)" value={proj.link} onChange={e => updateProject(idx, "link", e.target.value)} className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm w-full focus:outline-none focus:border-blue-500 transition-colors" />
                    <input type="url" placeholder="Image URL (Optional)" value={proj.image_url} onChange={e => updateProject(idx, "image_url", e.target.value)} className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm w-full sm:col-span-2 focus:outline-none focus:border-blue-500 transition-colors" />
                    <textarea placeholder="Short Description" value={proj.description} onChange={e => updateProject(idx, "description", e.target.value)} className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm w-full sm:col-span-2 h-20 resize-none focus:outline-none focus:border-blue-500 transition-colors" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* Popular Events */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
          <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-pink-500" /> Popular Events
          </h3>
          <button type="button" onClick={addEvent} className="text-xs font-semibold text-pink-600 hover:text-pink-700 bg-pink-50 dark:bg-pink-900/20 hover:bg-pink-100 dark:hover:bg-pink-900/40 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> Add Event
          </button>
        </div>
        
        {popularEvents.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No events added yet.</p>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {popularEvents.map((ev, idx) => (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} key={idx} className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-700 relative group transition-colors hover:border-gray-300 dark:hover:border-gray-600">
                  <button type="button" onClick={() => removeEvent(idx)} className="absolute top-3 right-3 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                    <input type="text" placeholder="Event Name (e.g. Hackathon 2024)" value={ev.name} onChange={e => updateEvent(idx, "name", e.target.value)} className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm w-full focus:outline-none focus:border-blue-500 transition-colors" />
                    <input type="text" placeholder="Year / Term" value={ev.year} onChange={e => updateEvent(idx, "year", e.target.value)} className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm w-full focus:outline-none focus:border-blue-500 transition-colors" />
                    <textarea placeholder="Event Highlight Description" value={ev.description} onChange={e => updateEvent(idx, "description", e.target.value)} className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm w-full sm:col-span-2 h-20 resize-none focus:outline-none focus:border-blue-500 transition-colors" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-all active:scale-[0.98] disabled:opacity-70"
        >
          <Save className="w-5 h-5" />
          {isSaving ? "Saving..." : "Save Config"}
        </button>
      </div>
    </form>
  );
}
