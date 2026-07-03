"use client";
import { useState } from "react";
import { Card, CardContent, Input, Label, Button, View, Text, Image } from "@amazecontinuityprojects/amazeui";
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
    <View className="min-h-screen flex items-center justify-center bg-background p-4 relative">
      <View className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.5_0.01_260)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.5_0.01_260)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-[0.03]" />

      <Card className="max-w-md w-full p-8 space-y-8 relative overflow-hidden">
        {loading && (
          <View className="absolute inset-0 bg-background/90 backdrop-blur-md flex flex-col items-center justify-center z-50 space-y-4">
            <View className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary">
              <Loader2 className="w-8 h-8 animate-spin" />
            </View>
            <View className="text-center space-y-1">
              <Text className="text-xs font-black uppercase tracking-widest text-foreground">VTOP Authentication</Text>
              <Text className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider animate-pulse">Establishing secure gateway...</Text>
            </View>
          </View>
        )}

        <View className="text-center">
          <View className="flex justify-center mb-6">
            <Image src="/logo.png" alt="AmazeCC Logo" className="h-14 w-14 rounded-xl object-contain shadow-md" />
          </View>
          <Text className="text-3xl font-extrabold text-foreground tracking-tight">Club Hub</Text>
          <Text className="mt-2 text-sm font-medium text-muted-foreground">Sign in with your verified VTOP credentials</Text>
        </View>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <View className="p-4 rounded-xl bg-danger-surface text-danger text-sm font-medium border border-danger/30">
              {error}
            </View>
          )}

          <View className="space-y-4">
            <View>
              <Label className="font-mono mb-1.5">VTOP_USERNAME</Label>
              <Input required value={username} onChange={(e: any) => setUsername(e.target.value.toUpperCase())} className="uppercase placeholder:text-muted-foreground" placeholder="21BCE0000" />
            </View>
            <View>
              <Label className="font-mono mb-1.5">VTOP_PASSWORD</Label>
              <Input required type="password" value={password} onChange={(e: any) => setPassword(e.target.value)} placeholder="••••••••" />
            </View>
          </View>

          <Button type="submit" disabled={loading} className="w-full py-3.5">
            Authenticate via VTOP
          </Button>
        </form>
      </Card>
    </View>
  );
}
