"use client";

import React, {useState} from "react";
import {useRouter} from "next/navigation";

const MOCK_POST = {
    id: 1,
    author: "트로트좋아",
    date: "2025.07.11",
    title: "나랑 송가인 콘서트 갈 친구",
    content:
        "이번에 콘서트 처음 가는데 혼자 들어가야해서 같이 갈 사람 구해봅니다. 팬카페 가입 인증 받습니다.",
    likeCount: 21,
    comments: [
        {
            id: 1,
            author: "송가인짱",
            date: "2025.07.11",
            content: "우와 티켓 어떻게 구하셨어요 티켓팅 정말 힘들던데!",
            replies: [
                {
                    id: 2,
                    author: "트로트좋아",
                    date: "2025.07.11",
                    content: "아들이 구해줬답니다^^",
                },
            ],
        },
    ],
};

export default function CommunityDetailPage() {
    const router = useRouter();
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(MOCK_POST.likeCount);
    const [comment, setComment] = useState("");

    const toggleLike = () => {
        setLiked((prev) => !prev);
        setLikeCount((n) => (liked ? n - 1 : n + 1));
    };

    const submitComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) return;
        console.log("새 댓글:", comment);
        setComment("");
    };

    return (
        <div className="mx-auto w-full max-w-[430px] flex flex-col flex-1">
            {/* 본문 */}
            <main className="flex-1 px-4">
                <section className="mt-4 flex flex-col">
                    {/* 뒤로가기 */}
                    <div className="mb-3">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="text-sm"
                            style={{color: "#808080"}}
                        >
                            뒤로가기
                        </button>
                    </div>

                    {/* 작성자 */}
                    <div
                        className="mt-4 flex items-center justify-between pb-4 border-b"
                        style={{borderColor: "#CCA57A"}}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className="rounded-full"
                                style={{width: 36, height: 36, backgroundColor: "#E6E6E6"}}
                            />
                            <div>
                                <div className="text-[15px] font-medium">{MOCK_POST.author}</div>
                                <div className="text-xs" style={{color: "#808080"}}>
                                    {MOCK_POST.date}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4 text-sm" style={{color: "#808080"}}>
                            <button>수정하기</button>
                            <button>삭제하기</button>
                        </div>
                    </div>

                    {/* 제목/본문 */}
                    <div className="py-5">
                        <h1 className="text-[20px] font-bold leading-snug">{MOCK_POST.title}</h1>
                        <p className="mt-3 text-[15px] leading-7">{MOCK_POST.content}</p>
                    </div>

                    {/* 좋아요 영역 */}
                    <div
                        className="mt-1 flex items-center gap-4 px-1 py-3 border-b"
                        style={{borderColor: "#CCA57A"}}
                    >
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                aria-label="좋아요"
                                onClick={toggleLike}
                                className="inline-flex items-center justify-center rounded-full"
                                style={{
                                    width: 24,
                                    height: 24,
                                    border: "1px solid #CCCCCC",
                                    backgroundColor: liked ? "#EAEDCC" : "#FFFFFF",
                                }}
                            >
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/11881/11881363.png"
                                    alt="like"
                                    className="w-3.5 h-3.5"
                                />
                            </button>
                            <span className="text-sm">{likeCount}</span>
                        </div>
                        <button
                            type="button"
                            onClick={toggleLike}
                            className="text-sm"
                            style={{color: "#666666"}}
                        >
                            좋아요 누르기
                        </button>
                    </div>

                    {/* 댓글 */}
                    <ul className="py-4 space-y-6">
                        {MOCK_POST.comments.map((c) => (
                            <li key={c.id}>
                                <div
                                    className="flex items-start gap-3 pb-4 border-b"
                                    style={{borderColor: "#CCA57A"}}
                                >
                                    <div
                                        className="rounded-full"
                                        style={{width: 32, height: 32, backgroundColor: "#E6E6E6"}}
                                    />
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center">
                                            <div className="flex gap-2">
                                                <span className="text-[15px] font-medium">{c.author}</span>
                                                <span className="text-xs" style={{color: "#808080"}}>
                            {c.date}
                          </span>
                                            </div>
                                            <div className="text-xs" style={{color: "#808080"}}>
                                                <button>수정</button>
                                                | <button>삭제</button>
                                            </div>
                                        </div>
                                        <p className="mt-2 text-[15px]">{c.content}</p>
                                        <button className="mt-3 text-sm" style={{color: "#666666"}}>
                                            답글 달기
                                        </button>
                                    </div>
                                </div>

                                {/* 대댓글 */}
                                {c.replies?.map((r) => (
                                    <div
                                        key={r.id}
                                        className="mt-6 pl-6 flex gap-3 pb-4 border-b"
                                        style={{borderColor: "#CCA57A"}}
                                    >
                                        <div
                                            className="rounded-full"
                                            style={{width: 32, height: 32, backgroundColor: "#E6E6E6"}}
                                        />
                                        <div className="flex-1">
                                            <div className="flex gap-2">
                                                <span className="text-[15px] font-medium">{r.author}</span>
                                                <span className="text-xs" style={{color: "#808080"}}>
                            {r.date}
                          </span>
                                            </div>
                                            <p className="mt-2 text-[15px]">{r.content}</p>
                                            <button className="mt-3 text-sm" style={{color: "#666666"}}>
                                                답글 달기
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </li>
                        ))}
                    </ul>

                    {/* 댓글 입력 */}
                    <form onSubmit={submitComment} className="sticky bottom-[72px] pt-2">
                        <div
                            className="flex items-center justify-between rounded-full pl-4 pr-2 py-3 shadow"
                            style={{
                                backgroundColor: "#FDFAE3",
                                border: "1px solid #CED5B2",
                            }}
                        >
                            <input
                                type="text"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="댓글 입력하기"
                                className="flex-1 bg-transparent outline-none text-[15px] mr-3"
                            />
                            <button
                                type="submit"
                                disabled={!comment.trim()}
                                className="px-3 py-2 text-sm font-semibold disabled:opacity-50"
                                style={{
                                    color: comment.trim() ? "#8B9744" : "#B3B3B3",
                                }}
                            >
                                ➤
                            </button>
                        </div>
                    </form>
                </section>
            </main>
        </div>
    );
}
