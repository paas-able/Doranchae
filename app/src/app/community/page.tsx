"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type PostCard = {
  id: string;
  title: string;
  preview: string;
  time: string;
  comments: number;
};

const MOCK_POSTS: PostCard[] = [
  { id: "1", title: "나랑 송가인 콘서트 갈 친구", preview: "이번에 콘서트 첨 가는데 혼자 가서 같이 갈 사람 구해봅니다. 팬카페 가입 인증 받습니다.", time: "11:23", comments: 2 },
  { id: "2", title: "동네 국밥 맛집 추천해주세요", preview: "든든하게 한 끼 하고 싶어요. 가격 착하면 더 좋아요!", time: "10:08", comments: 5 },
  { id: "3", title: "아침 산책 같이 하실 분", preview: "매일 7시에 한강 둔치 걷습니다. 초보 환영!", time: "09:41", comments: 0 },
  ...Array.from({ length: 20 }).map((_, i) => ({
    id: `more-${i + 4}`,
    title: `나랑 송가인 콘서트 갈 친구 #${i + 4}`,
    preview: "이번에 콘서트 첨 가는데 혼자 가서 같이 갈 사람 구해봅니다. 팬카페 가입 인증 받습니다.",
    time: `11:${String((23 + i) % 60).padStart(2, "0")}`,
    comments: (i * 3) % 9,
  })),
];

const BG = "#FFFDF7";
const CARD = "#F8EDD0";
const TEXT_DARK = "#4D4D4D";
const TEXT_MID = "#666666";
const CARD_SHADOW = "0 4px 12px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.05)";

const ICON_SEARCH = "https://cdn-icons-png.flaticon.com/512/149/149852.png";
const ICON_CHAT = "https://cdn-icons-png.flaticon.com/512/8316/8316205.png";
const ICON_PENCIL = "https://cdn-icons-png.flaticon.com/512/1828/1828919.png";

export default function CommunityPage() {
  const router = useRouter();

  // 검색 상태
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  // 무한 스크롤
  const STEP = 6;
  const [visible, setVisible] = useState(STEP);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return MOCK_POSTS;
    const q = query.trim().toLowerCase();
    return MOCK_POSTS.filter(
      (p) => p.title.toLowerCase().includes(q) || p.preview.toLowerCase().includes(q)
    );
  }, [query]);

  useEffect(() => {
    setVisible(STEP);
  }, [query]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible((v) => Math.min(v + STEP, filtered.length));
        }
      },
      { rootMargin: "200px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [filtered.length]);

  return (
    <div
      className="min-h-[100svh] flex flex-col"
      style={{
        backgroundColor: BG,
        color: TEXT_DARK,
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="mx-auto w-full max-w-[430px] flex flex-col flex-1 relative">
        <header className="sticky top-0 z-20 text-center py-3 text-[15px] font-semibold bg-neutral-300">
          데드존
        </header>

        <main className="flex-1 px-4 pb-24">
          {/* ===== 상단 영역 ===== */}
          <section className="pt-5">
            <div className="flex items-start justify-between">
              {/* 제목은 항상 노출 */}
              <div className="flex-1 min-w-0">
                <h1 className="text-[28px] font-extrabold leading-snug">
                  도란체 게시판
                </h1>

                {/* 검색 열리면 안내문 숨김, 닫히면 안내문 표시 */}
                {!searchOpen && (
                  <>
                    <p className="mt-2 text-[15px]" style={{ color: TEXT_MID }}>
                      친구를 찾고, 자유롭게 소통해보세요!
                    </p>
                    <p className="mt-1 text-[15px]" style={{ color: TEXT_MID }}>
                      글 작성이 어렵다면: <span className="font-semibold">이음이에게 부탁하기</span>
                    </p>
                  </>
                )}

                {/* 검색창: 열렸을 때만 제목 아래에 등장 */}
                {searchOpen && (
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      autoFocus
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="검색어를 입력하세요"
                      className="flex-1 rounded-full px-4 py-3 bg-white outline-none"
                      style={{ border: "1px solid #E6E6E6" }}
                    />
                    <button
                      type="button"
                      className="text-sm px-2 py-2"
                      style={{ color: TEXT_MID }}
                      onClick={() => {
                        setSearchOpen(false);
                        setQuery("");
                      }}
                    >
                      취소
                    </button>
                  </div>
                )}
              </div>

              {/* 우상단 검색 버튼 (제목 우측) */}
              <button
                type="button"
                aria-label="검색"
                onClick={() => setSearchOpen(true)}
                className={`ml-3 mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full border bg-white ${
                  searchOpen ? "opacity-0 pointer-events-none" : ""
                }`}
                style={{ borderColor: "#E6E6E6" }}
              >
                <img src={ICON_SEARCH} alt="검색" className="h-5 w-5" />
              </button>
            </div>

            {/* 제목/리스트 사이 여백(검색 열려도 유지) */}
            <div className="mt-6 md:mt-8" />
          </section>

          {/* ===== 목록 ===== */}
          <section className="space-y-4">
            {filtered.slice(0, visible).map((post) => (
              <Link key={post.id} href={`/community/${post.id}`} className="block">
                <article
                  className="rounded-2xl px-5 py-5 transition-colors"
                  style={{ backgroundColor: CARD, boxShadow: CARD_SHADOW }}
                >
                  <div className="flex items-start justify-between">
                    <h2 className="text-[20px] font-extrabold leading-tight">{post.title}</h2>
                    <time className="ml-3 shrink-0 text-[14px]" style={{ color: "#808080" }}>
                      {post.time}
                    </time>
                  </div>

                  <p className="mt-3 text-[16px] leading-7">{post.preview}</p>

                  <div className="mt-3 flex items-center justify-end gap-2">
                    <img src={ICON_CHAT} alt="댓글" className="h-[18px] w-[18px] opacity-80" />
                    <span className="text-[15px]">{post.comments}</span>
                  </div>
                </article>
              </Link>
            ))}
            {visible < filtered.length && <div ref={sentinelRef} className="h-10" />}
          </section>
        </main>

        {/* 글쓰기 FAB */}
        <button
          type="button"
          aria-label="글쓰기"
          onClick={() => router.push("/community/communityWrite")}
          className="fixed bottom-24 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full shadow-lg active:scale-95 transition"
          style={{ backgroundColor: "#8B9744", boxShadow: "0 6px 12px rgba(0,0,0,0.15)" }}
        >
          <img src={ICON_PENCIL} alt="글쓰기" className="h-6 w-6 invert" />
        </button>

        {/* 하단 데드존 자리 */}
        <footer className="sticky bottom-0 z-20 text-center py-3 text-[15px] font-semibold bg-neutral-300">
          데드존
        </footer>
      </div>
    </div>
  );
}
