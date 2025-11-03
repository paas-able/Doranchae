// src/libs/fetchWithAuth.ts
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    // 1. accessToken을 쿠키에서 읽기
    const getTokenFromCookie = (): string | null => {
        if (typeof document === "undefined") return null;
        const match = document.cookie.match(/(?:^|; )accessToken=([^;]*)/);
        return match ? decodeURIComponent(match[1]) : null;
    };

    const token = getTokenFromCookie();
    console.log("토큰:", token ? "있음" : "없음");

    // 2. 헤더 구성
    const headers = {
        ...(options.headers || {}),
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
    };

    console.log(`API 호출: ${options.method || 'GET'} ${url}`);

    // 3. fetch 실행 (credentials 옵션 추가)
    const response = await fetch(url, {
        ...options,
        headers,
        credentials: "include",
    });

    console.log(`응답 상태: ${response.status}`);

    // 4. 에러 처리
    if (!response.ok) {
        const errorBody = await response.text();
        console.error("에러 응답:", errorBody);
        const msg = `API Error: ${response.status} ${response.statusText}\n${errorBody}`;
        throw new Error(msg);
    }

    return response.json();
};
