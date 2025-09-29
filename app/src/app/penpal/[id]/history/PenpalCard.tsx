// app/penpal/[id]/PenpalCard.tsx

type PenpalCardProps = {
  text: string;
  from: string;
  isSent: boolean;
  timestamp: string;
};

export default function PenpalCard({ text, from, isSent, timestamp }: PenpalCardProps) {
  // isSent 값에 따라 스타일을 다르게 적용
  const cardClasses = isSent ? 'self-end bg-[#F8EDD0]' : 'self-start bg-[#EAEDCC]';

return (
    <div
      className={`relative w-10/12 rounded-lg p-4 shadow-sm ${cardClasses} min-h-[240px] flex flex-col`}
    >
      {/* 꼬리 부분은 동일 */}
      {isSent ? (
        <div className="absolute top-4 right-[-10px] h-0 w-0 border-[10px] border-solid border-transparent border-l-[#F8EDD0]" />
      ) : (
        <div className="absolute top-4 left-[-10px] h-0 w-0 border-[10px] border-solid border-transparent border-r-[#EAEDCC]" />
      )}

      <header className="flex justify-between items-center pb-2 mb-2 border-b border-black/10">
        <h3 className="font-bold text-sm">{isSent ? '보낸 편지' : '받은 편지'}</h3>
        <time className="text-xs text-gray-500">{timestamp}</time>
      </header>

      {/* --- 1. 편지 본문에서 flex-1 제거, break-words 추가 --- */}
      <p className="text-base break-words">{text}</p>

      {/* --- 2. 보내는 사람 부분에 mt-auto 추가 --- */}
      <p className="mt-auto pt-4 text-right text-sm font-bold">"{from}"로부터</p>
    </div>
  );
}