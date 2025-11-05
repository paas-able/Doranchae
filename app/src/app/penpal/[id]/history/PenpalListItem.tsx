"use client"

import {useEffect, useState} from 'react';
import Link from "next/link";
import {useRouter} from "next/navigation";
import React from 'react';

// PenpalList.tsx 파일에 정의된 타입들 (부모에서 정의되었다고 가정)
type OpponentInfo = {
    userId: string,
    nickname: string,
    birthDate: string,
    gender: string,
    interests: string[]
}

type Penpal = {
    id: number;
    opponentInfo: OpponentInfo
}

interface PenpalListItemProps {
    penpal: Penpal;
    penpalTextDark: string;
    openMenuId: number | null;
    toggleMenu: (id: number) => void;
    handler: (opponent: OpponentInfo) => void;
    // [!!] accessToken Prop을 다시 포함합니다. (이게 부모와 자식 간의 타입 계약입니다)
    accessToken: string | null; 
}

interface DropdownMenuProps {
    penpalId: number;
    accessToken: string | null;
}

// DropdownMenu가 액세스 토큰을 사용합니다.
const DropdownMenu = ({penpalId, accessToken} : DropdownMenuProps) => {
    const router = useRouter()
    const [msgCount, setMsgCount] = useState(0)
    const [canClick, setCanClick] = useState(false)

    const closePenpalFetch = () => {
        fetch(`/api/penpal/${penpalId}/close`, {
            method: 'DELETE',
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        }).then(res => {
            return res.json()
        }).then(data => {
            if (data.isSuccess) {
                alert("펜팔을 떠났습니다.")
                router.push("/penpal")
            }
        })
    }

    useEffect(() => {
        const penpalIdStr = String(penpalId); 
        
        fetch(`/api/penpal/${penpalIdStr}/messages`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        }).then(res => {
            return res.json()
        }).then(data => {
            if (data.isSuccess) {
                const count = Math.floor(data.data.messages.length / 2) + 1
                setMsgCount(count)
                setCanClick(count >= 3)
            }
        })
    }, [penpalId, accessToken]);

    return (
        <div className="absolute top-0 right-0 mt-2 min-w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
            <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                disabled={!canClick}
            >
                {canClick ? "채팅 전환하기" : `채팅 전환까지: 왕복 ${3 - msgCount}회`}
            </button>
            <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={closePenpalFetch}
            >
                떠나기
            </button>
        </div>
    );
};

// [!!] accessToken을 Props로 받도록 수정
export default function PenpalListItem({ penpal, penpalTextDark, openMenuId, toggleMenu, handler, accessToken }: PenpalListItemProps) {
    const isMenuOpen = openMenuId === penpal.id;

    return (
        <div className="relative">
            <div className="flex items-center space-x-3">

                <button
                    className="grid h-12 w-12 place-items-center rounded-full bg-gray-200 text-4xl hover:bg-gray-300 transition-colors"
                    onClick={(e) => {
                        e.stopPropagation(); // Link 이동 방지
                        toggleMenu(penpal.id);
                    }}
                >
                    🙂
                </button>

                <Link
                    key={penpal.id}
                    href={`/penpal/${penpal.id}/history`}
                    onClick={() => handler(penpal.opponentInfo)}
                    className="flex-1 min-w-0" // Link가 남은 공간을 차지하도록 설정
                >
                    <span className="font-medium text-lg truncate" style={{ color: penpalTextDark }}>
                        {penpal.opponentInfo.nickname}
                    </span>
                </Link>
            </div>

            {/* 3. 옵션 메뉴 조건부 렌더링 */}
            {isMenuOpen && <DropdownMenu penpalId={penpal.id} accessToken={accessToken} />}
        </div>
    );
}
