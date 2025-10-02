"use client";

import React, { useEffect, useState } from 'react';
import { SvgIcon } from "@mui/material";
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';

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

interface WelfareWithLikes extends WelfareResponse {
    likes: number;
}

const ScrapListPage = () => {
    const [scraps, setScraps] = useState<WelfareWithLikes[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const userId = "user123"; // 실제로는 로그인된 사용자 ID 사용

    useEffect(() => {
        const fetchScraps = async () => {
            try {
                const response = await fetch(`/api/welfare/user/${userId}/scraps`);
                const data = await response.json();
                
                // 각 항목의 좋아요 수 조회
                const scrapsWithLikes = await Promise.all(
                    data.data.welfares.map(async (welfare: WelfareResponse) => {
                        try {
                            const likeRes = await fetch(`/api/welfare/${welfare.id}/like-count`);
                            const likeData = await likeRes.json();
                            const likes = likeData.data || 0;

                            return {
                                ...welfare,
                                likes
                            };
                        } catch (err) {
                            console.error(`Error fetching likes for ${welfare.id}:`, err);
                            return {
                                ...welfare,
                                likes: 0
                            };
                        }
                    })
                );

                setScraps(scrapsWithLikes);
                setLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
                setLoading(false);
            }
        };

        fetchScraps();
    }, []);

    const handleShare = async (welfare: WelfareResponse) => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: welfare.title,
                    text: welfare.content,
                    url: welfare.sourceUrl || window.location.href,
                });
            } else {
                const shareUrl = welfare.sourceUrl || window.location.href;
                navigator.clipboard.writeText(shareUrl);
                alert('URL이 복사되었습니다.');
            }
        } catch (err) {
            console.error('Share error:', err);
        }
    };

    if (loading) return <div className="p-24 text-center">로딩 중...</div>;
    if (error) return <div className="p-24 text-center text-red-600">오류: {error}</div>;
    if (scraps.length === 0) return <div className="p-24 text-center text-gray-600">스크랩한 항목이 없습니다.</div>;

    return (
        <div className="w-full flex flex-col">
            <div className="p-3 border-b border-gray-200 text-center">
                <h1 className="text-2xl font-bold">스크랩 목록</h1>
            </div>

            <div className="w-full overflow-y-auto">
                {scraps.map((scrap) => (
                    <div key={scrap.id} className="bg-yellow-50 p-5 m-4 rounded-lg border border-yellow-100">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">{scrap.title}</h2>
                            <button 
                                onClick={() => handleShare(scrap)}
                                className="text-gray-600 hover:text-gray-900 flex items-center gap-1 ml-4 flex-shrink-0"
                            >
                                <span className="text-base">공유하기</span>
                            </button>
                        </div>

                        <p className="text-base text-gray-600 mb-4">{scrap.region} | {scrap.startDate}</p>

                        <div className="flex items-center justify-end">
                            <SvgIcon component={ThumbUpOutlinedIcon} sx={{ width: '24px', height: '24px' }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ScrapListPage;