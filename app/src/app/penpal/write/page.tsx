"use client"

import React, {useEffect, useState} from "react";
import {useRouter, useSearchParams} from 'next/navigation';
// [!!] 경로 수정: src/libs/fetchWithAuth -> 상대 경로 (3단계 위)
import { fetchWithAuth } from "../../../libs/fetchWithAuth"; 

// [!!] String 대신 string 원시 타입을 사용합니다.
const sendPenpalFetcher = async (url: string, token: string, data: { sendTo: string | null; content: string }) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error(`Failed to send penpal: ${response.statusText}`);
    }
    return response.json();
}

export default function PenpalWritePage() {
    const router = useRouter();
    const params = useSearchParams()
    const targetType = params.get('target');
    const [sendToView, setSendToView] = useState("로딩 중")
    // string 원시 타입으로 수정
    const [sendTo, setSendTo] = useState<string | null>("로딩 중") 
    const [penpalContent, setPenpalContent] = useState("")
    const [isSending, setIsSending] = useState(false)
    // string 원시 타입으로 수정
    const [accessToken, setAccessToken] = useState<string | null>(null)
    
    // ... (getAccessToken 유지) ...
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
            console.error("인증 토큰이 쿠키에 없습니다. 로그인 필요.");
            router.push('/login'); 
            return;
        } else {
            setAccessToken(token)
        }
    }, []);

    useEffect(() => {
        if (targetType === "random") {
            setSendToView("랜덤")
            setSendTo(null)
        } else {
            // [!!] 수정: localStorage.getItem 결과가 null일 경우 빈 문자열로 대체합니다.
            const opponentNickname = localStorage.getItem("opponent_nickname")
            const opponentUserId = localStorage.getItem("opponent_userId")

            // [!!] Type 오류 해결: null일 경우 "상대방"이라는 string 값으로 대체
            setSendToView(opponentNickname || "상대방") 
            setSendTo(opponentUserId) // setSendTo는 string | null 타입을 받으므로 그대로 유지
        }
    }, [targetType]); // targetType이 변경될 때마다 실행되도록 의존성 추가

    const sendPenpalHandler = async () => {
        if (penpalContent.length < 5) {
            alert("내용이 너무 짧습니다.");
            return;
        }

        setIsSending(true); // 전송 시작

        try {
            const token = accessToken;
            if (!token) {
                router.push('/login');
                return;
            }

            const sendBody: { sendTo: string | null; content: string } = {
                sendTo: sendTo,
                content: penpalContent
            };

            const data = await sendPenpalFetcher(
                '/api/penpal/send',
                token, 
                sendBody
            );

            console.log("전송 성공:", data);
            alert("편지 전송 성공!");
            router.push('/penpal')

        } catch (error) {
            console.error("전송 실패:", error);
            alert("편지 전송에 실패했습니다.");
        } finally {
            setIsSending(false); // 전송 완료 (성공/실패 무관)
        }
    }

    return (
        <div className="flex h-screen flex-col bg-[#FDFAE3]">
            {/* 상단 헤더 */}
            <header className="flex items-center justify-between p-4">
                <button className="text-black">취소</button>
                <div className="flex items-center gap-4">
                    {/*<button className=" text-black">임시저장</button>*/}
                    <button className="rounded-md px-3 py-1 text-black" onClick={sendPenpalHandler} disabled={isSending}>
                        {isSending ? "전송 중..." : "전송하기"}
                    </button>
                </div>
            </header>

            {/* 메인 콘텐츠 */}
            <main className="flex flex-1 flex-col gap-4 p-4">
                {/* 수신인 정보 */}
                <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-gray-200 text-3xl">
                        🙂
                    </div>
                    <span className="font-semibold">{`수신인: ${sendToView}`}</span>
                </div>

                {/* 편지 쓰는 공간 */}
                <textarea
                    placeholder="글을 이곳에 써주세요"
                    className="h-[600px] rounded-lg border-2 border-[#CCA57A] bg-transparent p-3 outline-none resize-none"
                    value={penpalContent}
                    onChange={(e) => setPenpalContent(e.target.value)}
                    disabled={isSending}
                />
            </main>
        </div>
    );
}
