import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PostCard from "@/components/PostCard";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }) {
    const { slug } = await params;
    
    const category = await prisma.category.findUnique({
        where: { slug },
    });

    if (!category) {
        notFound();
    }

    const posts = await prisma.post.findMany({
        where: { categoryId: category.id },
        orderBy: { createdAt: "desc" },
        include: {
            category: true,
        },
    });

    return (
        <div className="container py-5">
            <div className="category-header">
                <div className="category-icon" style={{ background: category.color }}>
                    <i className={`bi ${category.icon}`}></i>
                </div>
                <div>
                    <h1 className="category-title">{category.name}</h1>
                    <p className="category-count">{posts.length} پست در این دسته‌بندی</p>
                </div>
            </div>

            {posts.length === 0 ? (
                <div className="empty-state">
                    <i className="bi bi-inbox"></i>
                    <h3>هنوز پستی توی این دسته‌بندی نیست</h3>
                    <p>اولین پست رو بساز!</p>
                    <Link href="/" className="btn-glow">
                        <i className="bi bi-house"></i>
                        بازگشت به خانه
                    </Link>
                </div>
            ) : (
                <div className="posts-grid">
                    {posts.map((post, index) => (
                        <PostCard
                            key={post.id}
                            id={post.id}
                            title={post.title}
                            excerpt={post.excerpt}
                            author={post.author}
                            date={post.date}
                            tag={post.tag}
                            index={index}
                            category={post.category}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
