import Link from "next/link";

type Penpal = { id: string; name: string; avatar?: string };
const MOCK_PENPALS: Penpal[] = [
  { id: "u1", name: "김용식", avatar: "🙂" },
  { id: "u2", name: "김덕성", avatar: "😄" },
  { id: "u3", name: "박지은" },
  { id: "u4", name: "이수민", avatar: "😊" },
  { id: "u5", name: "최민호" },
  { id: "u6", name: "정유진", avatar: "😉" },
  { id: "u7", name: "한지훈" },
  { id: "u8", name: "오세훈", avatar: "😎" },
  { id: "u9", name: "김하늘" },
  { id: "u10", name: "이정은", avatar: "🤗" },
];
const MOCK_CHATS = [
  { id: "c1", name: "김용식", lastMessage: "사진 잘 봤어요 :)", unread: 2 },
  { id: "c2", name: "김덕성", lastMessage: "내일 점심 괜찮으세요?", unread: 0 },
  { id: "c3", name: "박지은", lastMessage: "편지 잘 받았어요!", unread: 1 },
  { id: "c4", name: "이수민", lastMessage: "오늘 날씨 좋네요.", unread: 0 },
  { id: "c5", name: "최민호", lastMessage: "답장 기다릴게요~", unread: 3 },
  {
    id: "c6",
    name: "정유진",
    lastMessage: "사진 공유해주셔서 감사해요.",
    unread: 0,
  },
  { id: "c7", name: "한지훈", lastMessage: "다음에 또 만나요!", unread: 1 },
  { id: "c8", name: "오세훈", lastMessage: "편지 내용 감동이에요.", unread: 0 },
  { id: "c9", name: "김하늘", lastMessage: "언제 시간 괜찮으세요?", unread: 2 },
  { id: "c10", name: "이정은", lastMessage: "좋은 하루 보내세요!", unread: 0 },
];

export default function PenpalHomePage() {
  const penpals = MOCK_PENPALS; // 나중에 API로 교체
  const chats = MOCK_CHATS; // 나중에 API로 교체
  return (
    <main className="h-screen bg-[#FDFAE3] grid grid-rows-[auto,1fr,auto,1fr] ">
      {/* 상단바 (고정 높이) */}
      <nav className="flex items-center justify-between px-4 py-5 text-gray-600">
        <span className="text-sm">임시저장함</span>
        <span className="text-xl font-bold text-gray-900">펜팔</span>
        <span className="text-sm">펜팔 작성</span>
      </nav>

      {/* 펜팔 섹션 */}
      <section className="px-4 min-h-0 flex flex-col">
        <h2 className="mb-2 text-sm text-gray-600">
          펜팔 목록 (<strong>{penpals.length}</strong>/1000)
        </h2>
        <ul className="divide-y flex-1 overflow-y-auto min-h-0 pr-1">
          {penpals.map((p) => (
            <li key={p.id} className="flex h-14 items-center gap-3 px-2">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-gray-200 text-3xl">
                {p.avatar ?? "👤"}
              </div>
              <span className="text-base font-medium">{p.name}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 구분선: 섹션과 섹션 사이 */}
      <hr className="mx-auto w-[90%] border-t-2 border-[#CCA57A]" />

      {/* 채팅 목록 섹션 */}
      <section className="px-4 min-h-0 flex flex-col">
        <h2 className="mb-2 text-sm text-gray-600">
          채팅 목록 (<strong>{chats.length}</strong>/100)
        </h2>
        <ul className="divide-y rounded-lg border bg-white/50 flex-1 overflow-y-auto min-h-0 pr-1">
          {chats.map((c) => (
            <li
              key={c.id}
              className="flex h-14 items-center justify-between px-3"
            >
              <div className="min-w-0">
                <div className="font-medium">{c.name}</div>
                <p className="truncate text-sm text-gray-600">
                  {c.lastMessage}
                </p>
              </div>
              {c.unread > 0 && (
                <span className="rounded-full bg-black px-2 py-0.5 text-xs text-white">
                  {c.unread}
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
