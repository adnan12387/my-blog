import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getUser";
import { createNotification } from "@/lib/notifications";

export async function PUT(request, { params }) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser || currentUser.role !== "admin") {
            return NextResponse.json({ error: "دسترسی نداری" }, { status: 403 });
        }

        const { id } = await params;
        const body = await request.json();
        const { status } = body;

        if (!["published", "rejected"].includes(status)) {
            return NextResponse.json({ error: "وضعیت نامعتبر" }, { status: 400 });
        }

        const post = await prisma.post.findUnique({
            where: { id: Number(id) },
        });

        if (!post) {
            return NextResponse.json({ error: "پست پیدا نشد" }, { status: 404 });
        }

        const updated = await prisma.post.update({
            where: { id: Number(id) },
            data: { status },
        });

        // اعلان برای نویسنده پست
        if (post.authorId && status === "published") {
            await createNotification({
                userId: post.authorId,
                type: "post_approved",
                title: "پست تأیید شد! 🎉",
                message: `پست «${post.title}» توسط ادمین تأیید و منتشر شد.`,
                link: `/posts/${post.id}`,
            });
        } else if (post.authorId && status === "rejected") {
            await createNotification({
                userId: post.authorId,
                type: "post_rejected",
                title: "پست رد شد",
                message: `پست «${post.title}» توسط ادمین رد شد.`,
                link: "/dashboard",
            });
        }

        return NextResponse.json(updated);
    } catch (error) {
        console.error("خطا در PUT pending-post:", error);
        return NextResponse.json({ error: "خطا" }, { status: 500 });
    }
}