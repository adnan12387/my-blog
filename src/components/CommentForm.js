"use client";

import { useState } from "react";

export default function CommentForm({ postId, onSuccess }) {
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (!content.trim()) {
            setError("متن کامنت اجباریه");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content, postId }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "خطا در ارسال کامنت");
            }

            setContent("");
            if (onSuccess) onSuccess();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="comment-form">
            {error && (
                <div className="form-error">
                    <i className="bi bi-exclamation-triangle"></i>
                    {error}
                </div>
            )}

            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="form-input form-textarea-sm"
                placeholder="نظرت رو بنویس..."
                rows={3}
                maxLength={500}
            />

            <div className="comment-form-footer">
                <small className="form-hint">{content.length} / 500</small>
                <button
                    type="submit"
                    className="btn-glow"
                    disabled={loading}
                    style={{ padding: "8px 20px", fontSize: "0.85rem" }}
                >
                    {loading ? (
                        <>
                            <i className="bi bi-hourglass-split"></i>
                            در حال ارسال...
                        </>
                    ) : (
                        <>
                            <i className="bi bi-send"></i>
                            ارسال نظر
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}