import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getUser";
import { createNotification } from "@/lib/notifications";

// PUT: تأیید یا رد درخواست (فقط ادمین)
export async function PUT(request, { params }) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser || currentUser.role !== "admin") {
            return NextResponse.json({ error: "دسترسی نداری" }, { status: 403 });
        }

        const { id } = await params;
        const body = await request.json();
        const { status, adminNote } = body;

        if (!["approved", "rejected"].includes(status)) {
            return NextResponse.json({ error: "وضعیت نامعتبر" }, { status: 400 });
        }

        const authorRequest = await prisma.authorRequest.findUnique({
            where: { id: Number(id) },
        });

        if (!authorRequest) {
            return NextResponse.json({ error: "درخواست پیدا نشد" }, { status: 404 });
        }

        const updated = await prisma.authorRequest.update({
            where: { id: Number(id) },
            data: {
                status,
                adminNote: adminNote || null,
            },
        });

        if (status === "approved") {
            await prisma.user.update({
                where: { id: authorRequest.userId },
                data: { role: "author" },
            });

            await createNotification({
                userId: authorRequest.userId,
                type: "request_approved",
                title: "درخواست نویسندگی تأیید شد! 🎉",
                message: "حالا می‌تونی پست بسازی و منتشر کنی.",
                link: "/dashboard",
            });
        } else if (status === "rejected") {
            await createNotification({
                userId: authorRequest.userId,
                type: "request_rejected",
                title: "درخواست نویسندگی رد شد",
                message: adminNote
                    ? `دلیل: ${adminNote}`
                    : "درخواستت توسط ادمین رد شد.",
                link: "/become-author",
            });
        }

        return NextResponse.json(updated);
    } catch (error) {
        console.error("خطا در PUT request:", error);
        return NextResponse.json({ error: "خطا" }, { status: 500 });
    }
}

// DELETE: حذف درخواست (فقط ادمین)
export async function DELETE(request, { params }) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser || currentUser.role !== "admin") {
            return NextResponse.json({ error: "دسترسی نداری" }, { status: 403 });
        }

        const { id } = await params;

        await prisma.authorRequest.delete({
            where: { id: Number(id) },
        });

        return NextResponse.json({ message: "حذف شد" });
    } catch (error) {
        console.error("خطا در DELETE request:", error);
        return NextResponse.json({ error: "خطا" }, { status: 500 });
    }
}