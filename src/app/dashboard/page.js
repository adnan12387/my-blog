import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/getUser";
import { prisma } from "@/lib/prisma";
import AuthorDeleteButton from "@/components/AuthorDeleteButton";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        redirect("/login");
    }

    // همه کاربرای لاگین‌کرده می‌تونن بیان داشبورد و پست بسازن
    // (فقط اگه نقش خاصی نداشتن، یعنی کاربر عادی هم می‌تونه)

    const posts = await prisma.post.findMany({
        where: { authorId: currentUser.id },
        orderBy: { createdAt: "desc" },
        include: {
            category: true,
        },
    });

    return (
        <div className="container py-5">
            <div className="admin-header">
                <div>
                    <h1 className="admin-title">پنل نویسندگی</h1>
                    <p className="admin-subtitle">
                        خوش اومدی {currentUser.name}! اینجا پست‌های خودت رو مدیریت کن
                    </p>
                </div>
                <Link href="/dashboard/posts/create" className="btn-glow">
                    <i className="bi bi-plus-lg"></i>
                    پست جدید
                </Link>
            </div>

            <div className="row g-4 mb-5">
                <div className="col-md-4">
                    <div className="stat-card">
                        <div
                            className="stat-icon"
                            style={{ background: "linear-gradient(135deg, #7c5cff, #ff5c9d)" }}
                        >
                            <i className="bi bi-file-text"></i>
                        </div>
                        <div>
                            <div className="stat-number">{posts.length}</div>
                            <div className="stat-label">پست‌های من</div>
                        </div>
                    </div>
                </div>
            </div>

            {posts.length === 0 ? (
                <div className="admin-empty">
                    <i className="bi bi-inbox"></i>
                    <h3>هنوز پستی نساختی</h3>
                    <p>اولین پستت رو بنویس!</p>
                    <Link href="/dashboard/posts/create" className="btn-glow">
                        <i className="bi bi-plus-lg"></i>
                        ساخت پست جدید
                    </Link>
                </div>
            ) : (
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>عنوان</th>
                                <th>دسته‌بندی</th>
                                <th>تاریخ</th>
                                <th>عملیات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((post, index) => (
                                <tr key={post.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <div className="post-title-cell">
                                            <i className={`bi ${post.tag}`}></i>
                                            <span>{post.title}</span>
                                        </div>
                                    </td>
                                    <td>
                                        {post.category ? (
                                            <Link
                                                href={`/category/${post.category.slug}`}
                                                className="category-badge"
                                                style={{ color: post.category.color }}
                                            >
                                                <i className={`bi ${post.category.icon}`}></i>
                                                {post.category.name}
                                            </Link>
                                        ) : (
                                            <span style={{ color: "var(--text-muted)" }}>-</span>
                                        )}
                                    </td>
                                    <td>{post.date}</td>
                                    <td>
                                        <div className="admin-actions">
                                            <Link
                                                href={`/posts/${post.id}`}
                                                className="action-btn view"
                                                title="مشاهده"
                                            >
                                                <i className="bi bi-eye"></i>
                                            </Link>
                                            <Link
                                                href={`/dashboard/posts/${post.id}/edit`}
                                                className="action-btn edit"
                                                title="ویرایش"
                                            >
                                                <i className="bi bi-pencil"></i>
                                            </Link>
                                            <AuthorDeleteButton id={post.id} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}