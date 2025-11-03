"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { saveTempSignupData, getTempSignupData, UserJoinPayload } from '@/libs/tempSignupData';

// --- 색상 변수 ---
const Bg = "#FDFAED";
const M5 = "#CED5B2";
const MM = "#8B9744";
// ---------------------

const SignupPage = () => {
    const router = useRouter(); 

    const [allAgreed, setAllAgreed] = useState(false);
    const [termsAgreed, setTermsAgreed] = useState(false);
    const [privacyAgreed, setPrivacyAgreed] = useState(false);
    const [accessAgreed, setAccessAgreed] = useState(false); 
    const [guardianAgreed, setGuardianAgreed] = useState(false);

    useEffect(() => {
        const data = getTempSignupData();
        if (data.userSetting?.termsAgree) {
            setTermsAgreed(true);
            setPrivacyAgreed(true); 
        }
    }, []);

    const handleNext = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!termsAgreed || !privacyAgreed) {
            alert("필수 이용약관에 동의해주세요.");
            return;
        }

        const userSettingPayload: Partial<UserJoinPayload['userSetting']> = {
            termsAgree: termsAgreed && privacyAgreed,
        };

        saveTempSignupData({
            userSetting: userSettingPayload,
        });

        router.push('/signup/details');
    };

    const handleAllAgree = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        setAllAgreed(isChecked);
        setTermsAgreed(isChecked);
        setPrivacyAgreed(isChecked);
        setAccessAgreed(isChecked); 
        setGuardianAgreed(isChecked);
    };

    return (
        // 1. 부모 Div: justify-between, flex-1
        <div 
            className="mx-auto w-full max-w-[430px] flex flex-col items-center justify-between flex-1 p-4 min-h-[calc(100vh-130px)]"
            style={{ backgroundColor: Bg }}
        >
            
            <div className="w-full max-w-sm flex flex-col pt-5"> 
                <h2 className="text-3xl font-bold text-gray-900 mb-1 text-center">약관 동의</h2>
                <p className="text-xl text-gray-800 mb-1 text-center px-4">
                    도란채에 오신 것을 환영합니다.
                </p>
                <p className="text-sm text-gray-600 mb-5 text-center px-4">
                    귀하는 약관동의를 거부할 수 있습니다.
                    <br />
                    단, 필수항목 동의 거부시에는 회원가입이 제한됩니다.
                </p>
            </div> 

            {/* 하단 폼 영역 */}
            <div className="w-full max-w-sm flex flex-col pb-6">
                <form onSubmit={handleNext} className="w-full flex flex-col">
                    
                    {/* 전체 동의 */}
                    <div className="flex items-center rounded-lg mb-2">
                        <input
                            type="checkbox"
                            id="all-agree"
                            checked={allAgreed}
                            onChange={handleAllAgree}
                            className="w-5 h-5 rounded" 
                        />
                        <label htmlFor="all-agree" className="ml-3 font-semibold text-gray-800 text-lg">
                            전체동의
                        </label>
                    </div>

                    {/* 개별 동의 */}
                    <div className="flex flex-col gap-4 pt-4 border-t border-gray-300">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input type="checkbox" id="terms-agree" checked={termsAgreed} onChange={(e) => setTermsAgreed(e.target.checked)} className="w-4 h-4 rounded" />
                                <label htmlFor="terms-agree" className="ml-2 text-sm text-gray-700">이용약관 동의(<span className="text-red-500">필수</span>)</label>
                            </div>
                            <span className="text-sm text-gray-500 cursor-pointer">{'>'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                             <div className="flex items-center">
                                <input type="checkbox" id="privacy-agree" checked={privacyAgreed} onChange={(e) => setPrivacyAgreed(e.target.checked)} className="w-4 h-4 rounded" />
                                <label htmlFor="privacy-agree" className="ml-2 text-sm text-gray-700">개인정보 수집 및 이용동의(<span className="text-red-500">필수</span>)</label>
                            </div>
                            <span className="text-sm text-gray-500 cursor-pointer">{'>'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input type="checkbox" id="access-agree" checked={accessAgreed} onChange={(e) => setAccessAgreed(e.target.checked)} className="w-4 h-4 rounded" />
                                <label htmlFor="access-agree" className="ml-2 text-sm text-gray-700">접속 기록 기반 보호자 알림 전송 동의(선택)</label>
                            </div>
                            <span className="text-sm text-gray-500 cursor-pointer">{'>'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                             <div className="flex items-center">
                                <input type="checkbox" id="guardian-agree" checked={guardianAgreed} onChange={(e) => setGuardianAgreed(e.target.checked)} className="w-4 h-4 rounded" />
                                <label htmlFor="guardian-agree" className="ml-2 text-sm text-gray-700">보호자 정보 수집 및 이용 동의(선택)</label>
                            </div>
                            <span className="text-sm text-gray-500 cursor-pointer">{'>'}</span>
                        </div>
                    </div>

                    {/* 계속하기 버튼 */}
                    <button 
                        type="submit"
                        className="w-full py-3 rounded-lg text-gray-800 font-semibold mt-10 transition-colors duration-200"
                        style={{ backgroundColor: M5 }}
                        onMouseOver={e => e.currentTarget.style.backgroundColor = MM}
                        onMouseOut={e => e.currentTarget.style.backgroundColor = M5}
                    >
                        계속하기
                    </button>
                </form>
            </div>
            
        </div>
    );
};

export default SignupPage;