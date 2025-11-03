"use client";
import React, { useEffect, useState } from "react";
import WelfareElement from "@components/WelfareElement";
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
  likeCount: number;
  scrapCount: number;
}

const WelfarePage = () => {
  const [welfares, setWelfares] = useState<WelfareResponse[]>([]);
  const [userScraps, setUserScraps] = useState<Set<string>>(new Set());
  const [userLikes, setUserLikes] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const welfaresRes = await fetchWithAuth("/api/welfare");
        console.log("welfaresRes:", welfaresRes);

        const welfaresList = Array.isArray(welfaresRes) ? welfaresRes : [];
        console.log("welfaresList:", welfaresList);
        setWelfares(welfaresList as WelfareResponse[]);

        // 사용자 스크랩 가져오기
        try {
          const scrapsRes = await fetchWithAuth("/api/welfare/user/me/scraps");
          console.log("scrapsRes:", scrapsRes);
          const scrapsList = (scrapsRes.data?.data?.welfares || scrapsRes.data?.welfares || []) as WelfareResponse[];
          const scrapIds = new Set<string>(scrapsList.map((w: WelfareResponse) => w.servId));
          setUserScraps(scrapIds);
          console.log("userScraps:", scrapIds);
        } catch (scrapErr) {
          console.log("Scrap 정보 조회 실패:", scrapErr);
          setUserScraps(new Set());
        }

        // 사용자 좋아요 가져오기
        try {
          const likesRes = await fetchWithAuth("/api/welfare/user/me/likes");
          console.log("likesRes:", likesRes);
          const likesList = (likesRes.data?.data?.welfares || likesRes.data?.welfares || []) as WelfareResponse[];
          const likeIds = new Set<string>(likesList.map((w: WelfareResponse) => w.servId));
          setUserLikes(likeIds);
          console.log("userLikes:", likeIds);
        } catch (likeErr) {
          console.log("Like 정보 조회 실패:", likeErr);
          setUserLikes(new Set());
        }
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleScrapChange = (scrapId: string, isScraped: boolean) => {
    setUserScraps((prev) => {
      const newSet = new Set(prev);
      if (isScraped) {
        newSet.add(scrapId);
      } else {
        newSet.delete(scrapId);
      }
      return newSet;
    });
  };

  const handleLikeChange = (likeId: string, isLiked: boolean) => {
    setUserLikes((prev) => {
      const newSet = new Set(prev);
      if (isLiked) {
        newSet.add(likeId);
      } else {
        newSet.delete(likeId);
      }
      return newSet;
    });
  };

  if (loading) return <div className="p-24 text-center">로딩 중...</div>;
  if (error) return <div className="p-24 text-center text-red-600">오류: {error}</div>;

  return (
    <div className="mx-auto flex flex-col" style={{ width: "430px", height: "932px", backgroundColor: "#FFFDF7" }}>
      <div className="px-5 pt-5 pb-12">
        <h1 className="text-2xl font-bold mb-1" style={{ color: "#4D4D4D" }}>
          복지 정보
        </h1>
        <p className="text-sm" style={{ color: "#9E9E9E" }}>
          나에게 맞는 복지 정보를 찾아보세요!
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-5">
        {welfares.length === 0 ? (
          <div className="py-8 text-center text-sm" style={{ color: "#B3B3B3" }}>
            표시할 복지 정보가 없습니다.
          </div>
        ) : (
          <div className="flex flex-col">
            {welfares.map((w) => (
              <WelfareElement
                key={w.servId}
                id={w.servId}
                title={w.title}
                region={w.region}
                date={w.localUploadDate}
                tag={w.organization}
                likes={w.likeCount}
                isScrap={userScraps.has(w.servId)}
                isLike={userLikes.has(w.servId)}
                onScrapChange={handleScrapChange}
                onLikeChange={handleLikeChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WelfarePage;