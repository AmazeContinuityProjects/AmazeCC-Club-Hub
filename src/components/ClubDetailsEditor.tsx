"use client";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, Input, Textarea, Label, Button, View, Text } from "@amazecontinuityprojects/amazeui";
import { apiFetch } from "@/lib/api";
import { Save, Loader2, Link as LinkIcon, Camera, Phone, Target, FileText, User, Mail } from "lucide-react";

export default function ClubDetailsEditor({ clubId }: { clubId: string }) {
  const [details, setDetails] = useState({
    mission: "", description: "", hiring_process: "", website: "", recruitment_link: "",
    instagram: "", whatsapp: "", poc: "", email: "", poc_phone: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await apiFetch(`/api/club-admin/details?club_id=${encodeURIComponent(clubId)}`);
        const data = await res.json();
        if (data.success && data.details) {
          setDetails({
            mission: data.details.mission || "", description: data.details.description || "",
            hiring_process: data.details.hiring_process || "", website: data.details.website || "",
            recruitment_link: data.details.recruitment_link || "", instagram: data.details.instagram || "",
            whatsapp: data.details.whatsapp || "", poc: data.details.poc || "",
            email: data.details.email || "", poc_phone: data.details.poc_phone || ""
          });
        }
      } catch (err) { console.error("Failed to load details"); }
      finally { setLoading(false); }
    };
    fetchDetails();
  }, [clubId]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const res = await apiFetch('/api/club-admin/details', {
        method: 'POST', headers: { "Content-Type": "application/json" },
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
    return <View className="p-8 flex flex-row justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></View>;
  }

  return (
    <View className="max-w-5xl mx-auto space-y-6 pb-20">
      <View className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <View className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                <View className="flex flex-row items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Basic Information
                </View>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <View>
                <Label className="flex flex-row items-center gap-2">
                  <Target className="w-4 h-4 text-muted-foreground" /> Mission Statement
                </Label>
                <Input name="mission" value={details.mission} onChange={handleChange} placeholder="A short, impactful mission statement" />
              </View>
              <View>
                <Label className="flex flex-row items-center justify-between">
                  <View className="flex flex-row items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" /> Description
                  </View>
                  <Text className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Markdown</Text>
                </Label>
                <Textarea name="description" value={details.description} onChange={handleChange} placeholder="Tell us about your club..." className="min-h-[160px]" />
              </View>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <View className="flex flex-row items-center gap-2">
                  <User className="w-4 h-4 text-emerald-600" />
                  Recruitment
                </View>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <View>
                <Label className="flex flex-row items-center justify-between">
                  <Text>Hiring Process</Text>
                  <Text className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Markdown</Text>
                </Label>
                <Textarea name="hiring_process" value={details.hiring_process} onChange={handleChange} placeholder="Describe how members can join..." className="min-h-[120px]" />
              </View>
              <View>
                <Label className="flex flex-row items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-muted-foreground" /> Application Form Link
                </Label>
                <Input type="url" name="recruitment_link" value={details.recruitment_link} onChange={handleChange} placeholder="Google Form, Typeform, etc." />
              </View>
            </CardContent>
          </Card>
        </View>

        <View className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                <View className="flex flex-row items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-purple-600" />
                  Social & Contact
                </View>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <View>
                <Label className="flex flex-row items-center gap-2"><LinkIcon className="w-4 h-4 text-muted-foreground" /> Website</Label>
                <Input type="url" name="website" value={details.website} onChange={handleChange} placeholder="https://..." />
              </View>
              <View>
                <Label className="flex flex-row items-center gap-2"><Camera className="w-4 h-4 text-muted-foreground" /> Instagram</Label>
                <Input name="instagram" value={details.instagram} onChange={handleChange} placeholder="@vitcc_club" />
              </View>
              <View>
                <Label className="flex flex-row items-center gap-2"><Phone className="w-4 h-4 text-muted-foreground" /> WhatsApp Group</Label>
                <Input type="url" name="whatsapp" value={details.whatsapp} onChange={handleChange} placeholder="https://chat.whatsapp.com/..." />
              </View>
              <View className="border-t border-border pt-4 space-y-5">
                <View>
                  <Label className="flex flex-row items-center gap-2"><User className="w-4 h-4 text-muted-foreground" /> Point of Contact</Label>
                  <Input name="poc" value={details.poc} onChange={handleChange} placeholder="John Doe" />
                </View>
                <View>
                  <Label className="flex flex-row items-center gap-2"><Phone className="w-4 h-4 text-muted-foreground" /> Contact Number</Label>
                  <Input type="tel" name="poc_phone" value={details.poc_phone} onChange={handleChange} placeholder="+91..." />
                </View>
                <View>
                  <Label className="flex flex-row items-center gap-2"><Mail className="w-4 h-4 text-muted-foreground" /> Club Email</Label>
                  <Input type="email" name="email" value={details.email} onChange={handleChange} placeholder="club@vit.ac.in" />
                </View>
              </View>
            </CardContent>
          </Card>
        </View>
      </View>

      <View className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-8 z-40 bg-card/90 backdrop-blur-md border border-border p-3 rounded-2xl shadow-xl flex flex-row items-center gap-4">
        {message.text && (
          <Text className={`text-sm font-medium px-2 ${message.type === 'success' ? 'text-success' : 'text-danger'}`}>
            {message.text}
          </Text>
        )}
        <Button onClick={handleSave} disabled={saving} variant="default">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </Button>
      </View>
    </View>
  );
}
