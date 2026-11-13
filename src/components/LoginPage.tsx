"use client";

import { View, Text, Image, Card, CardContent, Button } from "@/lib/ui";
import { AUTH_BASE } from "@/lib/api";
import { signInInteractive } from "@/lib/oauth2";
import { ShieldCheck, Link2, ArrowRight, RefreshCw } from "lucide-react";

/**
 * Sign-in entry for Club Hub. Auth is a full redirect to Amaze ID
 * (authorization code + PKCE) - this component renders only the entry card
 * and the "link your VTOP first" gate shown when the signed-in Amaze ID is
 * not a club representative yet.
 */
export default function LoginPage({
  vtopLinkRequired = false,
}: {
  vtopLinkRequired?: boolean;
}) {
  if (vtopLinkRequired) {
    return (
      <View className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
        <View className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_80%_80%_at_50%_-10%,#000_60%,transparent_100%)] pointer-events-none" />
        <Card className="max-w-sm w-full relative overflow-hidden" variant="glass">
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
                Club access is granted to VTOP-linked Amaze IDs only. Connect your VTOP account to your Amaze ID once -
                after that, club admin works instantly and revokes the moment you unlink.
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
              <Button variant="secondary" className="w-full text-xs" onClick={() => window.location.reload()}>
                <View className="flex-row items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5" />
                  <Text className="text-xs font-semibold">I&apos;ve linked it - check again</Text>
                </View>
              </Button>
            </View>
          </CardContent>
        </Card>
      </View>
    );
  }

  return (
    <View className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Ambient grid + glow */}
      <View className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_80%_80%_at_50%_-10%,#000_60%,transparent_100%)] pointer-events-none opacity-100" />
      <View className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <View className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <Card className="max-w-sm w-full relative overflow-hidden" variant="glass">
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
              <Text className="mt-1 text-sm text-muted-foreground">Sign in with your Amaze ID to manage your club</Text>
            </View>
          </View>

          <Button onClick={() => signInInteractive()} className="w-full">
            <View className="flex-row items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <Text className="font-semibold">Continue with Amaze ID</Text>
            </View>
          </Button>

          <Text className="text-[11px] text-muted-foreground/70 text-center leading-relaxed">
            One Amaze ID for every AmazeCC app.{" "}
            <a href={`${AUTH_BASE}/sign-up`} className="text-primary font-semibold hover:underline" target="_blank" rel="noreferrer">
              Create one
            </a>{" "}
            - club access needs a VTOP-linked Amaze ID.
          </Text>
        </CardContent>
      </Card>
    </View>
  );
}
