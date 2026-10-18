"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const bellRef = useRef(null);
    const router = useRouter();

    async function loadNotifications() {
        try {
            const res = await fetch("/api/notifications");
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.notifications);
                setUnreadCount(data.unreadCount);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    // بارگذاری اولیه + هر ۳۰ ثانیه
    useEffect(() => {
        loadNotifications();
        const interval = setInterval(loadNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    // بستن با کلیک بیرون
    useEffect(() => {
        function handleClickOutside(e) {
            if (bellRef.current && !bellRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    async function handleMarkAllRead() {
        try {
            await fetch("/api/notifications", { method: "PUT" });
            setUnreadCount(0);
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        } catch (error) {
            console.error(error);
        }
    }

    async function handleDelete(id) {
        try {
            await fetch(`/api/notifications/${id}`, { method: "DELETE" });
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        } catch (error) {
            console.error(error);
        }
    }

    function handleNotifClick(notif) {
        setIsOpen(false);
        if (notif.link) {
            router.push(notif.link);
        }
    }

    // آیکون بر اساس نوع
    function getNotifIcon(type) {
        const icons = {
            message: "bi-chat-dots",
            comment: "bi-chat-left-text",
            like: "bi-heart",
            follow: "bi-person-plus",
            admin: "bi-shield",
            post_approved: "bi-check-circle",
            post_rejected: "bi-x-circle",
            request_approved: "bi-check-circle",
            request_rejected: "bi-x-circle",
        };
        return icons[type] || "bi-bell";
    }

    // زمان نسبی
    function timeAgo(date) {
        const now = new Date();
        const past = new Date(date);
        const diff = Math.floor((now - past) / 1000);

        if (diff < 60) return "همین الان";
        if (diff < 3600) return `${Math.floor(diff / 60)} دقیقه پیش`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} ساعت پیش`;
        if (diff < 604800) return `${Math.floor(diff / 86400)} روز پیش`;
        return past.toLocaleDateString("fa-IR");
    }

    return (
        <div className="notification-bell-wrap" ref={bellRef}>
            <button
                className="notification-bell-btn"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="اعلان‌ها"
            >
                <i className={`bi ${isOpen ? "bi-x-lg" : "bi-bell"}`}></i>
                {unreadCount > 0 && (
                    <span className="notification-badge">
                        {unreadCount > 9 ? "۹+" : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="notification-panel">
                    <div className="notification-header">
                        <h3 className="notification-title">
                            <i className="bi bi-bell"></i>
                            اعلان‌ها
                        </h3>
                        {unreadCount > 0 && (
                            <button
                                className="notification-mark-read"
                                onClick={handleMarkAllRead}
                            >
                                همه خونده شد
                            </button>
                        )}
                    </div>

                    <div className="notification-list">
                        {loading ? (
                            <div className="notification-empty">
                                <i className="bi bi-hourglass-split"></i>
                                در حال بارگذاری...
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="notification-empty">
                                <i className="bi bi-bell-slash"></i>
                                <p>اعلانی نداری</p>
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    className={`notification-item ${!notif.read ? "unread" : ""}`}
                                >
                                    <button
                                        className="notification-content"
                                        onClick={() => handleNotifClick(notif)}
                                    >
                                        <div className="notification-icon">
                                            <i className={`bi ${getNotifIcon(notif.type)}`}></i>
                                        </div>
                                        <div className="notification-body">
                                            <div className="notification-item-title">{notif.title}</div>
                                            <div className="notification-item-message">
                                                {notif.message}
                                            </div>
                                            <div className="notification-time">
                                                {timeAgo(notif.createdAt)}
                                            </div>
                                        </div>
                                    </button>
                                    <button
                                        className="notification-delete"
                                        onClick={() => handleDelete(notif.id)}
                                        title="حذف"
                                    >
                                        <i className="bi bi-x"></i>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}