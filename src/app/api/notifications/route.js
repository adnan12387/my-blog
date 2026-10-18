import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getUser";

// GET: لیست اعلان‌های کاربر
export async function GET() {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json({ error: "لطفاً وارد شو" }, { status: 401 });
        }

        const notifications = await prisma.notification.findMany({
            where: { userId: currentUser.id },
            orderBy: { createdAt: "desc" },
            take: 20,
        });

        const unreadCount = notifications.filter((n) => !n.read).length;

        return NextResponse.json({
            notifications,
            unreadCount,
        });
    } catch (error) {
        console.error("خطا در GET notifications:", error);
        return NextResponse.json({ error: "خطا" }, { status: 500 });
    }
}

// PUT: علامت‌گذاری همه به عنوان خوانده‌شده
export async function PUT() {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json({ error: "لطفاً وارد شو" }, { status: 401 });
        }

        await prisma.notification.updateMany({
            where: {
                userId: currentUser.id,
                read: false,
            },
            data: { read: true },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("خطا در PUT notifications:", error);
        return NextResponse.json({ error: "خطا" }, { status: 500 });
    }
}