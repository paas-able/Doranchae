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

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // [!!] 1. 로딩 상태 시작 (수정/추가)
        setIsLoading(true); 
        setError('');

        // 코드 중복 제거를 위해 try 블록 바깥으로 이동
        console.log("로그인 시도:", { id, password });


        try {
        const response = await fetch('/api/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ loginId: id, password: password }),
            credentials: 'include'
        });

        if (response.ok) {
            const result = await response.json();
            const token = result.accessToken;

            console.log("로그인 성공:", token);
            // 토큰을 쿠키에 저장 (1시간 유효)
            document.cookie = `accessToken=${token}; path=/; max-age=3600;`;
            
            
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
};

    return (
        // 1. 전체 페이지 컨테이너
        <div 
            className="mx-auto w-full max-w-[430px] flex flex-col items-center justify-start min-h-[calc(100vh-130px)] p-4"
            style={{ backgroundColor: Bg }}
        >
            {/* 2. 상단 헤더 (임시) */}
            <div className="w-full p-5 text-center text-xl font-bold text-gray-800">
                도란채
            </div>

            {/* 3. 로그인 폼 영역 */}
            <div className="w-full max-w-sm flex flex-col items-center pt-15">
                <div className="mb-10">
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

                    {/* 3-3. 에러 메시지 */}
                    <p className="text-xs text-red-500 px-1 h-4">
                        {error}
                    </p>

                    {/* 3-4. 로그인 버튼 */}
                    <button 
                        type="submit"
                        className="w-full py-3 rounded-lg text-gray-800 font-semibold transition-colors duration-200 disabled:opacity-50" 
                        style={{ backgroundColor: M5 }}
                        onMouseOver={e => e.currentTarget.style.backgroundColor = MM}
                        onMouseOut={e => e.currentTarget.style.backgroundColor = M5}
                        disabled={isLoading}
                    >
                        {isLoading ? '로그인 중...' : '로그인하기'}
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