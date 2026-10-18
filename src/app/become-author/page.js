import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/getUser";
import { prisma } from "@/lib/prisma";
import BecomeAuthorForm from "@/components/BecomeAuthorForm";

export const dynamic = "force-dynamic";

export default async function BecomeAuthorPage() {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        redirect("/login");
    }

    // اگه قبلاً نویسنده یا ادمین هست
    if (currentUser.role === "author" || currentUser.role === "admin") {
        return (
            <div className="container py-5">
                <div className="auth-wrapper">
                    <div className="auth-card">
                        <div className="auth-header">
                            <div className="auth-icon" style={{ background: "linear-gradient(135deg, #00c9ff, #92fe9d)" }}>
                                <i className="bi bi-check-circle"></i>
                            </div>
                            <h1 className="auth-title">شما قبلاً نویسنده هستی!</h1>
                            <p className="auth-subtitle">
                                می‌تونی از پنل نویسندگی پست بسازی.
                            </p>
                        </div>
                        <a href="/dashboard" className="btn-glow" style={{ width: "100%", justifyContent: "center" }}>
                            <i className="bi bi-pencil-square"></i>
                            پنل نویسندگی
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    // چک کن درخواست pending داره یا نه
    const existingRequest = await prisma.authorRequest.findFirst({
        where: {
            userId: currentUser.id,
            status: "pending",
        },
    });

    // اگه درخواست pending داره
    if (existingRequest) {
        return (
            <div className="container py-5">
                <div className="auth-wrapper">
                    <div className="auth-card">
                        <div className="auth-header">
                            <div className="auth-icon" style={{ background: "linear-gradient(135deg, #f857a6, #ff5858)" }}>
                                <i className="bi bi-hourglass-split"></i>
                            </div>
                            <h1 className="auth-title">درخواستت در حال بررسیه</h1>
                            <p className="auth-subtitle">
                                درخواستت ارسال شده و به‌زودی توسط ادمین بررسی می‌شه.
                            </p>
                        </div>
                        <div className="profile-info" style={{ textAlign: "right" }}>
                            <div className="profile-info-item">
                                <i className="bi bi-calendar"></i>
                                <span>تاریخ ارسال: {new Date(existingRequest.createdAt).toLocaleDateString("fa-IR")}</span>
                            </div>
                            <div className="profile-info-item">
                                <i className="bi bi-chat-left-text"></i>
                                <span>{existingRequest.message}</span>
                            </div>
                        </div>
                        <a href="/profile" className="btn-glow-outline" style={{ width: "100%", justifyContent: "center" }}>
                            <i className="bi bi-arrow-right"></i>
                            بازگشت به پروفایل
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    // فرم درخواست
    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-7">
                    <div className="admin-header">
                        <div>
                            <h1 className="admin-title">درخواست نویسندگی</h1>
                            <p className="admin-subtitle">
                                اگه می‌خوای توی این وبلاگ مقاله بنویسی، درخواستت رو بفرست
                            </p>
                        </div>
                        <a href="/profile" className="btn-glow-outline">
                            <i className="bi bi-arrow-right"></i>
                            بازگشت
                        </a>
                    </div>

                    <BecomeAuthorForm />
                </div>
            </div>
        </div>
    );
}