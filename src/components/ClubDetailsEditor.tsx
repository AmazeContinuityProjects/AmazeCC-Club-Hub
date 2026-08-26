"use client";
import { useState, useEffect } from "react";
import {
  Card, CardHeader, CardTitle, CardContent, Input, Textarea, Label, Fab,
  Button, View, Text, IconBadge, Alert, LoadingSpinner, SectionHeader, Badge, Image
} from "@/lib/ui";
import { apiFetch } from "@/lib/api";
import {
  Save, Loader2, Link as LinkIcon, Camera, Phone, Target, FileText,
  User, Mail, CheckCircle2, XCircle, ImageIcon, ExternalLink
} from "lucide-react";

const INITIAL_DETAILS = {
  mission: "",
  description: "",
  hiring_process: "",
  website: "",
  recruitment_link: "",
  instagram: "",
  whatsapp: "",
  poc: "",
  email: "",
  poc_phone: "",
  logo_url: ""
};

export default function ClubDetailsEditor({ clubId }: { clubId: string }) {
  const [details, setDetails] = useState(INITIAL_DETAILS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [logoPreviewError, setLogoPreviewError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const fetchDetails = async () => {
      setLoading(true);
      setMessage({ type: "", text: "" });
      try {
        const res = await apiFetch(`/api/club-admin/details?club_id=${encodeURIComponent(clubId)}`, {
          signal: controller.signal,
          headers: { "X-Club-Id": clubId }
        });
        if (controller.signal.aborted) return;
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
            poc_phone: data.details.poc_phone || "",
            logo_url: data.details.logo_url || ""
          });
        } else {
          // If no details exist yet in DB for this club, reset to blank fields
          setDetails(INITIAL_DETAILS);
        }
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        console.error("Failed to load details");
        setDetails(INITIAL_DETAILS);
      }
      finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchDetails();
    return () => controller.abort();
  }, [clubId]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setDetails(prev => ({ ...prev, [name]: value }));
    if (name === "logo_url") setLogoPreviewError(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const res = await apiFetch('/api/club-admin/details', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "X-Club-Id": clubId
        },
        body: JSON.stringify({ ...details, club_id: clubId })
      });
      const data = await res.json();
      if (data.success) setMessage({ type: "success", text: "Details saved successfully!" });
      else setMessage({ type: "error", text: data.error || "Failed to save details." });
    } catch (err: any) { setMessage({ type: "error", text: err.message || "An error occurred." }); }
    finally {
      setSaving(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 5000);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <LoadingSpinner size="lg" />
        <Text className="text-sm text-muted-foreground">Loading club details…</Text>
      </View>
    );
  }

  const hasValidLogo = details.logo_url && !logoPreviewError;

  return (
    <View className="max-w-5xl mx-auto space-y-6 pb-24">
      <View className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left column — content */}
        <View className="lg:col-span-2 space-y-6">

          {/* Club Icon / Logo */}
          <Card>
            <CardHeader>
              <CardTitle>
                <View className="flex-row items-center gap-2">
                  <IconBadge color="pink" size="sm"><ImageIcon className="w-4 h-4" /></IconBadge>
                  <Text className="font-semibold">Club Icon</Text>
                </View>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <View className="flex flex-row items-start gap-4">
                {/* Live preview */}
                <View className="shrink-0">
                  {hasValidLogo ? (
                    <View className="relative">
                      <Image
                        src={details.logo_url}
                        alt="Club logo preview"
                        className="w-20 h-20 rounded-2xl object-cover border-2 border-border shadow-md"
                        onError={() => setLogoPreviewError(true)}
                      />
                      <View className="absolute -bottom-1 -right-1 bg-success rounded-full w-5 h-5 flex items-center justify-center border-2 border-background">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </View>
                    </View>
                  ) : (
                    <View className="w-20 h-20 rounded-2xl bg-muted border-2 border-dashed border-border flex flex-col items-center justify-center gap-1">
                      <ImageIcon className="w-7 h-7 text-muted-foreground/40" />
                      <Text className="text-[9px] text-muted-foreground/50 font-medium text-center">No icon</Text>
                    </View>
                  )}
                </View>

                {/* URL input */}
                <View className="flex-1 space-y-2">
                  <View className="space-y-1.5">
                    <Label>
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-2">
                          <LinkIcon className="w-4 h-4 text-muted-foreground" />
                          <Text>Icon URL</Text>
                        </View>
                        {logoPreviewError && details.logo_url && (
                          <Badge variant="danger" size="sm">Invalid URL</Badge>
                        )}
                      </View>
                    </Label>
                    <Input
                      type="url"
                      name="logo_url"
                      value={details.logo_url}
                      onChange={handleChange}
                      placeholder="https://example.com/club-logo.png"
                    />
                  </View>
                  <Text className="text-xs text-muted-foreground leading-relaxed">
                    This icon appears on the AmazeCC club directory and community feed. Use a square image (recommended: 256×256px or larger, PNG/WebP).
                  </Text>
                  {hasValidLogo && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(details.logo_url, "_blank")}
                    >
                      <View className="flex-row items-center gap-1.5">
                        <ExternalLink className="w-3.5 h-3.5" />
                        <Text className="text-xs">Open in new tab</Text>
                      </View>
                    </Button>
                  )}
                </View>
              </View>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>
                <View className="flex-row items-center gap-2">
                  <IconBadge color="blue" size="sm"><FileText className="w-4 h-4" /></IconBadge>
                  <Text className="font-semibold">Basic Information</Text>
                </View>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <View className="space-y-1.5">
                <Label>
                  <View className="flex-row items-center gap-2">
                    <Target className="w-4 h-4 text-muted-foreground" />
                    <Text>Mission Statement</Text>
                  </View>
                </Label>
                <Input name="mission" value={details.mission} onChange={handleChange} placeholder="A short, impactful mission statement" />
              </View>
              <View className="space-y-1.5">
                <Label>
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <Text>Description</Text>
                    </View>
                    <Badge variant="info" size="sm">Markdown</Badge>
                  </View>
                </Label>
                <Textarea name="description" value={details.description} onChange={handleChange} placeholder="Tell us about your club…" className="min-h-[160px]" />
              </View>
            </CardContent>
          </Card>

          {/* Recruitment */}
          <Card>
            <CardHeader>
              <CardTitle>
                <View className="flex-row items-center gap-2">
                  <IconBadge color="emerald" size="sm"><User className="w-4 h-4" /></IconBadge>
                  <Text className="font-semibold">Recruitment</Text>
                </View>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <View className="space-y-1.5">
                <Label>
                  <View className="flex-row items-center justify-between">
                    <Text>Hiring Process</Text>
                    <Badge variant="info" size="sm">Markdown</Badge>
                  </View>
                </Label>
                <Textarea name="hiring_process" value={details.hiring_process} onChange={handleChange} placeholder="Describe how members can join…" className="min-h-[120px]" />
              </View>
              <View className="space-y-1.5">
                <Label>
                  <View className="flex-row items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-muted-foreground" />
                    <Text>Application Form Link</Text>
                  </View>
                </Label>
                <Input type="url" name="recruitment_link" value={details.recruitment_link} onChange={handleChange} placeholder="Google Form, Typeform, etc." />
              </View>
            </CardContent>
          </Card>
        </View>

        {/* Right column — social & contact */}
        <View className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                <View className="flex-row items-center gap-2">
                  <IconBadge color="purple" size="sm"><LinkIcon className="w-4 h-4" /></IconBadge>
                  <Text className="font-semibold">Social &amp; Contact</Text>
                </View>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <View className="space-y-1.5">
                <Label><View className="flex-row items-center gap-2"><LinkIcon className="w-4 h-4 text-muted-foreground" /><Text>Website</Text></View></Label>
                <Input type="url" name="website" value={details.website} onChange={handleChange} placeholder="https://…" />
              </View>
              <View className="space-y-1.5">
                <Label><View className="flex-row items-center gap-2"><Camera className="w-4 h-4 text-muted-foreground" /><Text>Instagram</Text></View></Label>
                <Input name="instagram" value={details.instagram} onChange={handleChange} placeholder="@vitcc_club" />
              </View>
              <View className="space-y-1.5">
                <Label><View className="flex-row items-center gap-2"><Phone className="w-4 h-4 text-muted-foreground" /><Text>WhatsApp Group</Text></View></Label>
                <Input type="url" name="whatsapp" value={details.whatsapp} onChange={handleChange} placeholder="https://chat.whatsapp.com/…" />
              </View>

              <View className="border-t border-border pt-5 space-y-5">
                <View className="space-y-1.5">
                  <Label><View className="flex-row items-center gap-2"><User className="w-4 h-4 text-muted-foreground" /><Text>Point of Contact</Text></View></Label>
                  <Input name="poc" value={details.poc} onChange={handleChange} placeholder="John Doe" />
                </View>
                <View className="space-y-1.5">
                  <Label><View className="flex-row items-center gap-2"><Phone className="w-4 h-4 text-muted-foreground" /><Text>Contact Number</Text></View></Label>
                  <Input type="tel" name="poc_phone" value={details.poc_phone} onChange={handleChange} placeholder="+91…" />
                </View>
                <View className="space-y-1.5">
                  <Label><View className="flex-row items-center gap-2"><Mail className="w-4 h-4 text-muted-foreground" /><Text>Club Email</Text></View></Label>
                  <Input type="email" name="email" value={details.email} onChange={handleChange} placeholder="club@vit.ac.in" />
                </View>
              </View>
            </CardContent>
          </Card>
        </View>
      </View>

      {/* Toast notification */}
      {message.text && (
        <View className="fixed bottom-24 right-6 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
          <Alert variant={message.type === "success" ? "success" : "error"}>
            <View className="flex-row items-center gap-2">
              {message.type === "success"
                ? <CheckCircle2 className="w-4 h-4 shrink-0" />
                : <XCircle className="w-4 h-4 shrink-0" />
              }
              <Text className="text-sm font-medium">{message.text}</Text>
            </View>
          </Alert>
        </View>
      )}

      {/* FAB — icon+label handled internally by Fab component */}
      <Fab
        icon={saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
        label="Save Changes"
        onPress={handleSave}
        disabled={saving}
        position="bottom-right"
        variant="primary"
      />
    </View>
  );
}
