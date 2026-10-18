import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PostForm from "@/components/PostForm";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }) {
    const { id } = await params;
    const post = await prisma.post.findUnique({
        where: { id: Number(id) },
    });

    if (!post) {
        notFound();
    }

    return (
        <div>
            <div className="admin-header">
                <div>
                    <h1 className="admin-title">ویرایش پست</h1>
                    <p className="admin-subtitle">پست رو ویرایش کن و ذخیره کن</p>
                </div>
            </div>

            <PostForm initialData={post} isEdit={true} />
        </div>
    );
}