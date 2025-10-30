'use client'

import useSWR from 'swr'


type Penpal = {
    id: number;
    name: string;
    icon: 'smiley' | 'default';
}
const fetcher = (url: string) => fetch(url).then((res) => res.json())

const penpalTextDark = "#4A4A4A";

export function PenpalList() {
    const { data, error, isLoading } = useSWR<Penpal[]>('/api/penpals', fetcher)

    if (error) return <div>데이터를 불러오는데 실패했습니다.</div>
    if (isLoading) return <div>로딩 중...</div>
    if (!data) return null

    return (
        <div>
            <h2 className="text-sm text-gray-500 mb-4">
                펜팔 목록 ({data.length}/1000)
            </h2>
            <div className="space-y-4">
                {data.map((penpal) => (
                    <div key={penpal.id} className="flex items-center space-x-3">
                        <span
                            className="font-medium text-lg"
                            style={{ color: penpalTextDark }}
                        >
                  {penpal.name}
                </span>
                    </div>
                ))}
            </div>
        </div>
    )
}