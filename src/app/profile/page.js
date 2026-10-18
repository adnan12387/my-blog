import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/getUser";
import { prisma } from "@/lib/prisma";
import LogoutButton from "@/components/LogoutButton";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { id: currentUser.id },
        include: {
            _count: {
                select: { posts: true },
            },
        },
    });

    if (!user) {
        redirect("/login");
    }

    const roleLabels = {
        admin: "مدیر",
        author: "نویسنده",
        user: "کاربر عادی",
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
                    {/* کارت اصلی پروفایل */}
                    <div className="profile-card">
                        <div
                            className="profile-avatar"
                            style={{ background: roleColors[user.role] || roleColors.user }}
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
                            style={{ background: roleColors[user.role] || roleColors.user }}
                        >
                            {roleLabels[user.role] || user.role}
                        </span>

                        {user.bio && <p className="profile-bio">{user.bio}</p>}

                        {/* آمار */}
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

                        {/* اطلاعات تماس */}
                        <div className="profile-info">
                            <div className="profile-info-item">
                                <i className="bi bi-envelope"></i>
                                <span>{user.email}</span>
                            </div>
                        </div>

                        {/* شبکه‌های اجتماعی */}
                        {(user.github || user.twitter || user.linkedin || user.website) && (
                            <div className="profile-socials">
                                {user.github && (
                                    <a href={user.github} target="_blank" rel="noopener noreferrer" title="GitHub">
                                        <i className="bi bi-github"></i>
                                    </a>
                                )}
                                {user.twitter && (
                                    <a href={user.twitter} target="_blank" rel="noopener noreferrer" title="Twitter">
                                        <i className="bi bi-twitter-x"></i>
                                    </a>
                                )}
                                {user.linkedin && (
                                    <a href={user.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn">
                                        <i className="bi bi-linkedin"></i>
                                    </a>
                                )}
                                {user.website && (
                                    <a href={user.website} target="_blank" rel="noopener noreferrer" title="وب‌سایت">
                                        <i className="bi bi-globe"></i>
                                    </a>
                                )}
                            </div>
                        )}

                        {/* دکمه‌ها */}
                        <div className="profile-actions">
                            <a href="/profile/edit" className="btn-glow">
                                <i className="bi bi-pencil"></i>
                                ویرایش پروفایل
                            </a>

                            {user.role === "user" && (
                                <a href="/become-author" className="btn-glow-outline">
                                    <i className="bi bi-pencil-square"></i>
                                    درخواست نویسندگی
                                </a>
                            )}

                            {user.role === "author" && (
                                <a href="/dashboard" className="btn-glow-outline">
                                    <i className="bi bi-pencil-square"></i>
                                    پنل نویسندگی
                                </a>
                            )}

                            {user.role === "admin" && (
                                <a href="/admin" className="btn-glow-outline">
                                    <i className="bi bi-shield-lock"></i>
                                    پنل ادمین
                                </a>
                            )}
                        </div>

                        <div className="profile-logout">
                            <LogoutButton />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}