'use client'

import useSWR from 'swr'

// 채팅 데이터 타입 정의
type Chat = {
    id: number;
    name: string;
    message: string;
    time: string;
    icon: 'smiley' | 'default';
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const penpalTextDark = "#4A4A4A";

export function ChatList() {
    const { data, error, isLoading } = useSWR<Chat[]>('/api/chats', fetcher)

    if (error) return <div>데이터를 불러오는데 실패했습니다.</div>
    if (isLoading) return <div>로딩 중...</div>
    if (!data) return null

    return (
        <div>
            <h2 className="text-sm text-gray-500 mb-4">
                채팅 목록 ({data.length}/1000)
            </h2>
            <div className="space-y-4">
                {data.map((chat) => (
                    <div key={chat.id} className="flex items-start space-x-3">
                        <div className="flex-1">
                            <div className="flex justify-between items-baseline">
                    <span
                        className="font-medium text-lg"
                        style={{ color: penpalTextDark }}
                    >
                      {chat.name}
                    </span>
                                <span className="text-xs text-gray-400">{chat.time}</span>
                            </div>
                            <p className="text-sm text-gray-600">{chat.message}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}