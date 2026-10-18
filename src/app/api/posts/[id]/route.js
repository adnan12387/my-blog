import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getUser";

// GET: یه پست خاص
export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const post = await prisma.post.findUnique({
            where: { id: Number(id) },
            include: {
                category: true,
            },
        });

        if (!post) {
            return NextResponse.json({ error: "پست پیدا نشد" }, { status: 404 });
        }

        return NextResponse.json(post);
    } catch (error) {
        console.error("خطا در GET post:", error);
        return NextResponse.json({ error: "خطا" }, { status: 500 });
    }
}

// PUT: ویرایش پست
export async function PUT(request, { params }) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json({ error: "لطفاً وارد شو" }, { status: 401 });
        }

        const { id } = await params;
        const post = await prisma.post.findUnique({
            where: { id: Number(id) },
        });

        if (!post) {
            return NextResponse.json({ error: "پست پیدا نشد" }, { status: 404 });
        }

        const isOwner = post.authorId === currentUser.id;
        const isAdmin = currentUser.role === "admin";

        if (!isOwner && !isAdmin) {
            return NextResponse.json(
                { error: "شما اجازه ویرایش این پست رو نداری" },
                { status: 403 }
            );
        }

        const body = await request.json();

        const updated = await prisma.post.update({
            where: { id: Number(id) },
            data: {
                title: body.title,
                excerpt: body.excerpt,
                content: body.content,
                author: body.author || post.author,
                readTime: body.readTime,
                tag: body.tag,
                categoryId: body.categoryId ? Number(body.categoryId) : null,
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("خطا در PUT:", error);
        return NextResponse.json(
            { error: "خطا در ویرایش پست" },
            { status: 500 }
        );
    }
}

// DELETE: حذف پست
export async function DELETE(request, { params }) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json({ error: "لطفاً وارد شو" }, { status: 401 });
        }

        const { id } = await params;
        const post = await prisma.post.findUnique({
            where: { id: Number(id) },
        });

        if (!post) {
            return NextResponse.json({ error: "پست پیدا نشد" }, { status: 404 });
        }

        const isOwner = post.authorId === currentUser.id;
        const isAdmin = currentUser.role === "admin";

        if (!isOwner && !isAdmin) {
            return NextResponse.json(
                { error: "شما اجازه حذف این پست رو نداری" },
                { status: 403 }
            );
        }

        await prisma.post.delete({
            where: { id: Number(id) },
        });

        return NextResponse.json({ message: "پست حذف شد" });
    } catch (error) {
        console.error("خطا در DELETE:", error);
        return NextResponse.json({ error: "خطا" }, { status: 500 });
    }
}