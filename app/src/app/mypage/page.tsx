"use client";

import React from 'react';
import Image from 'next/image';

const Bg = "#FDFAED";
const M1 = "#CCA57A";
const M2 = "#F8EDD0";
const M3 = "#FDFAE3";
const M4 = "#EAEDCC";
const M5 = "#CED5B2";
const MM = "#8B9744";



const MyPage = () => {
    return (
<div className="mx-auto w-full max-w-[430px] flex flex-col flex-1 bg-[#FDFAED]">
            {/* 상단 '내 정보' 섹션 */}
            <div className="w-full max-w-md bg-[#FDFAED] rounded-lg shadow-md p-6 mt-4" > {/* 흰색 카드 배경 */}
                <h2 className="text-xl font-bold text-gray-800 mb-4">내 정보</h2>

                {/* 사용자 프로필 이름, 프로필-이모티콘 */}
                <div className="flex flex-col items-center mb-6">
                    <p className="text-2xl font-semibold text-gray-900 mb-4">김용식</p> {/* 이름 */}
                    <div className="w-24 h-24 rounded-full border-2 bg-gray-100 flex items-center justify-center">
                        <span className="text-7xl">😳</span>
                    </div>
                </div>

                {/* 내 관심사 섹션 */}
                <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">내 관심사</h3>
                    <div className="flex flex-wrap gap-5 justify-center"> 
                        <span className="bg-[#CED5B2] text-gray-900 px-5 py-1 rounded-full text-xl font-medium">#산책</span>
                        <span className="bg-[#CED5B2] text-gray-900 px-5 py-1 rounded-full text-xl font-medium">#등산</span>
                        <span className="bg-[#CED5B2] text-gray-900 px-5 py-1 rounded-full text-xl font-medium">#운동</span>
                    </div>
                </div>

                {/* 보호자 정보 섹션 */}
                <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">보호자 정보</h3>
                    <div className="p-4 py-7 bg-[#EAEDCC] rounded-lg">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center text-gray-500 text-3xl ml-2">
                                <Image src="/people.png" alt="보호자 프로필" width={64} height={64} />
                            </div>
                            <div>
                                <p className="text-gray-900">보호자명: 김순자</p>
                                <p className="text-gray-900">등록 전화번호: 010-1111-2222</p>
                                <p className="text-gray-900">관계: 자녀(딸)</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 정보 변경 버튼 섹션 */}
                <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-3">정보 변경</h3>
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