import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/getUser";
import { prisma } from "@/lib/prisma";
import PostCard from "@/components/PostCard";

export const dynamic = "force-dynamic";

export default async function FeedPage() {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        redirect("/login");
    }

    const following = await prisma.follow.findMany({
        where: { followerId: currentUser.id },
        select: { followingId: true },
    });

    const followingIds = following.map((f) => f.followingId);

    let posts = [];
    if (followingIds.length > 0) {
        posts = await prisma.post.findMany({
            where: {
                authorId: { in: followingIds },
                status: "published",
            },
            orderBy: { createdAt: "desc" },
            include: {
                category: true,
            },
        });
    }

    return (
        <div className="container py-5">
            <div className="admin-header">
                <div>
                    <h1 className="admin-title">فید دنبال‌شده‌ها</h1>
                    <p className="admin-subtitle">آخرین پست‌های کسانی که دنبال می‌کنی</p>
                </div>
            </div>

            {posts.length === 0 ? (
                <div className="admin-empty">
                    <i className="bi bi-people"></i>
                    <h3>هنوز پستی توی فیدت نیست</h3>
                    <p>یا کسی رو دنبال نکردی، یا کسانی که دنبال می‌کنی پستی نذاشتن.</p>
                    <Link href="/users" className="btn-glow">
                        <i className="bi bi-people"></i>
                        پیدا کردن کاربرا
                    </Link>
                </div>
            ) : (
                <div className="row g-4">
                    {posts.map((post, index) => (
                        <div key={post.id} className="col-md-6 col-lg-4">
                            <PostCard
                                id={post.id}
                                title={post.title}
                                excerpt={post.excerpt}
                                author={post.author}
                                date={post.date}
                                tag={post.tag}
                                index={index}
                                category={post.category}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}