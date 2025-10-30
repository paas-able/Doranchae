'use client'

import useSWR from 'swr'
import Link from "next/link";

type Response = {
    penpals: Penpal[],
    page: PageInfo
}

type Penpal = {
    id: number;
    opponentInfo: OpponentInfo
}

type OpponentInfo = {
    userId: string,
    nickname: string,
    birthDate: string,
    gender: string,
    interests: string[]
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

const penpalTextDark = "#4A4A4A";

export function PenpalList() {
    const {
        data,
        error,
        isLoading
    } = useSWR<Response>('http://localhost:8082/api/penpal/list?page=0&size=1000&sort=updatedAt,desc', fetcher)

    if (error) return <div>데이터를 불러오는데 실패했습니다.</div>
    if (isLoading) return <div>로딩 중...</div>
    if (!data) return null


    const handler = (opponent) => {
        localStorage.setItem('opponent_nickname', opponent.nickname)
        localStorage.setItem('opponent_id', opponent.userId)
    }

    return (
        <div>
            <h2 className="text-sm text-gray-500 mb-4">
                펜팔 목록 ({data.penpals.length}/1000)
            </h2>
            <div className="space-y-4">
                {data.penpals.map((penpal) => (
                    <Link key={penpal.id} className="flex items-center space-x-3" href={`/penpal/${penpal.id}/history`} onClick={() => handler(penpal.opponentInfo)}>
                        <span className="font-medium text-lg" style={{color: penpalTextDark}}>
                            {penpal.opponentInfo.nickname}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    )
}