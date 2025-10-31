"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const Bg = "#FDFAED";
const M1 = "#CCA57A";
const M2 = "#F8EDD0";
const M3 = "#FDFAE3";
const M4 = "#EAEDCC";
const M5 = "#CED5B2";
const MM = "#8B9744";


interface NextOfKin {
    relationship: string;
    name: string;
    phoneNumber: string;
}
interface UserInfoResponse {
    userId: number; // 실제 백엔드 코드에선 Long일 수 있지만, 여기선 number로 처리
    nickname: string;
    age: number;
    gender: string; // "남자" 또는 "여자"
    interests: string[]; // 예: ["일상", "스포츠", "경제"]
    nextOfKin: NextOfKin;
}

const MyPage = () => {

    const [userInfo, setUserInfo] = useState<UserInfoResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUserInfo = async () => {
        setIsLoading(true);

        // --- DEBUG MODE: API 요청 기록 ---
        console.log("--- DEBUG MODE: API 요청 ---");
        console.log("API: 내 정보 조회");
        console.log("Endpoint: /api/user/me (가상)");
        console.log("Method: GET");
        console.log("----------------------------");

        // 1초 딜레이 시뮬레이션
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 4. [!!] Mock Data: 백엔드 UserInfoResponse 형태와 일치
        const mockResponse: UserInfoResponse = {
            userId: 1,
            nickname: "김용식",
            age: 65, // 계산된 나이
            gender: "남자",
            interests: ["일상", "원예", "요리"],
            nextOfKin: { 
                name: "김순자",
                relationship: "자녀(딸)",
                phoneNumber: "010-1111-2222"
            }
        };

        // 5. Mocking 결과 처리
        setUserInfo(mockResponse);
        setIsLoading(false);

        /*
        // [추후 교체할 실제 API 통신 코드]
        try {
            const response = await fetch('/api/user/me', {
                method: 'GET',
                credentials: 'include' 
            });
            const data = await response.json();
            if (response.ok) {
                setUserInfo(data.data as UserInfoResponse);
            } else {
                console.error("API 오류:", data);
            }
        } catch (error) {
            console.error("통신 오류:", error);
        } finally {
            setIsLoading(false);
        }
        */
    };

    // 6. [!!] 컴포넌트 마운트 시 데이터 로드
    useEffect(() => {
        fetchUserInfo();
    }, []);

    // 7. 로딩 및 에러 처리 UI
    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen">정보 로딩 중...</div>;
    }

    if (!userInfo) {
        return <div className="flex justify-center items-center min-h-screen">사용자 정보를 불러올 수 없습니다.</div>;
    }
    
    // 8. 데이터 바인딩
    const { nickname, interests, gender, age, nextOfKin } = userInfo;

    // 성별 표시 텍스트
    const genderText = gender === '남자' ? '남성' : gender === '여자' ? '여성' : '선택안함';

    return (
        <div className="mx-auto w-full max-w-[430px] flex flex-col flex-1 p-2" style={{ backgroundColor: Bg }}>
            {/* 상단 '내 정보' 섹션 */}

            <div className="w-full bg-[#FDFAED] rounded-lg p-3 " > 
                <h2 className="text-xl font-bold text-gray-800 ">내 정보</h2>

                <div className="flex flex-col items-center mb-6">
                    {/* 닉네임 바인딩 */}
                    <p className="text-2xl font-semibold text-gray-900 mb-2">{nickname}</p> 
                    <div className="w-24 h-24 rounded-full border-2 bg-gray-100 flex items-center justify-center">
                        <span className="text-6xl">👤</span>
                    </div>
                </div>
                
                {/* 나이/성별 정보*/}
                <div className="flex justify-center gap-5 mb-4 text-lg text-gray-700">
                    <p>나이: {age}세</p>
                    <p>성별: {genderText}</p>
                </div>

                {/* 내 관심사 섹션 */}
                <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">내 관심사</h3>
                    <div className="flex flex-wrap gap-5 justify-center"> 
                        {interests.map((topic, index) => (
                             <span 
                                key={index}
                                className="bg-[#CED5B2] text-gray-900 px-5 py-1 rounded-full text-xl font-medium"
                             >
                                #{topic}
                            </span>
                        ))}
                    </div>
                </div>

                {/* 보호자 정보 섹션 (데이터 없음 - 기존 구조 유지) ToDo. 보호자정보도 줘야함 */} 
                <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">보호자 정보</h3>
                    <div className="p-4 py-7 bg-[#EAEDCC] rounded-lg">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center text-gray-500 text-3xl ml-2">
                                <Image src="/people.png" alt="보호자 프로필" width={64} height={64} />
                            </div>
                            <div>
                                {/* [!!] 4. 보호자 정보 바인딩 */}
                                <p className="text-gray-900">보호자명: {nextOfKin.name}</p>
                                <p className="text-gray-900">등록 전화번호: {nextOfKin.phoneNumber}</p>
                                <p className="text-gray-900">관계: {nextOfKin.relationship}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 정보 변경 버튼 섹션 */}
                <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">정보 변경</h3>
                    <div className="flex flex-col gap-3">
                        <button className="w-full bg-[#F8EDD0] text-gray-800 py-3 rounded-lg shadow-sm hover:bg-gray-200 transition-colors duration-200">
                            프로필 / 관심사 변경
                        </button>
                        <button className="w-full bg-[#F8EDD0] text-gray-800 py-3 rounded-lg shadow-sm hover:bg-gray-200 transition-colors duration-200">
                            비서 이름 변경
                        </button>
                        <button className="w-full bg-[#F8EDD0] text-gray-800 py-3 rounded-lg shadow-sm hover:bg-gray-200 transition-colors duration-200">
                            기타 정보 변경
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default MyPage;