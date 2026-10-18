import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getUser";
import CommentsSection from "@/components/CommentsSection";
import LikeButton from "@/components/LikeButton";
import BookmarkButton from "@/components/BookmarkButton";

export const dynamic = "force-dynamic";

export default async function PostPage({ params }) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
    include: {
      category: true,
      _count: {
        select: { likes: true, comments: true },
      },
    },
  });

  if (!post) {
    notFound();
  }

  const currentUser = await getCurrentUser();

  const gradients = [
    "linear-gradient(135deg, #7c5cff, #ff5c9d)",
    "linear-gradient(135deg, #00c9ff, #92fe9d)",
    "linear-gradient(135deg, #f857a6, #ff5858)",
    "linear-gradient(135deg, #667eea, #764ba2)",
    "linear-gradient(135deg, #f093fb, #f5576c)",
    "linear-gradient(135deg, #4facfe, #00f2fe)",
  ];

  const gradient = gradients[(post.id - 1) % gradients.length];

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <Link href="/" className="back-link mb-4 d-inline-flex">
            <i className="bi bi-arrow-right me-2"></i>
            بازگشت به خانه
          </Link>

          <div className="post-hero" style={{ background: gradient }}>
            <i className={`bi ${post.tag} post-hero-icon`}></i>
          </div>

          <h1 className="post-detail-title mt-4">{post.title}</h1>

          {post.category && (
            <Link
              href={`/category/${post.category.slug}`}
              className="category-link mb-3 d-inline-block"
              style={{ color: post.category.color }}
            >
              <i className={`bi ${post.category.icon} me-1`}></i>
              {post.category.name}
            </Link>
          )}

          <div className="post-detail-meta">
            <span>
              <i className="bi bi-person me-1"></i>
              {post.author}
            </span>
            <span>
              <i className="bi bi-calendar me-1"></i>
              {post.date}
            </span>
            <span>
              <i className="bi bi-clock me-1"></i>
              {post.readTime} مطالعه
            </span>
          </div>

          {/* دکمه‌های لایک و ذخیره */}
          <div className="post-actions-bar">
            <LikeButton
              postId={post.id}
              initialCount={post._count.likes}
              currentUser={currentUser}
            />
            <BookmarkButton postId={post.id} currentUser={currentUser} />
          </div>

          <hr className="my-4" style={{ borderColor: "var(--border)" }} />

          <div className="post-content">
            {post.content.split("\n").map((paragraph, i) =>
              paragraph.trim() ? <p key={i}>{paragraph}</p> : null
            )}
          </div>

          <div className="text-center mt-5">
            <Link href="/" className="btn-glow">
              <i className="bi bi-arrow-right"></i>
              بازگشت به لیست پست‌ها
            </Link>
          </div>

          <CommentsSection postId={post.id} currentUser={currentUser} />
        </div>
      </div>
    </div>
  );
}