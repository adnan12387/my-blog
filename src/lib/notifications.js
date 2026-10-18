import { prisma } from "@/lib/prisma";

export async function createNotification({
    userId,
    type,
    title,
    message,
    link,
}) {
    try {
        await prisma.notification.create({
            data: {
                userId,
                type,
                title,
                message,
                link,
            },
        });
    } catch (error) {
        console.error("خطا در ساخت اعلان:", error);
    }
}