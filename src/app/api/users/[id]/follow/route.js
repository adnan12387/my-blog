import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getUser";
import { createNotification } from "@/lib/notifications";

// POST: دنبال کردن یا لغو دنبال کردن
export async function POST(request, { params }) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json({ error: "لطفاً وارد شو" }, { status: 401 });
        }

        const { id } = await params;
        const targetUserId = Number(id);

        if (targetUserId === currentUser.id) {
            return NextResponse.json(
                { error: "نمی‌تونی خودت رو دنبال کنی" },
                { status: 400 }
            );
        }

        const targetUser = await prisma.user.findUnique({
            where: { id: targetUserId },
        });

        if (!targetUser) {
            return NextResponse.json({ error: "کاربر پیدا نشد" }, { status: 404 });
        }

        const existingFollow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: currentUser.id,
                    followingId: targetUserId,
                },
            },
        });

        if (existingFollow) {
            // لغو دنبال کردن
            await prisma.follow.delete({
                where: { id: existingFollow.id },
            });
            return NextResponse.json({ isFollowing: false });
        } else {
            // دنبال کردن
            await prisma.follow.create({
                data: {
                    followerId: currentUser.id,
                    followingId: targetUserId,
                },
            });

            // اعلان برای کاربری که دنبال شد
            await createNotification({
                userId: targetUserId,
                type: "follow",
                title: "دنبال‌کننده جدید 👤",
                message: `${currentUser.name} تو رو دنبال کرد`,
                link: `/users/${currentUser.id}`,
            });

            return NextResponse.json({ isFollowing: true });
        }
    } catch (error) {
        console.error("خطا در POST follow:", error);
        return NextResponse.json({ error: "خطا" }, { status: 500 });
    }
}