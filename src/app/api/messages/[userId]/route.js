import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getUser";

// GET: پیام‌های بین کاربر فعلی و کاربر مقابل
export async function GET(request, { params }) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json({ error: "لطفاً وارد شو" }, { status: 401 });
        }

        const { userId } = await params;
        const otherUserId = Number(userId);

        if (otherUserId === currentUser.id) {
            return NextResponse.json(
                { error: "نمی‌تونی با خودت چت کنی" },
                { status: 400 }
            );
        }

        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: currentUser.id, receiverId: otherUserId },
                    { senderId: otherUserId, receiverId: currentUser.id },
                ],
            },
            orderBy: { createdAt: "asc" },
            include: {
                sender: {
                    select: { id: true, name: true, avatar: true },
                },
            },
        });

        // علامت‌گذاری پیام‌های دریافتی به عنوان خوانده‌شده
        await prisma.message.updateMany({
            where: {
                senderId: otherUserId,
                receiverId: currentUser.id,
                read: false,
            },
            data: { read: true },
        });

        return NextResponse.json(messages);
    } catch (error) {
        console.error("خطا در GET messages:", error);
        return NextResponse.json({ error: "خطا" }, { status: 500 });
    }
}