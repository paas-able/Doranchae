"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // 1. Image 컴포넌트 import

// --- 색상 변수 ---
const Bg = "#FDFAED";
const M1 = "#CCA57A";
const M2 = "#F8EDD0"; 
const M3 = "#FDFAE3";
const M4 = "#EAEDCC";
const M5 = "#CED5B2"; // '네', '아니요' 버튼
const MM = "#8B9744"; 
// ---------------------

const NotificationsPage = () => {
    const router = useRouter();
    
    // 1. 알림 설정 완료 핸들러
    const handleFinish = (agreed: boolean) => {
        console.log("알림 설정 동의:", agreed);
        // [!!] 모든 회원가입 절차 완료. 로그인 페이지로 이동
        alert("회원가입이 완료되었습니다!");
        router.push('/login'); 
    };

    return (
        // 1. 페이지 전체 (flex-1 + justify-between)
        <div 
            className="mx-auto w-full max-w-[430px] flex flex-col items-center justify-between flex-1 p-4"
            style={{ backgroundColor: Bg }}
        >
            {/* 자식 1: 상단 컨텐츠 영역 (중앙 정렬) */}
            <div className="w-full max-w-sm flex flex-col items-center pt-20">
                
                {/* 1. 알림 아이콘 (임시) */}
                <div 
                    className="w-40 h-40 rounded-full flex items-center justify-center mb-8"
                    style={{ backgroundColor: M2 }} // 임시 배경색
                >
                    {/* [!!] 실제 아이콘 이미지가 필요합니다. 
                       <Image src="/notification-bell.png" alt="알림" width={100} height={100} /> 
                    */}
                    <span className="text-6xl">🔔</span> 
                </div>

                {/* 2. 타이틀 */}
                <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                    펜팔이나 채팅이 도착하면<br />알림을 드릴까요?
                </h2>
                <p className="text-sm text-gray-600 mb-8 text-center">
                    추후 설정에서 알림 설정을 변경할 수 있습니다.
                </p>
            </div>

            {/* 자식 2: 하단 '네/아니요' 버튼 영역 */}
            <div className="w-full max-w-sm grid grid-cols-2 gap-3 pb-6">
                <button 
                    type="button"
                    onClick={() => handleFinish(false)} // '아니요'
                    className="w-full py-3 rounded-lg text-gray-800 font-semibold"
                    style={{ backgroundColor: M5, opacity: 0.7 }} // '아니요'는 약간 연하게
                >
                    아니요
                </button>
                <button 
                    type="button"
                    onClick={() => handleFinish(true)} // '네'
                    className="w-full py-3 rounded-lg text-gray-800 font-semibold"
                    style={{ backgroundColor: M5 }}
                >
                    네
                </button>
            </div>
        </div>
    );
};

export default NotificationsPage;