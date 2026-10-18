import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            name: true,
            avatar: true,
            bio: true,
            role: true,
            _count: {
                select: { posts: true },
            },
        },
    });

    const roleLabels = {
        admin: "مدیر",
        author: "نویسنده",
        user: "کاربر",
    };

    const roleColors = {
        admin: "linear-gradient(135deg, #7c5cff, #ff5c9d)",
        author: "linear-gradient(135deg, #00c9ff, #92fe9d)",
        user: "linear-gradient(135deg, #f857a6, #ff5858)",
    };

    return (
        <div className="container py-5">
            <div className="admin-header">
                <div>
                    <h1 className="admin-title">کاربران</h1>
                    <p className="admin-subtitle">
                        {users.length} کاربر توی این وبلاگ عضو شدن
                    </p>
                </div>
            </div>

            <div className="users-grid">
                {users.map((user) => (
                    <Link
                        key={user.id}
                        href={`/users/${user.id}`}
                        className="user-card"
                    >
                        <div
                            className="user-card-avatar"
                            style={{ background: roleColors[user.role] }}
                        >
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.name} />
                            ) : (
                                <i className="bi bi-person-fill"></i>
                            )}
                        </div>
                        <div className="user-card-info">
                            <div className="user-card-name">
                                {user.name}
                                <span
                                    className="user-card-role"
                                    style={{ background: roleColors[user.role] }}
                                >
                                    {roleLabels[user.role]}
                                </span>
                            </div>
                            {user.bio && <div className="user-card-bio">{user.bio}</div>}
                            <div className="user-card-stats">
                                <i className="bi bi-file-text"></i>
                                {user._count.posts} پست
                            </div>
                        </div>
                        <i className="bi bi-chevron-left user-card-arrow"></i>
                    </Link>
                ))}
            </div>
        </div>
    );
}