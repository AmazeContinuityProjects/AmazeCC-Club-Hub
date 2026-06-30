"use client";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { Save, Loader2, Link as LinkIcon, Camera, Phone, Target, FileText, User } from "lucide-react";

export default function ClubDetailsEditor({ clubId }: { clubId: string }) {
  const [details, setDetails] = useState({
    mission: "",
    description: "",
    hiring_process: "",
    website: "",
    recruitment_link: "",
    instagram: "",
    whatsapp: "",
    poc: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
      const res = await apiFetch(`/api/club-admin/details?club_id=${clubId}`);
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
            poc: data.details.poc || ""
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
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm max-w-4xl">
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-2"><FileText className="w-4 h-4" /> Description</span>
            <span className="text-xs font-normal text-gray-400">Markdown supported</span>
          </label>
          <textarea
            name="description"
            value={details.description}
            onChange={handleChange}
            placeholder="Tell us about your club..."
            className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 min-h-[120px]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
            <Target className="w-4 h-4" /> Mission Statement
          </label>
          <input
            type="text"
            name="mission"
            value={details.mission}
            onChange={handleChange}
            placeholder="A short, impactful mission statement"
            className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <LinkIcon className="w-4 h-4" /> Website URL
            </label>
            <input
              type="url"
              name="website"
              value={details.website}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Camera className="w-4 h-4" /> Instagram Handle
            </label>
            <input
              type="text"
              name="instagram"
              value={details.instagram}
              onChange={handleChange}
              placeholder="e.g. @vitcc_club"
              className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Phone className="w-4 h-4" /> WhatsApp Group Link
            </label>
            <input
              type="url"
              name="whatsapp"
              value={details.whatsapp}
              onChange={handleChange}
              placeholder="https://chat.whatsapp.com/..."
              className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <User className="w-4 h-4" /> Point of Contact
            </label>
            <input
              type="text"
              name="poc"
              value={details.poc}
              onChange={handleChange}
              placeholder="Name & Number"
              className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center justify-between">
            <span>Hiring Process / Recruitment Info</span>
            <span className="text-xs font-normal text-gray-400">Markdown supported</span>
          </label>
          <textarea
            name="hiring_process"
            value={details.hiring_process}
            onChange={handleChange}
            placeholder="Describe how members can join..."
            className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 min-h-[100px]"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recruitment Form Link</label>
          <input
            type="url"
            name="recruitment_link"
            value={details.recruitment_link}
            onChange={handleChange}
            placeholder="Google Form, VTOP Link, etc."
            className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-800">
          <div>
            {message.text && (
              <span className={`text-sm font-medium ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {message.text}
              </span>
            )}
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-xl flex items-center justify-center gap-2 shadow-sm"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save Details
          </button>
        </div>
      </div>
    </div>
  );
}
