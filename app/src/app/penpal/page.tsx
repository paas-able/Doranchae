'use client'

import { useState } from 'react'
import { PenpalList } from './PenpalList'
import { ChatList } from './ChatList'
import Link from "next/link";

type ActiveTab = 'penpal' | 'chat'

const penpalBg = "#F9F7F0";
const penpalGreen = "#8F995D";
const penpalInactive = "#EFEFEF";
const penpalTextDark = "#4A4A4A";
const penpalTextLight = "#AAAAAA";

export default function PenpalApp() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('penpal')

  return (
      <div
          className="max-w-md mx-auto min-h-screen"
          style={{ backgroundColor: penpalBg }}
      >
        <header className="flex justify-between items-center p-4 pt-6">
          <span className="text-sm invisible" style={{ color: penpalTextLight }}>
            임시저장함
          </span>
          <h1 className="text-2xl font-bold" style={{ color: penpalTextDark }}>
            펜팔
          </h1>
          <Link href={`/penpal/write?target=random`} className="text-sm font-medium" style={{ color: penpalTextDark }}>
            랜덤 전송하기
          </Link>
        </header>

        <nav className="grid grid-cols-2 rounded-t-lg overflow-hidden mt-4">
          <button
              onClick={() => setActiveTab('penpal')}
              className="py-3 font-bold"
              style={{
                backgroundColor: activeTab === 'penpal' ? penpalGreen : penpalInactive,
                color: activeTab === 'penpal' ? 'white' : penpalTextLight
              }}
          >
            펜팔
          </button>
          <button
              onClick={() => setActiveTab('chat')}
              className="py-3 font-bold"
              style={{
                backgroundColor: activeTab === 'chat' ? penpalGreen : penpalInactive,
                color: activeTab === 'chat' ? 'white' : penpalTextLight
              }}
          >
            채팅
          </button>
        </nav>

        <main className="px-4 py-4">
          {activeTab === 'penpal' ? <PenpalList /> : <ChatList />}
        </main>
      </div>
  )
}
