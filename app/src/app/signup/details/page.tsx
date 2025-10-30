"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// --- 색상 변수 ---
const Bg = "#FDFAED";
const M1 = "#CCA57A";
const M2 = "#F8EDD0";
const M3 = "#FDFAE3";
const M4 = "#EAEDCC";
const M5 = "#CED5B2";
const MM = "#8B9744";
// ---------------------

const SignupDetailsPage = () => {
    const router = useRouter();

    // 폼 입력 상태
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [name, setName] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [gender, setGender] = useState(''); // 'male' | 'female'
    const [phone, setPhone] = useState('');
    const [authCode, setAuthCode] = useState('');

    // UI 상태
    const [isAuthRequested, setIsAuthRequested] = useState(false); // 인증번호 요청 여부

    // 에러 상태 (예시)
    const [idError, setIdError] = useState('');
    const [passwordError, setPasswordError] = useState('• 8~16자 영문 대소문자, 숫자, 특수문자');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("가입 시도:", { id, password, name, birthdate, gender, phone });
        // TODO: 가입 API 호출
    };

    return (
        // 1. 페이지 전체 (flex-1로 남은 공간 채우기)
        <div 
            className="mx-auto w-full max-w-[430px] flex flex-col items-center flex-1 p-4"
            style={{ backgroundColor: Bg }}
        >
            <div className="w-full max-w-sm flex flex-col pt-5">
                {/* 1. 타이틀 */}
                <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">회원 정보 입력</h2>
                <p className="text-sm text-gray-600 mb-8 text-center">
                    회원 가입을 위해 아래 정보를 입력해주세요.
                </p>

                {/* 2. 회원 정보 입력 폼 */}
                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                    
                    {/* 아이디 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">아이디</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg"
                                placeholder="아이디 입력"
                            />
                            <button 
                                type="button" 
                                className="px-4 py-3 rounded-lg text-gray-800 font-semibold"
                                style={{ backgroundColor: M5 }}
                            >
                                중복 확인
                            </button>
                        </div>
                    </div>

                    {/* 비밀번호 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                            placeholder="비밀번호 입력"
                        />
                        <p className="text-xs text-red-500 mt-1 pl-1">{passwordError}</p>
                    </div>

                    {/* 비밀번호 확인 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호 확인</label>
                        <input
                            type="password"
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                            placeholder="비밀번호 재입력"
                        />
                    </div>

                    {/* 이름 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                            placeholder="이름 입력"
                        />
                    </div>

                    {/* 생년월일 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">생년월일</label>
                        <input
                            type="text" // (나중에 Date Picker로 변경 가능)
                            value={birthdate}
                            onChange={(e) => setBirthdate(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                            placeholder="YYYY / MM / DD"
                        />
                    </div>

                    {/* 성별 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">성별</label>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setGender('male')}
                                className={`flex-1 py-3 rounded-lg font-semibold ${
                                    gender === 'male' 
                                    ? 'text-white' 
                                    : 'text-gray-800'
                                }`}
                                style={{ backgroundColor: gender === 'male' ? MM : M5 }}
                            >
                                남성
                            </button>
                            <button
                                type="button"
                                onClick={() => setGender('female')}
                                className={`flex-1 py-3 rounded-lg font-semibold ${
                                    gender === 'female' 
                                    ? 'text-white' 
                                    : 'text-gray-800'
                                }`}
                                style={{ backgroundColor: gender === 'female' ? MM : M5 }}
                            >
                                여성
                            </button>
                        </div>
                    </div>

                    {/* 전화번호 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
                        <div className="flex gap-2">
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg"
                                placeholder="010 - 1234 - 5678"
                            />
                            <button 
                                type="button" 
                                onClick={() => setIsAuthRequested(true)}
                                className="px-4 py-3 rounded-lg text-gray-800 font-semibold"
                                style={{ backgroundColor: M5 }}
                            >
                                인증 요청
                            </button>
                        </div>
                    </div>

                    {/* 인증번호 (인증 요청 시 보임) */}
                    {isAuthRequested && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">인증번호 입력</label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    value={authCode}
                                    onChange={(e) => setAuthCode(e.target.value)}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg"
                                    placeholder="인증번호 6자리"
                                />
                                <button 
                                    type="button" 
                                    className="px-4 py-3 rounded-lg text-gray-800 font-semibold"
                                    style={{ backgroundColor: M5 }}
                                >
                                    확인
                                </button>
                            </div>
                            {/* TODO: 타이머 추가 */}
                        </div>
                    )}

                    {/* 가입하기 버튼 */}
                    <button 
                        type="submit"
                        className="w-full py-3 rounded-lg text-gray-800 font-semibold mt-6 transition-colors duration-200"
                        style={{ backgroundColor: M5 }}
                        onMouseOver={e => e.currentTarget.style.backgroundColor = MM}
                        onMouseOut={e => e.currentTarget.style.backgroundColor = M5}
                    >
                        가입하기
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignupDetailsPage;