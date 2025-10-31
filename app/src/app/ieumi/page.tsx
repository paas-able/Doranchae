"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import Image from "next/image";
import logo from "@assets/ieumi.png";

const BackArrowIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
);

const MicrophoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15a3 3 0 0 1-3-3V4.5a3 3 0 0 1 6 0V12a3 3 0 0 1-3 3Z" />
    </svg>
);

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
    </svg>
);

interface Message {
    sender: "user" | "bot";
    text: string;
}

interface ReceivedMessage {
    content: string;
    senderId: string;
}

const IeumiPage = () => {
    const pageBg = "#FFFDF7";
    const messageBubbleBg = "#CED5B2";
    const userMessageBubbleBg = "#F8EDD0";
    const inputBarBg = "#F8EDD0";

    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [chatRoomId, setChatRoomId] = useState<string | null>(null);
    const [jwtToken, setJwtToken] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loadingOldMessages, setLoadingOldMessages] = useState(false);

    const stompClientRef = useRef<Client | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const BOT_USER_ID = "00000000-0000-0000-0000-00000C0DE001";

    const getJwtFromCookie = useCallback(() => {
        if (typeof document === "undefined") return null;
        const match = document.cookie.match(/jwt=([^;]+)/);
        return match ? match[1] : null;
    }, []);

    useEffect(() => {
        const token = getJwtFromCookie();
        if (!token) return;
        setJwtToken(token);
    }, [getJwtFromCookie]);

    useEffect(() => {
        if (!jwtToken) return;

        const setupChatRoom = async () => {
            let roomId: string | null = null;
            try {
                const response = await axios.get("http://chat:8084/api/chat/bot", {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });
                roomId = response.data.data;
            } catch (error) {
                console.log("기존 채팅방 없음. 새로 생성합니다.");
                try {
                    const createResponse = await axios.post(
                        "http://chat:8084/api/chat/room",
                        { opponentId: BOT_USER_ID },
                        { headers: { Authorization: `Bearer ${jwtToken}` } }
                    );
                    roomId = createResponse.data.data;
                } catch (createError) {
                    console.error("채팅방 생성 실패:", createError);
                    return;
                }
            }

            if (roomId) {
                setChatRoomId(roomId);
                await loadMessages(roomId, 0);
                connectWebSocket(roomId);
            }
        };

        setupChatRoom();

        return () => {
            if (stompClientRef.current?.active) {
                stompClientRef.current.deactivate();
            }
        };
    }, [jwtToken]);

    const loadMessages = async (roomId: string, nextPage: number) => {
        if (!jwtToken || loadingOldMessages || !hasMore) return;
        setLoadingOldMessages(true);

        const PAGE_SIZE = 20;

        try {
            const requestBody = {
                chatRoomId: roomId
            };

            const requestParams = {
                page: nextPage,
                size: PAGE_SIZE
            };

            const response = await axios.post(
                "http://chat:8084/api/chat/room/messages",
                requestBody,
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                    params: requestParams
                }
            );

            const data = response.data.data;

            const reversedMessages = data.messages.reverse();

            const newMessages = reversedMessages.map((msg: any) => ({
                sender: msg.isFromUser ? "user" : "bot",
                text: msg.content,
            }));

            if (newMessages.length < PAGE_SIZE) {
                setHasMore(false);
            }

            setMessages((prev) => {
                if (nextPage === 0) {
                    return newMessages;
                } else {
                    return [...newMessages, ...prev];
                }
            });

            setPage((prev) => prev + 1);

            if (nextPage === 0 && chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }

        } catch (error) {
            console.error("메시지 불러오기 실패:", error);
        } finally {
            setLoadingOldMessages(false);
        }
    };

    const connectWebSocket = (roomId: string) => {
        if (stompClientRef.current) {
            stompClientRef.current.deactivate();
        }

        const stompClient = new Client({
            webSocketFactory: () => new SockJS("http://chat:8084/ws-chat"),
            connectHeaders: { Authorization: `Bearer ${jwtToken}` },
            debug: (str) => console.log(new Date(), str),

            onConnect: () => {
                console.log("STOMP 연결 성공");
                stompClientRef.current = stompClient;

                stompClient.subscribe(`/topic/chat/room/${roomId}`, (message) => {
                    const receivedMessage: ReceivedMessage = JSON.parse(message.body);

                    const isFromBot = receivedMessage.senderId.toLowerCase() === BOT_USER_ID.toLowerCase();

                    const formattedMessage: Message = {
                        sender: isFromBot ? "bot" : "user",
                        text: receivedMessage.content,
                    };

                    setMessages((prev) => [...prev, formattedMessage]);
                });
            },
            onStompError: (frame) => {
                console.error("STOMP Error:", frame.headers["message"], frame.body);
            },
            onWebSocketError: (error) => {
                console.error("WebSocket Error:", error);
            },
        });

        stompClient.activate();
    };

    const handleSend = () => {
        if (!newMessage.trim() || !stompClientRef.current?.active || !chatRoomId) return;

        const chatMessage = { chatRoomId, content: newMessage };

        stompClientRef.current.publish({
            destination: "/app/chat/send",
            body: JSON.stringify(chatMessage),
        });

        setNewMessage("");
    };

    const handleScroll = () => {
        const container = chatContainerRef.current;
        if (!container || loadingOldMessages || !hasMore) return;

        if (container.scrollTop < 50) {
            loadMessages(chatRoomId!, page);
        }
    };

    useEffect(() => {
        if (chatContainerRef.current && !loadingOldMessages) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, loadingOldMessages]);

    return (
        <div
            className="flex flex-col max-w-[430px] mx-auto"
            style={{ backgroundColor: pageBg, height: "calc(100vh - 170px)" }}
        >
            <header className="flex-shrink-0 flex items-center justify-center relative p-4 bg-white z-10 shadow-sm">
                <button className="absolute left-4 text-gray-700 flex items-center space-x-1 text-sm">
                    <BackArrowIcon />
                    <span>뒤로가기</span>
                </button>
                <h1 className="text-lg font-semibold text-gray-900">이음이</h1>
            </header>

            <main
                ref={chatContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-4 space-y-6"
                style={{ paddingBottom: "100px" }}
            >
                {messages.length === 0 && !loadingOldMessages && (
                    <div className="text-center text-gray-500">
                        안녕하세요! 이음이에게 무엇이든 물어보세요.
                    </div>
                )}

                {messages.map((msg, index) =>
                    msg.sender === "bot" ? (
                        <div key={index} className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-11 h-11 rounded-full bg-orange-100 flex items-center justify-center text-xl shadow-sm">
                                <Image
                                    src={logo}
                                    alt="이음이 프로필"
                                    width={40}
                                    height={40}
                                    className="object-contain"
                                />
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="font-semibold text-gray-800 mb-1 text-sm">이음이</span>
                                <div
                                    className="p-3 rounded-lg max-w-xs text-black text-base shadow-sm"
                                    style={{ backgroundColor: messageBubbleBg }}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div key={index} className="flex justify-end">
                            <div
                                className="p-3 rounded-lg max-w-xs text-black text-base shadow-sm"
                                style={{ backgroundColor: userMessageBubbleBg }}
                            >
                                {msg.text}
                            </div>
                        </div>
                    )
                )}
            </main>

            <footer className="flex-shrink-0 p-3 border-t border-gray-100">
                <div
                    className="flex items-center justify-between py-1 px-3 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.05)]"
                    style={{ backgroundColor: inputBarBg }}
                >
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder={chatRoomId ? "대화를 시작해보세요" : "채팅방 연결 중..."}
                        disabled={!chatRoomId}
                        className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-gray-700 placeholder-gray-500 px-3 py-2 disabled:opacity-75"
                    />
                    <div className="flex items-center space-x-2 p-1">
                        <button
                            className="text-gray-600 hover:text-black p-2 rounded-full hover:bg-black/5 disabled:text-gray-300"
                            disabled={!chatRoomId}
                        >
                            <MicrophoneIcon />
                        </button>
                        <button
                            onClick={handleSend}
                            className="text-gray-600 hover:text-black p-2 rounded-full hover:bg-black/5 disabled:text-gray-300"
                            disabled={newMessage.trim() === "" || !chatRoomId}
                        >
                            <SendIcon />
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default IeumiPage;