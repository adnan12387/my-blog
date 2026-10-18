"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

export default function CommentsSection({ postId, currentUser }) {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    async function loadComments() {
        try {
            const res = await fetch(`/api/comments?postId=${postId}`);
            if (res.ok) {
                const data = await res.json();
                setComments(data);
            }
        } catch (error) {
            console.error("خطا در خواندن کامنت‌ها:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadComments();
    }, [postId]);

    async function handleDelete(id) {
        if (!confirm("مطمئنی می‌خوای این کامنت رو حذف کنی؟")) return;

        try {
            const res = await fetch(`/api/comments/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setComments((prev) => prev.filter((c) => c.id !== id));
            } else {
                alert("خطا در حذف کامنت");
            }
        } catch (error) {
            alert("خطا در حذف کامنت");
        }
    }

    return (
        <div className="comments-section">
            <h2 className="comments-title">
                <i className="bi bi-chat-left-text"></i>
                نظرات ({comments.length})
            </h2>

            {/* فرم ارسال کامنت */}
            {currentUser ? (
                <CommentForm postId={postId} onSuccess={loadComments} />
            ) : (
                <div className="comments-login-prompt">
                    <i className="bi bi-info-circle"></i>
                    <p>
                        برای ارسال نظر باید{" "}
                        <Link href="/login">وارد</Link> شوی یا{" "}
                        <Link href="/register">ثبت‌نام</Link> کنی.
                    </p>
                </div>
            )}

            {/* لیست کامنت‌ها */}
            {loading ? (
                <div className="comments-loading">
                    <i className="bi bi-hourglass-split"></i>
                    در حال بارگذاری...
                </div>
            ) : comments.length === 0 ? (
                <div className="comments-empty">
                    <i className="bi bi-chat-dots"></i>
                    <p>هنوز نظری ثبت نشده. اولین نفر باش!</p>
                </div>
            ) : (
                <div className="comments-list">
                    {comments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            currentUser={currentUser}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}