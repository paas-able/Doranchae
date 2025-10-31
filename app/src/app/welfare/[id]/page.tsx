"use client";

import React, { useEffect, useState } from "react";
import { SvgIcon } from "@mui/material";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import { useParams } from "next/navigation";
import { fetchWithAuth } from "@libs/fetchWithAuth";

interface WelfareResponse {
  servId: string;
  title: string;
  content: string;
  organization: string;
  region: string;
  localUploadDate: string;
  provider: string;
  sourceUrl: string;
}

const WelfareDetailPage = () => {
  const params = useParams();
  const id = params.id as string;

  const [welfare, setWelfare] = useState<WelfareResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isScraped, setIsScraped] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [scrapCount, setScrapCount] = useState(0);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await fetchWithAuth(`/api/welfare/${id}`);
        setWelfare(data.data);

        const likeRes = await fetchWithAuth(`/api/welfare/${id}/like-count`);
        setLikeCount(likeRes.data);

        const scrapRes = await fetchWithAuth(`/api/welfare/${id}/scrap-count`);
        setScrapCount(scrapRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetail();
  }, [id]);

  const handleLike = async () => {
    try {
      const method = isLiked ? "DELETE" : "POST";
      await fetchWithAuth(`/api/welfare/${id}/like`, { method });
      setIsLiked(!isLiked);
      setLikeCount((prev) => prev + (isLiked ? -1 : 1));
    } catch (err) {
      console.error(err);
    }
  };

  const handleScrap = async () => {
    try {
      const method = isScraped ? "DELETE" : "POST";
      await fetchWithAuth(`/api/welfare/${id}/scrap`, { method });
      setIsScraped(!isScraped);
      setScrapCount((prev) => prev + (isScraped ? -1 : 1));
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: welfare?.title,
          text: welfare?.content,
          url: welfare?.sourceUrl || window.location.href,
        });
      } else {
        const url = welfare?.sourceUrl || window.location.href;
        await navigator.clipboard.writeText(url);
        alert("URL이 복사되었습니다.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-24 text-center">로딩 중...</div>;
  if (!welfare) return <div className="p-24 text-center">정보를 찾을 수 없습니다.</div>;

  return (
    <div className="w-full flex flex-col">
      <div className="p-5 w-full">
        <h1 className="text-lg font-bold text-gray-900 mb-2">{welfare.title}</h1>
        <p className="text-sm text-gray-600 mb-4">
          {welfare.region} | {welfare.localUploadDate}
        </p>
        <p className="text-sm text-gray-500 mb-4">#{welfare.organization}</p>
        <hr className="mb-4" />
        <p className="text-sm text-gray-700 leading-relaxed mb-6">{welfare.content}</p>
        <div className="bg-gray-50 p-4 rounded text-sm text-gray-700 space-y-2 mb-6">
          <p><strong>운영 지역:</strong> {welfare.region}</p>
          <p><strong>제공 기관:</strong> {welfare.provider}</p>
          <p><strong>URL:</strong> <a href={welfare.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{welfare.sourceUrl}</a></p>
        </div>
        <div className="flex items-center justify-between">
          <button onClick={handleLike} className="flex items-center gap-2 text-gray-600 hover:text-red-600">
            <SvgIcon component={isLiked ? FavoriteIcon : FavoriteBorderOutlinedIcon} />
            <span className="text-sm font-medium">{likeCount} 좋아요</span>
          </button>
          <button onClick={handleScrap} className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
            <SvgIcon component={isScraped ? BookmarkIcon : BookmarkBorderOutlinedIcon} />
            <span className="text-sm font-medium">{scrapCount} 스크랩</span>
          </button>
          <button onClick={handleShare} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <SvgIcon component={ShareOutlinedIcon} />
            <span className="text-sm font-medium">공유하기</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelfareDetailPage;
