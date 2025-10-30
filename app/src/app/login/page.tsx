"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';


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
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    // TODO: 로그인 에러 메시지 상태
    // const [error, setError] = useState(''); 

    const handleLogin = (e) => {
        e.preventDefault();
        console.log("로그인 시도:", { id, password });
        // TODO: 로그인 API 연동
    };

    return (
        // 1. 전체 페이지 컨테이너 (시안의 연한 배경색 적용)
        <div 
            className="mx-auto w-full max-w-[430px] flex flex-col items-center justify-start min-h-screen p-4"
            style={{ backgroundColor: Bg }}
        >
            {/* 2. 상단 헤더 (임시) */}
            <div className="w-full p-4 text-center text-xl font-bold text-gray-800">
                도란채
            </div>

            {/* 3. 로그인 폼 영역 */}
            <div className="w-full max-w-sm flex flex-col items-center pt-10">
                <div className="mb-10"> {/* 이미지 컨테이너, 마진만 남김 */}
                    <Image 
                        src="/big_logo.png"
                        alt="도란채 로고"
                        width={150}
                        height={150}
                  
                    />
                </div>

                {/* 3-2. 로그인 폼 */}
                <form onSubmit={handleLogin} className="w-full flex flex-col gap-3">
                    <input
                        type="text"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CCA57A]"
                        placeholder="아이디"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CCA57A]"
                        placeholder="비밀번호"
                        required
                    />

                    {/* 3-3. 에러 메시지 (시안 참고) */}
                    <p className="text-xs text-red-500 px-1 h-4">
                        {/* {error} */}
                        {/* 임시: 아이디는 영문소문자/숫자 조합입니다. */}
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