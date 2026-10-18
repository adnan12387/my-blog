import PostCard from "@/components/PostCard";
import HeroSlider from "@/components/HeroSlider";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  const posts = await prisma.post.findMany({
    where: { status: "published" },
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
    },
  });

  return (
    <div>
      <HeroSlider />

      <div className="container py-5">
        <section id="posts">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h2 className="h4 fw-bold m-0">آخرین نوشته‌ها</h2>
          </div>

          <div className="row g-4">
            {posts.length === 0 ? (
              <div className="col-12 text-center py-5">
                <p style={{ color: "var(--text-muted)" }}>
                  هنوز پستی نوشته نشده.
                </p>
              </div>
            ) : (
              posts.map((post, index) => (
                <div key={post.id} className="col-md-6 col-lg-4">
                  <PostCard
                    id={post.id}
                    title={post.title}
                    excerpt={post.excerpt}
                    author={post.author}
                    date={post.date}
                    tag={post.tag}
                    index={index}
                    category={post.category}
                  />
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );}