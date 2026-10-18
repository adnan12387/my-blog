"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Sidebar({ isMobile = false }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch("/api/sidebar");
                if (res.ok) {
                    const json = await res.json();
                    setData(json);
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
            <aside className="site-sidebar">
                <div className="sidebar-widget" style={{ textAlign: "center", padding: "40px 20px" }}>
                    <i className="bi bi-hourglass-split" style={{ fontSize: "2rem", color: "var(--text-muted)" }}></i>
                </div>
            </aside>
        );
    }

    const user = data?.user;
    const categories = data?.categories || [];
    const recentPosts = data?.recentPosts || [];

    return (
        <aside className="site-sidebar">
            {/* پروفایل */}
            <div className="sidebar-widget">
                <div className="sidebar-profile">
                    <div className="sidebar-avatar">
                        {user?.avatar ? (
                            <img src={user.avatar} alt={user.name} />
                        ) : (
                            <i className="bi bi-person-fill"></i>
                        )}
                    </div>
                    {user ? (
                        <>
                            <div className="sidebar-user-name">{user.name}</div>
                            <Link href="/profile" className="sidebar-user-link">
                                مشاهده پروفایل
                            </Link>
                        </>
                    ) : (
                        <>
                            <div className="sidebar-user-name">مهمان</div>
                            <Link href="/login" className="sidebar-user-link">
                                ورود / ثبت‌نام
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* دسته‌بندی‌ها */}
            <div className="sidebar-widget">
                <h3 className="sidebar-title">
                    <i className="bi bi-folder"></i>
                    دسته‌بندی‌ها
                </h3>
                <ul className="sidebar-list">
                    {categories.length === 0 ? (
                        <li className="sidebar-empty">هنوز دسته‌بندی نیست</li>
                    ) : (
                        categories.map((cat) => (
                            <li key={cat.id}>
                                <Link href={`/category/${cat.slug}`} className="sidebar-link">
                                    <i className={`bi ${cat.icon}`} style={{ color: cat.color }}></i>
                                    {cat.name}
                                </Link>
                            </li>
                        ))
                    )}
                </ul>
            </div>

            {/* آخرین پست‌ها */}
            <div className="sidebar-widget">
                <h3 className="sidebar-title">
                    <i className="bi bi-clock-history"></i>
                    آخرین پست‌ها
                </h3>
                <ul className="sidebar-list">
                    {recentPosts.length === 0 ? (
                        <li className="sidebar-empty">هنوز پستی نیست</li>
                    ) : (
                        recentPosts.map((post) => (
                            <li key={post.id}>
                                <Link href={`/posts/${post.id}`} className="sidebar-link">
                                    <i className={`bi ${post.tag}`}></i>
                                    <span>{post.title}</span>
                                </Link>
                            </li>
                        ))
                    )}
                </ul>
            </div>

            {/* لینک‌های سریع */}
            <div className="sidebar-widget">
                <h3 className="sidebar-title">
                    <i className="bi bi-link-45deg"></i>
                    لینک‌های سریع
                </h3>
                <ul className="sidebar-list">
                    <li>
                        <Link href="/" className="sidebar-link">
                            <i className="bi bi-house"></i>
                            خانه
                        </Link>
                    </li>
                    <li>
                        <Link href="/about" className="sidebar-link">
                            <i className="bi bi-person"></i>
                            درباره من
                        </Link>
                    </li>
                    {user?.role === "admin" && (
                        <li>
                            <Link href="/admin" className="sidebar-link">
                                <i className="bi bi-shield-lock"></i>
                                پنل ادمین
                            </Link>
                        </li>
                    )}
                    {user?.role === "author" && (
                        <li>
                            <Link href="/dashboard" className="sidebar-link">
                                <i className="bi bi-pencil-square"></i>
                                پنل نویسندگی
                            </Link>
                        </li>
                    )}
                </ul>
            </div>
        </aside>
    );
}