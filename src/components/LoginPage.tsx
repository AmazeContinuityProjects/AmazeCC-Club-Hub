"use client";
import { useState } from "react";
import { View, Text, Image, Card, CardContent, Input, Label, Button, LoadingSpinner, Alert } from "@/lib/ui";
import { apiFetch } from "@/lib/api";
import { ShieldCheck } from "lucide-react";

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
          // Deduplicate club roles by club_id, prioritizing super-club-rep
          const roleMap = new Map<string, any>();
          for (const r of (data.clubRoles || [])) {
            if (!r?.club_id) continue;
            const existing = roleMap.get(r.club_id);
            if (!existing || r.role === 'super-club-rep') {
              roleMap.set(r.club_id, r);
            }
          }
          const uniqueRoles = Array.from(roleMap.values());

          localStorage.setItem("club_token", data.clubToken);
          localStorage.setItem("club_roles", JSON.stringify(uniqueRoles));
          onLogin(data.clubToken, uniqueRoles);
        } else setError("You do not have club representative privileges.");
      } else setError(data.message || data.error || "Login failed");
    } catch (err: any) { setError(err.message || "An unexpected error occurred"); }
    finally { setLoading(false); }
  };

  return (
    <View className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Grid pattern background */}
      <View className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_80%_80%_at_50%_-10%,#000_60%,transparent_100%)] pointer-events-none opacity-100" />

      {/* Ambient glow orbs */}
      <View className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <View className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <Card className="max-w-sm w-full relative overflow-hidden" variant="glass">
        {/* Loading overlay */}
        {loading && (
          <View className="absolute inset-0 bg-background/80 backdrop-blur-md flex flex-col items-center justify-center z-50 gap-4 rounded-2xl">
            <LoadingSpinner size="lg" />
            <View className="text-center">
              <Text className="text-xs font-black uppercase tracking-widest text-foreground">VTOP Authentication</Text>
              <Text className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider animate-pulse mt-1">Establishing secure gateway...</Text>
            </View>
          </View>
        )}

        <CardContent className="p-8 space-y-8">
          {/* Logo + Title */}
          <View className="text-center space-y-4">
            <View className="flex justify-center">
              <View className="relative">
                <View className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl" />
                <Image src="/logo.png" alt="AmazeCC Logo" className="relative h-16 w-16 rounded-2xl object-contain shadow-lg" />
              </View>
            </View>
            <View>
              <Text className="text-2xl font-extrabold text-foreground tracking-tight">Club Hub</Text>
              <Text className="mt-1 text-sm text-muted-foreground">Sign in with your VTOP credentials</Text>
            </View>
          </View>

          {/* Error alert */}
          {error && (
            <Alert variant="error">
              <Text className="text-sm font-medium">{error}</Text>
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <View className="space-y-4">
              <View className="space-y-1.5">
                <Label className="font-mono text-xs uppercase tracking-wider text-muted-foreground">VTOP Username</Label>
                <Input
                  required
                  value={username}
                  onChange={(e: any) => setUsername(e.target.value.toUpperCase())}
                  className="uppercase"
                  placeholder="21BCE0000"
                />
              </View>
              <View className="space-y-1.5">
                <Label className="font-mono text-xs uppercase tracking-wider text-muted-foreground">VTOP Password</Label>
                <Input
                  required
                  type="password"
                  value={password}
                  onChange={(e: any) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </View>
            </View>

            <Button type="submit" disabled={loading} className="w-full">
              {/* Wrap icon+text in flex-row to fix RN-Web stacking */}
              <View className="flex-row items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <Text className="font-semibold">Authenticate via VTOP</Text>
              </View>
            </Button>
          </form>
        </CardContent>
      </Card>
    </View>
  );
}
