import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/getUser";
import LogoutButton from "@/components/LogoutButton";

export const metadata = {
    title: "پنل ادمین",
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }) {
    const user = await getCurrentUser();

    // اگه کاربر لاگین نکرده
    if (!user) {
        redirect("/login");
    }

    // اگه کاربر ادمین نیست
    if (user.role !== "admin") {
        return (
            <div className="container py-5">
                <div className="auth-wrapper">
                    <div className="auth-card">
                        <div className="auth-header">
                            <div
                                className="auth-icon"
                                style={{ background: "linear-gradient(135deg, #ff5c5c, #ff5c9d)" }}
                            >
                                <i className="bi bi-shield-x"></i>
                            </div>
                            <h1 className="auth-title">دسترسی نداری</h1>
                            <p className="auth-subtitle">
                                این صفحه مخصوص ادمینه. اگه فکر می‌کنی اشتباهه، با مدیر سایت تماس بگیر.
                            </p>
                        </div>
                        <a
                            href="/"
                            className="btn-glow"
                            style={{ width: "100%", justifyContent: "center" }}
                        >
                            <i className="bi bi-house"></i>
                            بازگشت به خانه
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-wrapper">
            <aside className="admin-sidebar">
                <div className="admin-brand">
                    <i className="bi bi-shield-lock-fill"></i>
                    <span>پنل ادمین</span>
                </div>

                <nav className="admin-nav">
                    <a href="/admin" className="admin-nav-link">
                        <i className="bi bi-speedometer2"></i>
                        داشبورد
                    </a>
                    <a href="/admin/posts" className="admin-nav-link">
                        <i className="bi bi-file-text"></i>
                        پست‌ها
                    </a>
                    <a href="/admin/pending-posts" className="admin-nav-link">
                        <i className="bi bi-hourglass-split"></i>
                        در انتظار بررسی
                    </a>
                    <a href="/admin/categories" className="admin-nav-link">
                        <i className="bi bi-folder"></i>
                        دسته‌بندی‌ها
                    </a>
                    <a href="/admin/requests" className="admin-nav-link">
                        <i className="bi bi-envelope-paper"></i>
                        درخواست‌ها
                    </a>
                    <a href="/" className="admin-nav-link">
                        <i className="bi bi-house"></i>
                        مشاهده سایت
                    </a>
                </nav>

                <div className="admin-user-info">
                    <div className="admin-user-name">
                        <i className="bi bi-person-circle"></i>
                        {user.name}
                    </div>
                    <LogoutButton />
                </div>
            </aside>

            <main className="admin-main">{children}</main>
        </div>
    );
}