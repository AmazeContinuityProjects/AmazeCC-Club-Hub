"use client";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function LoginPage({ onLogin }: { onLogin: (token: string, roles: any[]) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Hit the AmazeCC-API login endpoint which issues clubToken
      const res = await apiFetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      
      if (data.success) {
        if (data.clubToken) {
          localStorage.setItem("club_token", data.clubToken);
          localStorage.setItem("club_roles", JSON.stringify(data.clubRoles));
          onLogin(data.clubToken, data.clubRoles);
        } else {
          setError("You do not have club representative privileges.");
        }
      } else {
        setError(data.message || data.error || "Login failed");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 relative">
      {/* Background decoration from AmazeCC */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f080_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f080_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />
      
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-[24px] shadow-2xl border border-gray-100 dark:border-gray-800 p-8 space-y-8 relative overflow-hidden backdrop-blur-3xl">
        {loading && (
          <div className="absolute inset-0 bg-white/80 dark:bg-[#050814]/90 backdrop-blur-md flex flex-col items-center justify-center z-25 space-y-4 animate-in fade-in duration-300">
            <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white font-[family-name:var(--font-outfit)]">VTOP Authentication</p>
              <p className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider animate-pulse">Establishing secure gateway...</p>
            </div>
          </div>
        )}

        <div className="text-center">
          <div className="flex justify-center mb-6">
            <img src="/logo.png" alt="AmazeCC Logo" className="h-14 w-14 rounded-xl object-contain shadow-md" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Club Hub</h1>
          <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">Sign in with your verified VTOP credentials</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium border border-red-100 dark:border-red-900/50">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Registration Number</label>
              <input 
                required 
                type="text" 
                value={username} 
                onChange={e => setUsername(e.target.value.toUpperCase())} 
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all uppercase placeholder-gray-400"
                placeholder="21BCE0000"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">VTOP Password</label>
              <input 
                required 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex justify-center items-center gap-2"
          >
            Authenticate via VTOP
          </button>
        </form>
      </div>
    </div>
  );
}
