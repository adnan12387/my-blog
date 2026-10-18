import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getUser";

export async function GET(request, { params }) {
    try {
        const currentUser = await getCurrentUser();
        const { id } = await params;
        const targetUserId = Number(id);

        // ۳ تا کوئری رو با هم می‌زنیم که سریع‌تر باشه
        const [isFollowing, followersCount, followingCount] = await Promise.all([
            currentUser
                ? prisma.follow.findUnique({
                    where: {
                        followerId_followingId: {
                            followerId: currentUser.id,
                            followingId: targetUserId,
                        },
                    },
                })
                : null,
            prisma.follow.count({ where: { followingId: targetUserId } }),
            prisma.follow.count({ where: { followerId: targetUserId } }),
        ]);

        return NextResponse.json({
            isFollowing: !!isFollowing,
            followersCount,
            followingCount,
        });
    } catch (error) {
        console.error("خطا در GET follow status:", error);
        return NextResponse.json({ error: "خطا" }, { status: 500 });
    }
}