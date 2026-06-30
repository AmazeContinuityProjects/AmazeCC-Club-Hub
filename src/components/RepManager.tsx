"use client";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { Trash2, UserPlus, Shield, User, Loader2 } from "lucide-react";

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
      const res = await apiFetch(`/api/club-admin/reps?club_id=${clubId}`);
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
      const res = await apiFetch(`/api/club-admin/reps?vtop_id=${vtop_id}`, {
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
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-blue-600" />
          Add Representative
        </h3>
        <form onSubmit={handleAddRep} className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="VTOP Registration Number (e.g. 21BCE0000)"
            className="flex-1 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/50"
            value={newVtopId}
            onChange={(e) => setNewVtopId(e.target.value)}
          />
          <select
            className="bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/50"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
          >
            <option value="representative">Representative</option>
            <option value="super-club-rep">Super Rep</option>
          </select>
          <button
            type="submit"
            disabled={adding || !newVtopId.trim()}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-xl flex items-center justify-center gap-2"
          >
            {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : "Add"}
          </button>
        </form>
        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300">Current Representatives</h3>
        </div>
        
        {loading ? (
          <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>
        ) : reps.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No representatives found.</div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {reps.map((rep) => (
              <div key={rep.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{rep.vtop_id}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      {rep.role === 'super-club-rep' ? <Shield className="w-3 h-3 text-amber-500" /> : null}
                      <span className={rep.role === 'super-club-rep' ? 'text-amber-600 dark:text-amber-500 font-medium' : ''}>
                        {rep.role === 'super-club-rep' ? 'Super Representative' : 'Representative'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => handleRemoveRep(rep.vtop_id)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
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
