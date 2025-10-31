export interface UserJoinPayload {
    loginId?: string;
    password?: string;
    nickname?: string;
    userDetail?: {
        name?: string;
        birthDate?: string;
        phoneNumber?: string;
        gender?: '남자' | '여자';
    };
    interests?: {
        interest1?: string;
        interest2?: string;
        interest3?: string;
    };
    userSetting?: {
        termsAgree?: boolean; 
        notificationPush?: boolean; 
        notificationSMS?: boolean; // (API 구조에는 없지만 나중에 확장 가능성 고려)
        notificationNOK?: boolean; // (보호자 알림 동의)
    };
    NOKInfo?: {
        relationship?: string;
        name?: string;
        phoneNumber?: string;
    };
}

const STORAGE_KEY = 'tempSignupData';

// 임시 데이터를 가져옵니다.
export function getTempSignupData(): UserJoinPayload {
    if (typeof window === 'undefined') return {};
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
}

// 임시 데이터를 저장합니다.
export function saveTempSignupData(data: Partial<UserJoinPayload>) {
    if (typeof window === 'undefined') return;
    const currentData = getTempSignupData();
    // 기존 데이터와 새 데이터를 병합
    const newData = {
        ...currentData,
        ...data,
        userDetail: { ...currentData.userDetail, ...data.userDetail },
        interests: { ...currentData.interests, ...data.interests },
        userSetting: { ...currentData.userSetting, ...data.userSetting },
        nokInfo: { ...currentData.NOKInfo, ...data.NOKInfo },
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
}

// 회원가입 완료 후 임시 데이터를 삭제합니다.
export function clearTempSignupData() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
    }
}