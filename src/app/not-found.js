import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container">
      <div className="not-found-wrap">
        <div className="not-found-code">۴۰۴</div>
        <h2 className="mt-4 mb-3">صفحه‌ای که دنبالش بودی پیدا نشد 😕</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
          شاید آدرس اشتباهه یا پست حذف شده.
        </p>
        <Link href="/" className="btn-glow">
          <i className="bi bi-house"></i>
          بازگشت به خانه
        </Link>
      </div>
    </div>
  );
}