"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
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
    <div className="w-full flex flex-col min-h-screen" style={{ backgroundColor: "#FFFDF7" }}>
      {/* 컨텐츠 */}
      <div className="flex-1 p-5">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{welfare.title}</h1>
        <p className="text-sm text-gray-600 mb-2">
          {welfare.region} | {welfare.localUploadDate}
        </p>
        <p className="text-sm text-gray-500 mb-4">#{welfare.organization}</p>
        <hr className="mb-4" style={{ borderColor: "#D4A574" }} />
        <p className="text-sm text-gray-700 leading-relaxed mb-6">{welfare.content}</p>
        <p className="text-sm text-gray-600">
          URL: <a href={welfare.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{welfare.sourceUrl}</a>
        </p>
      </div>

      {/* 버튼 영역 - 가로 정렬 */}
      <div className="p-5 border-t flex items-center justify-around" style={{ borderColor: "#D4A574" }}>
        <button 
          onClick={handleLike} 
          className="flex flex-col items-center gap-1 text-gray-600 hover:text-red-600 transition"
        >
          {isLiked ? <FavoriteIcon style={{color: '#EF4444', fontSize: '24px'}} /> : <FavoriteBorderOutlinedIcon style={{fontSize: '24px'}} />}
          <span className="text-xs font-medium">{likeCount} 좋아요</span>
        </button>
        
        <button 
          onClick={handleScrap} 
          className="flex flex-col items-center gap-1 text-gray-600 hover:text-blue-600 transition"
        >
          {isScraped ? <BookmarkIcon style={{color: '#3B82F6', fontSize: '24px'}} /> : <BookmarkBorderOutlinedIcon style={{fontSize: '24px'}} />}
          <span className="text-xs font-medium">{scrapCount} 스크랩</span>
        </button>
        
        <button 
          onClick={handleShare} 
          className="flex flex-col items-center gap-1 text-gray-600 hover:text-gray-900 transition"
        >
          <ShareOutlinedIcon style={{fontSize: '24px'}} />
          <span className="text-xs font-medium">공유하기</span>
        </button>
      </div>
    </div>
  );
};

export default WelfareDetailPage;