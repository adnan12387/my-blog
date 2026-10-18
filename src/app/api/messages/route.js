import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getUser";
import { createNotification } from "@/lib/notifications";

// POST: ارسال پیام جدید
export async function POST(request) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json({ error: "لطفاً وارد شو" }, { status: 401 });
        }

        const body = await request.json();
        const { receiverId, content } = body;

        if (!receiverId || !content || !content.trim()) {
            return NextResponse.json(
                { error: "گیرنده و متن پیام اجباریه" },
                { status: 400 }
            );
        }

        if (Number(receiverId) === currentUser.id) {
            return NextResponse.json(
                { error: "نمی‌تونی به خودت پیام بدی" },
                { status: 400 }
            );
        }

        // چک کن گیرنده وجود داره
        const receiver = await prisma.user.findUnique({
            where: { id: Number(receiverId) },
        });

        if (!receiver) {
            return NextResponse.json({ error: "کاربر پیدا نشد" }, { status: 404 });
        }

        const message = await prisma.message.create({
            data: {
                content: content.trim(),
                senderId: currentUser.id,
                receiverId: Number(receiverId),
            },
            include: {
                sender: {
                    select: { id: true, name: true, avatar: true },
                },
                receiver: {
                    select: { id: true, name: true, avatar: true },
                },
            },
        });

        // ساخت اعلان برای گیرنده
        await createNotification({
            userId: Number(receiverId),
            type: "message",
            title: "پیام جدید",
            message: `${currentUser.name} بهت پیام داد`,
            link: `/messages/${currentUser.id}`,
        });

        return NextResponse.json(message, { status: 201 });
    } catch (error) {
        console.error("خطا در POST message:", error);
        return NextResponse.json({ error: "خطا" }, { status: 500 });
    }
}