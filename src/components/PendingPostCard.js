"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PendingPostCard({ post }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    async function handleAction(action) {
        const messages = {
            published: "مطمئنی می‌خوای این پست رو منتشر کنی؟",
            rejected: "مطمئنی می‌خوای این پست رو رد کنی؟",
        };

        if (!confirm(messages[action])) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/admin/pending-posts/${post.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: action }),
            });

            if (res.ok) {
                router.refresh();
            } else {
                alert("خطا");
            }
        } catch (error) {
            alert("خطا");
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete() {
        if (!confirm("مطمئنی می‌خوای این پست رو کاملاً حذف کنی؟")) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/posts/${post.id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                router.refresh();
            } else {
                alert("خطا در حذف");
            }
        } catch (error) {
            alert("خطا در حذف");
        } finally {
            setLoading(false);
        }
    }

    // رنگ امتیاز
    function getScoreColor(score) {
        if (score >= 70) return "linear-gradient(135deg, #00c9ff, #92fe9d)";
        if (score >= 40) return "linear-gradient(135deg, #f857a6, #ff5858)";
        return "linear-gradient(135deg, #7c5cff, #ff5c9d)";
    }

    return (
        <div className="request-card">
            {/* هدر */}
            <div className="request-header">
                <div className="request-user">
                    <div className="request-avatar">
                        {post.user?.avatar ? (
                            <img src={post.user.avatar} alt={post.user.name} />
                        ) : (
                            <i className="bi bi-person-fill"></i>
                        )}
                    </div>
                    <div>
                        <div className="request-user-name">{post.user?.name || post.author}</div>
                        <div className="request-user-email">{post.user?.email}</div>
                    </div>
                </div>

                {post.aiScore !== null && (
                    <span
                        className="request-status"
                        style={{ background: getScoreColor(post.aiScore) }}
                    >
                        امتیاز AI: {post.aiScore}
                    </span>
                )}
            </div>

            {/* اطلاعات پست */}
            <div className="pending-post-info">
                <h3 className="pending-post-title">
                    <i className={`bi ${post.tag}`}></i>
                    {post.title}
                </h3>
                <p className="pending-post-excerpt">{post.excerpt}</p>
            </div>

            {/* دلیل AI */}
            {post.aiReason && (
                <div className="request-message">
                    <i className="bi bi-robot"></i>
                    <div>
                        <strong>نظر AI:</strong>
                        <p>{post.aiReason}</p>
                    </div>
                </div>
            )}

            {/* دکمه‌های عملیات */}
            <div className="request-actions">
                <button
                    onClick={() => handleAction("published")}
                    disabled={loading}
                    className="btn-glow"
                >
                    <i className="bi bi-check-lg"></i>
                    تأیید و انتشار
                </button>
                <button
                    onClick={() => handleAction("rejected")}
                    disabled={loading}
                    className="btn-glow-outline"
                >
                    <i className="bi bi-x-lg"></i>
                    رد کردن
                </button>
                <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="logout-btn"
                    style={{ width: "auto", padding: "12px 22px" }}
                >
                    <i className="bi bi-trash"></i>
                    حذف
                </button>
            </div>

            {/* دکمه مشاهده محتوا */}
            <button
                className="pending-toggle"
                onClick={() => setShowDetails(!showDetails)}
            >
                <i className={`bi ${showDetails ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
                {showDetails ? "بستن محتوا" : "مشاهده محتوا"}
            </button>

            {showDetails && (
                <div className="pending-content">
                    <pre>{post.content}</pre>
                </div>
            )}

            {/* لینک مشاهده */}
            <div style={{ marginTop: "12px" }}>
                <Link
                    href={`/posts/${post.id}`}
                    className="sidebar-link"
                    style={{ display: "inline-flex" }}
                >
                    <i className="bi bi-eye"></i>
                    مشاهده صفحه پست
                </Link>
            </div>
        </div>
    );
}