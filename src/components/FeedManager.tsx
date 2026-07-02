"use client";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, Input, Textarea, Label, Button, View, Text, Image, Link } from "@amazecontinuityprojects/amazeui";
import { apiFetch } from "@/lib/api";
import { Send, Link as LinkIcon, Calendar, Trash2, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function FeedManager({ clubId }: { clubId: string }) {
  const [content, setContent] = useState("");
  const [eventId, setEventId] = useState("");
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [links, setLinks] = useState<{ title: string; url: string }[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [feed, setFeed] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => { if (clubId) fetchFeed(); }, [clubId]);

  const fetchFeed = async () => {
    try {
      const [feedRes, eventsRes] = await Promise.all([
        apiFetch(`/api/club-admin/feed?club_id=${encodeURIComponent(clubId)}`),
        apiFetch(`/api/events`).catch(() => null)
      ]);
      const feedData = await feedRes.json();
      if (feedData.success) setFeed(feedData.feed);
      if (eventsRes && eventsRes.ok) setEvents(await eventsRes.json());
    } catch (err) { console.error("Failed to fetch feed:", err); }
    finally { setLoading(false); }
  };

  const handleAddLink = () => {
    if (linkTitle && linkUrl) { setLinks([...links, { title: linkTitle, url: linkUrl }]); setLinkTitle(""); setLinkUrl(""); }
  };

  const handleAddImage = () => {
    if (imageUrl) { setImageUrls([...imageUrls, imageUrl]); setImageUrl(""); }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await apiFetch(`/api/club-admin/feed?post_id=${postId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchFeed(); else alert(data.error || "Failed to delete");
    } catch (err) { alert("Error deleting post"); }
  };

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setIsPosting(true);
    try {
      const res = await apiFetch("/api/club-admin/feed", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, event_id: eventId || null, links, image_urls: imageUrls }),
      });
      const data = await res.json();
      if (data.success) { setContent(""); setEventId(""); setLinks([]); setImageUrls([]); fetchFeed(); }
      else alert(data.error || "Failed to post");
    } catch (err) { console.error(err); alert("Error posting to feed"); }
    finally { setIsPosting(false); }
  };

  return (
    <View className="space-y-6">
      <Card>
        <View className="p-5 sm:p-6 space-y-5">
          <View>
            <Label className="flex flex-row items-center gap-2">
              <Send className="w-4 h-4 text-blue-500" /> Update Content
            </Label>
            <Textarea required value={content} onChange={(e: any) => setContent(e.target.value)} placeholder="What's happening in your club?" className="min-h-[120px]" />
          </View>

          <View className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <View>
              <Label className="flex flex-row items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-500" /> Attach Event ID (Optional)
              </Label>
              <Input value={eventId} onChange={(e: any) => setEventId(e.target.value)} placeholder="e.g. EVENT123" className="uppercase" />
            </View>

            <View className="space-y-2 sm:col-span-2">
              <Label className="flex flex-row items-center gap-2">
                <LinkIcon className="w-4 h-4 text-emerald-500" /> Add Link (Optional)
              </Label>
              <View className="flex flex-col gap-2">
                <Input value={linkTitle} onChange={(e: any) => setLinkTitle(e.target.value)} placeholder="Title" />
                <View className="flex flex-row gap-2">
                  <Input value={linkUrl} onChange={(e: any) =>  setLinkUrl(e.target.value)} placeholder="URL (https://)" className="flex-1" />
                  <Button type="button" onClick={handleAddLink} variant="secondary" className="whitespace-nowrap">Add</Button>
                </View>
              </View>
              {links.length > 0 && (
                <View className="flex flex-row flex-wrap gap-2 mt-2">
                  <AnimatePresence>
                    {links.map((link, idx) => (
                      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} key={idx} className="flex flex-row items-center gap-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-lg text-xs font-medium border border-emerald-100 dark:border-emerald-800/50">
                        <Text>{link.title}</Text>
                        <Button type="button" onClick={() => setLinks(links.filter((_, i) => i !== idx))} variant="ghost" size="icon" className="text-emerald-500 hover:text-danger w-auto h-auto p-0 ml-1">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </View>
              )}
            </View>

            <View className="space-y-2 sm:col-span-2">
              <Label className="flex flex-row items-center gap-2">
                <Text className="text-xl">🖼️</Text> Add Image (Optional)
              </Label>
              <View className="flex flex-row gap-2 max-w-md">
                <Input value={imageUrl} onChange={(e: any) =>  setImageUrl(e.target.value)} placeholder="Image URL (https://)" className="flex-1" />
                <Button type="button" onClick={handleAddImage} variant="secondary">Add</Button>
              </View>
              {imageUrls.length > 0 && (
                <View className="flex flex-row flex-wrap gap-2 mt-3">
                  <AnimatePresence>
                    {imageUrls.map((url, idx) => (
                      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} key={idx} className="relative group w-20 h-20 rounded-xl overflow-hidden border border-border shadow-sm">
                        <Image src={url} alt="Attached" className="w-full h-full object-cover" />
                        <Button type="button" onClick={() => setImageUrls(imageUrls.filter((_, i) => i !== idx))} variant="ghost" size="icon" className="absolute inset-0 bg-black/60 text-white flex flex-row items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm w-auto h-auto rounded-none">
                          <Trash2 className="w-5 h-5 text-red-400" />
                        </Button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </View>
              )}
            </View>
          </View>

          <View className="flex flex-row justify-end pt-4 border-t border-border">
            <Button type="submit" onClick={(e: any) => handlePost(e)} disabled={isPosting} variant="default">
              <Send className="w-4 h-4" />
              {isPosting ? "Posting..." : "Post to Feed"}
            </Button>
          </View>
        </View>
      </Card>

      <View className="mt-12 max-w-4xl mx-auto">
        <CardTitle className="flex flex-row items-center gap-3 mb-6">
          <Send className="w-4 h-4 text-indigo-600" />
          Recent Posts
        </CardTitle>

        {loading ? (
          <View className="animate-pulse flex flex-row space-x-4">
            <View className="flex-1 space-y-4 py-1">
              <View className="h-4 bg-muted rounded w-3/4" />
              <View className="space-y-2">
                <View className="h-4 bg-muted rounded" />
                <View className="h-4 bg-muted rounded w-5/6" />
              </View>
            </View>
          </View>
        ) : feed.length === 0 ? (
          <View className="text-center py-12 bg-muted/30 rounded-3xl border border-dashed border-border">
            <Text className="text-muted-foreground font-medium">No posts yet. Spark up your community feed!</Text>
          </View>
        ) : (
          <View className="relative pl-6 sm:pl-8 border-l-2 border-border space-y-8 pb-10">
            <AnimatePresence>
              {feed.map((post, index) => (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} key={post.id} className="relative">
                  <View className="absolute w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-900/60 border-2 border-background -left-[33px] sm:-left-[41px] top-6 shadow-sm ring-1 ring-border" />
                  <Card className="p-6 hover:shadow-md transition-all group">
                    <View className="flex flex-row flex-wrap justify-between items-start gap-4 mb-4">
                      <Text className="text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                        {new Date(post.created_at).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </Text>
                      <View className="flex flex-row items-center gap-2">
                        {post.event_id && (
                          <Text className="flex flex-row items-center gap-1.5 px-3 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wide rounded-full border border-purple-100 dark:border-purple-800/50">
                            <Calendar className="w-3.5 h-3.5" /> Event: {post.event_id}
                          </Text>
                        )}
                        <Button onClick={() => handleDeletePost(post.id)} variant="ghost" size="icon" className="text-muted-foreground hover:text-danger hover:bg-danger-surface rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100" title="Delete post">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </View>
                    </View>

                    <View className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-foreground mb-6 prose-p:leading-relaxed prose-a:text-indigo-500 prose-img:rounded-2xl">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
                    </View>

                    {post.image_urls && post.image_urls.length > 0 && (
                      <View className="mb-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {post.image_urls.map((url: string, i: number) => (
                          <View key={i} className="aspect-video sm:aspect-square overflow-hidden rounded-xl border border-border">
                            <Image src={url} alt="Attached" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                          </View>
                        ))}
                      </View>
                    )}

                    {post.event_id && (() => {
                      const eventDetails = events.find(e => e.eid === post.event_id);
                      if (!eventDetails) return null;
                      return (
                        <View className="mb-6 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 border border-purple-100/50 dark:border-purple-900/30 rounded-2xl p-5 flex flex-col sm:flex-row gap-4 items-center">
                          <View className="flex-1 w-full">
                            <View className="flex flex-row items-center gap-2 mb-2">
                              <Text className="px-2.5 py-0.5 rounded-md text-[10px] bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-bold uppercase tracking-wider">Featured Event</Text>
                              {eventDetails.type && <Text className="text-xs text-muted-foreground font-medium">{eventDetails.type}</Text>}
                            </View>
                            <Text className="font-bold text-lg text-foreground leading-tight mb-3">{eventDetails.title}</Text>
                            <View className="flex flex-row flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                              {eventDetails.date && <View className="flex flex-row items-center gap-1.5"><Calendar className="w-4 h-4 text-purple-500" /> <Text>{eventDetails.date}</Text></View>}
                              {eventDetails.location && <View className="flex flex-row items-center gap-1.5"><Text className="text-purple-500 font-bold">📍</Text> <Text>{eventDetails.location}</Text></View>}
                            </View>
                          </View>
                        </View>
                      );
                    })()}

                    {post.links && post.links.length > 0 && (
                      <View className="mt-4 pt-4 border-t border-border flex flex-row flex-wrap gap-2">
                        {post.links.map((link: any, i: number) => (
                          <Link key={i} href={link.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2 rounded-xl transition-all hover:-translate-y-0.5 border border-indigo-100 dark:border-indigo-800/50 no-underline hover:underline">
                            {link.title} <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        ))}
                      </View>
                    )}
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </View>
        )}
      </View>
    </View>
  );
}

