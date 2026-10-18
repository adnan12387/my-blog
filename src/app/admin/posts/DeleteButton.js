"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteButton({ id }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleDelete() {
        if (!confirm("مطمئنی می‌خوای این پست رو حذف کنی؟")) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/posts/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                router.refresh();
            } else {
                alert("خطا در حذف پست");
            }
        } catch (error) {
            alert("خطا در حذف پست");
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="action-btn delete"
            title="حذف"
        >
            {loading ? (
                <i className="bi bi-hourglass-split"></i>
            ) : (
                <i className="bi bi-trash"></i>
            )}
        </button>
    );
}