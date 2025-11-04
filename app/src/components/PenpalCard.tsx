"use client"

import React from "react";
import Link from "next/link"

const PenpalCard = ({penpal}) => {
    const interests = penpal.sendFromInfo.interests
    return (
        <Link
            href={`/penpal/${penpal.penpalId}/history`}
            className={"bg-green2 shadow h-full w-[190px] rounded-2xl p-4 flex-shrink-0"}
            onClick={() => localStorage.setItem("opponent_nickname", penpal.sendFromInfo.nickname)}
        >
            {/*보낸이 정보*/}
            <div className={"flex items-center gap-2"}>
                <div
                    className="rounded-full"
                    style={{width: 40, height: 40, backgroundColor: "#E6E6E6"}}
                />
                <div>
                    <div className={"font-semibold"}>{penpal.sendFromInfo.nickname}</div>
                    <div className={"text-[13px]"}>{`#${interests[0]} #${interests[1]} #${interests[2]}`}</div>
                </div>
            </div>
            <div className={"mt-3 text-[18px]"}>{penpal.content}</div>
        </Link>
    )
}

export default PenpalCard