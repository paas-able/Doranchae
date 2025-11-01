'use client'

import useSWRInfinite from 'swr/infinite'
import { useEffect, useRef, useCallback } from 'react'// 1. useCallback 추가
import { useRouter } from 'next/navigation'

// --- 타입 정의 (변경 없음) ---
type ChatRoom = {
    id: string;
    opponentId: string;
    opponentName: string;
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

export function ChatList() {
    // 3. 훅은 컴포넌트 최상단에서 한 번만 호출
    const router = useRouter()

    // 4. getCookie 함수를 컴포넌트 내부로 이동 (useCallback 사용)
    const getCookie = useCallback((name: string): string | null => {
        if (typeof document === "undefined") return null;
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
        return null;
    }, []);

    // 5. authFetcher 함수를 컴포넌트 내부로 이동 (useCallback 사용)
    const authFetcher = useCallback(async (url: string) => {
        const token = getCookie("accessToken");
        if (!token) {
            console.error("인증 토큰이 쿠키에 없습니다. 로그인 필요.");
            router.push('/login'); // 이제 컴포넌트 스코프의 router에 접근 가능
            throw new Error("No access token found."); // SWR이 error 상태가 되도록 throw
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
    }, [getCookie, router]); // 의존성 배열에 getCookie와 router 추가

    // 6. getKey 함수도 useCallback으로 감싸 최적화
    const getKey = useCallback((pageIndex: number, previousPageData: ApiChatResponse | null) => {
        if (previousPageData && previousPageData.data.page.isLast) return null
        return `/api/chat/list?page=${pageIndex}`
    }, []);

    const { data, error, isLoading, size, setSize } = useSWRInfinite<ApiChatResponse>(
        getKey,
        authFetcher // 컴포넌트 내부에 정의된 authFetcher 사용
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
            <h2 className="text-sm text-gray-500 mb-2 px-4">
                채팅 목록 ({chatRooms.length} / 1000)
            </h2>
            <div className="divide-y divide-gray-200">
                {chatRooms.map((room) => (
                    <div
                        key={room.id}
                        className="flex items-center p-4 space-x-3 cursor-pointer hover:bg-gray-100"
                        // `penpal/chat/`이 아닌 `chat/`으로 이동해야 할 수 있습니다.
                        // PenpalApp.tsx에서 이미 /penpal 경로에 있습니다.
                        onClick={() => router.push(`penpal/chat/${room.id}`)}
                    >
                        <span className="text-4xl">😊</span>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-lg truncate">
                                {room.opponentName}
                            </p>
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