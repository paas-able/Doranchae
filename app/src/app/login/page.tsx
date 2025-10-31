"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// --- 색상 변수 (필요시 사용) ---
const Bg = "#FDFAED";
const M1 = "#CCA57A";
const M2 = "#F8EDD0";
const M3 = "#FDFAE3";
const M4 = "#EAEDCC";
const M5 = "#CED5B2";
const MM = "#8B9744";
// ---------------------

const LoginPage = () => {
    const router = useRouter();
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log("로그인 시도:", { id, password });
        setError('');

        try {
            const response = await fetch('/api/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ loginId: id, password: password }),
                credentials: 'include'
            });

            if (response.ok) {
                const result = await response.json();
                console.log("로그인 성공:", result.accessToken);
                // TODO: 토큰 저장
                // localStorage.setItem('accessToken', result.accessToken);
                router.push('/');
            } else {

                setError("아이디 또는 비밀번호가 틀렸습니다.");
            }
        } catch (err) {
            console.error("API 통신 오류:", err);
            setError("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
        } finally {
            setIsLoading(false);
        }
        // --- 디버그용 목업 시나리오 ---
        console.log("--- DEBUG MODE: API 요청 ---");
        console.log("API: 로그인");
        console.log("Endpoint: /api/user/login");
        console.log("Method: POST");
        console.log("Body:", JSON.stringify({ loginId: id, password: password }));
        console.log("----------------------------");

        await new Promise(resolve => setTimeout(resolve, 1000));

        if (id === "testUser" && password === "1234!") {
            // --- 시나리오 1: 로그인 성공 ---
            const mockResponse = {
                accessToken: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJxd2VyMTIzNCIsImlhdCI6MTc2MTc2ODY1NCwiZXhwIjoxNzYxNzcyMjU0fQ.wfys2-7Te1K0DxsxipSGAgh8jZBAgnimLaze2XRO2XRgSiFZJeU1fMouUeW7CzOovL8MQ7-oFB7Qc1o9ExNBaw"
            };
            console.log("DEBUG: 로그인 성공", mockResponse);
            
            // TODO: (선택) 토큰을 스토리지(쿠키 등)에 저장
            // localStorage.setItem('accessToken', mockResponse.accessToken);

            // 메인 페이지(예: '/')로 이동
            router.push('/'); 

        } else {
            // --- 시나리오 2: 로그인 실패 ---
            const mockError = "아이디 또는 비밀번호가 틀렸습니다.";
            console.log("DEBUG: 로그인 실패", mockError);
            setError(mockError);
        }

        setIsLoading(false);
    };

    return (
        // 1. 전체 페이지 컨테이너 (시안의 연한 배경색 적용)
        <div 
            className="mx-auto w-full max-w-[430px] flex flex-col items-center justify-start min-h-screen p-4"
            style={{ backgroundColor: Bg }}
        >
            {/* 2. 상단 헤더 (임시) */}
            <div className="w-full p-5 text-center text-xl font-bold text-gray-800">
                도란채
            </div>

            {/* 3. 로그인 폼 영역 */}
            <div className="w-full max-w-sm flex flex-col items-center pt-15">
                <div className="mb-10"> {/* 이미지 컨테이너, 마진만 남김 */}
                    <Image 
                        src="/big_logo.png"
                        alt="도란채 로고"
                        width={150}
                        height={150}
                    />
                </div>

                {/* 3-2. 로그인 폼 */}
                <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
                    <input
                        type="text"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CCA57A]"
                        placeholder="아이디"
                        required
                        disabled={isLoading}
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CCA57A]"
                        placeholder="비밀번호"
                        required
                        disabled={isLoading}
                    />

                    {/* 3-3. 에러 메시지 (시안 참고) */}
                    <p className="text-xs text-red-500 px-1 h-4">
                        {error}
                    </p>

                    {/* 3-4. 로그인 버튼 */}
                    <button 
                        type="submit"
                        className="w-full py-3 rounded-lg text-gray-800 font-semibold transition-colors duration-200"
                        style={{ backgroundColor: M5 }} // M2 색상 적용
                        onMouseOver={e => e.currentTarget.style.backgroundColor = MM}
                        onMouseOut={e => e.currentTarget.style.backgroundColor = M5}
                    >
                        로그인하기
                    </button>
                </form>

                {/* 3-5. 하단 링크 (아이디찾기 | 비밀번호찾기 | 회원가입) */}
                <div className="mt-6 text-sm text-gray-600">
                    <Link href="/find-id" className="hover:underline">아이디찾기</Link>
                    <span className="mx-2">|</span>
                    <Link href="/find-password" className="hover:underline">비밀번호찾기</Link>
                    <span className="mx-2">|</span>
                    <Link href="/signup" className="hover:underline">회원가입</Link>
                </div>
            </div>

        </div>
    );
};

export default LoginPage;