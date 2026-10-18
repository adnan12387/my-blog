import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json({
        message: "خروج موفق",
    });

    // پاک کردن کوکی توکن
    response.cookies.set("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0,
        path: "/",
    });

    return response;
}