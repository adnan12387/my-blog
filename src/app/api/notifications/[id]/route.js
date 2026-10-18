import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getUser";

// DELETE: حذف اعلان
export async function DELETE(request, { params }) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json({ error: "لطفاً وارد شو" }, { status: 401 });
        }

        const { id } = await params;

        const notification = await prisma.notification.findUnique({
            where: { id: Number(id) },
        });

        if (!notification) {
            return NextResponse.json({ error: "اعلان پیدا نشد" }, { status: 404 });
        }

        if (notification.userId !== currentUser.id) {
            return NextResponse.json({ error: "دسترسی نداری" }, { status: 403 });
        }

        await prisma.notification.delete({
            where: { id: Number(id) },
        });

        return NextResponse.json({ message: "حذف شد" });
    } catch (error) {
        console.error("خطا در DELETE notification:", error);
        return NextResponse.json({ error: "خطا" }, { status: 500 });
    }
}