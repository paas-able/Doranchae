"use client";
import React, { useEffect, useState } from "react";
import { SvgIcon } from "@mui/material";
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
    <div className="p-4">
      {scraps.map((welfare) => (
        <div key={welfare.servId} className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">{welfare.title}</h2>
          <p className="text-sm text-gray-500">
            {welfare.region} | {welfare.localUploadDate}
          </p>
          {welfare.sourceUrl && (
            <a
              href={welfare.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 text-sm underline"
            >
              상세보기
            </a>
          )}
          <div className="flex justify-end mt-2">
            <SvgIcon component={ThumbUpOutlinedIcon} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScrapListPage;
