import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const q = searchParams.get("q");

        if (!q || !q.trim()) {
            return NextResponse.json([]);
        }

        const posts = await prisma.post.findMany({
            where: {
                OR: [
                    { title: { contains: q } },
                    { excerpt: { contains: q } },
                    { content: { contains: q } },
                ],
            },
            orderBy: { createdAt: "desc" },
            take: 10,
            select: {
                id: true,
                title: true,
                excerpt: true,
                author: true,
                tag: true,
            },
        });

        return NextResponse.json(posts);
    } catch (error) {
        console.error("خطا در جستجو:", error);
        return NextResponse.json({ error: "خطا در جستجو" }, { status: 500 });
    }
}