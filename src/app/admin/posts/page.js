import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteButton from "./DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminPostsList() {
    const posts = await prisma.post.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            category: true,
        },
    });

    return (
        <div>
            <div className="admin-header">
                <div>
                    <h1 className="admin-title">مدیریت پست‌ها</h1>
                    <p className="admin-subtitle">همه پست‌های وبلاگ رو از اینجا مدیریت کن</p>
                </div>
                <Link href="/admin/posts/create" className="btn-glow">
                    <i className="bi bi-plus-lg"></i>
                    پست جدید
                </Link>
            </div>

            {posts.length === 0 ? (
                <div className="admin-empty">
                    <i className="bi bi-inbox"></i>
                    <h3>هنوز پستی نداری</h3>
                    <p>اولین پستت رو بساز!</p>
                    <Link href="/admin/posts/create" className="btn-glow">
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
                                <th>نویسنده</th>
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
                                            <Link href={`/category/${post.category.slug}`} className="category-badge" style={{ color: post.category.color }}>
                                                <i className={`bi ${post.category.icon}`}></i>
                                                {post.category.name}
                                            </Link>
                                        ) : (
                                            <span style={{ color: "var(--text-muted)" }}>-</span>
                                        )}
                                    </td>
                                    <td>{post.author}</td>
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
                                                href={`/admin/posts/${post.id}/edit`}
                                                className="action-btn edit"
                                                title="ویرایش"
                                            >
                                                <i className="bi bi-pencil"></i>
                                            </Link>
                                            <DeleteButton id={post.id} />
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