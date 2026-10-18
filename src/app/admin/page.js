import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
    const posts = await prisma.post.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div>
            <div className="admin-header">
                <div>
                    <h1 className="admin-title">داشبورد</h1>
                    <p className="admin-subtitle">خوش اومدی به پنل مدیریت وبلاگ</p>
                </div>
                <Link href="/admin/posts/create" className="btn-glow">                    
                <i className="bi bi-plus-lg"></i>
                    پست جدید
                </Link>
            </div>

            <div className="row g-4 mb-5">
                <div className="col-md-4">
                    <div className="stat-card">
                        <div
                            className="stat-icon"
                            style={{
                                background: "linear-gradient(135deg, #7c5cff, #ff5c9d)",
                            }}
                        >
                            <i className="bi bi-file-text"></i>
                        </div>
                        <div>
                            <div className="stat-number">{posts.length}</div>
                            <div className="stat-label">کل پست‌ها</div>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="stat-card">
                        <div
                            className="stat-icon"
                            style={{
                                background: "linear-gradient(135deg, #00c9ff, #92fe9d)",
                            }}
                        >
                            <i className="bi bi-calendar-check"></i>
                        </div>
                        <div>
                            <div className="stat-number">۱</div>
                            <div className="stat-label">پست امروز</div>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="stat-card">
                        <div
                            className="stat-icon"
                            style={{
                                background: "linear-gradient(135deg, #f857a6, #ff5858)",
                            }}
                        >
                            <i className="bi bi-person"></i>
                        </div>
                        <div>
                            <div className="stat-number">۱</div>
                            <div className="stat-label">نویسنده</div>
                        </div>
                    </div>
                </div>
            </div>

            <h2 className="admin-section-title">آخرین پست‌ها</h2>
            <Link href="/admin/posts" className="btn-glow-outline">
                مشاهده همه پست‌ها
                <i className="bi bi-arrow-left"></i>
            </Link>
        </div>
    );
}
