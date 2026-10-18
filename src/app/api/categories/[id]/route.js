import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getUser";

// PUT: ویرایش دسته‌بندی (فقط ادمین)
export async function PUT(request, { params }) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser || currentUser.role !== "admin") {
            return NextResponse.json({ error: "دسترسی نداری" }, { status: 403 });
        }

        const { id } = await params;
        const body = await request.json();
        const { name, slug, color, icon } = body;

        const existing = await prisma.category.findFirst({
            where: {
                OR: [{ name }, { slug }],
                NOT: { id: Number(id) },
            },
        });

        if (existing) {
            return NextResponse.json(
                { error: "این نام یا slug قبلاً استفاده شده" },
                { status: 400 }
            );
        }

        const updated = await prisma.category.update({
            where: { id: Number(id) },
            data: {
                name,
                slug,
                color,
                icon,
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("خطا در PUT category:", error);
        return NextResponse.json({ error: "خطا در ویرایش" }, { status: 500 });
    }
}

// DELETE: حذف دسته‌بندی (فقط ادمین)
export async function DELETE(request, { params }) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser || currentUser.role !== "admin") {
            return NextResponse.json({ error: "دسترسی نداری" }, { status: 403 });
        }

        const { id } = await params;

        // چک کن که پستی به این دسته وصل نشده باشه
        const categoryWithPosts = await prisma.category.findUnique({
            where: { id: Number(id) },
            include: { _count: { select: { posts: true } } },
        });

        if (!categoryWithPosts) {
            return NextResponse.json({ error: "دسته‌بندی پیدا نشد" }, { status: 404 });
        }

        if (categoryWithPosts._count.posts > 0) {
            return NextResponse.json(
                { error: "این دسته‌بندی پست داره، نمیشه حذفش کرد" },
                { status: 400 }
            );
        }

        await prisma.category.delete({
            where: { id: Number(id) },
        });

        return NextResponse.json({ message: "دسته‌بندی حذف شد" });
    } catch (error) {
        console.error("خطا در DELETE category:", error);
        return NextResponse.json({ error: "خطا در حذف" }, { status: 500 });
    }
}
