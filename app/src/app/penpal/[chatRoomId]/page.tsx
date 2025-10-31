'use client'

import { useParams } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface Message {
    sender: "user" | "opponent";
    text: string;
}

const ChatRoomPage = () => {
    const { chatRoomId } = useParams(); // URL에서 chatRoomId 가져오기
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [jwtToken, setJwtToken] = useState<string | null>(null);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loadingOldMessages, setLoadingOldMessages] = useState(false);

    const stompClientRef = useRef<Client | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const getJwtFromCookie = useCallback(() => {
        if (typeof document === "undefined") return null;
        const match = document.cookie.match(/jwt_token=([^;]+)/);
        return match ? match[1] : null;
    }, []);

    useEffect(() => {
        setJwtToken(getJwtFromCookie());
    }, [getJwtFromCookie]);

    /** 기존 메시지 불러오기 */
    const loadMessages = async (nextOffset: number) => {
        if (!jwtToken || loadingOldMessages || !chatRoomId) return;
        setLoadingOldMessages(true);

        try {
            const res = await axios.post(
                "/api/chat/room/messages",
                { chatRoomId, offset: nextOffset },
                { headers: { Authorization: `Bearer ${jwtToken}` } }
            );

            const newMsgs = res.data.data.messages.map((msg: any) => ({
                sender: msg.senderId === res.data.data.currentUserId ? "user" : "opponent",
                text: msg.content,
            }));

            if (newMsgs.length === 0) setHasMore(false);
            setMessages(prev => [...newMsgs, ...prev]);
            setOffset(prev => prev + newMsgs.length);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingOldMessages(false);
        }
    };

    /** WebSocket 연결 */
    const connectWebSocket = () => {
        if (!jwtToken || !chatRoomId) return;

        const client = new Client({
            webSocketFactory: () => new SockJS("/ws-chat"),
            connectHeaders: { Authorization: `Bearer ${jwtToken}` },
            onConnect: () => {
                stompClientRef.current = client;
                client.subscribe(`/topic/chat/room/${chatRoomId}`, (message) => {
                    const msg = JSON.parse(message.body);
                    setMessages(prev => [...prev, { sender: msg.senderId === "me" ? "user" : "opponent", text: msg.content }]);
                });
            },
        });

        client.activate();
    };

    useEffect(() => {
        if (jwtToken) {
            loadMessages(0);
            connectWebSocket();
        }
        return () => {
            stompClientRef.current?.deactivate();
        };
    }, [jwtToken, chatRoomId]);

    const handleSend = () => {
        if (!newMessage.trim() || !stompClientRef.current || !chatRoomId) return;

        stompClientRef.current.publish({
            destination: "/app/chat/send",
            body: JSON.stringify({ chatRoomId, content: newMessage }),
        });
        setNewMessage("");
    };

    const handleScroll = () => {
        if (!chatContainerRef.current || loadingOldMessages || !hasMore) return;
        if (chatContainerRef.current.scrollTop < 100) {
            loadMessages(offset);
        }
    };

    return (
        <div className="flex flex-col h-full max-w-[430px] mx-auto">
            <div className="flex-1 overflow-y-auto" ref={chatContainerRef} onScroll={handleScroll}>
                {messages.map((msg, i) => (
                    <div key={i} className={msg.sender === "user" ? "text-right" : "text-left"}>
                        <span>{msg.text}</span>
                    </div>
                ))}
            </div>
            <div className="flex">
                <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                <button onClick={handleSend}>전송</button>
            </div>
        </div>
    );
};

export default ChatRoomPage;
