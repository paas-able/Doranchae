"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveTempSignupData, getTempSignupData, UserJoinPayload } from '@/libs/tempSignupData';

// --- 색상 변수 ---
const Bg = "#FDFAED";
const M1 = "#CCA57A";
const M2 = "#F8EDD0";
const M3 = "#FDFAE3";
const M4 = "#EAEDCC";
const M5 = "#CED5B2"; // 선택 안 됨, 하단 버튼
const MM = "#8B9744"; // 선택 됨
// ---------------------

// 1. 관심주제 목록
const TOPICS = [
    '일상', '스포츠', '경제', '건강',
    '원예', '시사 ⋅ 이슈', '예술', '와인',
    '연예', '커피', '자기계발', '독서',
    '반려동물', '요리', '심리', '역사'
];

type InterestsPayload = UserJoinPayload['interests'];

const InterestsPage = () => {
    const router = useRouter();
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    
    const handleTopicClick = (topic: string) => {
        setSelectedTopics((prev) => {
            if (prev.includes(topic)) {
                return prev.filter((t) => t !== topic);
            }
            
            if (prev.length >= 3) {
                alert("관심 주제는 최대 3개까지만 선택할 수 있습니다.");
                return prev;
            }

            return [...prev, topic];
        });
    };

    const handleNext = () => {
        if (selectedTopics.length < 3) {
            alert("최대 3개의 주제를 선택해주세요.");
            return;
        }

        // 1. 관심사 데이터 포맷팅
        const interestsPayload: Partial<InterestsPayload> = {};
        
        // 2. 선택된 주제 3개를 포맷에 맞게 할당
        selectedTopics.slice(0, 3).forEach((topic, index) => {
            // [!!] 3. 인덱스를 사용하여 키를 안전하게 접근 (타입스크립트 오류 방지)
            const key = `interest${index + 1}` as keyof InterestsPayload;

            (interestsPayload as Record<string, string>)[key as string] = topic; 
        
        });

        console.log("DEBUG: 관심사 저장", interestsPayload);
        
        // 4. 안전하게 저장
        saveTempSignupData({
            interests: interestsPayload as InterestsPayload 
        });

        // 다음 페이지로 이동
        router.push('/signup/guardian'); 
    };

    const isSelected = (topic: string) => selectedTopics.includes(topic);

    return (
        // 1. 페이지 전체 (flex-1 + justify-between)
        <div 
            className="mx-auto w-full max-w-[430px] flex flex-col items-center justify-between flex-1 p-4"
            style={{ backgroundColor: Bg }}
        >
            {/* 자식 1: 상단 컨텐츠 영역 */}
            <div className="w-full max-w-sm flex flex-col pt-5">
                {/* 1. 타이틀 */}
                <h2 className="text-3xl font-bold text-gray-900 mb-2">관심 주제를 선택해주세요</h2>
                <p className="text-sm text-gray-600 mb-8">
                    3개 이상의 주제를 선택해주세요. <br />
                    선택한 관심 주제를 참고하여 펜팔 상대를 연결합니다.
                </p>

                {/* 2. 관심주제 그리드 (grid-cols-2 -> 2열) */}
                <div className="grid grid-cols-2 gap-3">
                    {TOPICS.map((topic) => (
                        <button
                            key={topic}
                            type="button"
                            onClick={() => handleTopicClick(topic)}
                            className={`w-full py-3 rounded-lg font-semibold transition-colors duration-200 ${
                                isSelected(topic) ? 'text-white' : 'text-gray-800'
                            }`}
                            // 5. 선택 여부에 따라 배경색 변경
                            style={{ 
                                backgroundColor: isSelected(topic) ? MM : M5 
                            }}
                        >
                            {topic}
                        </button>
                    ))}
                </div>
            </div>

            {/* 자식 2: 하단 '다음' 버튼 영역 */}
            <div className="w-full max-w-sm flex flex-col pb-6">
                <button 
                    type="button"
                    onClick={handleNext}
                    // 6. 3개 이상 선택 안 하면 반투명 처리
                    className="w-full py-3 rounded-lg text-gray-800 font-semibold transition-opacity duration-200"
                    style={{ 
                        backgroundColor: M5,
                        opacity: selectedTopics.length < 3 ? 0.5 : 1
                    }}
                    disabled={selectedTopics.length < 3}
                >
                    다음
                </button>
            </div>
        </div>
    );
};

export default InterestsPage;