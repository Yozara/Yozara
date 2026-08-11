"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import { Heart, Bookmark, BookmarkCheck } from "lucide-react";

export default function MediaActions({
  mediaId,
  mediaType,
  title,
  coverImage,
}: {
  mediaId: number;
  mediaType: "ANIME" | "MANGA";
  title: string;
  coverImage: string;
}) {
  const [user, setUser] = useState<any>(null);
  const [liked, setLiked] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);

      // Get like count
      const { count } = await supabase
        .from("likes")
        .select("*", { count: "exact", head: true })
        .eq("media_id", mediaId)
        .eq("media_type", mediaType);
      setLikeCount(count || 0);

      if (data.user) {
        // Check if liked
        const { data: likeData } = await supabase
          .from("likes")
          .select("id")
          .eq("user_id", data.user.id)
          .eq("media_id", mediaId)
          .eq("media_type", mediaType)
          .single();
        setLiked(!!likeData);

        // Check watchlist
        const { data: watchData } = await supabase
          .from("watchlist")
          .select("id")
          .eq("user_id", data.user.id)
          .eq("media_id", mediaId)
          .eq("media_type", mediaType)
          .single();
        setInWatchlist(!!watchData);
      }
      setLoading(false);
    };
    init();
  }, [mediaId]);

  const toggleLike = async () => {
    if (!user) { router.push("/signup"); return; }
    if (liked) {
      await supabase.from("likes").delete()
        .eq("user_id", user.id).eq("media_id", mediaId).eq("media_type", mediaType);
      setLikeCount((c) => c - 1);
    } else {
      await supabase.from("likes").insert({ user_id: user.id, media_id: mediaId, media_type: mediaType });
      setLikeCount((c) => c + 1);
    }
    setLiked(!liked);
  };

  const toggleWatchlist = async () => {
    if (!user) { router.push("/signup"); return; }
    if (inWatchlist) {
      await supabase.from("watchlist").delete()
        .eq("user_id", user.id).eq("media_id", mediaId).eq("media_type", mediaType);
    } else {
      await supabase.from("watchlist").insert({
        user_id: user.id,
        media_id: mediaId,
        media_type: mediaType,
        title,
        cover_image: coverImage,
      });
    }
    setInWatchlist(!inWatchlist);
  };

  if (loading) return null;

  return (
    <div className="flex items-center gap-3 mt-4">
      {/* Like button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleLike}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
          liked
            ? "bg-red-500/20 border border-red-500/50 text-red-400"
            : "bg-white/5 border border-white/10 text-white/60 hover:border-red-500/30 hover:text-red-400"
        }`}
      >
        <Heart size={16} className={liked ? "fill-red-400" : ""} />
        {likeCount > 0 && <span>{likeCount}</span>}
        {liked ? "Liked" : "Like"}
      </motion.button>

      {/* Watchlist button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleWatchlist}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
          inWatchlist
            ? "bg-brand-pink/20 border border-brand-pink/50 text-brand-pink"
            : "bg-white/5 border border-white/10 text-white/60 hover:border-brand-pink/30 hover:text-brand-pink"
        }`}
      >
        {inWatchlist ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
        {inWatchlist ? (mediaType === "ANIME" ? "In Watchlist" : "In Readlist") : (mediaType === "ANIME" ? "Add to Watchlist" : "Add to Readlist")}
      </motion.button>

      {!user && (
        <p className="text-white/30 text-xs">
          <a href="/login" className="text-brand-pink hover:underline">Log in</a> to like or save
        </p>
      )}
    </div>
  );
}
