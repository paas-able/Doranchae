"use client";

import React, { useEffect, useState } from 'react';
import WelfareElement from "@components/WelfareElement";

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

const WelfarePage = () => {
    const [welfares, setWelfares] = useState<WelfareResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/welfare')
            .then(res => res.json())
            .then(data => {
                setWelfares(data.data.welfares);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-24 text-center">로딩 중...</div>;
    if (error) return <div className="p-24 text-center text-red-600">오류: {error}</div>;

    return (
        <div className="flex h-full flex-col justify-center overflow-clip">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
                복지 정보 페이지
            </h1>
            <div className={'h-full overflow-scroll'}>
                {welfares.map((welfare) => (
                    <WelfareElement 
                        key={welfare.id}
                        id={welfare.id}
                        title={welfare.title}
                        region={welfare.region}
                        image={'url'}
                        date={welfare.startDate}
                        tag={welfare.organization}
                        likes={0}
                        isScrap={false}
                    />
                ))}
            </div>
        </div>
    );
};

export default WelfarePage;