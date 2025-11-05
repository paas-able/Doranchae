// app/penpal/[id]/PenpalCard.tsx
'use client'
type PenpalCardProps = {
    content: string;  // text -> content
    sentAt: string;   // timestamp -> sentAt
    status: string;
    isFromUser: boolean; // isSent -> isFromUser
};

export default function PenpalCard({content, sentAt, status, isFromUser}: PenpalCardProps) {
    const timestamp = new Date(sentAt)
    const dateVal = `${timestamp.getFullYear()}.${timestamp.getMonth() + 1}.${timestamp.getDate()}`

    // isSent 값에 따라 스타일을 다르게 적용
    const cardClasses = isFromUser ? 'self-end bg-[#F8EDD0]' : 'self-start bg-[#EAEDCC]';

    const username = isFromUser ? '나' : (typeof window !== 'undefined' ? localStorage.getItem("opponent_nickname") : ''); // [!!] localStorage 접근 보호

    const text = (status === "READ" || isFromUser) ? content : '💌보낸 날로부터 하루 뒤에 확인할 수 있어요💌'

    return (
        <div
            className={`relative w-10/12 rounded-lg p-4 shadow-sm ${cardClasses} h-fit flex flex-col`}
        >
            {/* 꼬리 부분은 동일 */}
            {isFromUser ? (
                <div
                    className="absolute top-4 right-[-10px] h-0 w-0 border-[10px] border-solid border-transparent border-l-[#F8EDD0]"/>
            ) : (
                <div
                    className="absolute top-4 left-[-10px] h-0 w-0 border-[10px] border-solid border-transparent border-r-[#EAEDCC]"/>
            )}

            <header className="flex justify-between items-center pb-2 mb-2 border-b border-black/10">
                <h3 className="font-bold text-sm">{isFromUser ? '보낸 편지' : '받은 편지'}</h3>
                <time className="text-xs text-gray-500">{dateVal}</time>
            </header>

            <p className="text-base break-words">{text}</p>
            <p className="mt-auto pt-4 text-right text-sm font-bold">
                {`"${username}"(으)로부터`}
            </p>
        </div>
    );
}