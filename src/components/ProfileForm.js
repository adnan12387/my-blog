"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfileForm({ initialData }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [form, setForm] = useState({
        name: initialData?.name || "",
        bio: initialData?.bio || "",
        avatar: initialData?.avatar || "",
        github: initialData?.github || "",
        twitter: initialData?.twitter || "",
        linkedin: initialData?.linkedin || "",
        website: initialData?.website || "",
    });

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!form.name.trim()) {
            setError("نام اجباریه");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/update-profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "خطا در ذخیره");
            }

            setSuccess("پروفایل با موفقیت ذخیره شد!");
            router.refresh();

            setTimeout(() => {
                router.push("/profile");
            }, 1200);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="admin-form">
            {error && (
                <div className="form-error">
                    <i className="bi bi-exclamation-triangle"></i>
                    {error}
                </div>
            )}

            {success && (
                <div className="form-success">
                    <i className="bi bi-check-circle"></i>
                    {success}
                </div>
            )}

            {/* پیش‌نمایش آواتار */}
            <div className="form-group text-center">
                <div className="avatar-preview">
                    {form.avatar ? (
                        <img src={form.avatar} alt="آواتار" />
                    ) : (
                        <i className="bi bi-person-fill"></i>
                    )}
                </div>
                <small className="form-hint">پیش‌نمایش عکس پروفایل</small>
            </div>

            <div className="form-group">
                <label className="form-label">
                    نام <span className="required">*</span>
                </label>
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="نام و نام خانوادگی"
                />
            </div>

            <div className="form-group">
                <label className="form-label">آدرس عکس پروفایل</label>
                <input
                    type="url"
                    name="avatar"
                    value={form.avatar}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="https://example.com/avatar.jpg"
                    dir="ltr"
                />
                <small className="form-hint">
                    یه لینک عکس از اینترنت بذار (مثلاً از imgur یا github)
                </small>
            </div>

            <div className="form-group">
                <label className="form-label">درباره من</label>
                <textarea
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    className="form-input form-textarea-sm"
                    placeholder="یه توضیح کوتاه درباره خودت..."
                    rows={3}
                />
            </div>

            <h3 className="form-section-title">
                <i className="bi bi-link-45deg"></i>
                شبکه‌های اجتماعی
            </h3>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">
                        <i className="bi bi-github me-1"></i>
                        GitHub
                    </label>
                    <input
                        type="url"
                        name="github"
                        value={form.github}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="https://github.com/username"
                        dir="ltr"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">
                        <i className="bi bi-twitter-x me-1"></i>
                        Twitter / X
                    </label>
                    <input
                        type="url"
                        name="twitter"
                        value={form.twitter}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="https://twitter.com/username"
                        dir="ltr"
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">
                        <i className="bi bi-linkedin me-1"></i>
                        LinkedIn
                    </label>
                    <input
                        type="url"
                        name="linkedin"
                        value={form.linkedin}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="https://linkedin.com/in/username"
                        dir="ltr"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">
                        <i className="bi bi-globe me-1"></i>
                        وب‌سایت
                    </label>
                    <input
                        type="url"
                        name="website"
                        value={form.website}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="https://mywebsite.com"
                        dir="ltr"
                    />
                </div>
            </div>

            <div className="form-actions">
                <button type="submit" className="btn-glow" disabled={loading}>
                    {loading ? (
                        <>
                            <i className="bi bi-hourglass-split"></i>
                            در حال ذخیره...
                        </>
                    ) : (
                        <>
                            <i className="bi bi-check-lg"></i>
                            ذخیره تغییرات
                        </>
                    )}
                </button>

                <button
                    type="button"
                    className="btn-glow-outline"
                    onClick={() => router.push("/profile")}
                >
                    <i className="bi bi-x-lg"></i>
                    انصراف
                </button>
            </div>
        </form>
    );
}