"use client";

import { useState } from "react";
import { View, Text, Image, Card, CardContent, Input, Label, Button, LoadingSpinner, Alert } from "@/lib/ui";
import { AUTH_BASE, apiFetch } from "@/lib/api";
import { ShieldCheck, Link2, ArrowRight } from "lucide-react";

type LoginState = "form" | "needs-vtop-link";

export default function LoginPage({
  onLogin,
}: {
  onLogin: (token: string, roles: { club_id: string; role: string }[]) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [state, setState] = useState<LoginState>("form");

  const finishWithToken = async (token: string) => {
    // Resolve the caller's clubs from the shared store (source of truth).
    const res = await apiFetch("/api/club-admin/my-clubs", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 403) {
      const body = await res.json().catch(() => null);
      if (body?.error === "vtop_link_required") {
        setState("needs-vtop-link");
        localStorage.removeItem("club_token");
        return;
      }
      setError(body?.message || "Your account is not a club representative yet.");
      return;
    }
    if (!res.ok) {
      setError("Could not verify your club access. Try again.");
      return;
    }
    const { clubs } = await res.json();
    localStorage.setItem("club_token", token);
    localStorage.setItem("club_roles", JSON.stringify(clubs));
    onLogin(token, clubs);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${AUTH_BASE}/api/auth/sign-in/email`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok || !body?.token) {
        setError(body?.message || body?.code || "Invalid email or password.");
        return;
      }
      await finishWithToken(body.token);
    } catch {
      setError("Could not reach Amaze ID. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Ambient grid + glow */}
      <View className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_80%_80%_at_50%_-10%,#000_60%,transparent_100%)] pointer-events-none opacity-100" />
      <View className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <View className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <Card className="max-w-sm w-full relative overflow-hidden" variant="glass">
        {loading && (
          <View className="absolute inset-0 bg-background/80 backdrop-blur-md flex flex-col items-center justify-center z-50 gap-4 rounded-2xl">
            <LoadingSpinner size="lg" />
            <View className="text-center">
              <Text className="text-xs font-black uppercase tracking-widest text-foreground">Signing in to Amaze ID</Text>
              <Text className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider animate-pulse mt-1">Verifying your identity…</Text>
            </View>
          </View>
        )}

        {state === "needs-vtop-link" ? (
          <CardContent className="p-8 space-y-6 text-center">
            <View className="flex justify-center">
              <View className="relative">
                <View className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl" />
                <View className="relative h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Link2 className="w-7 h-7 text-primary" />
                </View>
              </View>
            </View>
            <View className="space-y-2">
              <Text className="text-xl font-extrabold text-foreground tracking-tight">Link your VTOP profile</Text>
              <Text className="text-sm text-muted-foreground leading-relaxed">
                Club access is granted to VTOP-linked Amaze IDs only. Connect your VTOP account to your Amaze ID once — after that, club admin works instantly and revokes the moment you unlink.
              </Text>
            </View>
            <View className="space-y-2">
              <Button
                className="w-full"
                onClick={() => window.open(`${AUTH_BASE}/account`, "_blank", "noopener,noreferrer")}
              >
                <View className="flex-row items-center gap-2">
                  <Text className="font-semibold">Open auth.amazecc.com/account</Text>
                  <ArrowRight className="w-4 h-4" />
                </View>
              </Button>
              <Button variant="ghost" className="w-full text-xs" onClick={() => setState("form")}>
                <Text className="text-xs font-semibold text-muted-foreground">Back to sign-in</Text>
              </Button>
            </View>
          </CardContent>
        ) : (
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
                <Text className="mt-1 text-sm text-muted-foreground">Sign in with your Amaze ID</Text>
              </View>
            </View>

            {error && (
              <Alert variant="error">
                <Text className="text-sm font-medium">{error}</Text>
              </Alert>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              <View className="space-y-4">
                <View className="space-y-1.5">
                  <Label className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Email</Label>
                  <Input
                    required
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    placeholder="you@vit.ac.in"
                  />
                </View>
                <View className="space-y-1.5">
                  <Label className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Password</Label>
                  <Input
                    required
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </View>
              </View>

              <Button type="submit" disabled={loading} className="w-full">
                <View className="flex-row items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <Text className="font-semibold">Continue with Amaze ID</Text>
                </View>
              </Button>
            </form>

            <Text className="text-[11px] text-muted-foreground/70 text-center leading-relaxed">
              No Amaze ID?{" "}
              <a href={`${AUTH_BASE}/sign-up`} className="text-primary font-semibold hover:underline" target="_blank" rel="noreferrer">
                Create one
              </a>{" "}
              — same account for every AmazeCC app.
            </Text>
          </CardContent>
        )}
      </Card>
    </View>
  );
}
