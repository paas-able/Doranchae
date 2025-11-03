'use client'

import PenpalCard from "./PenpalCard";
import useSWR from 'swr';
import {useParams, useRouter} from "next/navigation";
import Link from "next/link";
import {useEffect, useState} from "react";

type Response = {
    messages: Message[],
    page: PageInfo
}

type Message = {
    id: string;
    content: string,
    sentAt: string,
    status: string,
    isFromUser: boolean
}

type PageInfo = {
    isFirst: boolean,
    isLast: boolean,
    currentPage: number,
    totalPages: number
}

type OpponentInfo = {
    userId: string,
    nickname: string,
    interests: string[]
}

export default function PenpalHistoryPage() {
    const router = useRouter();
    const params = useParams()
    const url = `/api/penpal/${params.id}/messages?page=0&size=1000`
    const [accessToken, setAccessToken] = useState<String | null>(null)
    const [opponent, setOpponent] = useState<OpponentInfo|null>(null)

    const getAccessToken = () => {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // 'accessToken='로 시작하는 쿠키를 찾습니다.
            if (cookie.startsWith('accessToken=')) {
                return cookie.substring('accessToken='.length);
            }
        }
        return null;
    };

    const fetcher = (url: string | null) =>
        fetch(url, {
            method: "GET",
            headers: {"Authorization": `Bearer ${accessToken}`}
        }).then((res) => {
            return res.json()
        }).then((it) => {
            if (it.isSuccess) {
                return it.data
            } else {
                throw new Error('문제가 발생했습니다.');
            }
        })

    const getOpponentInfo = () => {
        const opponentId = localStorage.getItem("opponent_id")
        const url = accessToken ? `/api/user/${opponentId}` : null
        fetcher(url)
            .then(r => {
                const opponent = {
                    userId: r.userId,
                    nickname: r.nickname,
                    interests: r.interests
                }
                console.log(opponent)
                setOpponent(opponent)
            })
    }

    useEffect(() => {
        const token = getAccessToken();
        if (!token) {
            // 토큰이 없다면 바로 로그인 페이지로 이동시키거나 오류 처리
            console.error("인증 토큰이 쿠키에 없습니다. 로그인 필요.");
            router.push('/login'); // useRouter가 MyPage에 임포트되어 있어야 합니다.
            return;
        } else {
            setAccessToken(token)
        }
    }, []);

    useEffect(() => {
        if (accessToken) {
            getOpponentInfo()
        }
    }, [accessToken]);

    const {
        data,
        error,
        isLoading
    } = useSWR<Response>(url, fetcher)

    if (error) return <div>데이터를 불러오는데 실패했습니다.</div>
    if (isLoading) return <div>로딩 중...</div>
    if (!data) return null

    const opponent_nickname = localStorage.getItem("opponent_nickname")

    return (
        <div className="flex h-dvh flex-col bg-[#FDFAE3] z-0 overscroll-none pt-3">
            <header className="flex items-center justify-between bg-[#FDFAE3] p-4">
                <Link href={"/penpal"} className="text-gray-600">뒤로가기</Link>
            </header>

            <div className="flex-1 overflow-hidden">
                <section className="bg-[#FDFAE3] p-4">
                    <div className="flex items-center gap-3">
                        <div className="grid h-12 w-12 place-items-center rounded-full bg-gray-200 text-4xl">
                            🙂
                        </div>
                        <div>
                            <p className="font-bold">
                                {`${opponent?.nickname}`}
                            </p>
                            <p className="text-sm text-gray-600">
                                {`#${opponent?.interests[0]} #${opponent?.interests[1]} #${opponent?.interests[2]}`}
                            </p>
                        </div>
                    </div>
                </section>

                <main className="flex flex-col gap-4 p-4 pt-0 overflow-y-auto">
                    {data.messages.map((penpal) => (
                        <PenpalCard key={penpal.id} {...penpal} />
                    ))}
                </main>
            </div>
        </div>
    );
}
