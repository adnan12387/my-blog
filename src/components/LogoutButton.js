"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleLogout() {
        setLoading(true);
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/");
            router.refresh();
        } catch (error) {
            alert("خطا در خروج");
            setLoading(false);
        }
    }

    return (
        <button
            onClick={handleLogout}
            disabled={loading}
            className="logout-btn"
        >
            {loading ? (
                <i className="bi bi-hourglass-split"></i>
            ) : (
                <i className="bi bi-box-arrow-right"></i>
            )}
            خروج
        </button>
    );
}