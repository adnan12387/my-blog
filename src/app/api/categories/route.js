import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getUser";

// GET: لیست همه دسته‌بندی‌ها
export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { name: "asc" },
            include: {
                _count: {
                    select: { posts: true },
                },
            },
        });
        return NextResponse.json(categories);
    } catch (error) {
        console.error("خطا در GET categories:", error);
        return NextResponse.json({ error: "خطا" }, { status: 500 });
    }
}

// POST: ساخت دسته‌بندی جدید (فقط ادمین)
export async function POST(request) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser || currentUser.role !== "admin") {
            return NextResponse.json({ error: "دسترسی نداری" }, { status: 403 });
        }

        const body = await request.json();
        const { name, slug, color, icon } = body;

        if (!name || !slug) {
            return NextResponse.json(
                { error: "نام و slug اجباریه" },
                { status: 400 }
            );
        }

        const existing = await prisma.category.findFirst({
            where: {
                OR: [{ name }, { slug }],
            },
        });

        if (existing) {
            return NextResponse.json(
                { error: "این دسته‌بندی قبلاً وجود داره" },
                { status: 400 }
            );
        }

        const category = await prisma.category.create({
            data: {
                name,
                slug,
                color: color || "#7c5cff",
                icon: icon || "bi-folder",
            },
        });

        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        console.error("خطا در POST category:", error);
        return NextResponse.json({ error: "خطا" }, { status: 500 });
    }
}
