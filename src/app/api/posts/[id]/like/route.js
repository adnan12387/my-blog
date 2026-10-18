import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getUser";
import { createNotification } from "@/lib/notifications";

export async function POST(request, { params }) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json({ error: "لطفاً وارد شو" }, { status: 401 });
        }

        const { id } = await params;
        const postId = Number(id);

        const post = await prisma.post.findUnique({ where: { id: postId } });
        if (!post) {
            return NextResponse.json({ error: "پست پیدا نشد" }, { status: 404 });
        }

        const existingLike = await prisma.like.findUnique({
            where: {
                userId_postId: { userId: currentUser.id, postId },
            },
        });

        if (existingLike) {
            await prisma.like.delete({ where: { id: existingLike.id } });
            const likeCount = await prisma.like.count({ where: { postId } });
            return NextResponse.json({ liked: false, likeCount });
        } else {
            await prisma.like.create({
                data: { userId: currentUser.id, postId },
            });

            if (post.authorId && post.authorId !== currentUser.id) {
                await createNotification({
                    userId: post.authorId,
                    type: "like",
                    title: "لایک جدید ❤️",
                    message: `${currentUser.name} پست «${post.title}» رو لایک کرد`,
                    link: `/posts/${post.id}`,
                });
            }

            const likeCount = await prisma.like.count({ where: { postId } });
            return NextResponse.json({ liked: true, likeCount });
        }
    } catch (error) {
        console.error("خطا در POST like:", error);
        return NextResponse.json({ error: "خطا" }, { status: 500 });
    }
}