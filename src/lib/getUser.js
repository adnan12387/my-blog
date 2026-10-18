import { cookies } from "next/headers";
import { verifyToken } from "./auth";

// گرفتن کاربر فعلی از توکن
export async function getCurrentUser() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return null;
        }

        const payload = await verifyToken(token);

        if (!payload) {
            return null;
        }

        return payload; // { id, name, email, role }
    } catch (error) {
        return null;
    }
}