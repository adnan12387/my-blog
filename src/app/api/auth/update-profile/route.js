import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getUser";

export async function PUT(request) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json(
                { error: "لطفاً وارد شو" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { name, bio, avatar, github, twitter, linkedin, website } = body;

        if (!name || !name.trim()) {
            return NextResponse.json(
                { error: "نام اجباریه" },
                { status: 400 }
            );
        }

        const updated = await prisma.user.update({
            where: { id: currentUser.id },
            data: {
                name: name.trim(),
                bio: bio?.trim() || null,
                avatar: avatar?.trim() || null,
                github: github?.trim() || null,
                twitter: twitter?.trim() || null,
                linkedin: linkedin?.trim() || null,
                website: website?.trim() || null,
            },
        });

        return NextResponse.json({
            message: "پروفایل با موفقیت به‌روزرسانی شد",
            user: {
                id: updated.id,
                name: updated.name,
                email: updated.email,
                role: updated.role,
            },
        });
    } catch (error) {
        console.error("خطا در آپدیت پروفایل:", error);
        return NextResponse.json(
            { error: "خطا در ذخیره تغییرات" },
            { status: 500 }
        );
    }
}