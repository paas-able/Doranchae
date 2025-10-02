"use client";

import React, { useEffect, useState } from "react";
import { SvgIcon } from "@mui/material";
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import { useParams } from "next/navigation";

interface WelfareResponse {
    id: string;
    title: string;
    content: string;
    organization: string;
    region: string;
    localUploadDate: string;
    startDate: string;
    endDate: string | null;
    provider: string;
    sourceUrl: string;
}

const WelfareDetailPage = () => {
    const params = useParams();
    const id = params.id as string;
    
    const [welfare, setWelfare] = useState<WelfareResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLiked, setIsLiked] = useState(false);
    const [isScraped, setIsScraped] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [scrapCount, setScrapCount] = useState(0);
    const userId = "user123"; // 실제로는 로그인된 사용자 ID 사용

    useEffect(() => {
        const fetchWelfareDetail = async () => {
            try {
                // 복지 정보 조회
                const response = await fetch(`/api/welfare/${id}`);
                if (!response.ok) throw new Error('Failed to fetch welfare');
                const data = await response.json();
                setWelfare(data.data);

                // 좋아요 수 조회
                const likeRes = await fetch(`/api/welfare/${id}/like-count`);
                const likeData = await likeRes.json();
                setLikeCount(likeData.data || 0);

                // 스크랩 수 조회
                const scrapRes = await fetch(`/api/welfare/${id}/scrap-count`);
                const scrapData = await scrapRes.json();
                setScrapCount(scrapData.data || 0);

                // 사용자가 좋아요했는지 확인
                const userLikesRes = await fetch(`/api/welfare/user/${userId}/likes`);
                const userLikesData = await userLikesRes.json();
                const isUserLiked = userLikesData.data.welfares.some((w: WelfareResponse) => w.id === id);
                setIsLiked(isUserLiked);

                // 사용자가 스크랩했는지 확인
                const userScrapsRes = await fetch(`/api/welfare/user/${userId}/scraps`);
                const userScrapsData = await userScrapsRes.json();
                const isUserScraped = userScrapsData.data.welfares.some((w: WelfareResponse) => w.id === id);
                setIsScraped(isUserScraped);
                
                setLoading(false);
            } catch (err) {
                console.error('Error:', err);
                setError(err instanceof Error ? err.message : 'Unknown error');
                setLoading(false);
            }
        };

        if (id) {
            fetchWelfareDetail();
        }
    }, [id]);

    const handleLike = async () => {
        try {
            if (isLiked) {
                await fetch(`/api/welfare/${id}/like?userId=${userId}`, { method: 'DELETE' });
                setLikeCount(Math.max(0, likeCount - 1));
                setIsLiked(false);
            } else {
                await fetch(`/api/welfare/${id}/like?userId=${userId}`, { method: 'POST' });
                setLikeCount(likeCount + 1);
                setIsLiked(true);
            }
        } catch (err) {
            console.error('Like error:', err);
        }
    };

    const handleScrap = async () => {
        try {
            if (isScraped) {
                await fetch(`/api/welfare/${id}/scrap?userId=${userId}`, { method: 'DELETE' });
                setScrapCount(Math.max(0, scrapCount - 1));
                setIsScraped(false);
            } else {
                await fetch(`/api/welfare/${id}/scrap?userId=${userId}`, { method: 'POST' });
                setScrapCount(scrapCount + 1);
                setIsScraped(true);
            }
        } catch (err) {
            console.error('Scrap error:', err);
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
                // 복사 기능 (공유 API 미지원 시)
                const shareUrl = welfare?.sourceUrl || window.location.href;
                navigator.clipboard.writeText(shareUrl);
                alert('URL이 복사되었습니다.');
            }
        } catch (err) {
            console.error('Share error:', err);
        }
    };

    if (loading) return <div className="p-24 text-center">로딩 중...</div>;
    if (error) return <div className="p-24 text-center text-red-600">오류: {error}</div>;
    if (!welfare) return <div className="p-24 text-center">정보를 찾을 수 없습니다.</div>;

    return (
        <div className="w-full flex flex-col">
            {/* 컨텐츠 */}
            <div className="w-full overflow-y-auto">
                <div className="p-5 w-full">
                    {/* 제목 */}
                    <h1 className="text-lg font-bold text-gray-900 mb-2">{welfare.title}</h1>

                    {/* 지역, 날짜 */}
                    <p className="text-sm text-gray-600 mb-4">{welfare.region} | {welfare.startDate}</p>

                    {/* 태그 */}
                    <p className="text-sm text-gray-500 mb-4">#{welfare.organization}</p>

                    <hr className="mb-4" />

                    {/* 상세 내용 */}
                    <p className="text-sm text-gray-700 leading-relaxed mb-6">{welfare.content}</p>

                    {/* 운영정보 */}
                    <div className="bg-gray-50 p-4 rounded text-sm text-gray-700 space-y-2 mb-6">
                        <p><strong>운영 지자체:</strong> {welfare.region}</p>
                        <p><strong>관심주제:</strong> {welfare.organization}</p>
                        <p><strong>제공기관:</strong> {welfare.provider}</p>
                        <p><strong>URL:</strong> <a href={welfare.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">{welfare.sourceUrl}</a></p>
                    </div>

                    <hr className="mb-4" />

                    {/* 액션 버튼 */}
                    <div className="flex items-center justify-between">
                        <button 
                            onClick={handleLike}
                            className="flex items-center gap-2 text-gray-600 hover:text-red-600"
                        >
                            <SvgIcon component={isLiked ? FavoriteIcon : FavoriteBorderOutlinedIcon} />
                            <span className="text-sm font-medium">{likeCount} 좋아요</span>
                        </button>

                        <button 
                            onClick={handleScrap}
                            className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
                        >
                            <SvgIcon component={isScraped ? BookmarkIcon : BookmarkBorderOutlinedIcon} />
                            <span className="text-sm font-medium">{scrapCount} 스크랩</span>
                        </button>

                        <button 
                            onClick={handleShare}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                        >
                            <SvgIcon component={ShareOutlinedIcon} />
                            <span className="text-sm font-medium">공유하기</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WelfareDetailPage;