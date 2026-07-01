"use client";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { Trash2, UserPlus, Shield, User, Users, Loader2 } from "lucide-react";

export default function RepManager({ clubId }: { clubId: string }) {
  const [reps, setReps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newVtopId, setNewVtopId] = useState("");
  const [newRole, setNewRole] = useState("representative");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  const fetchReps = async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`/api/club-admin/reps?club_id=${encodeURIComponent(clubId)}`);
      const data = await res.json();
      if (data.success) {
        setReps(data.reps || []);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load reps");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReps();
  }, [clubId]);

  const handleAddRep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVtopId.trim()) return;

    setAdding(true);
    setError("");
    try {
      const res = await apiFetch('/api/club-admin/reps', {
        method: "POST",
        body: JSON.stringify({ vtop_id: newVtopId.trim(), role: newRole }),
      });
      const data = await res.json();
      if (data.success) {
        setNewVtopId("");
        setNewRole("representative");
        fetchReps();
      } else {
        setError(data.error || "Failed to add rep");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveRep = async (vtop_id: string) => {
    if (!confirm(`Are you sure you want to remove ${vtop_id}?`)) return;

    try {
      const res = await apiFetch(`/api/club-admin/reps?vtop_id=${encodeURIComponent(vtop_id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        fetchReps();
      } else {
        setError(data.error || "Failed to remove rep");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-24">
      {/* Add Representative Card */}
      <div className="bg-white dark:bg-gray-900 midnight:bg-[#0a0a0a] border border-gray-100 dark:border-gray-800 midnight:border-white/5 rounded-2xl p-6 sm:p-8 shadow-sm transition-all duration-200 hover:shadow-md relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <UserPlus className="w-32 h-32" />
        </div>

        <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 midnight:border-white/10 pb-4 mb-6 relative z-10">
          <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 midnight:bg-blue-500/10 flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white midnight:text-white font-[family-name:var(--font-outfit)]">
            Add Representative
          </h3>
        </div>

        <form onSubmit={handleAddRep} className="flex flex-col sm:flex-row gap-4 relative z-10">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 ml-1">VTOP Registration Number</label>
            <input
              type="text"
              placeholder="e.g. 21BCE0000"
              className="w-full bg-gray-50/50 dark:bg-black/50 midnight:bg-black border border-gray-200 dark:border-gray-800 midnight:border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-mono uppercase"
              value={newVtopId}
              onChange={(e) => setNewVtopId(e.target.value)}
            />
          </div>
          <div className="sm:w-48">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 ml-1">Access Level</label>
            <select
              className="w-full bg-gray-50/50 dark:bg-black/50 midnight:bg-black border border-gray-200 dark:border-gray-800 midnight:border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
            >
              <option value="representative">Representative</option>
              <option value="super-club-rep">Super Rep</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={adding || !newVtopId.trim()}
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:translate-y-0 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 shadow-sm active:translate-y-0"
            >
              {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : "Grant Access"}
            </button>
          </div>
        </form>
        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 midnight:bg-red-500/10 border border-red-100 dark:border-red-900/50 midnight:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium relative z-10 animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-900 midnight:bg-[#0a0a0a] border border-gray-100 dark:border-gray-800 midnight:border-white/5 rounded-2xl shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
        <div className="p-5 sm:px-8 border-b border-gray-100 dark:border-gray-800 midnight:border-white/10 bg-gray-50/50 dark:bg-black/20 midnight:bg-white/[0.02] flex items-center justify-between">
          <h3 className="font-bold text-gray-900 dark:text-white midnight:text-white font-[family-name:var(--font-outfit)] flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-500" /> Current Representatives
          </h3>
          <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-bold">
            {reps.length} Total
          </span>
        </div>
        
        {loading ? (
          <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600/50" /></div>
        ) : reps.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800/50 midnight:bg-white/[0.02] rounded-full flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">No representatives found.</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Add someone above to grant them access to this club.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800 midnight:divide-white/5">
            {reps.map((rep) => (
              <div key={rep.id} className="p-5 sm:px-8 flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-gray-800/30 midnight:hover:bg-white/[0.02] transition-colors group">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${rep.role === 'super-club-rep' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'}`}>
                    {rep.role === 'super-club-rep' ? <Shield className="w-6 h-6" /> : <User className="w-6 h-6" />}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-gray-100 midnight:text-white text-lg font-mono">
                      {rep.vtop_id}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-1">
                      {rep.role === 'super-club-rep' ? (
                        <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-500 font-bold uppercase tracking-wider text-[10px] bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800/50">
                          Super Representative
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider text-[10px] bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800/50">
                          Representative
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => handleRemoveRep(rep.vtop_id)}
                  className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 midnight:hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                  title="Remove Representative"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
