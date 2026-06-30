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
        apiFetch(`/api/club-admin/feed?club_id=${clubId}`),
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
      <form onSubmit={handlePost} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Update Content</label>
          <textarea
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all min-h-[100px] resize-y"
            placeholder="What's happening in your club?"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Attach Event ID (Optional)</label>
            <input
              type="text"
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all uppercase"
              placeholder="e.g. EVENT123"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
              <LinkIcon className="w-4 h-4 text-blue-500" /> Add Link (Optional)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={linkTitle}
                onChange={(e) => setLinkTitle(e.target.value)}
                className="flex-1 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Title"
              />
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="flex-1 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="URL (https://)"
              />
              <button
                type="button"
                onClick={handleAddLink}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl text-sm font-medium transition-colors"
              >
                Add
              </button>
            </div>
            {links.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                <AnimatePresence>
                  {links.map((link, idx) => (
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} key={idx} className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-lg text-xs font-medium border border-blue-100 dark:border-blue-800">
                      <span>{link.title}</span>
                      <button
                        type="button"
                        onClick={() => setLinks(links.filter((_, i) => i !== idx))}
                        className="text-blue-500 hover:text-red-500 ml-1 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
              Add Image (Optional)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Image URL (https://)"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl text-sm font-medium transition-colors"
              >
                Add
              </button>
            </div>
            {imageUrls.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                <AnimatePresence>
                  {imageUrls.map((url, idx) => (
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} key={idx} className="relative group w-16 h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                      <img src={url} alt="Attached" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImageUrls(imageUrls.filter((_, i) => i !== idx))}
                        className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isPosting}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-all active:scale-[0.98] disabled:opacity-70"
          >
            <Send className="w-4 h-4" />
            {isPosting ? "Posting..." : "Post to Feed"}
          </button>
        </div>
      </form>

      <div className="mt-8">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Recent Posts</h3>
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
          <p className="text-gray-500 text-sm">No posts yet.</p>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {feed.map((post) => (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={post.id} className="p-5 bg-white dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-medium text-gray-500">
                      {new Date(post.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                    <div className="flex items-center gap-2">
                      {post.event_id && (
                        <span className="flex items-center gap-1 px-3 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 text-xs font-semibold rounded-full border border-purple-100 dark:border-purple-800/50">
                          <Calendar className="w-3 h-3" /> Event: {post.event_id}
                        </span>
                      )}
                      <button 
                        onClick={() => handleDeletePost(post.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="prose prose-sm dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 mb-4 prose-p:leading-relaxed prose-a:text-blue-500 hover:prose-a:text-blue-600 prose-img:rounded-xl">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
                  </div>

                  {post.image_urls && post.image_urls.length > 0 && (
                    <div className="mb-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {post.image_urls.map((url: string, i: number) => (
                        <img key={i} src={url} alt="Attached" className="w-full h-32 object-cover rounded-xl border border-gray-100 dark:border-gray-800" />
                      ))}
                    </div>
                  )}

                  {post.event_id && (
                    <div className="mb-4">
                      {(() => {
                        const eventDetails = events.find(e => e.eid === post.event_id);
                        if (eventDetails) {
                          return (
                            <div className="bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 rounded-xl p-4 flex flex-col sm:flex-row gap-3 items-center">
                              <div className="flex-1 w-full">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="px-2 py-0.5 rounded text-[10px] bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-bold uppercase tracking-wider">Featured Event</span>
                                  {eventDetails.type && <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{eventDetails.type}</span>}
                                </div>
                                <h4 className="font-bold text-gray-900 dark:text-white leading-tight mb-2">{eventDetails.title}</h4>
                                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-600 dark:text-gray-300">
                                  {eventDetails.date && <div className="flex items-center gap-1"><Calendar className="w-3 h-3 text-purple-500" /> {eventDetails.date}</div>}
                                  {eventDetails.location && <div className="flex items-center gap-1"><span className="text-purple-500 font-bold">📍</span> {eventDetails.location}</div>}
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
                    <div className="mt-4 flex flex-wrap gap-2">
                      {post.links.map((link: any, i: number) => (
                        <a key={i} href={link.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg transition-colors border border-blue-100 dark:border-blue-800/50">
                          {link.title} <ExternalLink className="w-3 h-3" />
                        </a>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
