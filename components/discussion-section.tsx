"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/api-client";
import { Send, User as UserIcon, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface Comment {
  id: number;
  content: string;
  created_at: string;
  user: {
    name: string;
    avatar: string;
  };
}

export function DiscussionSection({ seriesId }: { seriesId: number }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [seriesId]);

  const fetchComments = async () => {
    try {
      const res = await axiosInstance.get(
        `/member/series/${seriesId}/comments`
      );
      setComments(res.data.data);
    } catch (error) {
      console.error("Failed to load comments", error);
    } finally {
      setInitialLoading(false);
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      await axiosInstance.post(`/member/series/${seriesId}/comments`, {
        content: newComment,
      });
      setNewComment("");
      toast.success("Comment posted!");
      fetchComments();
    } catch (error) {
      toast.error("Failed to post comment");
    } finally {
      setLoading(false);
    }
  };

  const getAvatarUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `http://localhost:8080/${url}`;
  };
  return (
    <div className="mt-6 bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-black dark:text-white flex items-center gap-2">
          Discussion
          <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-xs text-black dark:text-white font-bold">
            {comments.length}
          </span>
        </h3>
      </div>

      {/* Input Form */}
      <form onSubmit={handlePostComment} className="flex gap-3 mb-8">
        <div className="flex-1 relative">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Ask a question or share your thoughts..."
            className="w-full pl-5 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate6600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm placeholder:text-slate-400"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !newComment.trim()}
          className="bg-blue-500 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-90 shadow-md"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">Post</span>
        </button>
      </form>

      {/* Comment List */}
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {initialLoading ? (
          <div className="text-center py-4 text-slate-400 animate-pulse">
            Loading discussion...
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900">
            <p className="text-slate-500 text-sm">
              No comments yet. Be the first to start the discussion!
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="flex gap-4 group animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              {/* Avatar */}
              <div className="flex-shrink-0 mt-1">
                {comment.user.avatar ? (
                  <img
                    src={getAvatarUrl(comment.user.avatar)}
                    alt={comment.user.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-sm"
                  />
                ) : (
                  <div className="w-10 h-10 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full flex items-center justify-center text-slate-400">
                    <UserIcon className="w-5 h-5" />
                  </div>
                )}
              </div>

              {/* PERBAIKAN 3: Bubble Chat Putih Solid (bg-white). */}
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-1 ml-1">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    {comment.user.name}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {new Date(comment.created_at).toLocaleDateString()} •{" "}
                    {new Date(comment.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {/* Bubble Background SOLID */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  {comment.content}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
