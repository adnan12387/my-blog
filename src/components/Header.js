"use client";

import NotificationBell from "./NotificationBell";
import UserMenu from "./UserMenu";
import ThemeToggle from "./ThemeToggle";
import Link from "next/link";
import SearchBox from "./SearchBox";
import MobileSidebar from "./MobileSidebar";
import Sidebar from "./Sidebar";

export default function Header({ user }) {
    return (
        <nav className="glass-nav">
            <div className="container d-flex align-items-center justify-content-between py-3 gap-3">
                {/* لوگو */}
                <Link className="brand" href="/">
                    <span className="brand-icon">
                        <i className="bi bi-journal-text"></i>
                    </span>
                    <span>وبلاگ من</span>
                </Link>

                {/* منوی راست */}
                <div className="d-flex align-items-center gap-2">
                    <SearchBox />

                    <Link className="nav-link-custom" href="/">
                        خانه
                    </Link>

                    <Link className="nav-link-custom" href="/about">
                        درباره من
                    </Link>

                    {user ? (
                        <>
                            <UserMenu user={user} />
                            <NotificationBell />
                        </>
                    ) : (
                        <>
                            <Link className="nav-link-custom" href="/login">
                                ورود
                            </Link>
                            <Link
                                className="btn-glow"
                                href="/register"
                                style={{ padding: "8px 18px", fontSize: "0.85rem" }}
                            >
                                ثبت‌نام
                            </Link>
                        </>
                    )}

                    {/* دکمه تغییر تم */}
                    <ThemeToggle />

                    <MobileSidebar>
                        <Sidebar isMobile={true} />
                    </MobileSidebar>
                </div>
            </div>
        </nav>
    );
}