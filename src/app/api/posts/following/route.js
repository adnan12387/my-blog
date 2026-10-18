import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getUser";

export async function GET() {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json({ error: "لطفاً وارد شو" }, { status: 401 });
        }

        const following = await prisma.follow.findMany({
            where: { followerId: currentUser.id },
            select: { followingId: true },
        });

        const followingIds = following.map((f) => f.followingId);

        if (followingIds.length === 0) {
            return NextResponse.json([]);
        }

        const posts = await prisma.post.findMany({
            where: {
                authorId: { in: followingIds },
                status: "published",
            },
            orderBy: { createdAt: "desc" },
            include: {
                category: true,
            },
        });

        return NextResponse.json(posts);
    } catch (error) {
        console.error("خطا در GET following feed:", error);
        return NextResponse.json({ error: "خطا" }, { status: 500 });
    }
}