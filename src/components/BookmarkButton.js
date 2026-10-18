"use client";

import { useState, useEffect } from "react";

export default function BookmarkButton({ postId, currentUser }) {
    const [bookmarked, setBookmarked] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function loadStatus() {
            try {
                const res = await fetch(`/api/posts/${postId}/bookmark`);
                if (res.ok) {
                    const data = await res.json();
                    setBookmarked(data.bookmarked);
                }
            } catch (error) {
                console.error(error);
            }
        }
        loadStatus();
    }, [postId]);

    async function handleBookmark() {
        if (!currentUser) {
            alert("برای ذخیره کردن باید وارد شوی");
            return;
        }
        if (loading) return;
        setLoading(true);

        try {
            const res = await fetch(`/api/posts/${postId}/bookmark`, {
                method: "POST",
            });
            if (res.ok) {
                const data = await res.json();
                setBookmarked(data.bookmarked);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            className={`bookmark-btn ${bookmarked ? "active" : ""}`}
            onClick={handleBookmark}
            disabled={loading}
            title={bookmarked ? "حذف از ذخیره‌ها" : "ذخیره"}
        >
            <i className={`bi ${bookmarked ? "bi-bookmark-fill" : "bi-bookmark"}`}></i>
            <span>ذخیره</span>       
            </button>
    );
}