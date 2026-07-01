"use client";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { Save, Loader2, Link as LinkIcon, Camera, Phone, Target, FileText, User, Mail } from "lucide-react";

export default function ClubDetailsEditor({ clubId }: { clubId: string }) {
  const [details, setDetails] = useState({
    mission: "",
    description: "",
    hiring_process: "",
    website: "",
    recruitment_link: "",
    instagram: "",
    whatsapp: "",
    poc: "",
    email: "",
    poc_phone: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
      const res = await apiFetch(`/api/club-admin/details?club_id=${encodeURIComponent(clubId)}`);
      const data = await res.json();
      if (data.success && data.details) {
          setDetails({
            mission: data.details.mission || "",
            description: data.details.description || "",
            hiring_process: data.details.hiring_process || "",
            website: data.details.website || "",
            recruitment_link: data.details.recruitment_link || "",
            instagram: data.details.instagram || "",
            whatsapp: data.details.whatsapp || "",
            poc: data.details.poc || "",
            email: data.details.email || "",
            poc_phone: data.details.poc_phone || ""
          });
        }
      } catch (err) {
        console.error("Failed to load details");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [clubId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const res = await apiFetch('/api/club-admin/details', {
        method: 'POST',
        body: JSON.stringify(details)
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: "Details saved successfully!" });
      } else {
        setMessage({ type: "error", text: data.error || "Failed to save details." });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "An error occurred." });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 5000);
    }
  };

  if (loading) {
    return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Core Info & Recruitment */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information Card */}
          <div className="bg-white dark:bg-gray-900 midnight:bg-[#0a0a0a] border border-gray-100 dark:border-gray-800 midnight:border-white/5 rounded-2xl p-6 shadow-sm transition-all duration-200 hover:shadow-md">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 midnight:text-white mb-6 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 midnight:bg-blue-500/10 flex items-center justify-center">
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-blue-400" />
              </div>
              Basic Information
            </h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-gray-400 mb-1.5 flex items-center gap-2">
                  <Target className="w-4 h-4 text-gray-400" /> Mission Statement
                </label>
                <input
                  type="text"
                  name="mission"
                  value={details.mission}
                  onChange={handleChange}
                  placeholder="A short, impactful mission statement"
                  className="w-full bg-gray-50/50 dark:bg-black/50 midnight:bg-black border border-gray-200 dark:border-gray-800 midnight:border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none transition-all duration-150 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-gray-400 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" /> Description
                  </span>
                  <span className="text-xs font-normal text-gray-400 bg-gray-100 dark:bg-gray-800 midnight:bg-white/5 px-2 py-0.5 rounded-full">Markdown</span>
                </label>
                <textarea
                  name="description"
                  value={details.description}
                  onChange={handleChange}
                  placeholder="Tell us about your club..."
                  className="w-full bg-gray-50/50 dark:bg-black/50 midnight:bg-black border border-gray-200 dark:border-gray-800 midnight:border-white/10 rounded-xl px-4 py-3 text-sm outline-none transition-all duration-150 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 min-h-[160px]"
                />
              </div>
            </div>
          </div>

          {/* Recruitment Card */}
          <div className="bg-white dark:bg-gray-900 midnight:bg-[#0a0a0a] border border-gray-100 dark:border-gray-800 midnight:border-white/5 rounded-2xl p-6 shadow-sm transition-all duration-200 hover:shadow-md">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 midnight:text-white mb-6 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/20 midnight:bg-emerald-500/10 flex items-center justify-center">
                <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400 midnight:text-emerald-400" />
              </div>
              Recruitment
            </h3>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-gray-400 mb-1.5 flex items-center justify-between">
                  <span>Hiring Process</span>
                  <span className="text-xs font-normal text-gray-400 bg-gray-100 dark:bg-gray-800 midnight:bg-white/5 px-2 py-0.5 rounded-full">Markdown</span>
                </label>
                <textarea
                  name="hiring_process"
                  value={details.hiring_process}
                  onChange={handleChange}
                  placeholder="Describe how members can join..."
                  className="w-full bg-gray-50/50 dark:bg-black/50 midnight:bg-black border border-gray-200 dark:border-gray-800 midnight:border-white/10 rounded-xl px-4 py-3 text-sm outline-none transition-all duration-150 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 min-h-[120px]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-gray-400 mb-1.5 flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-gray-400" /> Application Form Link
                </label>
                <input
                  type="url"
                  name="recruitment_link"
                  value={details.recruitment_link}
                  onChange={handleChange}
                  placeholder="Google Form, Typeform, etc."
                  className="w-full bg-gray-50/50 dark:bg-black/50 midnight:bg-black border border-gray-200 dark:border-gray-800 midnight:border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none transition-all duration-150 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact & Socials */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 midnight:bg-[#0a0a0a] border border-gray-100 dark:border-gray-800 midnight:border-white/5 rounded-2xl p-6 shadow-sm transition-all duration-200 hover:shadow-md">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 midnight:text-white mb-6 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-900/20 midnight:bg-purple-500/10 flex items-center justify-center">
                <LinkIcon className="w-4 h-4 text-purple-600 dark:text-purple-400 midnight:text-purple-400" />
              </div>
              Social & Contact
            </h3>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-gray-400 mb-1.5 flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-gray-400" /> Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={details.website}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full bg-gray-50/50 dark:bg-black/50 midnight:bg-black border border-gray-200 dark:border-gray-800 midnight:border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none transition-all duration-150 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-gray-400 mb-1.5 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-gray-400" /> Instagram
                </label>
                <input
                  type="text"
                  name="instagram"
                  value={details.instagram}
                  onChange={handleChange}
                  placeholder="@vitcc_club"
                  className="w-full bg-gray-50/50 dark:bg-black/50 midnight:bg-black border border-gray-200 dark:border-gray-800 midnight:border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none transition-all duration-150 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-gray-400 mb-1.5 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" /> WhatsApp Group
                </label>
                <input
                  type="url"
                  name="whatsapp"
                  value={details.whatsapp}
                  onChange={handleChange}
                  placeholder="https://chat.whatsapp.com/..."
                  className="w-full bg-gray-50/50 dark:bg-black/50 midnight:bg-black border border-gray-200 dark:border-gray-800 midnight:border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none transition-all duration-150 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
              
              <div className="pt-2 border-t border-gray-100 dark:border-gray-800 midnight:border-white/5"></div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-gray-400 mb-1.5 flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" /> Point of Contact
                </label>
                <input
                  type="text"
                  name="poc"
                  value={details.poc}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full bg-gray-50/50 dark:bg-black/50 midnight:bg-black border border-gray-200 dark:border-gray-800 midnight:border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none transition-all duration-150 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-gray-400 mb-1.5 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" /> Contact Number
                </label>
                <input
                  type="tel"
                  name="poc_phone"
                  value={details.poc_phone}
                  onChange={handleChange}
                  placeholder="+91..."
                  className="w-full bg-gray-50/50 dark:bg-black/50 midnight:bg-black border border-gray-200 dark:border-gray-800 midnight:border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none transition-all duration-150 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-gray-400 mb-1.5 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" /> Club Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={details.email}
                  onChange={handleChange}
                  placeholder="club@vit.ac.in"
                  className="w-full bg-gray-50/50 dark:bg-black/50 midnight:bg-black border border-gray-200 dark:border-gray-800 midnight:border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none transition-all duration-150 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-8 z-40 bg-white/90 dark:bg-gray-900/90 midnight:bg-[#111]/90 backdrop-blur-md border border-gray-200 dark:border-gray-700 midnight:border-white/10 p-3 rounded-2xl shadow-xl shadow-indigo-500/10 flex items-center gap-4 transition-all animate-in fade-in slide-in-from-bottom-4">
        {message.text && (
          <span className={`text-sm font-medium px-2 ${message.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
            {message.text}
          </span>
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0 text-white font-medium rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all duration-150"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>
    </div>
  );
}
