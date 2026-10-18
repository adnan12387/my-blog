import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createToken } from "@/lib/auth";

export async function POST(request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: "ایمیل و رمز عبور اجباریه" },
                { status: 400 }
            );
        }

        // پیدا کردن کاربر
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { error: "ایمیل یا رمز عبور اشتباهه" },
                { status: 401 }
            );
        }

        // چک کردن پسورد
        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return NextResponse.json(
                { error: "ایمیل یا رمز عبور اشتباهه" },
                { status: 401 }
            );
        }

        // ساخت توکن
        const token = await createToken({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        });

        // ساخت پاسخ
        const response = NextResponse.json({
            message: "ورود موفق",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

        // ذخیره توکن توی کوکی
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // ۷ روز
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("خطا در لاگین:", error);
        return NextResponse.json(
            { error: "خطا در ورود" },
            { status: 500 }
        );
    }
}