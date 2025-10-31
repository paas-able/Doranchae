"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { saveTempSignupData, getTempSignupData, clearTempSignupData, UserJoinPayload } from '@/libs/tempSignupData'; 

// --- 색상 변수 ---
const Bg = "#FDFAED";
const M1 = "#CCA57A";
const M2 = "#F8EDD0"; 
const M3 = "#FDFAE3";
const M4 = "#EAEDCC";
const M5 = "#CED5B2";
const MM = "#8B9744"; 
// ---------------------

// [!!] 1. 'any' 타입을 제거하기 위해 인터페이스 정의 (유지)
interface ValidationError {
    field: string;
    defaultMessage: string;
}
interface SpringErrorResponse {
    message?: string;
    // [!!] 2. 'errors'가 배열이 아닌 객체(Map)일 수 있음을 반영
    errors?: Record<string, string> | ValidationError[]; 
}
// ---------------------


const NotificationsPage = () => {
    const router = useRouter();
    
    const [isAgreed, setIsAgreed] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const finalSubmit = async (agreed: boolean) => {
        setIsLoading(true);
        setIsAgreed(agreed);
        
        // ... (saveTempSignupData 로직 유지) ...
        saveTempSignupData({
            userSetting: {
                notificationPush: agreed, 
                termsAgree: true,
                notificationSMS: false, // 필수 필드 채우기
                notificationNOK: false, // 필수 필드 채우기
            }
        });

        const signupData = getTempSignupData();
        
        try {
            // ... (finalPayload 구성 및 콘솔 로그 유지) ...
            const finalPayload: Partial<UserJoinPayload> = {
                ...signupData,
                nickname: signupData.nickname || signupData.loginId || "임시닉네임", 
                NOKInfo: signupData.NOKInfo || undefined,
            };
            
            console.log("--- FINAL API REQUEST (JOIN) ---");
            console.log("Payload:", JSON.stringify(finalPayload, null, 2));
            console.log("------------------------------");


            const response = await fetch('/api/user/join', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalPayload),
            });

            // [!!] 3. 오류 처리 로직 (수정됨)
            if (!response.ok) {
                const errorText = await response.text(); 
                console.error("--- SERVER VALIDATION ERROR ---");
                console.error(errorText);
                console.error("-------------------------------");
                
                let errorMessage = 'Validation failed'; 
                
                try {
                    const errorData: SpringErrorResponse = JSON.parse(errorText);
                    
                    // [!!] 4. 'errors'가 배열이 아닌 객체(Object)인지 확인합니다.
                    if (errorData.errors && !Array.isArray(errorData.errors) && typeof errorData.errors === 'object') {
                        // 객체(Map)의 값(value)들을 추출하여 오류 메시지로 만듭니다.
                        errorMessage = Object.values(errorData.errors).join(', ');
                    } else if (errorData.message) {
                        errorMessage = errorData.message;
                    }
                } catch (e) {
                    errorMessage = "서버 응답 오류 (JSON 아님)";
                }
                
                throw new Error(errorMessage);
            }

            // 5. 성공 시 처리
            console.log("API Success: 회원가입 완료.");
            clearTempSignupData(); 
            
            alert("회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.");
            router.push('/login'); 

        } catch (error: unknown) {
            const errorMessage = (error instanceof Error) ? error.message : '알 수 없는 오류'; 
            console.error("Error during signup:", errorMessage);
            // [!!] 6. 이제 alert에 "Validation failed"가 아닌 상세 오류가 뜹니다.
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