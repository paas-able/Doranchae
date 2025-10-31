"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { saveTempSignupData, getTempSignupData } from '@/libs/tempSignupData';

// --- 색상 변수 ---
const Bg = "#FDFAED";
const M1 = "#CCA57A";
const M2 = "#F8EDD0"; // 입력창 배경 (예시)
const M3 = "#FDFAE3";
const M4 = "#EAEDCC";
const M5 = "#CED5B2"; // 하단 버튼
const MM = "#8B9744"; 
// ---------------------

const GuardianPage = () => {
    const router = useRouter();
    
    // 1. 보호자 정보 상태 변수
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [relationship, setRelationship] = useState('');

    // 2. 컴포넌트 마운트 시 기존 데이터 불러오기
    useEffect(() => {
        const data = getTempSignupData();
        if (data.NOKInfo?.name) setName(data.NOKInfo.name);
        if (data.NOKInfo?.phoneNumber) setPhone(data.NOKInfo.phoneNumber);
        if (data.NOKInfo?.relationship) setRelationship(data.NOKInfo.relationship);
    }, []);
    
    // 3. '다음' 버튼 클릭 핸들러
    const handleNext = () => {
        // (간단한 유효성 검사)
        if (!name || !phone || !relationship) {
            alert("모든 정보를 입력해주세요.");
            return;
        }

        // 4. 데이터 저장 (API 형식: NOKInfo)
        saveTempSignupData({
            NOKInfo: {
                name: name,
                phoneNumber: phone,
                relationship: relationship,
            }
        });
        const currentData = getTempSignupData();
        

        router.push('/signup/notifications'); 
    };

    const isFormValid = name && phone && relationship;

    return (
        // 1. 페이지 전체 (flex-1 + justify-between)
        <div 
            className="mx-auto w-full max-w-[430px] flex flex-col items-center justify-between flex-1 p-4"
            style={{ backgroundColor: Bg }}
        >
            {/* 자식 1: 상단 컨텐츠 영역 */}
            <div className="w-full max-w-sm flex flex-col pt-5">
                {/* 1. 타이틀 */}
                <h2 className="text-3xl font-bold text-gray-900 mb-2">보호자 정보를 입력해주세요</h2>
                <p className="text-sm text-gray-600 mb-8">
                    장시간 미접속 시, 보호자에게 알림이 전송될 수 있습니다.
                </p>

                {/* 2. 보호자 정보 입력 폼 */}
                <form className="w-full flex flex-col gap-4">
                    
                    {/* 보호자 성명 */}
                    <div className="flex items-center">
                        <label 
                            htmlFor="guardian-name" 
                            className="w-1/4 text-sm font-semibold text-gray-700"
                        >
                            보호자 성명
                        </label>
                        <input
                            type="text"
                            id="guardian-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="flex-1 px-4 py-3 rounded-lg border-none"
                            style={{ backgroundColor: M2 }}
                            placeholder="홍길동"
                        />
                    </div>

                    {/* 휴대전화 */}
                    <div className="flex items-center">
                        <label 
                            htmlFor="guardian-phone" 
                            className="w-1/4 text-sm font-semibold text-gray-700"
                        >
                            휴대전화
                        </label>
                        <input
                            type="tel"
                            id="guardian-phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="flex-1 px-4 py-3 rounded-lg border-none"
                            style={{ backgroundColor: M2 }}
                            placeholder="010-1234-5678"
                        />
                    </div>

                    {/* 관계 */}
                    <div className="flex items-center">
                        <label 
                            htmlFor="guardian-relationship" 
                            className="w-1/4 text-sm font-semibold text-gray-700"
                        >
                            관계
                        </label>
                        <input
                            type="text"
                            id="guardian-relationship"
                            value={relationship}
                            onChange={(e) => setRelationship(e.target.value)}
                            className="flex-1 px-4 py-3 rounded-lg border-none"
                            style={{ backgroundColor: M2 }}
                            placeholder="자녀"
                        />
                    </div>
                </form>
            </div>

            {/* 자식 2: 하단 '다음' 버튼 영역 */}
            <div className="w-full max-w-sm flex flex-col pb-6">
                <button 
                    type="button"
                    onClick={handleNext}
                    className="w-full py-3 rounded-lg text-gray-800 font-semibold transition-opacity duration-200"
                    style={{ 
                        backgroundColor: M5,
                        opacity: isFormValid ? 1 : 0.5
                    }}
                    disabled={!isFormValid}
                >
                    다음
                </button>
            </div>
        </div>
    );
};

export default GuardianPage;