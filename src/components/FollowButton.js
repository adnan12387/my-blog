"use client";

import { useState, useEffect } from "react";

export default function FollowButton({ targetUserId, currentUser }) {
    const [isFollowing, setIsFollowing] = useState(false);
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        async function loadStatus() {
            try {
                const res = await fetch(`/api/users/${targetUserId}/follow/status`);
                if (res.ok) {
                    const data = await res.json();
                    setIsFollowing(data.isFollowing);
                    setFollowersCount(data.followersCount);
                    setFollowingCount(data.followingCount);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setInitialLoading(false);
            }
        }
        loadStatus();
    }, [targetUserId]);

    async function handleFollow() {
        if (!currentUser) {
            alert("برای دنبال کردن باید وارد شوی");
            return;
        }
        if (loading) return;

        const wasFollowing = isFollowing;
        setIsFollowing(!wasFollowing);
        setFollowersCount((prev) => (wasFollowing ? prev - 1 : prev + 1));
        setLoading(true);

        try {
            const res = await fetch(`/api/users/${targetUserId}/follow`, {
                method: "POST",
            });
            if (res.ok) {
                const data = await res.json();
                setIsFollowing(data.isFollowing);
            } else {
                setIsFollowing(wasFollowing);
                setFollowersCount((prev) => (wasFollowing ? prev + 1 : prev - 1));
            }
        } catch (error) {
            console.error(error);
            setIsFollowing(wasFollowing);
            setFollowersCount((prev) => (wasFollowing ? prev + 1 : prev - 1));
        } finally {
            setLoading(false);
        }
    }

    if (initialLoading) return null;
    if (currentUser && currentUser.id === targetUserId) return null; // خودش رو دنبال نکنه

    return (
        <div className="follow-section">
            <div className="follow-stats">
                <div className="follow-stat-item">
                    <span className="follow-stat-number">{followersCount}</span>
                    <span className="follow-stat-label">دنبال‌کننده</span>
                </div>
                <div className="follow-stat-item">
                    <span className="follow-stat-number">{followingCount}</span>
                    <span className="follow-stat-label">دنبال‌شده</span>
                </div>
            </div>

            <button
                onClick={handleFollow}
                disabled={loading}
                className={`follow-btn ${isFollowing ? "following" : ""}`}
            >
                {isFollowing ? (
                    <>
                        <i className="bi bi-check-lg"></i>
                        دنبال می‌کنید
                    </>
                ) : (
                    <>
                        <i className="bi bi-person-plus"></i>
                        دنبال کردن
                    </>
                )}
            </button>
        </div>
    );
}