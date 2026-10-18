import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getUser";
import { createNotification } from "@/lib/notifications";

// GET: وضعیت لایک (برای وقتی که مستقیماً این مسیر صدا زده بشه)
export async function GET(request, { params }) {
    try {
        const currentUser = await getCurrentUser();
        const { id } = await params;
        const postId = Number(id);

        if (!currentUser) {
            const count = await prisma.like.count({ where: { postId } });
            return NextResponse.json({ liked: false, likeCount: count });
        }

        const [like, likeCount] = await Promise.all([
            prisma.like.findUnique({
                where: {
                    userId_postId: { userId: currentUser.id, postId },
                },
            }),
            prisma.like.count({ where: { postId } }),
        ]);

        return NextResponse.json({ liked: !!like, likeCount });
    } catch (error) {
        console.error("خطا در GET like:", error);
        return NextResponse.json({ error: "خطا" }, { status: 500 });
    }
}

