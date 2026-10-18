import Link from "next/link";

export const metadata = {
  title: "درباره من | محمد عدنان محمودی",
  description: "توسعه‌دهنده فول‌استک، عاشق تکنولوژی و ساخت محصولات دیجیتال",
};

export default function AboutPage() {
  const socials = [
    { name: "ایمیل", icon: "bi-envelope-fill", url: "mailto:adnan.mahmoudi90@gmail.com", className: "social-email" },
    { name: "GitHub", icon: "bi-github", url: "https://github.com/adnan12387", className: "social-github" },
    { name: "تلگرام", icon: "bi-telegram", url: "https://t.me/Adnanmdi", className: "social-telegram" },
    { name: "اینستاگرام", icon: "bi-instagram", url: "https://instagram.com/adnan.mdi", className: "social-instagram" },
  ];

  const skills = [
    { name: "JavaScript / TypeScript", icon: "bi-filetype-js" },
    { name: "React / Next.js", icon: "bi-atom" },
    { name: "Node.js / Express", icon: "bi-server" },
    { name: "AWS / Vercel", icon: "bi-cloud" },
    { name: "PostgreSQL / MongoDB", icon: "bi-database" },
    { name: "Git / GitHub", icon: "bi-git" },
  ];

  return (
    <div className="container py-5 about-page">
      <Link href="/" className="back-link mb-4 d-inline-flex">
        <i className="bi bi-arrow-right me-2"></i>
        بازگشت به خانه
      </Link>

      {/* هدر پروفایل */}
      <div className="about-hero">
        <div className="about-avatar-wrap">
          <div className="about-avatar">
            <img src="/avatar.jpg" alt="محمد عدنان محمودی" />
          </div>
        </div>
        <h1 className="about-name">محمد عدنان محمودی</h1>
        <p className="about-title">توسعه‌دهنده فول‌استک | عاشق تکنولوژی</p>
        <p className="about-bio">
          من یک توسعه‌دهنده فول‌استک هستم که عاشق ساختن محصولات دیجیتال با کیفیت بالا هستم.
          با بیش از چند سال تجربه در توسعه وب، تخصص من در ساختن اپلیکیشن‌های مدرن و مقیاس‌پذیر است.
        </p>
      </div>

      {/* مهارت‌ها */}
      <div className="about-section">
        <h2 className="about-section-title">
          <i className="bi bi-code-slash"></i>
          مهارت‌ها
        </h2>
        <div className="skills-grid">
          {skills.map((skill) => (
            <div key={skill.name} className="skill-card">
              <i className={`bi ${skill.icon}`}></i>
              <span>{skill.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* تجربه‌ها */}
      <div className="about-section">
        <h2 className="about-section-title">
          <i className="bi bi-briefcase"></i>
          تجربه
        </h2>
        <div className="timeline">
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <span className="timeline-date">۲۰۲۲ - تاکنون</span>
              <h3 className="timeline-title">Senior Developer</h3>
              <p className="timeline-company">Tech Company</p>
              <p className="timeline-desc">
                هبری تیم توسعه و ساخت اپلیکیشن‌های مقیاس‌پذیر با استفاده از تکنولوژی‌های مدرن
              </p>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <span className="timeline-date">۲۰۲۰ - ۲۰۲۲</span>
              <h3 className="timeline-title">Full Stack Developer</h3>
              <p className="timeline-company">Startup</p>
              <p className="timeline-desc">
                توسعه وب‌اپلیکیشن‌ها و سرویس‌های بک‌اند برای استارتاپ
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* تماس و شبکه‌های اجتماعی */}
      <div className="about-section">
        <h2 className="about-section-title">
          <i className="bi bi-link-45deg"></i>
          ارتباط با من
        </h2>
        <div className="social-grid">
          {socials.map((social) => (
            <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className={`social-card ${social.className}`}>
              <i className={`bi ${social.icon}`}></i>
              <span>{social.name}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}