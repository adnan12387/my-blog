"use client";

import { useState, useEffect, useRef } from "react";

export default function ChatBox({ currentUserId, otherUser }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);

    async function loadMessages() {
        try {
            const res = await fetch(`/api/messages/${otherUser.id}`);
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadMessages();

        // هر ۵ ثانیه پیام‌های جدید رو چک کن
        const interval = setInterval(loadMessages, 5000);
        return () => clearInterval(interval);
    }, [otherUser.id]);

    // اسکرول به پایین
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    async function handleSend(e) {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        setSending(true);
        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    receiverId: otherUser.id,
                    content: newMessage,
                }),
            });

            if (res.ok) {
                const msg = await res.json();
                setMessages((prev) => [...prev, msg]);
                setNewMessage("");
            } else {
                const data = await res.json();
                alert(data.error || "خطا در ارسال");
            }
        } catch (error) {
            alert("خطا در ارسال");
        } finally {
            setSending(false);
        }
    }

    function formatTime(date) {
        const d = new Date(date);
        return d.toLocaleTimeString("fa-IR", {
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    return (
        <div className="chat-box">
            {/* پیام‌ها */}
            <div className="chat-messages">
                {loading ? (
                    <div className="chat-loading">
                        <i className="bi bi-hourglass-split"></i>
                        در حال بارگذاری...
                    </div>
                ) : messages.length === 0 ? (
                    <div className="chat-empty">
                        <i className="bi bi-chat-dots"></i>
                        <p>هنوز پیامی رد و بدل نشده. اولین پیام رو بفرست!</p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMine = msg.senderId === currentUserId;
                        return (
                            <div
                                key={msg.id}
                                className={`chat-bubble-wrap ${isMine ? "mine" : "theirs"}`}
                            >
                                <div className={`chat-bubble ${isMine ? "mine" : "theirs"}`}>
                                    <div className="chat-bubble-content">{msg.content}</div>
                                    <div className="chat-bubble-time">
                                        {formatTime(msg.createdAt)}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* فرم ارسال */}
            <form onSubmit={handleSend} className="chat-form">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="پیامت رو بنویس..."
                    className="chat-input"
                    disabled={sending}
                />
                <button
                    type="submit"
                    className="chat-send-btn"
                    disabled={sending || !newMessage.trim()}
                >
                    {sending ? (
                        <i className="bi bi-hourglass-split"></i>
                    ) : (
                        <i className="bi bi-send"></i>
                    )}
                </button>
            </form>
        </div>
    );
}