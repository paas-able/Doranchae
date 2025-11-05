"use client"

import {fetchWithAuth} from "@libs/fetchWithAuth";
import React, {useEffect, useState} from "react";
import Link from "next/link";
import PenpalCard from "@components/PenpalCard";

interface PostDetail {
    id: string,
    title: string,
    contentPreview: string,
    commentCount: number
}

interface PenpalDetail {
    id: string,
    content: string,
    sender: SenderDetail
}

interface SenderDetail {
    userId: string,
    nickname: string,
    birthDate: string,
    gender: string,
    interests: string[]
}

const ICON_CHAT = "https://cdn-icons-png.flaticon.com/512/8316/8316205.png";

export default function Home() {
    const [recentPost, setRecentPost] = useState<PostDetail>()
    const [penpalList, setPenpalList] = useState<PenpalDetail[]>()

    const fetchRecentPost = () => {
        fetchWithAuth('/api/community/post/recent')
            .then(res => {
                if (res.isSuccess) {
                    return res.data
                }
            })
            .then(data => {
                setRecentPost(data)
            })
    }

    const fetchRecentPenpal = () => {
        fetchWithAuth('/api/penpal/recent')
            .then(res => {
                if (res.isSuccess) {
                    return res.data
                }
            })
            .then(data => {
                setPenpalList(data)
            })
    }

    useEffect(() => {
        fetchRecentPost()
        fetchRecentPenpal()
    }, []);

    return (
        <div className={"h-[calc(100vh-130px)] bg-white overflow-hidden"}>
            {/*편지함*/}
            <div className={"mt-[40px]"}>
                <p className={"px-3 font-semibold text-[30px]"}>편지함</p>
                <div className={"w-full h-[300px] bg-green1 pl-4 py-5 flex overscroll-y-auto overflow-auto gap-3"}>
                    {penpalList?.map(it => (
                        <PenpalCard key={it.id} penpal={it}/>
                    ))}
                </div>
            </div>

            {/*최근 정보 & 최근 게시물*/}
            <div className={"flex px-3 justify-between gap-3 mt-[50px]"}>
                {/*최근 정보*/}
                <div className={"flex-1"}>
                    <p className={"font-bold text-[26px]"}>최근 정보</p>
                    <div className={"w-full h-[250px] rounded-lg bg-brown3"}>

                    </div>
                </div>

                {/*최근 게시물*/}
                <div className={"flex-1"}>
                    <p className={"font-bold text-[26px]"}>최근 게시글</p>
                    <Link href={`/community/${recentPost?.id}`} className={"w-full h-[250px] rounded-lg bg-brown2 p-4 flex flex-col justify-between"}>
                        <div className={"text-[24px] font-semibold pb-2.5 border-b-brown1 border-b"}>{recentPost?.title}</div>
                        <div className={"pt-2.5 flex-1"}>{recentPost?.contentPreview}</div>
                        <div className={"flex justify-end items-center gap-1"}>
                            <img src={ICON_CHAT} alt="댓글" className="h-[18px] w-[18px] opacity-80"/>
                            {recentPost?.commentCount}
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
