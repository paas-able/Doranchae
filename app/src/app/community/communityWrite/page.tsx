"use client";

import React from "react";
import {useRouter} from "next/navigation";
import {useState} from "react";

export default function CommunityWritePage() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const isValid = title.trim().length > 0 && content.trim().length > 0;

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!isValid || submitting) return;

        setSubmitting(true);
        console.log("[communityWrite] payload:", {title, content});

        setTimeout(() => {
            setSubmitting(false);
            router.replace("/community");
        }, 150);
    }

    return (
        <div className="mx-auto w-full max-w-[430px] flex flex-col flex-1">
            {/* 본문 */}
            <main className="flex-1 px-4 pb-8">
                {/* 카드 컨테이너 */}
                <section className="mt-4 flex flex-col flex-1">
                    {/* 타이틀 바 */}
                    <div className="flex items-center justify-between px-4 py-4 border-b border-neutral-200">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            disabled={submitting}
                            className="text-[clamp(12px,3.2vw,14px)] text-neutral-500"
                        >
                            취소
                        </button>

                        <h1 className="text-[clamp(16px,4.2vw,18px)] font-bold">
                            글 작성하기
                        </h1>

                        <button
                            type="submit"
                            form="post-form"
                            disabled={!isValid || submitting}
                            className={`text-[clamp(12px,3.2vw,14px)] font-semibold ${
                                isValid ? "text-green-700" : "text-neutral-400 cursor-not-allowed"
                            }`}
                        >
                            {submitting ? "등록중…" : "등록"}
                        </button>
                    </div>

                    {/* 글쓰기 폼 */}
                    <form
                        id="post-form"
                        onSubmit={onSubmit}
                        className="px-4 py-6 flex-1 flex flex-col gap-6"
                    >
                        {/* 제목 */}
                        <input
                            id="title"
                            placeholder="제목을 여기에 써주세요"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={submitting}
                            maxLength={120}
                            required
                            autoComplete="off"
                            className="w-full bg-transparent outline-none placeholder:text-neutral-500
                           text-[clamp(16px,4vw,18px)] font-medium
                           border-b border-amber-300 pb-2"
                        />

                        {/* 본문 */}
                        <textarea
                            id="content"
                            placeholder="글을 이곳에 써주세요"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            disabled={submitting}
                            required
                            className="flex-1 min-h-[65svh] rounded-md border border-amber-300 bg-[#fdfcf9] p-4 outline-none
                           placeholder:text-neutral-500 text-[clamp(14px,3.7vw,16px)] resize-none"
                        />
                    </form>
                </section>
            </main>
        </div>
    );
}
