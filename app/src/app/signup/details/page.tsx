"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { saveTempSignupData, getTempSignupData } from '@/libs/tempSignupData';

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
    const [gender, setGender] = useState<'남자' | '여자' | ''>(''); // API 형식에 맞춤
    const [phone, setPhone] = useState('');
    const [authCode, setAuthCode] = useState('');

    // UI 상태
    const [isAuthRequested, setIsAuthRequested] = useState(false);
    const [isPhoneAuthComplete, setIsPhoneAuthComplete] = useState(false); // 전화번호 인증 완료 여부
    const [isIdChecked, setIsIdChecked] = useState(false); // 아이디 중복 확인 완료 여부
    const [isLoading, setIsLoading] = useState(false);

    // 에러 상태 (예시)
    const [idError, setIdError] = useState('');
    const [passwordError, setPasswordError] = useState('• 8~16자 영문 대소문자, 숫자, 특수문자');

    useEffect(() => {
        const data = getTempSignupData();
        if (data.loginId) setId(data.loginId);
        if (data.userDetail?.name) setName(data.userDetail.name);
        if (data.userDetail?.gender) setGender(data.userDetail.gender as '남자' | '여자');
    }, []);

    const handleCheckId = async () => {
        setIsLoading(true);
        // [1단계: 요청 기록]
        console.log("--- DEBUG MODE: API 요청 ---");
        console.log("API: 아이디 중복 확인 | Body:", JSON.stringify({ userId: id }));
        await new Promise(resolve => setTimeout(resolve, 1000));

        // --- 시나리오 1: 아이디 사용 가능 ---
        const mockResponse = { isSuccess: true, message: "사용 가능한 아이디입니다.", data: { isAvailable: true } };
        
        if (mockResponse.data.isAvailable) {
            alert(mockResponse.message);
            setIdError('');
            setIsIdChecked(true);
        } else {
            // (시나리오 2 테스트 시)
            alert(mockResponse.message); 
            setIdError(mockResponse.message);
            setIsIdChecked(false);
        }
        setIsLoading(false);
    };

    const handleAuthConfirm = () => {
        const correctCode = '123456';

        if (authCode === correctCode) {
            alert("휴대폰 인증에 성공했습니다!");
            setIsPhoneAuthComplete(true); // 인증 완료
            setIsAuthRequested(false); // 입력창 닫기
        } else {
            alert("인증번호가 일치하지 않습니다. [임시]123456 입력");
            setIsPhoneAuthComplete(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!isIdChecked) {
            alert("아이디 중복 확인이 필요합니다.");
            return;
        }
        if (password !== passwordConfirm) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }
        
        if (!isPhoneAuthComplete) {
            alert("전화번호 인증이 필요합니다.");
            return;
        }
        
        // 4. 데이터 저장
        saveTempSignupData({
            loginId: id,
            password: password,
            userDetail: {
                name: name,
                birthDate: birthdate.replace(/\s\/\s/g, '-'), // YYYY / MM / DD -> YYYY-MM-DD
                phoneNumber: phone.replace(/\s-\s/g, ''),
                gender: gender as '남자' | '여자', 
            }
        });

        router.push('/signup/interests');
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
                                onChange={(e) => {setId(e.target.value); setIsIdChecked(false); }}
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg"
                                placeholder="아이디 입력"
                                disabled={isLoading || isIdChecked}
                            />
                            <button 
                                type="button" 
                                onClick={handleCheckId}
                                disabled={isLoading || isIdChecked}
                                className={`px-4 py-3 rounded-lg font-semibold ${isIdChecked ? 'text-white' : 'text-gray-800'}`}
                                style={{ backgroundColor: isIdChecked ? MM : M5 }}
                            >
                                {isLoading ? '확인 중' : isIdChecked ? '확인 완료' : '중복 확인'}
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
                                onClick={() => setGender('남자')}
                                className={`flex-1 py-3 rounded-lg font-semibold ${
                                    gender === '남자' 
                                    ? 'text-white' 
                                    : 'text-gray-800'
                                }`}
                                style={{ backgroundColor: gender === '남자' ? MM : M5 }}
                            >
                                남성
                            </button>
                            <button
                                type="button"
                                onClick={() => setGender('여자')}
                                className={`flex-1 py-3 rounded-lg font-semibold ${
                                    gender === '여자' 
                                    ? 'text-white' 
                                    : 'text-gray-800'
                                }`}
                                style={{ backgroundColor: gender === '여자' ? MM : M5 }}
                            >
                                여성
                            </button>
                            <button
                                type="button"
                                onClick={() => setGender('')}
                                className={`flex-1 py-3 rounded-lg font-semibold ${
                                    gender === '' 
                                    ? 'text-white' 
                                    : 'text-gray-800'
                                }`}
                                style={{ backgroundColor: gender === '' ? MM : M5 }}
                            >
                                선택안함
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
                                disabled={isPhoneAuthComplete}
                            />
                            <button 
                                type="button" 
                                onClick={() => setIsAuthRequested(true)}
                                className="px-4 py-3 rounded-lg text-gray-800 font-semibold"
                                style={{ backgroundColor: M5 }}
                                disabled={isPhoneAuthComplete}
                            >
                                {isPhoneAuthComplete ? '인증 완료' : '인증 요청'}
                            </button>
                        </div>
                    </div>

                    {/* 인증번호 (인증 요청 시 보임) */}
                    {isAuthRequested && !isPhoneAuthComplete && ( // [!!] 인증 완료되면 숨김
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">인증번호 입력</label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    value={authCode}
                                    onChange={(e) => setAuthCode(e.target.value)}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg"
                                    placeholder="인증번호 6자리(임시로 123456 입력)"
                                />
                                <button 
                                    type="button" 
                                    onClick={handleAuthConfirm}
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