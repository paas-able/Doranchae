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
}

const WelfarePage = () => {
  const [welfares, setWelfares] = useState<WelfareResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWelfares = async () => {
      try {
        const res = await fetchWithAuth("/api/welfare");
        setWelfares(res.data.welfares);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchWelfares();
  }, []);

  if (loading) return <div className="p-24 text-center">로딩 중...</div>;
  if (error) return <div className="p-24 text-center text-red-600">오류: {error}</div>;

  return (
    <div className="flex h-full flex-col justify-center overflow-clip">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">복지 정보 페이지</h1>
      <div className="h-full overflow-scroll">
        {welfares.map((w) => (
          <WelfareElement
            key={w.servId}
            id={w.servId}
            title={w.title}
            region={w.region}
            image={"/default.png"}
            date={w.localUploadDate}
            tag={w.organization}
            likes={0}
            isScrap={false}
          />
        ))}
      </div>
    </div>
  );
};

export default WelfarePage;
