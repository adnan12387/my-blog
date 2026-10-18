"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BecomeAuthorForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [message, setMessage] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!message.trim() || message.trim().length < 20) {
            setError("متن درخواست باید حداقل ۲۰ کاراکتر باشه");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/author-request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "خطا در ارسال درخواست");
            }

            setSuccess("درخواستت با موفقیت ارسال شد!");
            setTimeout(() => {
                router.push("/profile");
                router.refresh();
            }, 1500);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="admin-form">
            {error && (
                <div className="form-error">
                    <i className="bi bi-exclamation-triangle"></i>
                    {error}
                </div>
            )}

            {success && (
                <div className="form-success">
                    <i className="bi bi-check-circle"></i>
                    {success}
                </div>
            )}

            <div className="form-info-box">
                <i className="bi bi-info-circle-fill"></i>
                <div>
                    <strong>چرا می‌خوای نویسنده بشی؟</strong>
                    <p>
                        یه توضیح کوتاه بنویس که چرا می‌خوای توی این وبلاگ مقاله بنویسی و
                        چه موضوعاتی رو می‌خوای پوشش بدی. ادمین درخواستت رو بررسی می‌کنه.
                    </p>
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">
                    متن درخواست <span className="required">*</span>
                </label>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="form-input form-textarea-sm"
                    placeholder="مثلاً: من برنامه‌نویس فرانت‌اندم و می‌خوام درباره React و Next.js مقاله بنویسم..."
                    rows={6}
                    maxLength={500}
                />
                <small className="form-hint">
                    {message.length} / 500 کاراکتر
                </small>
            </div>

            <div className="form-actions">
                <button type="submit" className="btn-glow" disabled={loading}>
                    {loading ? (
                        <>
                            <i className="bi bi-hourglass-split"></i>
                            در حال ارسال...
                        </>
                    ) : (
                        <>
                            <i className="bi bi-send"></i>
                            ارسال درخواست
                        </>
                    )}
                </button>

                <button
                    type="button"
                    className="btn-glow-outline"
                    onClick={() => router.push("/profile")}
                >
                    <i className="bi bi-x-lg"></i>
                    انصراف
                </button>
            </div>
        </form>
    );
}