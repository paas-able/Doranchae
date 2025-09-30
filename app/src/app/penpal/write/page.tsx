

export default function PenpalWritePage() {
  return (
    <div className="flex h-screen flex-col bg-[#FDFAE3]">
      {/* 상단 헤더 */}
      <header className="flex items-center justify-between p-4">
        <button className="text-black">취소</button>
        <div className="flex items-center gap-4">
          <button className=" text-black">임시저장</button>
          <button className="rounded-md px-3 py-1  text-black">
            전송하기
          </button>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="flex flex-1 flex-col gap-4 p-4">
        {/* 수신인 정보 */}
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-gray-200 text-3xl">
            🙂
          </div>
          <span className="font-semibold">수신인: 김용식</span>
        </div>

        {/* 편지 쓰는 공간 */}
        <textarea
          placeholder="글을 이곳에 써주세요"
          className="flex-1 rounded-lg border-2 border-[#CCA57A] bg-transparent p-3 outline-none resize-none"
        />
      </main>
    </div>
  );
}