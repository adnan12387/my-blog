import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getUser";

export async function GET() {
    try {
        const currentUser = await getCurrentUser();

        const categories = await prisma.category.findMany({
            orderBy: { name: "asc" },
        });

        const recentPosts = await prisma.post.findMany({
            orderBy: { createdAt: "desc" },
            take: 5,
            select: { id: true, title: true, tag: true },
        });

        return NextResponse.json({
            user: currentUser
                ? { name: currentUser.name, avatar: currentUser.avatar, role: currentUser.role }
                : null,
            categories,
            recentPosts,
        });
    } catch (error) {
        console.error("خطا در sidebar API:", error);
        return NextResponse.json({ error: "خطا" }, { status: 500 });
    }
}