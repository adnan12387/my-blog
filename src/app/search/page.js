import Link from "next/link";
import PostCard from "@/components/PostCard";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }) {
    const params = await searchParams;
    const q = params.q || "";

    let posts = [];
    if (q.trim()) {
        posts = await prisma.post.findMany({
            where: {
                OR: [
                    { title: { contains: q } },
                    { excerpt: { contains: q } },
                    { content: { contains: q } },
                ],
            },
            orderBy: { createdAt: "desc" },
        });
    }

    return (
        <div className="container py-5">
            <div className="search-page-header">
                <h1 className="search-page-title">
                    <i className="bi bi-search"></i>
                    نتایج جستجو
                </h1>
                {q && (
                    <p className="search-page-query">
                        برای «<strong>{q}</strong>» — {posts.length} نتیجه پیدا شد
                    </p>
                )}
            </div>

            {!q.trim() ? (
                <div className="admin-empty">
                    <i className="bi bi-search"></i>
                    <h3>چی می‌خوای پیدا کنی؟</h3>
                    <p>از آیکون جستجو توی هدر استفاده کن</p>
                </div>
            ) : posts.length === 0 ? (
                <div className="admin-empty">
                    <i className="bi bi-emoji-frown"></i>
                    <h3>نتیجه‌ای پیدا نشد</h3>
                    <p>با کلمات دیگه‌ای جستجو کن</p>
                    <Link href="/" className="btn-glow">
                        <i className="bi bi-arrow-right"></i>
                        بازگشت به خانه
                    </Link>
                </div>
            ) : (
                <div className="row g-4">
                    {posts.map((post, index) => (
                        <div key={post.id} className="col-md-6 col-lg-4">
                            <PostCard
                                id={post.id}
                                title={post.title}
                                excerpt={post.excerpt}
                                author={post.author}
                                date={post.date}
                                tag={post.tag}
                                index={index}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}