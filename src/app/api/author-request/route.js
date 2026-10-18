import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getUser";

// POST: ارسال درخواست نویسندگی
export async function POST(request) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json(
                { error: "لطفاً وارد شو" },
                { status: 401 }
            );
        }

        // فقط کاربر عادی می‌تونه درخواست بده
        if (currentUser.role !== "user") {
            return NextResponse.json(
                { error: "فقط کاربران عادی می‌تونن درخواست نویسندگی بدن" },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { message } = body;

        if (!message || !message.trim()) {
            return NextResponse.json(
                { error: "متن درخواست اجباریه" },
                { status: 400 }
            );
        }

        // چک کن درخواست pending قبلی نداشته باشه
        const existing = await prisma.authorRequest.findFirst({
            where: {
                userId: currentUser.id,
                status: "pending",
            },
        });

        if (existing) {
            return NextResponse.json(
                { error: "شما یه درخواست در حال بررسی دارید" },
                { status: 400 }
            );
        }

        const newRequest = await prisma.authorRequest.create({
            data: {
                message: message.trim(),
                userId: currentUser.id,
            },
        });

        return NextResponse.json(
            {
                message: "درخواستت ارسال شد. به‌زودی بررسی می‌شه.",
                request: newRequest,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("خطا در ارسال درخواست:", error);
        return NextResponse.json(
            { error: "خطا در ارسال درخواست" },
            { status: 500 }
        );
    }
}

// GET: گرفتن درخواست‌های کاربر فعلی
export async function GET() {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json(
                { error: "لطفاً وارد شو" },
                { status: 401 }
            );
        }

        const requests = await prisma.authorRequest.findMany({
            where: { userId: currentUser.id },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(requests);
    } catch (error) {
        console.error("خطا در خواندن درخواست‌ها:", error);
        return NextResponse.json(
            { error: "خطا در خواندن درخواست‌ها" },
            { status: 500 }
        );
    }
}