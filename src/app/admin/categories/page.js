import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CategoryDeleteButton from "./CategoryDeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesList() {
    const categories = await prisma.category.findMany({
        orderBy: { name: "asc" },
        include: {
            _count: {
                select: { posts: true },
            },
        },
    });

    return (
        <div>
            <div className="admin-header">
                <div>
                    <h1 className="admin-title">مدیریت دسته‌بندی‌ها</h1>
                    <p className="admin-subtitle">دسته‌بندی‌های وبلاگ رو از اینجا مدیریت کن</p>
                </div>
                <Link href="/admin/categories/create" className="btn-glow">
                    <i className="bi bi-plus-lg"></i>
                    دسته‌بندی جدید
                </Link>
            </div>

            {categories.length === 0 ? (
                <div className="admin-empty">
                    <i className="bi bi-folder-x"></i>
                    <h3>هنوز دسته‌بندی نداری</h3>
                    <p>اولین دسته‌بندی رو بساز!</p>
                    <Link href="/admin/categories/create" className="btn-glow">
                        <i className="bi bi-plus-lg"></i>
                        ساخت دسته‌بندی جدید
                    </Link>
                </div>
            ) : (
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>نام</th>
                                <th>Slug</th>
                                <th>آیکون</th>
                                <th>رنگ</th>
                                <th>تعداد پست</th>
                                <th>عملیات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category, index) => (
                                <tr key={category.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <div className="category-name-cell">
                                            <i
                                                className={`bi ${category.icon}`}
                                                style={{ color: category.color }}
                                            ></i>
                                            <span>{category.name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <code className="slug-code">{category.slug}</code>
                                    </td>
                                    <td>
                                        <i className={`bi ${category.icon}`}></i>
                                    </td>
                                    <td>
                                        <div
                                            className="color-preview"
                                            style={{ background: category.color }}
                                        ></div>
                                    </td>
                                    <td>{category._count.posts}</td>
                                    <td>
                                        <div className="admin-actions">
                                            <Link
                                                href={`/category/${category.slug}`}
                                                className="action-btn view"
                                                title="مشاهده"
                                            >
                                                <i className="bi bi-eye"></i>
                                            </Link>
                                            <Link
                                                href={`/admin/categories/${category.id}/edit`}
                                                className="action-btn edit"
                                                title="ویرایش"
                                            >
                                                <i className="bi bi-pencil"></i>
                                            </Link>
                                            <CategoryDeleteButton id={category.id} />
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
