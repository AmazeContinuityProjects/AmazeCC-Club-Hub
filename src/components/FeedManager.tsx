"use client";
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, Input, Textarea, OptionPicker, Button, View, Text, Image, EmptyState, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, Link, Timeline, TimelineItem, TimelineCard, TimelineDate, TimelineTitle, TimelineDescription, TimelineActions } from "@amazecontinuityprojects/amazeui";
import { apiFetch } from "@/lib/api";
import { Loader2, Plus, Trash2, Link as LinkIcon, Upload, RefreshCw, ImageIcon, X, CalendarDays, SendHorizonal, Ticket } from "lucide-react";

interface FeedPost {
  id: number;
  club_id: string;
  content: string;
  links: { url: string; label: string }[];
  image_urls: string[];
  event_id: string | null;
  posted_by: string;
  created_at: string;
  promote_count: number;
  has_promoted: boolean;
}

interface SocialLink {
  url: string; label: string;
}

interface EventItem {
  eid: string;
  title: string;
  date: string;
  posterUrl?: string;
}

const dotColors = ["blue", "emerald", "purple", "amber", "indigo", "pink"] as const;

export default function FeedManager({ clubId }: { clubId: string }) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([{ url: "", label: "" }]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("");
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchPosts = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await apiFetch(`/api/club-admin/feed?club_id=${encodeURIComponent(clubId)}`);
      const data = await res.json();
      if (data.success) setPosts(data.feed || []);
    } catch (err) { console.error("Failed to fetch posts"); }
    finally { setRefreshing(false); }
  }, [clubId]);

  const fetchEvents = useCallback(async () => {
    setEventsLoading(true);
    try {
      const res = await apiFetch("/api/events");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setEvents(data);
      }
    } catch (err) { console.error("Failed to fetch events"); }
    finally { setEventsLoading(false); }
  }, []);

  useEffect(() => {
    const load = async () => { setLoading(true); await fetchPosts(); setLoading(false); };
    load();
  }, [fetchPosts]);

  useEffect(() => {
    if (showForm && events.length === 0) fetchEvents();
  }, [showForm, events.length, fetchEvents]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setImagePreview(URL.createObjectURL(file)); }
  };

  const addLink = () => setSocialLinks(prev => [...prev, { url: "", label: "" }]);

  const updateLink = (i: number, field: keyof SocialLink, value: string) => {
    setSocialLinks(prev => prev.map((l, idx) => idx === i ? { ...l, [field]: value } : l));
  };

  const removeLink = (i: number) => {
    setSocialLinks(prev => prev.length > 1 ? prev.filter((_, idx) => idx !== i) : [{ url: "", label: "" }]);
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;
    try {
      const links = socialLinks.filter(l => l.url).map(l => ({ url: l.url, label: l.label }));
      const body: any = { content, links };
      if (imagePreview) body.image_urls = [imagePreview];
      if (selectedEventId) body.event_id = selectedEventId;

      const res = await apiFetch("/api/club-admin/feed", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        setContent(""); setImagePreview(null); setSelectedEventId("");
        setSocialLinks([{ url: "", label: "" }]);
        setShowForm(false);
        await fetchPosts();
      } else alert(data.error || "Failed to create post");
    } catch (err: any) { alert(err.message); }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await apiFetch(`/api/club-admin/feed?post_id=${encodeURIComponent(id)}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) await fetchPosts();
      else alert(data.error || "Failed to delete post");
    } catch (err: any) { alert(err.message); }
    finally { setConfirmDelete(null); }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const linkedEvent = (eid: string) => events.find(e => e.eid === eid);

  if (loading) {
    return <View className="flex-1 flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 animate-spin text-info" /></View>;
  }

  return (
    <View className="flex flex-col w-full h-full space-y-0">
      <View className="flex flex-row items-center justify-between mb-6 shrink-0">
        <View className="flex flex-row items-center gap-3">
          <Text className="text-2xl font-bold tracking-tight text-foreground">Feed</Text>
          <View className="bg-muted rounded-full px-3 py-1">
            <Text className="text-xs font-semibold text-muted-foreground">{posts.length} post{posts.length !== 1 ? "s" : ""}</Text>
          </View>
        </View>
        <View className="flex flex-row items-center gap-2">
          <Button variant="ghost" size="sm" onClick={fetchPosts} disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={() => setShowForm(true)} variant="default" size="sm" className="gap-1.5">
            <Plus className="w-4 h-4" /> New Post
          </Button>
        </View>
      </View>

      {showForm && (
        <Card className="mb-6 shrink-0 border-info/30 bg-info-surface/5">
          <CardContent className="p-4 space-y-4">
            <Textarea placeholder="What's happening?" value={content}
              onChange={(e: any) => setContent(e.target.value)}
              className="min-h-[80px] bg-transparent border-0 focus-visible:ring-0 p-0 text-base placeholder:text-muted-foreground/50" />

            {events.length > 0 && (
              <OptionPicker
                value={selectedEventId}
                onChange={setSelectedEventId}
                options={[
                  { value: "", label: "No event linked" },
                  ...events.map(e => ({ value: e.eid, label: `${e.title}${e.date ? ` — ${e.date}` : ""}` }))
                ]}
                placeholder="Link to an event..."
              />
            )}

            <View className="flex flex-row items-center gap-2">
              <LinkIcon className="w-4 h-4 shrink-0 text-muted-foreground" />
              <Input type="url" value={socialLinks[0]?.url || ""}
                onChange={(e: any) => {
                  if (socialLinks[0]) updateLink(0, "url", e.target.value);
                  else setSocialLinks([{ url: e.target.value, label: "" }]);
                }}
                placeholder="Add a link..."
                className="flex-1 text-sm h-9" />
              {socialLinks[0]?.url && (
                <Input value={socialLinks[0]?.label || ""}
                  onChange={(e: any) => updateLink(0, "label", e.target.value)}
                  placeholder="Label"
                  className="w-28 text-sm h-9" />
              )}
            </View>

            {imagePreview && (
              <View className="relative w-full max-w-xs rounded-lg overflow-hidden border border-border">
                <Image src={imagePreview} className="w-full h-32 object-cover" />
                <Button variant="ghost" size="icon" onClick={() => setImagePreview(null)}
                  className="absolute top-1.5 right-1.5 bg-black/50 hover:bg-black/70 rounded-full w-7 h-7">
                  <X className="w-3.5 h-3.5 text-white" />
                </Button>
              </View>
            )}

            {socialLinks.length > 1 && (
              <View className="space-y-2">
                {socialLinks.slice(1).map((link, i) => (
                  <View key={i} className="flex flex-row items-center gap-2">
                    <Input type="url" value={link.url}
                      onChange={(e: any) => updateLink(i + 1, "url", e.target.value)}
                      placeholder="https://..." className="flex-1 text-sm h-8" />
                    <Input value={link.label}
                      onChange={(e: any) => updateLink(i + 1, "label", e.target.value)}
                      placeholder="Label" className="w-28 text-sm h-8" />
                    <Button variant="ghost" size="icon" onClick={() => removeLink(i + 1)}
                      className="text-danger hover:text-danger h-8 w-8 shrink-0">
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  </View>
                ))}
                <Button variant="ghost" size="sm" onClick={addLink} className="text-xs text-muted-foreground">
                  <Plus className="w-3.5 h-3.5" /> Add another link
                </Button>
              </View>
            )}

            <View className="flex flex-row items-center justify-between pt-2 border-t border-border/50">
              <View className="flex flex-row items-center gap-1">
                <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" id="inline-image" />
                <label htmlFor="inline-image" className="cursor-pointer p-2 rounded-lg hover:bg-muted transition-colors">
                  <Upload className="w-4 h-4 text-muted-foreground" />
                </label>
              </View>
              <View className="flex flex-row items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => { setShowForm(false); setContent(""); setImagePreview(null); setSelectedEventId(""); }}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSubmit} disabled={!content.trim()}>
                  <SendHorizonal className="w-4 h-4" /> Post
                </Button>
              </View>
            </View>
          </CardContent>
        </Card>
      )}

      <View className="flex-1 pb-8">
        {posts.length === 0 ? (
          <View className="flex items-center justify-center pt-16">
            <EmptyState icon={<ImageIcon className="w-8 h-8" />}
              title="No posts yet"
              description="Share updates, events, and more with your community">
              <Button variant="secondary" onClick={() => setShowForm(true)} className="mt-2">
                <Plus className="w-4 h-4" /> First Post
              </Button>
            </EmptyState>
          </View>
        ) : (
          <Timeline className="w-full max-w-3xl">
            {posts.map((post, idx) => {
              const event = post.event_id ? linkedEvent(post.event_id) : null;
              return (
                <TimelineItem key={post.id} dotColor={dotColors[idx % dotColors.length]}>
                  <TimelineCard>
                    <View className="flex flex-row items-start justify-between gap-2">
                      <TimelineDate>{formatDate(post.created_at)}</TimelineDate>
                      <Button variant="ghost" size="icon"
                        onClick={() => setConfirmDelete(String(post.id))}
                        className="text-muted-foreground hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity -mt-1 -mr-2 h-7 w-7">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </View>

                    {event && (
                      <View className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 rounded-full self-start">
                        <Ticket className="w-3 h-3" />
                        {event.title}
                        {event.date && <Text className="opacity-70">— {event.date}</Text>}
                      </View>
                    )}

                    {post.content && (
                      <TimelineDescription className="mt-1">{post.content}</TimelineDescription>
                    )}

                    {post.image_urls?.length > 0 && (
                      <View className="mt-3 rounded-lg overflow-hidden border border-border">
                        <Image src={post.image_urls[0]} className="w-full max-h-64 object-cover" />
                      </View>
                    )}

                    {post.links?.length > 0 && (
                      <View className="flex flex-row flex-wrap gap-2 mt-3">
                        {post.links.map((l, i) => (
                          <Link key={i} href={l.url} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-info bg-info-surface/20 hover:bg-info-surface/40 px-3 py-1.5 rounded-full transition-colors">
                            <LinkIcon className="w-3 h-3" />{l.label || l.url}
                          </Link>
                        ))}
                      </View>
                    )}

                    <TimelineActions>
                      <View className="flex flex-row items-center gap-1.5 text-xs text-muted-foreground/60">
                        <CalendarDays className="w-3 h-3" />
                        <Text>{new Date(post.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</Text>
                      </View>
                      <View className="flex-1" />
                      <Text className="text-xs text-muted-foreground/40">Posted by {post.posted_by}</Text>
                    </TimelineActions>
                  </TimelineCard>
                </TimelineItem>
              );
            })}
          </Timeline>
        )}
      </View>

      <Dialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>This action cannot be undone. All associated data will be permanently removed.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmDelete(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => confirmDelete && handleDelete(confirmDelete)}>
              <Trash2 className="w-4 h-4" /> Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </View>
  );
}
