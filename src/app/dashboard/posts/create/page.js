import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/getUser";
import AuthorPostForm from "@/components/AuthorPostForm";

export const dynamic = "force-dynamic";

export default async function NewAuthorPostPage() {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        redirect("/login");
    }

    if (currentUser.role !== "author" && currentUser.role !== "admin") {
        redirect("/become-author");
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="admin-header">
                        <div>
                            <h1 className="admin-title">پست جدید</h1>
                            <p className="admin-subtitle">یه پست جدید بنویس و منتشر کن</p>
                        </div>
                        <Link href="/dashboard" className="btn-glow-outline">
                            <i className="bi bi-arrow-right"></i>
                            بازگشت
                        </Link>
                    </div>

                    <AuthorPostForm />
                </div>
            </div>
        </div>
    );
}