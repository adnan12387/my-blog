import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PendingPostCard from "@/components/PendingPostCard";

export const dynamic = "force-dynamic";

export default async function PendingPostsPage() {
    const pendingPosts = await prisma.post.findMany({
        where: { status: "pending" },
        orderBy: { createdAt: "desc" },
        include: {
            category: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    avatar: true,
                },
            },
        },
    });

    return (
        <div>
            <div className="admin-header">
                <div>
                    <h1 className="admin-title">پست‌های در انتظار بررسی</h1>
                    <p className="admin-subtitle">
                        پست‌هایی که AI تأیید نکرده یا امتیاز پایین گرفتن
                    </p>
                </div>
            </div>

            {pendingPosts.length === 0 ? (
                <div className="admin-empty">
                    <i className="bi bi-check-circle"></i>
                    <h3>هیچ پستی در انتظار نیست</h3>
                    <p>همه پست‌ها بررسی شدن!</p>
                </div>
            ) : (
                <div className="requests-list">
                    {pendingPosts.map((post) => (
                        <PendingPostCard key={post.id} post={post} />
                    ))}
                </div>
            )}
        </div>
    );
}