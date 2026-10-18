import { SignJWT, jwtVerify } from "jose";

// کلید مخفی برای امضای توکن
// ⚠️ در پروژه واقعی این باید توی .env باشه
const secret = new TextEncoder().encode(
    "my-super-secret-key-for-blog-project-change-this-in-production"
);

// ساخت توکن
export async function createToken(payload) {
    const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d") // اعتبار: ۷ روز
        .sign(secret);

    return token;
}

// بررسی توکن
export async function verifyToken(token) {
    try {
        const { payload } = await jwtVerify(token, secret);
        return payload;
    } catch (error) {
        return null;
    }
}