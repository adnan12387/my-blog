"use client";

import { useState } from "react";

export default function CategoryDeleteButton({ id }) {
    const [loading, setLoading] = useState(false);

    async function handleDelete() {
        if (!confirm("آیا مطمئنی که می‌خوای این دسته‌بندی رو حذف کنی؟")) {
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`/api/categories/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "خطا در حذف");
            }

            window.location.reload();
        } catch (err) {
            alert(err.message);
            setLoading(false);
        }
    }

    return (
        <button
            onClick={handleDelete}
            className="action-btn delete"
            title="حذف"
            disabled={loading}
        >
            <i className="bi bi-trash"></i>
        </button>
    );
}
