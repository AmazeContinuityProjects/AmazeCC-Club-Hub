"use client";
import { useState, useEffect } from "react";
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

  useEffect(() => {
    if (clubId) {
      fetchFeed();
    }
  }, [clubId]);

  const fetchFeed = async () => {
    try {
      const [feedRes, eventsRes] = await Promise.all([
        apiFetch(`/api/club-admin/feed?club_id=${encodeURIComponent(clubId)}`),
        apiFetch(`/api/events`).catch(() => null)
      ]);
      const feedData = await feedRes.json();
      if (feedData.success) {
        setFeed(feedData.feed);
      }
      if (eventsRes && eventsRes.ok) {
        const eventsData = await eventsRes.json();
        setEvents(eventsData);
      }
    } catch (err) {
      console.error("Failed to fetch feed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLink = () => {
    if (linkTitle && linkUrl) {
      setLinks([...links, { title: linkTitle, url: linkUrl }]);
      setLinkTitle("");
      setLinkUrl("");
    }
  };

  const handleAddImage = () => {
    if (imageUrl) {
      setImageUrls([...imageUrls, imageUrl]);
      setImageUrl("");
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await apiFetch(`/api/club-admin/feed?post_id=${postId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchFeed();
      } else {
        alert(data.error || "Failed to delete");
      }
    } catch (err) {
      alert("Error deleting post");
    }
  };

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsPosting(true);
    try {
      const res = await apiFetch("/api/club-admin/feed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, event_id: eventId || null, links, image_urls: imageUrls }),
      });
      const data = await res.json();
      if (data.success) {
        setContent("");
        setEventId("");
        setLinks([]);
        setImageUrls([]);
        fetchFeed();
      } else {
        alert(data.error || "Failed to post");
      }
    } catch (err) {
      console.error(err);
      alert("Error posting to feed");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handlePost} className="bg-white dark:bg-gray-900 midnight:bg-[#0a0a0a] border border-gray-100 dark:border-gray-800 midnight:border-white/5 rounded-2xl p-5 sm:p-6 shadow-sm transition-all hover:shadow-md space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-gray-400 mb-1.5 flex items-center gap-2">
            <Send className="w-4 h-4 text-blue-500" /> Update Content
          </label>
          <textarea
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50/50 dark:bg-black/50 midnight:bg-black border border-gray-200 dark:border-gray-800 midnight:border-white/10 rounded-xl text-gray-900 dark:text-white midnight:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all min-h-[120px] resize-y"
            placeholder="What's happening in your club?"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-gray-400 mb-1.5 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-500" /> Attach Event ID (Optional)
            </label>
            <input
              type="text"
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50/50 dark:bg-black/50 midnight:bg-black border border-gray-200 dark:border-gray-800 midnight:border-white/10 rounded-xl text-gray-900 dark:text-white midnight:text-white focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 outline-none transition-all uppercase"
              placeholder="e.g. EVENT123"
            />
          </div>
          
          <div className="space-y-2 sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-gray-400 mb-1.5 flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-emerald-500" /> Add Link (Optional)
            </label>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={linkTitle}
                onChange={(e) => setLinkTitle(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50/50 dark:bg-black/50 midnight:bg-black border border-gray-200 dark:border-gray-800 midnight:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                placeholder="Title"
              />
              <div className="flex gap-2">
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="flex-1 px-3 py-2.5 bg-gray-50/50 dark:bg-black/50 midnight:bg-black border border-gray-200 dark:border-gray-800 midnight:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                  placeholder="URL (https://)"
                />
                <button
                  type="button"
                  onClick={handleAddLink}
                  className="px-4 py-2.5 bg-gray-100 dark:bg-gray-800 midnight:bg-white/[0.05] hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl text-sm font-medium transition-colors whitespace-nowrap"
                >
                  Add
                </button>
              </div>
            </div>
            {links.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                <AnimatePresence>
                  {links.map((link, idx) => (
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} key={idx} className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-lg text-xs font-medium border border-emerald-100 dark:border-emerald-800/50">
                      <span>{link.title}</span>
                      <button
                        type="button"
                        onClick={() => setLinks(links.filter((_, i) => i !== idx))}
                        className="text-emerald-500 hover:text-red-500 ml-1 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-gray-400 mb-1.5 flex items-center gap-2">
              <span className="text-xl">🖼️</span> Add Image (Optional)
            </label>
            <div className="flex gap-2 max-w-md">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1 px-3 py-2.5 bg-gray-50/50 dark:bg-black/50 midnight:bg-black border border-gray-200 dark:border-gray-800 midnight:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                placeholder="Image URL (https://)"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-2.5 bg-gray-100 dark:bg-gray-800 midnight:bg-white/[0.05] hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl text-sm font-medium transition-colors"
              >
                Add
              </button>
            </div>
            {imageUrls.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                <AnimatePresence>
                  {imageUrls.map((url, idx) => (
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} key={idx} className="relative group w-20 h-20 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 midnight:border-white/10 shadow-sm">
                      <img src={url} alt="Attached" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImageUrls(imageUrls.filter((_, i) => i !== idx))}
                        className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                      >
                        <Trash2 className="w-5 h-5 text-red-400" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800 midnight:border-white/5">
          <button
            type="submit"
            disabled={isPosting}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-sm transition-all active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
          >
            <Send className="w-4 h-4" />
            {isPosting ? "Posting..." : "Post to Feed"}
          </button>
        </div>
      </form>

      <div className="mt-12 max-w-4xl mx-auto">
        <h3 className="text-xl font-black text-gray-900 dark:text-white midnight:text-white mb-6 font-[family-name:var(--font-outfit)] flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 midnight:bg-indigo-500/10 flex items-center justify-center">
            <Send className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </span>
          Recent Posts
        </h3>
        
        {loading ? (
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        ) : feed.length === 0 ? (
          <div className="text-center py-12 bg-gray-50/50 dark:bg-gray-900/50 midnight:bg-white/[0.02] rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 midnight:border-white/10">
            <p className="text-gray-500 dark:text-gray-400 font-medium">No posts yet. Spark up your community feed!</p>
          </div>
        ) : (
          <div className="relative pl-6 sm:pl-8 border-l-2 border-gray-100 dark:border-gray-800 midnight:border-white/10 space-y-8 pb-10">
            <AnimatePresence>
              {feed.map((post, index) => (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} key={post.id} className="relative">
                  {/* Timeline dot */}
                  <div className="absolute w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-900/60 midnight:bg-indigo-500/20 border-2 border-white dark:border-gray-950 midnight:border-[#0a0a0a] -left-[33px] sm:-left-[41px] top-6 shadow-sm ring-1 ring-gray-200 dark:ring-gray-800 midnight:ring-white/10" />
                  
                  <div className="p-6 bg-white dark:bg-gray-900 midnight:bg-[#0a0a0a] rounded-2xl border border-gray-100 dark:border-gray-800 midnight:border-white/5 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                      <span className="text-sm font-medium text-gray-500 bg-gray-50 dark:bg-gray-800/50 midnight:bg-white/5 px-3 py-1 rounded-full">
                        {new Date(post.created_at).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                      <div className="flex items-center gap-2">
                        {post.event_id && (
                          <span className="flex items-center gap-1.5 px-3 py-1 bg-purple-50 dark:bg-purple-900/20 midnight:bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wide rounded-full border border-purple-100 dark:border-purple-800/50 midnight:border-purple-500/20">
                            <Calendar className="w-3.5 h-3.5" /> Event: {post.event_id}
                          </span>
                        )}
                        <button 
                          onClick={() => handleDeletePost(post.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 midnight:hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                          title="Delete post"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 mb-6 prose-p:leading-relaxed prose-a:text-indigo-500 hover:prose-a:text-indigo-600 prose-img:rounded-2xl">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
                    </div>

                    {post.image_urls && post.image_urls.length > 0 && (
                      <div className="mb-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {post.image_urls.map((url: string, i: number) => (
                          <div key={i} className="aspect-video sm:aspect-square overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800 midnight:border-white/5">
                            <img src={url} alt="Attached" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                          </div>
                        ))}
                      </div>
                    )}

                    {post.event_id && (
                      <div className="mb-6">
                        {(() => {
                          const eventDetails = events.find(e => e.eid === post.event_id);
                          if (eventDetails) {
                            return (
                              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 midnight:from-purple-500/5 midnight:to-indigo-500/5 border border-purple-100/50 dark:border-purple-900/30 midnight:border-white/5 rounded-2xl p-5 flex flex-col sm:flex-row gap-4 items-center">
                                <div className="flex-1 w-full">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2.5 py-0.5 rounded-md text-[10px] bg-purple-100 dark:bg-purple-900/50 midnight:bg-purple-500/20 text-purple-700 dark:text-purple-300 font-bold uppercase tracking-wider">Featured Event</span>
                                    {eventDetails.type && <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{eventDetails.type}</span>}
                                  </div>
                                  <h4 className="font-bold text-lg text-gray-900 dark:text-white midnight:text-white leading-tight mb-3 font-[family-name:var(--font-outfit)]">{eventDetails.title}</h4>
                                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-300">
                                    {eventDetails.date && <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-purple-500" /> {eventDetails.date}</div>}
                                    {eventDetails.location && <div className="flex items-center gap-1.5"><span className="text-purple-500 font-bold">📍</span> {eventDetails.location}</div>}
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    )}

                    {post.links && post.links.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 midnight:border-white/5 flex flex-wrap gap-2">
                        {post.links.map((link: any, i: number) => (
                          <a key={i} href={link.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 hover:underline bg-indigo-50 dark:bg-indigo-900/20 midnight:bg-indigo-500/10 px-4 py-2 rounded-xl transition-all hover:-translate-y-0.5 border border-indigo-100 dark:border-indigo-800/50 midnight:border-white/5">
                            {link.title} <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
