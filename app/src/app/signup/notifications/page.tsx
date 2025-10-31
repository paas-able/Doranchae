"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { saveTempSignupData, getTempSignupData, clearTempSignupData } from '@/libs/tempSignupData';

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
    
    // 1. 알림 설정 동의 상태 (기본값: 네)
    const [isAgreed, setIsAgreed] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    // 2. 최종 제출 핸들러: 모든 데이터 통합 및 API 전송 (디버그 모드)
    const finalSubmit = async (agreed: boolean) => {
        setIsLoading(true);
        setIsAgreed(agreed);
        
        // 1. 알림 동의 여부 저장
        saveTempSignupData({
            userSetting: {
                // API 구조에 맞게 notificationPush는 알림 동의 여부로 사용
                notificationPush: agreed, 
                termsAgree: true, // 약관 동의는 이미 이전 페이지에서 확인되었으므로 true로 간주
            }
        });

        const signupData = getTempSignupData();
        
        // [!!] 2. 실제 API 통신 코드
        try {

            const finalPayload = {
                ...signupData,
            };

            console.log("--- FINAL API REQUEST (JOIN) ---");
            console.log("Endpoint: /api/user/join");
            console.log("Payload:", finalPayload);
            console.log("------------------------------");

            const response = await fetch('/api/user/join', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(finalPayload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '회원가입에 실패했습니다.');
            }

            // 2-2. 성공 시 처리
            console.log("API Success: 회원가입 완료.");
            
            clearTempSignupData(); // 임시 저장 데이터 제거
            
            alert("회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.");
            router.push('/login'); 

        } catch (error) { 
            const errorMessage = (error instanceof Error) ? error.message : '알 수 없는 오류'; 
            console.error("Error during signup:", errorMessage);
            alert(`회원가입 실패: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // 1. 페이지 전체
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
                    onClick={() => finalSubmit(false)} // '아니요'
                    className="w-full py-3 rounded-lg text-gray-800 font-semibold"
                    style={{ backgroundColor: M5, opacity: 0.7 }} // '아니요'는 약간 연하게
                >
                    아니요
                </button>
                <button 
                    type="button"
                    onClick={() => finalSubmit(true)} // '네'
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