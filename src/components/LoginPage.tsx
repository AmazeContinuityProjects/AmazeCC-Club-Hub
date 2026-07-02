"use client";
import { useState } from "react";
import { Card, CardContent, Input, Label, Button } from "@amazecontinuityprojects/amazeui";
import { apiFetch } from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function LoginPage({ onLogin }: { onLogin: (token: string, roles: any[]) => void }) {
  const [username, setUsername] = useState(process.env.NEXT_PUBLIC_VTOP_USERNAME || "");
  const [password, setPassword] = useState(process.env.NEXT_PUBLIC_VTOP_PASSWORD || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await apiFetch("/api/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        if (data.clubToken) {
          localStorage.setItem("club_token", data.clubToken);
          localStorage.setItem("club_roles", JSON.stringify(data.clubRoles));
          onLogin(data.clubToken, data.clubRoles);
        } else setError("You do not have club representative privileges.");
      } else setError(data.message || data.error || "Login failed");
    } catch (err: any) { setError(err.message || "An unexpected error occurred"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f080_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f080_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

      <Card className="max-w-md w-full p-8 space-y-8 relative overflow-hidden">
        {loading && (
          <div className="absolute inset-0 bg-background/90 backdrop-blur-md flex flex-col items-center justify-center z-25 space-y-4">
            <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-xs font-black uppercase tracking-widest text-foreground">VTOP Authentication</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider animate-pulse">Establishing secure gateway...</p>
            </div>
          </div>
        )}

        <div className="text-center">
          <div className="flex justify-center mb-6">
            <img src="/logo.png" alt="AmazeCC Logo" className="h-14 w-14 rounded-xl object-contain shadow-md" />
          </div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Club Hub</h1>
          <p className="mt-2 text-sm font-medium text-muted-foreground">Sign in with your verified VTOP credentials</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-danger-surface text-danger text-sm font-medium border border-danger/30">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label className="font-mono mb-1.5">VTOP_USERNAME</Label>
              <Input required value={username} onChange={(e: any) =>  setUsername(e.target.value.toUpperCase())} className="uppercase placeholder:text-muted-foreground" placeholder="21BCE0000" />
            </div>
            <div>
              <Label className="font-mono mb-1.5">VTOP_PASSWORD</Label>
              <Input required type="password" value={password} onChange={(e: any) =>  setPassword(e.target.value)} placeholder="••••••••" />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full py-3.5">
            Authenticate via VTOP
          </Button>
        </form>
      </Card>
    </div>
  );
}

