"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Card, CardContent, Input, Textarea, Button, View, Text, IconBadge, EmptyState,
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
  Fab, Timeline, TimelineItem, TimelineCard, TimelineDate, TimelineTitle,
  TimelineDescription, TimelineActions, LoadingSpinner, SectionHeader, Badge, Alert, Link
} from "@/lib/ui";
import { apiFetch } from "@/lib/api";
import {
  Plus, Trash2, Loader2, Globe, Layout, Save, Target,
  CalendarDays, CheckCircle2, XCircle, Sparkles
} from "lucide-react";

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
    } catch { console.error("Failed to load landing page data"); }
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
    return (
      <View className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <LoadingSpinner size="lg" />
        <Text className="text-sm text-muted-foreground">Loading landing page…</Text>
      </View>
    );
  }

  return (
    <View className="flex flex-col w-full h-full">

      {/* ── Header ──────────────────────────────────────────────── */}
      <View className="flex flex-row items-center justify-between mb-6 shrink-0">
        <SectionHeader
          icon={<Sparkles className="w-4 h-4" />}
          title="Landing Page"
          subtitle={`${projects.length + events.length} item${projects.length + events.length !== 1 ? "s" : ""}`}
        />
        <View className="flex flex-row items-center gap-2">
          <Button
            onClick={() => setShowForm(showForm === "event" ? null : "event")}
            variant={showForm === "event" ? "default" : "secondary"}
            size="sm"
          >
            <View className="flex-row items-center gap-1.5">
              <CalendarDays className="w-4 h-4" />
              <Text className="font-semibold">Event</Text>
            </View>
          </Button>
          <Button
            onClick={() => setShowForm(showForm === "project" ? null : "project")}
            variant={showForm === "project" ? "default" : "secondary"}
            size="sm"
          >
            <View className="flex-row items-center gap-1.5">
              <Plus className="w-4 h-4" />
              <Text className="font-semibold">Project</Text>
            </View>
          </Button>
        </View>
      </View>

      {/* ── Add item form ─────────────────────────────────────────── */}
      {showForm && (
        <Card className="mb-6 shrink-0 border-info/20 animate-in fade-in slide-in-from-top-2 duration-200" variant="glass">
          <CardContent className="p-4 space-y-4">
            <Text className="text-sm font-semibold text-foreground">
              <View className="flex-row items-center gap-2">
                {showForm === "project"
                  ? <Target className="w-4 h-4 text-purple-500" />
                  : <CalendarDays className="w-4 h-4 text-amber-500" />
                }
                <Text className="font-semibold">New {showForm === "project" ? "Project" : "Event"}</Text>
              </View>
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
              <Button onClick={addItem} size="sm">
                <View className="flex-row items-center gap-1.5">
                  <Plus className="w-4 h-4" />
                  <Text className="font-semibold">{showForm === "project" ? "Add Project" : "Add Event"}</Text>
                </View>
              </Button>
              <Button onClick={() => setShowForm(null)} variant="ghost" size="sm">Cancel</Button>
            </View>
          </CardContent>
        </Card>
      )}

      <View className="flex-1 space-y-10 pb-24">

        {/* ── Projects ─────────────────────────────────────────────── */}
        <View>
          <View className="flex flex-row items-center gap-2 mb-4">
            <IconBadge color="purple" size="sm"><Target className="w-4 h-4" /></IconBadge>
            <Text className="text-base font-bold text-foreground">Projects</Text>
            <Badge variant="default" size="sm">{projects.length}</Badge>
          </View>
          {projects.length === 0 ? (
            <EmptyState
              icon={<Layout className="w-6 h-6" />}
              title="No projects yet"
              description="Showcase your club's work"
              action={
                <Button variant="secondary" size="sm" onClick={() => setShowForm("project")} className="mt-2">
                  <View className="flex-row items-center gap-1.5">
                    <Plus className="w-4 h-4" />
                    <Text className="font-semibold">Add Project</Text>
                  </View>
                </Button>
              }
            />
          ) : (
            <Timeline className="w-full">
              {projects.map((p, i) => (
                <TimelineItem key={i} dotColor={dotColors[i % dotColors.length]}>
                  <TimelineCard>
                    <View className="flex flex-row items-start justify-between gap-2">
                      <View className="flex-1 min-w-0">
                        <TimelineTitle>{p.name}</TimelineTitle>
                        {p.link && (
                          <Link href={p.link} target="_blank" rel="noopener noreferrer"
                            className="text-xs text-info mt-0.5 truncate block hover:underline">
                            {p.link}
                          </Link>
                        )}
                      </View>
                      <Button variant="ghost" size="icon"
                        onClick={() => setDeleting({ index: i, type: "project" })}
                        className="text-muted-foreground hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity -mt-1 -mr-2 h-7 w-7 shrink-0">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </View>
                    {p.description && <TimelineDescription>{p.description}</TimelineDescription>}
                  </TimelineCard>
                </TimelineItem>
              ))}
            </Timeline>
          )}
        </View>

        {/* ── Events ───────────────────────────────────────────────── */}
        <View>
          <View className="flex flex-row items-center gap-2 mb-4">
            <IconBadge color="amber" size="sm"><CalendarDays className="w-4 h-4" /></IconBadge>
            <Text className="text-base font-bold text-foreground">Events</Text>
            <Badge variant="default" size="sm">{events.length}</Badge>
          </View>
          {events.length === 0 ? (
            <EmptyState
              icon={<Layout className="w-6 h-6" />}
              title="No events yet"
              description="Promote upcoming events"
              action={
                <Button variant="secondary" size="sm" onClick={() => setShowForm("event")} className="mt-2">
                  <View className="flex-row items-center gap-1.5">
                    <Plus className="w-4 h-4" />
                    <Text className="font-semibold">Add Event</Text>
                  </View>
                </Button>
              }
            />
          ) : (
            <Timeline className="w-full">
              {events.map((e, i) => (
                <TimelineItem key={i} dotColor={eventDotColors[i % eventDotColors.length]}>
                  <TimelineCard>
                    <View className="flex flex-row items-start justify-between gap-2">
                      <View className="flex-1 min-w-0">
                        <TimelineTitle>{e.name}</TimelineTitle>
                        {e.date && <TimelineDate className="mt-0.5">{formatDate(e.date)}</TimelineDate>}
                      </View>
                      <Button variant="ghost" size="icon"
                        onClick={() => setDeleting({ index: i, type: "event" })}
                        className="text-muted-foreground hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity -mt-1 -mr-2 h-7 w-7 shrink-0">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </View>
                    {e.description && <TimelineDescription>{e.description}</TimelineDescription>}
                    <TimelineActions>
                      {e.link && (
                        <Link href={e.link} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-info hover:underline">
                          <Globe className="w-3 h-3" /> {e.link}
                        </Link>
                      )}
                    </TimelineActions>
                  </TimelineCard>
                </TimelineItem>
              ))}
            </Timeline>
          )}
        </View>
      </View>

      {/* ── Toast ────────────────────────────────────────────────── */}
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
              <View className="flex-row items-center gap-1.5">
                <Trash2 className="w-4 h-4" />
                <Text className="font-semibold">Remove</Text>
              </View>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </View>
  );
}
