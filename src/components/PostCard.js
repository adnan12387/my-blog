import Link from "next/link";

export default function PostCard({ id, title, excerpt, author, date, index, tag, category }) {
  const gradients = [
    "linear-gradient(135deg, #7c5cff, #ff5c9d)",
    "linear-gradient(135deg, #00c9ff, #92fe9d)",
    "linear-gradient(135deg, #f857a6, #ff5858)",
    "linear-gradient(135deg, #667eea, #764ba2)",
    "linear-gradient(135deg, #f093fb, #f5576c)",
    "linear-gradient(135deg, #4facfe, #00f2fe)",
  ];

  const gradient = category ? category.color : gradients[index % gradients.length];

  return (
    <article
      className="post-card"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="card-header-gradient" style={{ background: gradient }}>
        <i className={`bi ${tag || "bi-file-text"} header-icon`}></i>
      </div>

      <div className="card-body-custom">
        {category ? (
          <Link href={`/category/${category.slug}`} className="category-badge mb-3" style={{ color: category.color }}>
            <i className={`bi ${category.icon}`}></i>
            {category.name}
          </Link>
        ) : (
          <span className="badge-accent mb-3">مقاله</span>
        )}
        <h3 className="post-title">{title}</h3>
        <p className="post-excerpt">{excerpt}</p>

        <div className="post-meta">
          <span>
            <i className="bi bi-person me-1"></i>
            {author}
          </span>
          <span>
            <i className="bi bi-calendar me-1"></i>
            {date}
          </span>
        </div>

        <Link href={`/posts/${id}`} className="read-more">
          ادامه مطلب
          <i className="bi bi-arrow-left"></i>
        </Link>
      </div>
    </article>
  );
}