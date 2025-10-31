import { NextResponse, type NextRequest } from 'next/server';

const ACCESS_TOKEN_COOKIE_NAME = 'accessToken'; 

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    return NextResponse.next();
    // 1. JWT 토큰(예: accessToken)이 쿠키에 있는지 확인
    const isAuthenticated = request.cookies.has(ACCESS_TOKEN_COOKIE_NAME); 
    
    // 2. 보호가 필요한 경로 (인증 없이는 접근 불가)
    const protectedPaths = ['/', '/mypage', '/chat', '/community', '/penpal']; 
    
    // 3. 인증이 필요 없는 공개 경로 (로그인, 회원가입 관련) # find-id, find-password 는 아직 없음.. 개발필요
    const publicPaths = ['/login', '/signup', '/find-id', '/find-password'];
    
    // --- 로그인 필수 로직 ---
    
    // A. 보호 경로에 접근했지만, 인증되지 않은 경우
    if (protectedPaths.some(path => pathname === path || pathname.startsWith(`${path}/`)) && !isAuthenticated) {
        // 로그인 페이지로
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }
    
    // B. 인증되었는데, 로그인/회원가입 페이지에 접근하려는 경우
    // (로그인했으면 메인 페이지('/')로 돌려보냄)
    if (publicPaths.some(path => pathname === path || pathname.startsWith(`${path}/`)) && isAuthenticated) {
        const homeUrl = new URL('/', request.url);
        return NextResponse.redirect(homeUrl);
    }
    return NextResponse.next();
}

// 미들웨어 실행할 경로
export const config = {
    matcher: [
        '/',
        '/login',
        '/signup/:path*',
        '/find-id',
        '/find-password',
        '/mypage/:path*',
        '/chat/:path*',
        '/community/:path*',
        '/penpal/:path*',
    ],
};