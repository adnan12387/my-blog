import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getUser";

// GET: تعداد پیام‌های خونده‌نشده
export async function GET() {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json({ count: 0 });
        }

        const count = await prisma.message.count({
            where: {
                receiverId: currentUser.id,
                read: false,
            },
        });

        return NextResponse.json({ count });
    } catch (error) {
        console.error("خطا در GET unread:", error);
        return NextResponse.json({ count: 0 });
    }
}