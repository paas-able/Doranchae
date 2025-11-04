'use client'

import PenpalCard from "./PenpalCard";
import {useParams, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {fetchWithAuth} from "@libs/fetchWithAuth";

type Response = {
    messages: Message[],
    page: PageInfo
}

type Message = {
    id: string;
    content: string,
    sentAt: string,
    status: string,
    isFromUser: boolean
}

type PageInfo = {
    isFirst: boolean,
    isLast: boolean,
    currentPage: number,
    totalPages: number
}

type OpponentInfo = {
    userId: string,
    nickname: string,
    interests: string[]
}

export default function PenpalHistoryPage() {
    const router = useRouter();
    const params = useParams()
    const [opponent, setOpponent] = useState<OpponentInfo>()
    const [messages, setMessages] = useState<Message[]>()

    const fetchMessage = () => {
        fetchWithAuth(`/api/penpal/${params.id}/messages?page=0&size=1000`)
            .then(res => {
                if (res.isSuccess) {
                    return res.data
                }
            })
            .then(data => {
                setMessages(data.messages)
            })
    }

    const getOpponentInfo = () => {
        const opponentId = localStorage.getItem("opponent_id")

        fetchWithAuth(`/api/user/${opponentId}`)
            .then(res => {
                if (res.isSuccess) {
                    return res.data
                }
            })
            .then(data => {
                const opponent = {
                    userId: data.userId,
                    nickname: data.nickname,
                    interests: data.interests
                }
                setOpponent(opponent)
            })
    }

    useEffect(() => {
        fetchMessage()
        getOpponentInfo()
    }, []);

    const opponent_nickname = localStorage.getItem("opponent_nickname")

    return (
        <div className="flex h-dvh flex-col bg-[#FDFAE3] z-0 overscroll-none pt-3">
            <header className="flex items-center justify-between bg-[#FDFAE3] p-4">
                <div className="text-gray-600" onClick={() => router.back()}>뒤로가기</div>
            </header>

            <div className="flex-1 overflow-hidden">
                <section className="bg-[#FDFAE3] p-4">
                    <div className="flex items-center gap-3">
                        <div className="grid h-12 w-12 place-items-center rounded-full bg-gray-200 text-4xl">
                            🙂
                        </div>
                        <div>
                            <p className="font-bold">
                                {`${opponent?.nickname}`}
                            </p>
                            <p className="text-sm text-gray-600">
                                {`#${opponent?.interests[0]} #${opponent?.interests[1]} #${opponent?.interests[2]}`}
                            </p>
                        </div>
                    </div>
                </section>

                <main className="flex flex-col gap-4 p-4 pt-0 overflow-y-auto">
                    {messages?.map((penpal) => (
                        <PenpalCard key={penpal.id} {...penpal} />
                    ))}
                </main>
            </div>
        </div>
    );
}
