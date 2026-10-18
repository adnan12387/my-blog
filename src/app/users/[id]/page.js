import { notFound } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/getUser";
import { prisma } from "@/lib/prisma";
import FollowButton from "@/components/FollowButton";

export const dynamic = "force-dynamic";

export default async function UserProfilePage({ params }) {
    const currentUser = await getCurrentUser();
    const { id } = await params;

    const user = await prisma.user.findUnique({
        where: { id: Number(id) },
        include: {
            _count: {
                select: { posts: true },
            },
            posts: {
                where: { status: "published" },
                orderBy: { createdAt: "desc" },
                take: 6,
            },
        },
    });

    if (!user) {
        notFound();
    }

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

    const joinDate = new Date(user.createdAt).toLocaleDateString("fa-IR");

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="profile-card">
                        <div
                            className="profile-avatar"
                            style={{ background: roleColors[user.role] }}
                        >
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.name} />
                            ) : (
                                <i className="bi bi-person-fill"></i>
                            )}
                        </div>

                        <h1 className="profile-name">{user.name}</h1>

                        <span
                            className="profile-role"
                            style={{ background: roleColors[user.role] }}
                        >
                            {roleLabels[user.role]}
                        </span>

                        {user.bio && <p className="profile-bio">{user.bio}</p>}

                        <div className="profile-stats">
                            <div className="stat-box">
                                <div className="stat-box-number">{user._count.posts}</div>
                                <div className="stat-box-label">پست</div>
                            </div>
                            <div className="stat-box">
                                <div className="stat-box-number">{joinDate}</div>
                                <div className="stat-box-label">تاریخ عضویت</div>
                            </div>
                        </div>

                        {(user.github || user.twitter || user.linkedin || user.website) && (
                            <div className="profile-socials">
                                {user.github && (
                                    <a
                                        href={user.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="GitHub"
                                    >
                                        <i className="bi bi-github"></i>
                                    </a>
                                )}
                                {user.twitter && (
                                    <a
                                        href={user.twitter}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="Twitter"
                                    >
                                        <i className="bi bi-twitter-x"></i>
                                    </a>
                                )}
                                {user.linkedin && (
                                    <a
                                        href={user.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="LinkedIn"
                                    >
                                        <i className="bi bi-linkedin"></i>
                                    </a>
                                )}
                                {user.website && (
                                    <a
                                        href={user.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="وب‌سایت"
                                    >
                                        <i className="bi bi-globe"></i>
                                    </a>
                                )}
                            </div>
                        )}

                        {/* دکمه‌های ارتباط با کاربر */}
                        {currentUser && currentUser.id !== user.id && (
                            <>
                                <div className="profile-actions">
                                    <Link href={`/messages/${user.id}`} className="btn-glow">
                                        <i className="bi bi-chat-dots"></i>
                                        ارسال پیام
                                    </Link>
                                </div>
                                <FollowButton
                                    targetUserId={user.id}
                                    currentUser={currentUser}
                                />
                            </>
                        )}
                    </div>

                    {user.posts.length > 0 && (
                        <div className="mt-5">
                            <h2 className="admin-section-title">
                                آخرین پست‌های {user.name}
                            </h2>
                            <div className="row g-4">
                                {user.posts.map((post) => (
                                    <div key={post.id} className="col-md-6">
                                        <Link
                                            href={`/posts/${post.id}`}
                                            className="user-post-card"
                                        >
                                            <i className={`bi ${post.tag}`}></i>
                                            <div>
                                                <div className="user-post-title">{post.title}</div>
                                                <div className="user-post-date">{post.date}</div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}