'use client'

import useSWRInfinite from 'swr/infinite'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

// 1. ChatRoom 타입에 opponentName 추가
type ChatRoom = {
    id: string;
    opponentId: string;
    opponentName: string; // API 응답에 맞춰 추가
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

const router = useRouter();
const getCookie = (name: string): string | null => {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
}

const authFetcher = async (url: string) => {
    const token = getCookie("accessToken");
    if (!token) {
        if (!token) {
            console.error("인증 토큰이 쿠키에 없습니다. 로그인 필요.");
            router.push('/login');
            return;
        };
    }

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
        return `http://chat:8084/api/chat/list?page=${pageIndex}`
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
            {/* 2. 이미지와 유사하게 헤더 텍스트 수정 (카운트는 일단 제외) */}
            <h2 className="text-sm text-gray-500 mb-2 px-4">
                채팅 목록 ({chatRooms.length} / 1000)
            </h2>

            {/* 3. 리스트 UI 구성을 위해 'divide-y' 사용 */}
            <div className="divide-y divide-gray-200">
                {chatRooms.map((room) => (
                    // 4. 요청한 이미지 레이아웃으로 JSX 수정
                    <div
                        key={room.id}
                        className="flex items-center p-4 space-x-3 cursor-pointer hover:bg-gray-100"
                        onClick={() => router.push(`penpal/chat/${room.id}`)}
                    >
                        {/* 프로필 사진 (이모지) */}
                        <span className="text-4xl">😊</span>

                        {/* 이름 (flex-1로 남은 공간 차지, min-w-0와 truncate로 긴 이름 처리) */}
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-lg truncate">
                                {room.opponentName}
                            </p>
                            {/* 요청에 따라 메시지와 시간은 표시하지 않습니다. */}
                        </div>
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
            </div>
        </div>
    )
}