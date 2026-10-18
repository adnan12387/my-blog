"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ConversationsList({ currentUserId }) {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch("/api/messages/conversations");
                if (res.ok) {
                    const data = await res.json();
                    setConversations(data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    if (loading) {
        return (
            <div className="admin-empty">
                <i className="bi bi-hourglass-split"></i>
                <p>در حال بارگذاری...</p>
            </div>
        );
    }

    if (conversations.length === 0) {
        return (
            <div className="admin-empty">
                <i className="bi bi-chat-dots"></i>
                <h3>هنوز پیامی نداری</h3>
                <p>وقتی کسی بهت پیام بده، اینجا نمایش داده می‌شه</p>
            </div>
        );
    }

    return (
        <div className="conversations-list">
            {conversations.map((conv) => (
                <Link
                    key={conv.user.id}
                    href={`/messages/${conv.user.id}`}
                    className="conversation-item"
                >
                    <div className="conversation-avatar">
                        {conv.user.avatar ? (
                            <img src={conv.user.avatar} alt={conv.user.name} />
                        ) : (
                            <i className="bi bi-person-fill"></i>
                        )}
                    </div>
                    <div className="conversation-info">
                        <div className="conversation-name">
                            {conv.user.name}
                            {conv.unreadCount > 0 && (
                                <span className="conversation-badge">
                                    {conv.unreadCount}
                                </span>
                            )}
                        </div>
                        <div className="conversation-preview">
                            {conv.lastMessageFromMe && "شما: "}
                            {conv.lastMessage}
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}