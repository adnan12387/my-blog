import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getUser";
import { reviewPost } from "@/lib/ai";

// GET: پست‌های کاربر فعلی
export async function GET() {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json({ error: "لطفاً وارد شو" }, { status: 401 });
        }

        const posts = await prisma.post.findMany({
            where: { authorId: currentUser.id },
            orderBy: { createdAt: "desc" },
            include: {
                category: true,
            },
        });

        return NextResponse.json(posts);
    } catch (error) {
        console.error("خطا در GET my-posts:", error);
        return NextResponse.json({ error: "خطا" }, { status: 500 });
    }
}

// POST: ساخت پست جدید توسط کاربر (با بررسی AI)
export async function POST(request) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json({ error: "لطفاً وارد شو" }, { status: 401 });
        }

        // همه کاربرای لاگین‌کرده می‌تونن پست بسازن
        if (
            currentUser.role !== "author" &&
            currentUser.role !== "admin" &&
            currentUser.role !== "user"
        ) {
            return NextResponse.json({ error: "دسترسی نداری" }, { status: 403 });
        }

        const body = await request.json();

        if (!body.title || !body.content) {
            return NextResponse.json(
                { error: "عنوان و محتوا اجباریه" },
                { status: 400 }
            );
        }

        let status = "published";
        let aiScore = null;
        let aiReason = null;

        // اگه ادمین نباشه (چه user چه author)، AI بررسی می‌کنه
        if (currentUser.role !== "admin") {
            const review = await reviewPost({
                title: body.title,
                excerpt: body.excerpt || body.content.substring(0, 100),
                content: body.content,
            });

            aiScore = review.score;
            aiReason = review.reason;

            if (review.approved && review.score >= 70) {
                status = "published";
            } else {
                status = "pending";
            }
        }

        const newPost = await prisma.post.create({
            data: {
                title: body.title,
                excerpt: body.excerpt || body.content.substring(0, 100),
                content: body.content,
                author: currentUser.name,
                date: body.date || new Date().toLocaleDateString("fa-IR"),
                readTime: body.readTime || "۳ دقیقه",
                tag: body.tag || "bi-file-text",
                status,
                aiScore,
                aiReason,
                authorId: currentUser.id,
                categoryId: body.categoryId ? Number(body.categoryId) : null,
            },
        });

        return NextResponse.json(newPost, { status: 201 });
    } catch (error) {
        console.error("خطا در POST my-posts:", error);
        return NextResponse.json(
            { error: "خطا در ساخت پست" },
            { status: 500 }
        );
    }
}