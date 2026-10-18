"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RequestCard({ request }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [adminNote, setAdminNote] = useState(request.adminNote || "");
    const [showNote, setShowNote] = useState(false);

    const statusLabels = {
        pending: "در انتظار",
        approved: "تأیید شده",
        rejected: "رد شده",
    };

    const statusColors = {
        pending: "linear-gradient(135deg, #f857a6, #ff5858)",
        approved: "linear-gradient(135deg, #00c9ff, #92fe9d)",
        rejected: "linear-gradient(135deg, #7c5cff, #ff5c9d)",
    };

    async function handleAction(status) {
        if (status === "rejected" && !adminNote.trim()) {
            setShowNote(true);
            alert("برای رد کردن، لطفاً دلیل رو بنویس");
            return;
        }

        if (!confirm(`مطمئنی می‌خوای این درخواست رو ${status === "approved" ? "تأیید" : "رد"} کنی؟`)) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/admin/requests/${request.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status, adminNote }),
            });

            if (res.ok) {
                router.refresh();
            } else {
                alert("خطا در انجام عملیات");
            }
        } catch (error) {
            alert("خطا در انجام عملیات");
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete() {
        if (!confirm("مطمئنی می‌خوای این درخواست رو حذف کنی؟")) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/admin/requests/${request.id}`, {
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

    const createdAt = new Date(request.createdAt).toLocaleDateString("fa-IR");

    return (
        <div className="request-card">
            <div className="request-header">
                <div className="request-user">
                    <div
                        className="request-avatar"
                        style={{ background: statusColors[request.status] }}
                    >
                        {request.user.avatar ? (
                            <img src={request.user.avatar} alt={request.user.name} />
                        ) : (
                            <i className="bi bi-person-fill"></i>
                        )}
                    </div>
                    <div>
                        <div className="request-user-name">{request.user.name}</div>
                        <div className="request-user-email">{request.user.email}</div>
                    </div>
                </div>

                <span
                    className="request-status"
                    style={{ background: statusColors[request.status] }}
                >
                    {statusLabels[request.status]}
                </span>
            </div>

            <div className="request-message">
                <i className="bi bi-chat-left-quote"></i>
                <p>{request.message}</p>
            </div>

            <div className="request-meta">
                <span>
                    <i className="bi bi-calendar me-1"></i>
                    {createdAt}
                </span>
            </div>

            {/* نمایش دلیل رد */}
            {request.status === "rejected" && request.adminNote && (
                <div className="request-admin-note">
                    <i className="bi bi-info-circle"></i>
                    <div>
                        <strong>دلیل رد:</strong>
                        <p>{request.adminNote}</p>
                    </div>
                </div>
            )}

            {/* فرم دلیل رد */}
            {showNote && (
                <div className="form-group" style={{ marginTop: "16px" }}>
                    <label className="form-label">دلیل رد درخواست</label>
                    <textarea
                        value={adminNote}
                        onChange={(e) => setAdminNote(e.target.value)}
                        className="form-input form-textarea-sm"
                        placeholder="مثلاً: نمونه کار کافی نداری..."
                        rows={3}
                    />
                </div>
            )}

            {/* دکمه‌های عملیات */}
            {request.status === "pending" && (
                <div className="request-actions">
                    <button
                        onClick={() => handleAction("approved")}
                        disabled={loading}
                        className="btn-glow"
                    >
                        <i className="bi bi-check-lg"></i>
                        تأیید
                    </button>
                    <button
                        onClick={() => handleAction("rejected")}
                        disabled={loading}
                        className="btn-glow-outline"
                    >
                        <i className="bi bi-x-lg"></i>
                        رد
                    </button>
                </div>
            )}

            {/* دکمه حذف برای همه */}
            <div style={{ marginTop: "12px" }}>
                <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="logout-btn"
                    style={{ width: "auto", padding: "8px 16px", fontSize: "0.8rem" }}
                >
                    <i className="bi bi-trash"></i>
                    حذف درخواست
                </button>
            </div>
        </div>
    );
}