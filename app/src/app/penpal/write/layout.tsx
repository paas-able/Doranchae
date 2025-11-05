import React, { Suspense } from 'react';

// Suspense가 로드되는 동안 보여줄 임시 로딩 UI
const LoadingFallback = () => (
    <div className="flex h-screen flex-col bg-[#FDFAE3] items-center justify-center">
        <p>편지 쓰기 페이지 로딩 중...</p>
    </div>
);

export default function PenpalWriteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      {children}
    </Suspense>
  );
}

