"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UserMenu({ user }) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const menuRef = useRef(null);
    const router = useRouter();

    // بستن با کلیک بیرون
    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    async function handleLogout() {
        setLoading(true);
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/");
            router.refresh();
        } catch (error) {
            alert("خطا در خروج");
            setLoading(false);
        }
    }

    const roleLabels = {
        admin: "مدیر",
        author: "نویسنده",
        user: "کاربر",
    };

    return (
        <div className="user-menu-wrap" ref={menuRef}>
            <button className="user-menu-btn" onClick={() => setIsOpen(!isOpen)}>
                <div className="user-menu-avatar">
                    {user.avatar ? (
                        <img src={user.avatar} alt={user.name} />
                    ) : (
                        <i className="bi bi-person-fill"></i>
                    )}
                </div>
                <span className="user-menu-name">{user.name}</span>
                <i
                    className={`bi bi-chevron-${isOpen ? "up" : "down"} user-menu-chevron`}
                ></i>
            </button>

            {isOpen && (
                <div className="user-menu-dropdown">
                    <div className="user-menu-header">
                        <div className="user-menu-header-avatar">
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.name} />
                            ) : (
                                <i className="bi bi-person-fill"></i>
                            )}
                        </div>
                        <div>
                            <div className="user-menu-header-name">{user.name}</div>
                            <div className="user-menu-header-role">
                                {roleLabels[user.role]}
                            </div>
                        </div>
                    </div>

                    <div className="user-menu-items">
                        <Link
                            href="/profile"
                            className="user-menu-item"
                            onClick={() => setIsOpen(false)}
                        >
                            <i className="bi bi-person"></i>
                            پروفایل من
                        </Link>

                        {(user.role === "author" || user.role === "user") && (
                            <Link
                                href="/dashboard"
                                className="user-menu-item"
                                onClick={() => setIsOpen(false)}
                            >
                                <i className="bi bi-pencil-square"></i>
                                پنل من
                            </Link>
                        )}

                        {user.role === "admin" && (
                            <Link
                                href="/admin"
                                className="user-menu-item"
                                onClick={() => setIsOpen(false)}
                            >
                                <i className="bi bi-shield-lock"></i>
                                پنل ادمین
                            </Link>
                        )}

                        <Link
                            href="/messages"
                            className="user-menu-item"
                            onClick={() => setIsOpen(false)}
                        >
                            <i className="bi bi-chat-dots"></i>
                            پیام‌ها
                        </Link>

                        <Link
                            href="/users"
                            className="user-menu-item"
                            onClick={() => setIsOpen(false)}
                        >
                            <i className="bi bi-people"></i>
                            کاربران
                        </Link>

                        <Link
                            href="/bookmarks"
                            className="user-menu-item"
                            onClick={() => setIsOpen(false)}
                        >
                            <i className="bi bi-bookmark"></i>
                            ذخیره‌ها
                        </Link>

                        <Link href="/feed"className="user-menu-item"onClick={() => setIsOpen(false)}>
                        <i className="bi bi-rss"></i>
                        فید من
                        </Link>
                    </div>

                    <div className="user-menu-footer">
                        <button
                            onClick={handleLogout}
                            disabled={loading}
                            className="user-menu-logout"
                        >
                            <i className="bi bi-box-arrow-right"></i>
                            {loading ? "..." : "خروج"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}