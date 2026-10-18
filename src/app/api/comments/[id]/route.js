import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getUser";

// DELETE: حذف کامنت
export async function DELETE(request, { params }) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json({ error: "لطفاً وارد شو" }, { status: 401 });
        }

        const { id } = await params;
        const comment = await prisma.comment.findUnique({
            where: { id: Number(id) },
        });

        if (!comment) {
            return NextResponse.json({ error: "کامنت پیدا نشد" }, { status: 404 });
        }

        // چک کن کاربر صاحب کامنت یا ادمین هست
        const isOwner = comment.userId === currentUser.id;
        const isAdmin = currentUser.role === "admin";

        if (!isOwner && !isAdmin) {
            return NextResponse.json(
                { error: "شما اجازه حذف این کامنت رو نداری" },
                { status: 403 }
            );
        }

        await prisma.comment.delete({
            where: { id: Number(id) },
        });

        return NextResponse.json({ message: "کامنت حذف شد" });
    } catch (error) {
        console.error("خطا در DELETE comment:", error);
        return NextResponse.json({ error: "خطا در حذف کامنت" }, { status: 500 });
    }
}