import Link from "next/link";
import CategoryForm from "../CategoryForm";

export const metadata = {
    title: "ساخت دسته‌بندی جدید",
};

export default function CreateCategoryPage() {
    return (
        <div>
            <div className="admin-header">
                <div>
                    <h1 className="admin-title">ساخت دسته‌بندی جدید</h1>
                    <p className="admin-subtitle">یه دسته‌بندی جدید برای وبلاگ بساز</p>
                </div>
                <Link href="/admin/categories" className="btn-glow-outline">
                    <i className="bi bi-arrow-left"></i>
                    بازگشت
                </Link>
            </div>

            <CategoryForm />
        </div>
    );
}
