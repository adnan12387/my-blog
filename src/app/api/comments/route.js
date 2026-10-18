import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getUser";

// GET: گرفتن کامنت‌های یه پست
// ?postId=1
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const postId = searchParams.get("postId");

        if (!postId) {
            return NextResponse.json(
                { error: "شناسه پست اجباریه" },
                { status: 400 }
            );
        }

        const comments = await prisma.comment.findMany({
            where: { postId: Number(postId) },
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                        role: true,
                    },
                },
            },
        });

        return NextResponse.json(comments);
    } catch (error) {
        console.error("خطا در خواندن کامنت‌ها:", error);
        return NextResponse.json(
            { error: "خطا در خواندن کامنت‌ها" },
            { status: 500 }
        );
    }
}

// POST: ارسال کامنت جدید
export async function POST(request) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json(
                { error: "برای ارسال کامنت باید وارد شوی" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { content, postId } = body;

        if (!content || !content.trim()) {
            return NextResponse.json(
                { error: "متن کامنت اجباریه" },
                { status: 400 }
            );
        }

        if (!postId) {
            return NextResponse.json(
                { error: "شناسه پست اجباریه" },
                { status: 400 }
            );
        }

        // چک کن پست وجود داره
        const post = await prisma.post.findUnique({
            where: { id: Number(postId) },
        });

        if (!post) {
            return NextResponse.json(
                { error: "پست پیدا نشد" },
                { status: 404 }
            );
        }

        const comment = await prisma.comment.create({
            data: {
                content: content.trim(),
                postId: Number(postId),
                userId: currentUser.id,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                        role: true,
                    },
                },
            },
        });

        return NextResponse.json(comment, { status: 201 });
    } catch (error) {
        console.error("خطا در ساخت کامنت:", error);
        return NextResponse.json(
            { error: "خطا در ارسال کامنت" },
            { status: 500 }
        );
    }
}