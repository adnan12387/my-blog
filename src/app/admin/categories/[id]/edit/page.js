import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CategoryForm from "../../CategoryForm";

export const dynamic = "force-dynamic";

export default async function EditCategoryPage({ params }) {
    const { id } = await params;
    const category = await prisma.category.findUnique({
        where: { id: Number(id) },
    });

    if (!category) {
        notFound();
    }

    return (
        <div>
            <div className="admin-header">
                <div>
                    <h1 className="admin-title">ویرایش دسته‌بندی</h1>
                    <p className="admin-subtitle">ویرایش دسته‌بندی: {category.name}</p>
                </div>
                <Link href="/admin/categories" className="btn-glow-outline">
                    <i className="bi bi-arrow-left"></i>
                    بازگشت
                </Link>
            </div>

            <CategoryForm initialData={category} isEdit={true} />
        </div>
    );
}
