"use client"

import React from "react";
import Link from "next/link"

interface SenderDetail {
    userId: string,
    nickname: string,
    birthDate: string,
    gender: string,
    interests: string[]
}

interface PenpalDetail {
    id: string,
    content: string,
    sender: SenderDetail,
}

interface PenpalCardProps {
    penpal: PenpalDetail;
}

const PenpalCard = ({penpal}: PenpalCardProps) => {
    const senderInfo = penpal.sender || { interests: [] as string[] }; // 안전장치
    const interests = senderInfo.interests;
    
    const penpalId = penpal.id; 
    
    return (
        <Link
            href={`/penpal/${penpalId}/history`}
            className={"bg-green2 shadow h-full w-[190px] rounded-2xl p-4 flex-shrink-0"}
            onClick={() => localStorage.setItem("opponent_nickname", senderInfo.nickname)}
        >
            {/*보낸이 정보*/}
            <div className={"flex items-center gap-2"}>
                <div
                    className="rounded-full"
                    style={{width: 40, height: 40, backgroundColor: "#E6E6E6"}}
                />
                <div>
                    <div className={"font-semibold"}>{senderInfo.nickname}</div>
                    {/* [!!] interests가 3개 미만일 경우 오류 방지 */}
                    <div className={"text-[13px]"}>
                        {interests.slice(0, 3).map((int, i) => `#${int}`).join(' ')}
                    </div>
                </div>
            </div>
            <div className={"mt-3 text-[18px]"}>{penpal.content}</div>
        </Link>
    )
}

export default PenpalCard
