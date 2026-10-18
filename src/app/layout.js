import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";
import { getCurrentUser } from "@/lib/getUser";
import Header from "@/components/Header";

export const metadata = {
  title: "وبلاگ شخصی من",
  description: "وبلاگ شخصی - نوشته‌ها و تجربه‌های من",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }) {
  const user = await getCurrentUser();

  return (
    <html lang="fa" dir="rtl">
      <body>
        <Header user={user} />
        <main>{children}</main>
        <footer className="site-footer">
          <div className="container">
            <p className="mb-0">
              Built with <i className="bi bi-heart-fill text-danger"></i> by Adnan MDI
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}