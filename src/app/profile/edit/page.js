import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/getUser";
import { prisma } from "@/lib/prisma";
import ProfileForm from "@/components/ProfileForm";

export const dynamic = "force-dynamic";

export default async function EditProfilePage() {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { id: currentUser.id },
    });

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-7">
                    <div className="admin-header">
                        <div>
                            <h1 className="admin-title">ویرایش پروفایل</h1>
                            <p className="admin-subtitle">اطلاعات پروفایلت رو به‌روز کن</p>
                        </div>
                        <a href="/profile" className="btn-glow-outline">
                            <i className="bi bi-arrow-right"></i>
                            بازگشت
                        </a>
                    </div>

                    <ProfileForm initialData={user} />
                </div>
            </div>
        </div>
    );
}