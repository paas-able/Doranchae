'use client'

import React, {useEffect, useState} from "react";
import {useRouter, useSearchParams} from 'next/navigation';

const sendPenpalFetcher = async (url: string, token: string, data: { sendTo: String | null; content: string }) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json", // JSON 데이터임을 명시
            "Authorization": `Bearer ${token}` // 'Authentication' 대신 'Authorization'을 일반적으로 사용
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        // 서버에서 에러 응답이 오면 예외 발생
        throw new Error(`Failed to send penpal: ${response.statusText}`);
    }

    // 성공적으로 전송되면 응답 본문(JSON) 반환
    return response.json();
}

export default function PenpalWritePage() {
    const router = useRouter();
    const params = useSearchParams()
    const targetType = params.get('target');
    const [sendToView, setSendToView] = useState("로딩 중")
    const [sendTo, setSendTo] = useState<String|null>("로딩 중")
    const [penpalContent, setPenpalContent] = useState("")
    const [isSending, setIsSending] = useState(false)
    const [accessToken, setAccessToken] = useState<String | null>(null)
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

    useEffect(() => {
        if (targetType === "random") {
            setSendToView("랜덤")
            setSendTo(null)
        } else {
            setSendToView(localStorage.getItem("opponent_nickname"))
            setSendTo(localStorage.getItem("opponent_userId"))
        }
    }, []);

    const sendPenpalHandler = async () => {
        if (penpalContent.length < 5) {
            alert("내용이 너무 짧습니다.");
            return;
        }

        setIsSending(true); // 전송 시작

        try {
            const sendBody: { sendTo: String | null; content: string } = {
                sendTo: sendTo,
                content: penpalContent
            };

            const data = await sendPenpalFetcher(
                'http://localhost:8082/api/penpal/send',
                accessToken!!,
                sendBody
            );

            console.log("전송 성공:", data);
            alert("편지 전송 성공!");
            // TODO: 성공 후 페이지 이동 로직 추가 (예: router.push('/home'))

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
                    <button className="rounded-md px-3 py-1 text-black" onClick={sendPenpalHandler}>
                        전송하기
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
                />
            </main>
        </div>
    );
}