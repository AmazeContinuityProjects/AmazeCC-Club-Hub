"use client";
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, Input, Textarea, Button, View, Text, IconBadge, EmptyState, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, Fab, Timeline, TimelineItem, TimelineCard, TimelineDate, TimelineTitle, TimelineDescription, TimelineActions } from "@amazecontinuityprojects/amazeui";
import { apiFetch } from "@/lib/api";
import { Plus, Trash2, Loader2, Globe, Layout, Save, Target, CalendarDays, CheckCircle2, XCircle, Sparkles } from "lucide-react";

interface LandingPageItem {
  name: string;
  description: string;
  link?: string;
  date?: string;
}

const dotColors = ["purple", "indigo", "blue", "emerald"] as const;
const eventDotColors = ["amber", "pink", "emerald", "indigo"] as const;

export default function LandingPageBuilder({ clubId }: { clubId: string }) {
  const [projects, setProjects] = useState<LandingPageItem[]>([]);
  const [events, setEvents] = useState<LandingPageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [deleting, setDeleting] = useState<{ index: number; type: "project" | "event" } | null>(null);
  const [showForm, setShowForm] = useState<"project" | "event" | null>(null);
  const [form, setForm] = useState({ name: "", description: "", link: "", date: "" });

  const fetchData = useCallback(async () => {
    try {
      const res = await apiFetch(`/api/club-admin/landing-page?club_id=${encodeURIComponent(clubId)}`);
      const data = await res.json();
      if (data.success && data.landingPage) {
        setProjects(data.landingPage.showcase_projects || []);
        setEvents(data.landingPage.popular_events || []);
      }
    } catch (err) { console.error("Failed to load landing page data"); }
  }, [clubId]);

  useEffect(() => {
    const load = async () => { setLoading(true); await fetchData(); setLoading(false); };
    load();
  }, [fetchData]);

  const saveAll = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const res = await apiFetch("/api/club-admin/landing-page", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ club_id: clubId, showcase_projects: projects, popular_events: events })
      });
      const data = await res.json();
      if (data.success) setMessage({ type: "success", text: "Landing page saved!" });
      else setMessage({ type: "error", text: data.error || "Failed to save" });
    } catch (err: any) { setMessage({ type: "error", text: err.message }); }
    finally {
      setSaving(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 4000);
    }
  };

  const addItem = () => {
    if (!form.name.trim() || !form.description.trim()) return;
    const item: LandingPageItem = { name: form.name, description: form.description };
    if (form.link) item.link = form.link;
    if (form.date) item.date = form.date;

    if (showForm === "project") setProjects(prev => [item, ...prev]);
    else setEvents(prev => [item, ...prev]);

    setForm({ name: "", description: "", link: "", date: "" });
    setShowForm(null);
  };

  const removeItem = () => {
    if (!deleting) return;
    if (deleting.type === "project") setProjects(prev => prev.filter((_, i) => i !== deleting.index));
    else setEvents(prev => prev.filter((_, i) => i !== deleting.index));
    setDeleting(null);
  };

  const formatDate = (dateStr: string) => {
    try { return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }
    catch { return dateStr; }
  };

  if (loading) {
    return <View className="flex-1 flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 animate-spin text-info" /></View>;
  }

  return (
    <View className="flex flex-col w-full h-full space-y-0">
        <View className="flex flex-row items-center justify-between mb-6 shrink-0">
          <View className="flex flex-row items-center gap-3">
            <Text className="text-2xl font-bold tracking-tight text-foreground">Landing Page</Text>
            <View className="bg-muted/80 rounded-full px-3 py-1 flex flex-row items-center gap-2">
              <Sparkles className="w-3 h-3 text-muted-foreground" />
              <Text className="text-xs font-semibold text-muted-foreground">{projects.length + events.length} items</Text>
            </View>
          </View>
          <View className="flex flex-row items-center gap-2">
            <Button onClick={() => setShowForm(showForm === "event" ? null : "event")}
              variant={showForm === "event" ? "default" : "secondary"} size="sm" className="gap-1.5">
              <CalendarDays className="w-4 h-4" /> Event
            </Button>
            <Button onClick={() => setShowForm(showForm === "project" ? null : "project")}
              variant={showForm === "project" ? "default" : "secondary"} size="sm" className="gap-1.5">
              <Plus className="w-4 h-4" /> Project
            </Button>
          </View>
        </View>

      {showForm && (
        <Card className="mb-6 shrink-0 border-info/30 bg-info-surface/5 animate-enter">
          <CardContent className="p-4 space-y-4">
            <Text className="text-sm font-semibold text-foreground flex flex-row items-center gap-2">
              {showForm === "project" ? <Target className="w-4 h-4 text-purple-500" /> : <CalendarDays className="w-4 h-4 text-amber-500" />}
              New {showForm === "project" ? "Project" : "Event"}
            </Text>
            <View className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input name="name" value={form.name}
                onChange={(e: any) => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="Name *" required />
              {showForm === "event" && (
                <Input type="date" name="date" value={form.date}
                  onChange={(e: any) => setForm(p => ({ ...p, date: e.target.value }))}
                  placeholder="Date" />
              )}
            </View>
            <Textarea name="description" value={form.description}
              onChange={(e: any) => setForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Description *" required className="min-h-[80px]" />
            <Input name="link" value={form.link}
              onChange={(e: any) => setForm(p => ({ ...p, link: e.target.value }))}
              placeholder="Link URL (optional)" />
            <View className="flex flex-row gap-3 pt-2">
              <Button onClick={addItem} variant="default" size="sm">
                <Plus className="w-4 h-4" /> {showForm === "project" ? "Add Project" : "Add Event"}
              </Button>
              <Button onClick={() => setShowForm(null)} variant="ghost" size="sm">Cancel</Button>
            </View>
          </CardContent>
        </Card>
      )}

      <View className="flex-1 space-y-10">
        <View>
          <View className="flex flex-row items-center gap-2 mb-4">
            <IconBadge color="purple" size="sm"><Target className="w-4 h-4" /></IconBadge>
            <Text className="text-lg font-bold text-foreground">Projects</Text>
            <Text className="text-xs text-muted-foreground/60 bg-muted/50 px-2 py-0.5 rounded-full">{projects.length}</Text>
          </View>
          {projects.length === 0 ? (
            <EmptyState icon={<Layout className="w-6 h-6" />}
              title="No projects yet"
              description="Showcase your club's work">
              <Button variant="secondary" size="sm" onClick={() => setShowForm("project")} className="mt-2">
                <Plus className="w-4 h-4" /> Add Project
              </Button>
            </EmptyState>
          ) : (
            <Timeline className="w-full">
              {projects.map((p, i) => (
                <TimelineItem key={i} dotColor={dotColors[i % dotColors.length]}>
                  <TimelineCard>
                    <View className="flex flex-row items-start justify-between gap-2">
                      <View className="flex-1 min-w-0">
                        <TimelineTitle>{p.name}</TimelineTitle>
                        {p.link && (
                          <Text className="text-xs text-info mt-0.5 truncate">{p.link}</Text>
                        )}
                      </View>
                      <Button variant="ghost" size="icon"
                        onClick={() => setDeleting({ index: i, type: "project" })}
                        className="text-muted-foreground hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity -mt-1 -mr-2 h-7 w-7 shrink-0">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </View>
                    {p.description && (
                      <TimelineDescription>{p.description}</TimelineDescription>
                    )}
                  </TimelineCard>
                </TimelineItem>
              ))}
            </Timeline>
          )}
        </View>

        <View>
          <View className="flex flex-row items-center gap-2 mb-4">
            <IconBadge color="amber" size="sm"><CalendarDays className="w-4 h-4" /></IconBadge>
            <Text className="text-lg font-bold text-foreground">Events</Text>
            <Text className="text-xs text-muted-foreground/60 bg-muted/50 px-2 py-0.5 rounded-full">{events.length}</Text>
          </View>
          {events.length === 0 ? (
            <EmptyState icon={<Layout className="w-6 h-6" />}
              title="No events yet"
              description="Promote upcoming events">
              <Button variant="secondary" size="sm" onClick={() => setShowForm("event")} className="mt-2">
                <Plus className="w-4 h-4" /> Add Event
              </Button>
            </EmptyState>
          ) : (
            <Timeline className="w-full">
              {events.map((e, i) => (
                <TimelineItem key={i} dotColor={eventDotColors[i % eventDotColors.length]}>
                  <TimelineCard>
                    <View className="flex flex-row items-start justify-between gap-2">
                      <View className="flex-1 min-w-0">
                        <View className="flex flex-row items-center gap-2">
                          <TimelineTitle>{e.name}</TimelineTitle>
                        </View>
                        {e.date && (
                          <TimelineDate className="mt-0.5">{formatDate(e.date)}</TimelineDate>
                        )}
                      </View>
                      <Button variant="ghost" size="icon"
                        onClick={() => setDeleting({ index: i, type: "event" })}
                        className="text-muted-foreground hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity -mt-1 -mr-2 h-7 w-7 shrink-0">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </View>
                    {e.description && (
                      <TimelineDescription>{e.description}</TimelineDescription>
                    )}
                    <TimelineActions>
                      {e.link && (
                        <Text className="inline-flex items-center gap-1 text-xs text-info">
                          <Globe className="w-3 h-3" /> {e.link}
                        </Text>
                      )}
                    </TimelineActions>
                  </TimelineCard>
                </TimelineItem>
              ))}
            </Timeline>
          )}
        </View>
      </View>

      {message.text && (
        <View className="fixed bottom-24 right-6 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
          <View className={`flex flex-row items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl border backdrop-blur-xl ${
            message.type === "success"
              ? "bg-success-surface/90 border-success/30 text-success-foreground"
              : "bg-danger-surface/90 border-danger/30 text-danger"
          }`}>
            {message.type === "success"
              ? <CheckCircle2 className="w-4 h-4 shrink-0" />
              : <XCircle className="w-4 h-4 shrink-0" />
            }
            <Text className="text-sm font-medium">{message.text}</Text>
          </View>
        </View>
      )}

      <Fab
        icon={saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
        label="Save"
        onPress={saveAll}
        disabled={saving}
        position="bottom-right"
        variant="primary"
      />

      <Dialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove</DialogTitle>
            <DialogDescription>Remove this item from the list? Changes are saved when you click Save.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleting(null)}>Cancel</Button>
            <Button variant="danger" onClick={removeItem}>
              <Trash2 className="w-4 h-4" /> Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </View>
  );
}
