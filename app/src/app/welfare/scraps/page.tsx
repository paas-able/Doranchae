"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import { fetchWithAuth } from "@libs/fetchWithAuth";

interface WelfareResponse {
  servId: string;
  title: string;
  content?: string;
  organization?: string;
  region?: string;
  localUploadDate?: string;
  provider?: string;
  sourceUrl?: string;
}

const ScrapListPage = () => {
  const router = useRouter();
  const [scraps, setScraps] = useState<WelfareResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScraps = async () => {
      try {
        const response = await fetchWithAuth("/api/welfare/user/me/scraps");
        console.log("SCRAP RESPONSE >>>", response);

        const list = response?.data?.welfares ?? response?.data?.data?.welfares ?? [];
        setScraps(list);
      } catch (err) {
        console.error("FETCH ERROR >>>", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchScraps();
  }, []);

  if (loading) return <div className="p-24 text-center">로딩 중...</div>;
  if (error) return <div className="p-24 text-center text-red-600">오류: {error}</div>;
  if (scraps.length === 0)
    return <div className="p-24 text-center text-gray-600">스크랩한 항목이 없습니다.</div>;

  return (
    <div className="p-4" style={{ backgroundColor: "#FFFDF7" }}>
      <h1 className="text-2xl font-bold text-center mb-6" style={{ color: "#4D4D4D" }}>
        스크랩 목록
      </h1>

      {scraps.map((welfare) => (
        <div
          key={welfare.servId}
          className="p-4 rounded-lg mb-4 cursor-pointer transition hover:opacity-80"
          style={{ backgroundColor: "#FDFAE3" }}
          onClick={() => router.push(`/welfare/${welfare.servId}`)}
        >
          <div className="flex justify-between items-start mb-3">
            <h2 className="text-lg font-semibold flex-1" style={{ color: "#4D4D4D" }}>
              {welfare.title}
            </h2>
            <a
              href={welfare.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium ml-2"
              style={{ color: "#9E9E9E" }}
              onClick={(e) => e.stopPropagation()}
            >
              공유하기
            </a>
          </div>

          <p className="text-sm mb-2" style={{ color: "#4D4D4D" }}>
            {welfare.region} {welfare.organization}
          </p>
          <p className="text-sm" style={{ color: "#9E9E9E" }}>
            {welfare.localUploadDate}
          </p>

          <div className="flex justify-end mt-3">
            <ThumbUpOutlinedIcon style={{ fontSize: "24px", color: "#9E9E9E" }} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScrapListPage;