"use client";

import { useState, useEffect } from "react";

export default function MobileSidebar({ children }) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    useEffect(() => {
        function handleEsc(e) {
            if (e.key === "Escape") setIsOpen(false);
        }
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, []);

    return (
        <>
            <button
                className="mobile-menu-btn"
                onClick={() => setIsOpen(true)}
                aria-label="باز کردن منو"
            >
                <i className="bi bi-three-dots-vertical"></i>
            </button>

            {isOpen && (
                <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />
            )}

            <div className={`mobile-sidebar-drawer ${isOpen ? "open" : ""}`}>
                <button className="sidebar-close-btn" onClick={() => setIsOpen(false)}>
                    <i className="bi bi-x-lg"></i>
                </button>
                {children}
            </div>
        </>
    );
}