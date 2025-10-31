'use client'

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
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
    sender: "user" | "opponent";
    text: string;
}

const ChatRoomPage = () => {
    const pageBg = "#FFFDF7";
    const messageBubbleBg = "#CED5B2";
    const userMessageBubbleBg = "#F8EDD0";
    const inputBarBg = "#F8EDD0";

    const { chatRoomId } = useParams();
    const router = useRouter();

    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [jwtToken, setJwtToken] = useState<string | null>(null);
    const [opponentName, setOpponentName] = useState<string>("상대방");
    const [opponentId, setOpponentId] = useState<string | null>(null); // 1. opponentId state 추가

    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loadingOldMessages, setLoadingOldMessages] = useState(false);

    const stompClientRef = useRef<Client | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const getJwtFromCookie = useCallback(() => {
        if (typeof document === "undefined") return null;
        const match = document.cookie.match(/jwt=([^;]+)/);
        return match ? match[1] : null;
    }, []);

    useEffect(() => {
        setJwtToken(getJwtFromCookie());
    }, [getJwtFromCookie]);

    const loadMessages = async (nextPage: number) => {
        if (!jwtToken || loadingOldMessages || !chatRoomId || (nextPage > 0 && !hasMore)) return;
        setLoadingOldMessages(true);
        const PAGE_SIZE = 20;

        try {
            const res = await axios.post(
                "http://localhost:8080/api/chat/room/messages",
                { chatRoomId: chatRoomId },
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                    params: { page: nextPage, size: PAGE_SIZE }
                }
            );

            const data = res.data.data;
            const reversedMessages = data.messages.reverse();

            const newMsgs = reversedMessages.map((msg: any) => ({
                sender: msg.senderId === data.currentUserId ? "user" : "opponent",
                text: msg.content,
            }));

            if (newMsgs.length < PAGE_SIZE) {
                setHasMore(false);
            }

            setMessages(prev => {
                if (nextPage === 0) {
                    return newMsgs;
                } else {
                    return [...newMsgs, ...prev];
                }
            });

            setPage(prev => prev + 1);

            if (nextPage === 0 && chatContainerRef.current) {
                setTimeout(() => {
                    if (chatContainerRef.current) {
                        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
                    }
                }, 0);
            }

        } catch (err) {
            console.error("메시지 불러오기 실패:", err);
        } finally {
            setLoadingOldMessages(false);
        }
    };

    // 2. loadOpponentInfo가 opponentId를 state에 저장하도록 수정
    const loadOpponentInfo = async () => {
        if (!jwtToken || !chatRoomId) return;

        try {
            const res = await axios.get(
                "http://localhost:8080/api/chat/list",
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                    params: { page: 0, size: 20 }
                }
            );

            if (res.data?.isSuccess && res.data.data.chatRooms) {
                const chatRooms = res.data.data.chatRooms;

                const currentRoom = chatRooms.find(
                    (room: any) => room.id === chatRoomId
                );

                if (currentRoom) {
                    if (currentRoom.opponentName && currentRoom.opponentName !== "알 수 없음") {
                        setOpponentName(currentRoom.opponentName);
                    }
                    if (currentRoom.opponentId) {
                        setOpponentId(currentRoom.opponentId); // state에 저장
                    }
                } else {
                    console.warn(`Chat room ${chatRoomId} not found in the first page of the list.`);
                }
            }
        } catch (err) {
            console.error("상대방 정보 불러오기 실패:", err);
        }
    };

    // 3. connectWebSocket이 state의 opponentId를 사용하도록 수정
    const connectWebSocket = () => {
        // opponentId가 로드되지 않았으면 연결하지 않음
        if (!jwtToken || !chatRoomId || !opponentId) return;

        if (stompClientRef.current) {
            stompClientRef.current.deactivate();
        }

        const client = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8080/ws-chat"),
            connectHeaders: { Authorization: `Bearer ${jwtToken}` },
            debug: (str) => console.log(new Date(), str),

            onConnect: () => {
                console.log("STOMP 연결 성공");
                stompClientRef.current = client;

                client.subscribe(`/topic/chat/room/${chatRoomId}`, (message) => {
                    const msg = JSON.parse(message.body);

                    // "me" 대신 state의 opponentId와 비교
                    const sender = msg.senderId === opponentId ? "opponent" : "user";

                    setMessages(prev => [...prev, { sender: sender, text: msg.content }]);
                });
            },
            onStompError: (frame) => {
                console.error("STOMP Error:", frame.headers["message"], frame.body);
            },
            onWebSocketError: (error) => {
                console.error("WebSocket Error:", error);
            },
        });

        client.activate();
    };

    // 4. useEffect 분리

    // 첫 번째 useEffect: 메시지와 상대방 정보를 로드
    useEffect(() => {
        if (jwtToken && chatRoomId) {
            loadMessages(0);
            loadOpponentInfo();
        }
    }, [jwtToken, chatRoomId]); // chatRoomId가 바뀔 때마다 정보 로드

    // 두 번째 useEffect: WebSocket 연결 (opponentId가 세팅된 후에만)
    useEffect(() => {
        if (jwtToken && chatRoomId && opponentId) {
            connectWebSocket();
        }
        return () => {
            stompClientRef.current?.deactivate();
        };
    }, [jwtToken, chatRoomId, opponentId]); // opponentId가 변경될 때마다 재연결

    useEffect(() => {
        if (chatContainerRef.current && !loadingOldMessages) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, loadingOldMessages]);


    const handleSend = () => {
        if (!newMessage.trim() || !stompClientRef.current?.active || !chatRoomId) {
            console.log("--- 메시지 전송 실패 ---");
            console.log("입력된 메시지:", newMessage.trim());
            console.log("STOMP 활성화 상태:", stompClientRef.current?.active);
            console.log("채팅방 ID:", chatRoomId);
            return;
        }

        stompClientRef.current.publish({
            destination: "/app/chat/send",
            body: JSON.stringify({ chatRoomId, content: newMessage }),
        });
        setNewMessage("");
    };

    const handleScroll = () => {
        const container = chatContainerRef.current;
        if (!container || loadingOldMessages || !hasMore) return;

        if (container.scrollTop < 50) {
            loadMessages(page);
        }
    };

    return (
        <div
            className="flex flex-col max-w-[430px] mx-auto"
            style={{ backgroundColor: pageBg, height: "calc(100vh - 170px)" }}
        >
            <header className="flex-shrink-0 flex items-center justify-center relative p-4 bg-white z-10 shadow-sm">
                <button
                    onClick={() => router.back()}
                    className="absolute left-4 text-gray-700 flex items-center space-x-1 text-sm"
                >
                    <BackArrowIcon />
                    <span>뒤로가기</span>
                </button>
                <h1 className="text-lg font-semibold text-gray-900">
                    채팅
                </h1>
            </header>

            <main
                ref={chatContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-4 space-y-6"
                style={{ paddingBottom: "100px" }}
            >
                {messages.length === 0 && !loadingOldMessages && (
                    <div className="text-center text-gray-500">
                        안녕하세요! 대화를 시작해보세요.
                    </div>
                )}

                {messages.map((msg, index) =>
                    msg.sender === "opponent" ? (
                        <div key={index} className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-11 h-11 rounded-full bg-orange-100 flex items-center justify-center text-xl shadow-sm">
                                <Image
                                    src={logo}
                                    alt={`${opponentName} 프로필`}
                                    width={40}
                                    height={40}
                                    className="object-contain"
                                />
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="font-semibold text-gray-800 mb-1 text-sm">
                                    {opponentName}
                                </span>
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
                        placeholder={chatRoomId ? "메시지를 입력하세요" : "채팅방 연결 중..."}
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

export default ChatRoomPage;