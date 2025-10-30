'use client'

import PenpalCard from "./PenpalCard";
import useSWR from 'swr';
import {useParams} from "next/navigation";
import Link from "next/link";

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

// TODO: 토큰 해결시 삭제
const tempToken = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0VXNlciIsInVzZXJJZCI6IjYzNDBkN2YyLWVjMTAtNDliMy04MzVmLWZkZjNjN2EwZDk3MSIsImlhdCI6MTc2MTg2MjAzMywiZXhwIjoxNzYxODY1NjMzfQ.jIvBtxrg1alOT2UmZEe5V047e_AJovy_-1Ak7SfsrDdJdQeS8uo1gF51PIZZ0SD0BYwZQ7amtZGvyUEZfIDuyw"
const fetcher = (url: string) =>
    fetch(url, {
        method: "GET",
        headers: {"Authorization": `Bearer ${tempToken}`}
    }).then((res) => {
        return res.json()
    }).then((it) => {
        if (it.isSuccess) {
            return it.data
        } else {
            throw new Error('문제가 발생했습니다.');
        }
    })

export default function PenpalHistoryPage() {
    const params = useParams()
    const url = `http://localhost:8082/api/penpal/${params.id}/messages?page=0&size=1000`

    const {
        data,
        error,
        isLoading
    } = useSWR<Response>(url, fetcher)

    if (error) return <div>데이터를 불러오는데 실패했습니다.</div>
    if (isLoading) return <div>로딩 중...</div>
    if (!data) return null

    const opponent_nickname = localStorage.getItem("opponent_nickname")

    return (
        <div className="flex h-dvh flex-col bg-[#FDFAE3] z-0 overscroll-none">
            <header className="flex items-center justify-between bg-[#FDFAE3] p-4">
                <Link href={"/penpal"} className="text-gray-600">뒤로가기</Link>
            </header>

            <div className="flex-1 overflow-hidden">
                <section className="bg-[#FDFAE3] p-4">
                    <div className="flex items-center gap-3">
                        <div className="grid h-12 w-12 place-items-center rounded-full bg-gray-200 text-4xl">
                            🙂
                        </div>
                        <div>
                            <p className="font-bold">
                                {`${opponent_nickname}`}
                            </p>
                            <p className="text-sm text-gray-600">#원예 #경제 #동산</p>
                        </div>
                    </div>
                </section>

                <main className="flex flex-col gap-4 p-4 pt-0 overflow-y-auto">
                    {data.messages.map((penpal) => (
                        <PenpalCard key={penpal.id} {...penpal} />
                    ))}
                </main>
            </div>
        </div>
    );
}
