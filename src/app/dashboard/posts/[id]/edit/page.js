import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/getUser";
import { prisma } from "@/lib/prisma";
import AuthorPostForm from "@/components/AuthorPostForm";

export const dynamic = "force-dynamic";

export default async function EditAuthorPostPage({ params }) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        redirect("/login");
    }

    if (currentUser.role !== "author" && currentUser.role !== "admin") {
        redirect("/become-author");
    }

    const { id } = await params;
    const post = await prisma.post.findUnique({
        where: { id: Number(id) },
    });

    if (!post) {
        notFound();
    }

    // چک کن نویسنده صاحب پسته یا ادمین
    const isOwner = post.authorId === currentUser.id;
    const isAdmin = currentUser.role === "admin";

    if (!isOwner && !isAdmin) {
        return (
            <div className="container py-5">
                <div className="auth-wrapper">
                    <div className="auth-card">
                        <div className="auth-header">
                            <div
                                className="auth-icon"
                                style={{ background: "linear-gradient(135deg, #ff5c5c, #ff5c9d)" }}
                            >
                                <i className="bi bi-shield-x"></i>
                            </div>
                            <h1 className="auth-title">دسترسی نداری</h1>
                            <p className="auth-subtitle">
                                این پست مال شما نیست و نمی‌تونی ویرایشش کنی.
                            </p>
                        </div>
                        <Link
                            href="/dashboard"
                            className="btn-glow"
                            style={{ width: "100%", justifyContent: "center" }}
                        >
                            <i className="bi bi-arrow-right"></i>
                            بازگشت به پنل من
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="admin-header">
                        <div>
                            <h1 className="admin-title">ویرایش پست</h1>
                            <p className="admin-subtitle">پستت رو ویرایش کن و ذخیره کن</p>
                        </div>
                        <Link href="/dashboard" className="btn-glow-outline">
                            <i className="bi bi-arrow-right"></i>
                            بازگشت
                        </Link>
                    </div>

                    <AuthorPostForm initialData={post} isEdit={true} />
                </div>
            </div>
        </div>
    );
}