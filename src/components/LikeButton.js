"use client";

import { useState, useEffect } from "react";

export default function LikeButton({ postId, initialCount = 0, currentUser }) {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(initialCount);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function loadStatus() {
            try {
                const res = await fetch(`/api/posts/${postId}/like/status`);
                if (res.ok) {
                    const data = await res.json();
                    setLiked(data.liked);
                    setLikeCount(data.likeCount);
                }
            } catch (error) {
                console.error(error);
            }
        }
        loadStatus();
    }, [postId]);

    async function handleLike() {
        if (!currentUser) {
            alert("برای لایک کردن باید وارد شوی");
            return;
        }
        if (loading) return;

        const wasLiked = liked;
        setLiked(!wasLiked);
        setLikeCount((prev) => (wasLiked ? prev - 1 : prev + 1));
        setLoading(true);

        try {
            const res = await fetch(`/api/posts/${postId}/like`, {
                method: "POST",
            });
            if (res.ok) {
                const data = await res.json();
                setLiked(data.liked);
                setLikeCount(data.likeCount);
            } else {
                setLiked(wasLiked);
                setLikeCount((prev) => (wasLiked ? prev + 1 : prev - 1));
            }
        } catch (error) {
            console.error(error);
            setLiked(wasLiked);
            setLikeCount((prev) => (wasLiked ? prev + 1 : prev - 1));
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            className={`like-btn ${liked ? "liked" : ""} ${loading ? "loading" : ""}`}
            onClick={handleLike}
            disabled={loading}
            title={liked ? "آنلایک" : "لایک"}
        >
            <i className={`bi ${liked ? "bi-heart-fill" : "bi-heart"}`}></i>
            <span>{likeCount}</span>
        </button>
    );
}