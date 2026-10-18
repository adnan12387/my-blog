import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getUser";

export async function GET(request, { params }) {
    try {
        const currentUser = await getCurrentUser();
        const { id } = await params;

        if (!currentUser) {
            return NextResponse.json({ bookmarked: false });
        }

        const bookmark = await prisma.bookmark.findUnique({
            where: {
                userId_postId: { userId: currentUser.id, postId: Number(id) },
            },
        });

        return NextResponse.json({ bookmarked: !!bookmark });
    } catch (error) {
        console.error("خطا در GET bookmark:", error);
        return NextResponse.json({ error: "خطا" }, { status: 500 });
    }
}

export async function POST(request, { params }) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json({ error: "لطفاً وارد شو" }, { status: 401 });
        }

        const { id } = await params;
        const postId = Number(id);

        const post = await prisma.post.findUnique({ where: { id: postId } });
        if (!post) {
            return NextResponse.json({ error: "پست پیدا نشد" }, { status: 404 });
        }

        const existing = await prisma.bookmark.findUnique({
            where: {
                userId_postId: { userId: currentUser.id, postId },
            },
        });

        if (existing) {
            await prisma.bookmark.delete({ where: { id: existing.id } });
            return NextResponse.json({ bookmarked: false });
        } else {
            await prisma.bookmark.create({
                data: { userId: currentUser.id, postId },
            });
            return NextResponse.json({ bookmarked: true });
        }
    } catch (error) {
        console.error("خطا در POST bookmark:", error);
        return NextResponse.json({ error: "خطا" }, { status: 500 });
    }
}