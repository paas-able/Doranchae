"use client"

import useSWR from 'swr'
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import PenpalListItem from "@app/penpal/[id]/history/PenpalListItem";

type Response = {
    penpals: Penpal[],
    page: PageInfo
}

type Penpal = {
    id: number;
    opponentInfo: OpponentInfo
}

type OpponentInfo = {
    userId: string,
    nickname: string,
    birthDate: string,
    gender: string,
    interests: string[]
}

type PageInfo = {
    isFirst: boolean,
    isLast: boolean,
    currentPage: number,
    totalPages: number
}

const penpalTextDark = "#4A4A4A";


export function PenpalList() {
    const router = useRouter();
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const toggleMenu = (id: number) => {
        setOpenMenuId(prevId => (prevId === id ? null : id));
    };
    const [accessToken, setAccessToken] = useState<string | null>(null)
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

    const fetcher = (url: string) =>
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

    const swrKey = accessToken ? '/api/penpal/list?page=0&size=1000&sort=updatedAt,desc' : null
    const {
        data,
        error,
        isLoading
    } = useSWR<Response>(swrKey, fetcher)
    console.log(data)

    if (error) return <div>데이터를 불러오는데 실패했습니다.</div>
    if (isLoading) return <div>로딩 중...</div>
    if (!data) return null


    const handler = (opponent: OpponentInfo) => {
        localStorage.setItem('opponent_id', opponent.userId)
    }

    return (
        <div>
            <h2 className="text-sm text-gray-500 mb-4">
                펜팔 목록 ({data.penpals.length}/1000)
            </h2>
            <div className="space-y-4">
                {data.penpals.map((penpal) => (
                    <PenpalListItem
                        key={penpal.id}
                        penpal={penpal}
                        penpalTextDark={penpalTextDark}
                        openMenuId={openMenuId}
                        toggleMenu={toggleMenu}
                        handler={handler}
                        // [!!] 오류 해결: accessToken Prop을 추가합니다.
                        accessToken={accessToken} 
                    />
                ))}
            </div>
        </div>
    )
}
