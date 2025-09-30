"use client";

import React, { useState, useEffect, useRef } from 'react';

// 메시지 데이터 타입 정의
type Message = {
    id: number;
    sender: '김용식' | 'me';
    text: string;
    timestamp: string;
};

// 초기 채팅 데이터 예시
const initialMessages: Message[] = [
    { id: 1, sender: 'me', text: '등산... 좋아하세요?', timestamp: '오후 5:00' },
    { id: 2, sender: '김용식', text: '어떻게 안 좋아할 수 있겠습니까!!!!!', timestamp: '오후 5:00' },
    { id: 3, sender: 'me', text: '그럼 같이 가시죠 ^^..', timestamp: '오후 5:00' },
];

const ChatPage = () => {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [inputValue, setInputValue] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    // 새 메시지가 추가될 때마다 스크롤을 맨 아래로 이동시키는 효과
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // 현재 시간을 "오전/오후 H:MM" 형식으로 반환하는 함수
    const getCurrentTimestamp = () => {
        const date = new Date();
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? '오후' : '오전';
        const formattedHours = hours % 12 || 12; // 12시간 형식으로 변환
        return `${ampm} ${formattedHours}:${minutes}`;
    };

    // 메시지 전송 처리 함수
    const handleSendMessage = () => {
        if (inputValue.trim() === '') return; // 빈 메시지는 전송하지 않음

        const newMessage: Message = {
            id: Date.now(), // 간단하게 현재 시간을 고유 ID로 사용
            sender: 'me',
            text: inputValue,
            timestamp: getCurrentTimestamp(),
        };

        setMessages([...messages, newMessage]);
        setInputValue(''); // 입력창 비우기
    };

    // Enter 키로 메시지를 전송하는 함수
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
            handleSendMessage();
        }
    };

    return (
        <div className="flex flex-col h-screen max-w-md mx-auto bg-[#FAF8F5] font-sans">
            <header className="relative flex items-center justify-center p-4">

            </header>

            <main className="flex-1 p-4 overflow-y-auto bg-[#FFFDF7]">
                <div className="relative flex items-center justify-center px-4 pb-4">
                    <button className="absolute left-4 text-sm text-gray-600">뒤로가기</button>
                    <h1 className="text-lg font-bold">김용식</h1>
                </div>
                <div className="space-y-4">
                    {messages.map((msg, index) => {
                        const prevSender = index > 0 ? messages[index - 1].sender : null;
                        const showSenderInfo = msg.sender !== 'me' && msg.sender !== prevSender;

                        if (msg.sender === 'me') {
                            return (
                                <div key={msg.id} className="flex items-end justify-end gap-2">
                                    <span className="text-xs text-gray-500 whitespace-nowrap">{msg.timestamp}</span>
                                    <div className="bg-[#EAEDCC] p-3 rounded-2xl max-w-[70%]">
                                        <p className="break-words">{msg.text}</p>
                                    </div>
                                </div>
                            );
                        } else {
                            return (
                                <div key={msg.id}>
                                    {showSenderInfo && (
                                        <div className="flex items-center gap-2 mb-2">
                                            <div
                                                className="w-10 h-10 rounded-full flex items-center justify-center text-2xl bg-[#EEE8DA]">
                                                <span>😊</span>
                                            </div>
                                            <span className="font-semibold">{msg.sender}</span>
                                        </div>
                                    )}
                                    <div className="flex items-end justify-start gap-2">
                                        <div className="bg-[#CED5B2] p-3 rounded-2xl max-w-[70%]">
                                            <p className="break-words">{msg.text}</p>
                                        </div>
                                        <span className="text-xs text-gray-500 whitespace-nowrap">{msg.timestamp}</span>
                                    </div>
                                </div>
                            );
                        }
                    })}
                    {/* 스크롤 위치를 위한 빈 div */}
                    <div ref={chatEndRef}/>
                </div>
            </main>

            <footer className="p-4 bg-[#FFFDF7]">
                <div className="flex items-center p-1 bg-[#F8EDD0] rounded-full">
                    <input
                        type="text"
                        placeholder="대화를 시작해보세요"
                        className="flex-1 px-4 py-2 bg-transparent focus:outline-none placeholder-gray-500"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button className="p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#92A391]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                    </button>
                    <button className="p-2" onClick={handleSendMessage}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#92A391]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default ChatPage;