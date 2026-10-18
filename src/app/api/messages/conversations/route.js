import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getUser";

// GET: لیست مکالمات کاربر فعلی
export async function GET() {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json({ error: "لطفاً وارد شو" }, { status: 401 });
        }

        // همه پیام‌های کاربر (فرستاده و دریافت‌شده)
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: currentUser.id },
                    { receiverId: currentUser.id },
                ],
            },
            orderBy: { createdAt: "desc" },
            include: {
                sender: {
                    select: { id: true, name: true, avatar: true },
                },
                receiver: {
                    select: { id: true, name: true, avatar: true },
                },
            },
        });

        // گروه‌بندی بر اساس کاربر مقابل
        const conversationsMap = new Map();

        messages.forEach((msg) => {
            const otherUser =
                msg.senderId === currentUser.id ? msg.receiver : msg.sender;
            const key = otherUser.id;

            if (!conversationsMap.has(key)) {
                conversationsMap.set(key, {
                    user: otherUser,
                    lastMessage: msg.content,
                    lastMessageAt: msg.createdAt,
                    lastMessageFromMe: msg.senderId === currentUser.id,
                    unreadCount: 0,
                });
            }

            // شمارش پیام‌های خوانده‌نشده
            if (msg.receiverId === currentUser.id && !msg.read) {
                conversationsMap.get(key).unreadCount += 1;
            }
        });

        const conversations = Array.from(conversationsMap.values());

        return NextResponse.json(conversations);
    } catch (error) {
        console.error("خطا در GET conversations:", error);
        return NextResponse.json({ error: "خطا" }, { status: 500 });
    }
}