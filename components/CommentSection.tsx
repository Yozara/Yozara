"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Reply, Trash2, Send } from "lucide-react";

type Comment = {
  id: string;
  user_id: string;
  content: string;
  parent_id: string | null;
  created_at: string;
  profiles?: { username?: string; avatar_url?: string };
  replies?: Comment[];
};

export default function CommentSection({
  mediaId,
  mediaType,
}: {
  mediaId: number;
  mediaType: "ANIME" | "MANGA";
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<{ id: string; username: string } | null>(null);
  const [replyText, setReplyText] = useState("");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    fetchComments();
  }, [mediaId]);

  const fetchComments = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("comments")
      .select("*, profiles(username, avatar_url)")
      .eq("media_id", mediaId)
      .eq("media_type", mediaType)
      .is("parent_id", null)
      .order("created_at", { ascending: false });

    const { data: replies } = await supabase
      .from("comments")
      .select("*, profiles(username, avatar_url)")
      .eq("media_id", mediaId)
      .eq("media_type", mediaType)
      .not("parent_id", "is", null)
      .order("created_at", { ascending: true });

    const withReplies = (data || []).map((c: Comment) => ({
      ...c,
      replies: (replies || []).filter((r: Comment) => r.parent_id === c.id),
    }));

    setComments(withReplies);
    setLoading(false);
  };

  const submitComment = async () => {
    if (!user || !newComment.trim()) return;
    setSubmitting(true);
    await supabase.from("comments").insert({
      user_id: user.id,
      media_id: mediaId,
      media_type: mediaType,
      content: newComment.trim(),
      parent_id: null,
    });
    setNewComment("");
    await fetchComments();
    setSubmitting(false);
  };

  const submitReply = async () => {
    if (!user || !replyText.trim() || !replyTo) return;
    setSubmitting(true);
    await supabase.from("comments").insert({
      user_id: user.id,
      media_id: mediaId,
      media_type: mediaType,
      content: replyText.trim(),
      parent_id: replyTo.id,
    });
    setReplyText("");
    setReplyTo(null);
    await fetchComments();
    setSubmitting(false);
  };

  const deleteComment = async (id: string) => {
    await supabase.from("comments").delete().eq("id", id);
    await fetchComments();
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const CommentBubble = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isReply ? "ml-10 mt-3" : "mt-4"}`}
    >
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-brand-pink/30 border border-brand-pink/50 flex items-center justify-center shrink-0 text-xs font-bold text-brand-pink">
        {comment.profiles?.username?.[0]?.toUpperCase() || "?"}
      </div>

      <div className="flex-1">
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-brand-pink text-xs font-bold">
              {comment.profiles?.username || "Anonymous"}
            </span>
            <span className="text-white/30 text-[10px]">{timeAgo(comment.created_at)}</span>
          </div>
          <p className="text-white/80 text-sm leading-relaxed">{comment.content}</p>
        </div>

        <div className="flex items-center gap-3 mt-1 px-2">
          {!isReply && user && (
            <button
              onClick={() => setReplyTo({ id: comment.id, username: comment.profiles?.username || "user" })}
              className="flex items-center gap-1 text-white/40 hover:text-brand-pink text-xs transition-colors"
            >
              <Reply size={12} /> Reply
            </button>
          )}
          {user?.id === comment.user_id && (
            <button
              onClick={() => deleteComment(comment.id)}
              className="flex items-center gap-1 text-white/40 hover:text-red-400 text-xs transition-colors"
            >
              <Trash2 size={12} /> Delete
            </button>
          )}
        </div>

        {/* Reply input */}
        {replyTo?.id === comment.id && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-2 flex gap-2"
          >
            <input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Reply to ${replyTo.username}...`}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-brand-pink/50"
              onKeyDown={(e) => e.key === "Enter" && submitReply()}
            />
            <button
              onClick={submitReply}
              disabled={submitting}
              className="px-3 py-2 rounded-xl bg-brand-pink text-white text-xs font-bold hover:bg-brand-pink/80 transition-all"
            >
              <Send size={12} />
            </button>
            <button
              onClick={() => setReplyTo(null)}
              className="px-3 py-2 rounded-xl bg-white/10 text-white/60 text-xs hover:bg-white/20 transition-all"
            >
              ✕
            </button>
          </motion.div>
        )}

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="border-l border-white/10 ml-4 pl-2">
            {comment.replies.map((reply) => (
              <CommentBubble key={reply.id} comment={reply} isReply />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <MessageCircle size={22} className="text-brand-pink" />
        Comments
        <span className="text-white/40 text-base font-normal">({comments.length})</span>
      </h2>

      {/* New comment input */}
      {user ? (
        <div className="flex gap-3 mb-8">
          <div className="w-9 h-9 rounded-full bg-brand-pink/30 border border-brand-pink/50 flex items-center justify-center shrink-0 text-sm font-bold text-brand-pink">
            {user.email?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 flex gap-2">
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-pink/50 transition-colors"
              onKeyDown={(e) => e.key === "Enter" && submitComment()}
            />
            <button
              onClick={submitComment}
              disabled={submitting || !newComment.trim()}
              className="px-4 py-3 rounded-xl bg-brand-pink text-white font-bold hover:bg-brand-pink/80 transition-all disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-8 p-4 rounded-xl bg-white/5 border border-white/10 text-center">
          <p className="text-white/60 text-sm">
            <a href="/login" className="text-brand-pink hover:underline">Log in</a> to leave a comment
          </p>
        </div>
      )}

      {/* Comments list */}
      {loading ? (
        <div className="text-center py-8 text-white/40 text-sm">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-white/40 text-sm">No comments yet. Be the first!</div>
      ) : (
        <AnimatePresence>
          {comments.map((comment) => (
            <CommentBubble key={comment.id} comment={comment} />
          ))}
        </AnimatePresence>
      )}
    </div>
  );
}
