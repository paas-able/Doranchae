"use client";
import React, { useState, useEffect } from "react";
import { Bookmark, ThumbsUp } from "lucide-react";
import { fetchWithAuth } from "@libs/fetchWithAuth";

interface WelfareElementProps {
  id: string;
  title: string;
  region: string;
  date: string;
  tag: string;
  likes: number;
  isScrap: boolean;
  isLike: boolean;
  onScrapChange?: (scrapId: string, isScraped: boolean) => void;
  onLikeChange?: (likeId: string, isLiked: boolean) => void;
}

const WelfareElement: React.FC<WelfareElementProps> = ({
  id,
  title,
  region,
  date,
  tag,
  likes,
  isScrap,
  isLike,
  onScrapChange,
  onLikeChange,
}) => {
  const [likeCount, setLikeCount] = useState(likes);
  const [isLiked, setIsLiked] = useState(isLike);
  const [isScraped, setIsScraped] = useState(isScrap);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsScraped(isScrap);
    setIsLiked(isLike);
    console.log(`[${id}] isScrap: ${isScrap}, isLike: ${isLike}`);
  }, [isScrap, isLike, id]);

  const handleLike = async () => {
    if (loading) return;
    setLoading(true);
    try {
      if (isLiked) {
        await fetchWithAuth(`/api/welfare/${id}/like`, { method: "DELETE" });
        setIsLiked(false);
        setLikeCount(likeCount - 1);
        onLikeChange?.(id, false);
      } else {
        await fetchWithAuth(`/api/welfare/${id}/like`, { method: "POST" });
        setIsLiked(true);
        setLikeCount(likeCount + 1);
        onLikeChange?.(id, true);
      }
    } catch (err) {
      console.error("좋아요 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleScrap = async () => {
    if (loading) return;
    setLoading(true);
    try {
      if (isScraped) {
        await fetchWithAuth(`/api/welfare/${id}/scrap`, { method: "DELETE" });
        setIsScraped(false);
        onScrapChange?.(id, false);
      } else {
        await fetchWithAuth(`/api/welfare/${id}/scrap`, { method: "POST" });
        setIsScraped(true);
        onScrapChange?.(id, true);
      }
    } catch (err) {
      console.error("스크랩 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col pb-4 border-b relative mb-4" style={{ borderColor: "#D4A574" }}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-base font-bold leading-tight flex-1 pr-2" style={{ color: "#4D4D4D" }}>
          {title}
        </h3>
        <button
          onClick={handleScrap}
          disabled={loading}
          className="flex-shrink-0 pt-0.5 transition-colors hover:opacity-80 cursor-pointer"
          style={{ color: isScraped ? "#4D4D4D" : "#B3B3B3" }}
        >
          <Bookmark size={18} className={isScraped ? "fill-current" : ""} />
        </button>
      </div>

      <div className="text-xs mb-2" style={{ color: "#9E9E9E" }}>
        <span>{tag}</span>
        <span className="mx-1">|</span>
        <span>{date}</span>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-xs" style={{ color: "#9E9E9E" }}>
          #{region}
        </p>
        <button
          onClick={handleLike}
          disabled={loading}
          className="flex items-center gap-1 transition-colors hover:opacity-80 cursor-pointer"
          style={{ color: isLiked ? "#4D4D4D" : "#9E9E9E" }}
        >
          <span className="text-xs">{likeCount}</span>
          <ThumbsUp size={16} className={isLiked ? "fill-current" : ""} />
        </button>
      </div>
    </div>
  );
};

export default WelfareElement;