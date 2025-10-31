'use client'

import useSWRInfinite from 'swr/infinite'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

type ChatRoom = {
    id: string;
    opponentId: string;
}

type PageInfo = {
    isFirst: boolean;
    isLast: boolean;
    currentPage: number;
    totalPages: number;
}

type ChatRoomData = {
    chatRooms: ChatRoom[];
    page: PageInfo;
}

type ApiChatResponse = {
    isSuccess: boolean;
    code: string;
    message: string;
    data: ChatRoomData;
}

// 쿠키에서 JWT 가져오기
const getAuthTokenFromCookie = (): string | null => {
    if (typeof document !== 'undefined') {
        const match = document.cookie.match(new RegExp('(^| )jwt_token=([^;]+)'))
        if (match) return match[2]
    }
    return null
}

const authFetcher = async (url: string) => {
    const token = getAuthTokenFromCookie()
    if (!token) throw new Error('인증 토큰이 없습니다.')

    const res = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    })

    if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || '데이터를 불러오는데 실패했습니다.')
    }

    return res.json()
}

export function ChatList() {
    const router = useRouter()

    const getKey = (pageIndex: number, previousPageData: ApiChatResponse | null) => {
        if (previousPageData && previousPageData.data.page.isLast) return null
        return `/api/chat/list?page=${pageIndex}`
    }

    const { data, error, isLoading, size, setSize } = useSWRInfinite<ApiChatResponse>(
        getKey,
        authFetcher
    )

    const chatRooms: ChatRoom[] = data
        ? data.flatMap(apiResponse => apiResponse.data.chatRooms)
        : []

    const isLast = data && data[data.length - 1]?.data.page.isLast
    const isLoadingMore = isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined')

    const loaderRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const target = entries[0]
                if (target.isIntersecting && !isLoadingMore && !isLast) {
                    setSize(size + 1)
                }
            },
            { threshold: 1.0 }
        )

        const currentLoader = loaderRef.current
        if (currentLoader) observer.observe(currentLoader)
        return () => {
            if (currentLoader) observer.unobserve(currentLoader)
        }
    }, [loaderRef, isLoadingMore, isLast, size, setSize])

    if (error) return <div>데이터를 불러오는데 실패했습니다: {error.message}</div>
    if (!data && isLoading) return <div>채팅 목록 로딩 중...</div>

    return (
        <div>
            <h2 className="text-sm text-gray-500 mb-4">채팅 목록</h2>
            <div className="space-y-4">
                {chatRooms.map((room) => (
                    <div
                        key={room.id}
                        className="p-4 border rounded-lg shadow-sm cursor-pointer"
                        onClick={() => router.push(`/chat/${room.id}`)} // 클릭 시 채팅방 페이지 이동
                    >
                        <p className="font-semibold">Chat Room: {room.id}</p>
                        <p className="text-gray-600">Opponent: {room.opponentId}</p>
                    </div>
                ))}

                <div ref={loaderRef} className="h-10">
                    {isLoadingMore && !isLast && (
                        <div className="text-center text-gray-500">채팅 목록을 더 불러오는 중...</div>
                    )}
                </div>

                {!isLoading && chatRooms.length === 0 && (
                    <div className="text-center text-gray-400 py-4">채팅방이 없습니다.</div>
                )}

                {isLast && chatRooms.length > 0 && (
                    <div className="text-center text-gray-400 py-4">마지막 채팅방입니다.</div>
                )}
            </div>
        </div>
    )
}
