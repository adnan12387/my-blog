import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
    try {
        const body = await request.json();
        const { name, email, password } = body;

        // اعتبارسنجی
        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "همه فیلدها اجباریه" },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: "رمز عبور باید حداقل ۶ کاراکتر باشه" },
                { status: 400 }
            );
        }

        // چک کن ایمیل قبلاً ثبت نشده باشه
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "این ایمیل قبلاً ثبت شده" },
                { status: 400 }
            );
        }

        // رمزنگاری پسورد
        const hashedPassword = await bcrypt.hash(password, 10);

        // ساخت کاربر جدید
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "user", // پیش‌فرض
            },
        });

        // برگردوندن اطلاعات (بدون پسورد)
        return NextResponse.json(
            {
                message: "ثبت‌نام با موفقیت انجام شد",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("خطا در ثبت‌نام:", error);
        return NextResponse.json(
            { error: "خطا در ثبت‌نام" },
            { status: 500 }
        );
    }
}