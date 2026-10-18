"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const ICONS = [
    { value: "bi-file-text", label: "فایل" },
    { value: "bi-code-slash", label: "کد" },
    { value: "bi-rocket-takeoff", label: "راکت" },
    { value: "bi-palette", label: "پالت رنگ" },
    { value: "bi-cpu", label: "پردازنده" },
    { value: "bi-database", label: "دیتابیس" },
    { value: "bi-shield-lock", label: "امنیت" },
    { value: "bi-phone", label: "موبایل" },
    { value: "bi-camera", label: "دوربین" },
    { value: "bi-book", label: "کتاب" },
    { value: "bi-music-note-beamed", label: "موسیقی" },
    { value: "bi-play-circle", label: "ویدیو" },
];

export default function PostForm({ initialData = null, isEdit = false }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [categories, setCategories] = useState([]);

    const [form, setForm] = useState({
        title: initialData?.title || "",
        excerpt: initialData?.excerpt || "",
        content: initialData?.content || "",
        author: initialData?.author || "عدنان",
        date: initialData?.date || new Date().toLocaleDateString("fa-IR"),
        readTime: initialData?.readTime || "۳ دقیقه",
        tag: initialData?.tag || "bi-file-text",
        categoryId: initialData?.categoryId || "",
    });

    useEffect(() => {
        async function loadCategories() {
            try {
                const res = await fetch("/api/categories");
                if (res.ok) {
                    const data = await res.json();
                    setCategories(data);
                }
            } catch (error) {
                console.error("خطا در بارگذاری دسته‌بندی‌ها:", error);
            }
        }
        loadCategories();
    }, []);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (!form.title.trim()) {
            setError("عنوان اجباریه");
            return;
        }
        if (!form.content.trim()) {
            setError("محتوا اجباریه");
            return;
        }

        setLoading(true);

        try {
            const url = isEdit ? `/api/posts/${initialData.id}` : "/api/posts";
            const method = isEdit ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "خطا در ذخیره");
            }

            router.push("/admin/posts");
            router.refresh();
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

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">
                        عنوان <span className="required">*</span>
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="مثلاً: شروع یادگیری برنامه‌نویسی"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">نویسنده</label>
                    <input
                        type="text"
                        name="author"
                        value={form.author}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="نام نویسنده"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">دسته‌بندی</label>
                    <select
                        name="categoryId"
                        value={form.categoryId}
                        onChange={handleChange}
                        className="form-input"
                    >
                        <option value="">بدون دسته‌بندی</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">
                    خلاصه <span className="required">*</span>
                </label>
                <textarea
                    name="excerpt"
                    value={form.excerpt}
                    onChange={handleChange}
                    className="form-input form-textarea-sm"
                    placeholder="یه خلاصه کوتاه از پست..."
                    rows={2}
                />
                <small className="form-hint">
                    این متن توی کارت پست توی صفحه اصلی نشون داده می‌شه
                </small>
            </div>

            <div className="form-group">
                <label className="form-label">
                    محتوا <span className="required">*</span>
                </label>
                <textarea
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    className="form-input form-textarea"
                    placeholder="متن کامل پستت رو اینجا بنویس..."
                    rows={12}
                />
                <small className="form-hint">
                    با Enter می‌تونی پاراگراف جدید بسازی
                </small>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">تاریخ</label>
                    <input
                        type="text"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="۱۴۰۴/۰۱/۱۵"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">زمان مطالعه</label>
                    <input
                        type="text"
                        name="readTime"
                        value={form.readTime}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="۵ دقیقه"
                    />
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">آیکون پست</label>
                <div className="icon-picker">
                    {ICONS.map((icon) => (
                        <button
                            key={icon.value}
                            type="button"
                            onClick={() => setForm((prev) => ({ ...prev, tag: icon.value }))}
                            className={`icon-option ${form.tag === icon.value ? "active" : ""}`}
                            title={icon.label}
                        >
                            <i className={`bi ${icon.value}`}></i>
                        </button>
                    ))}
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
                            {isEdit ? "ذخیره تغییرات" : "ساخت پست"}
                        </>
                    )}
                </button>

                <button
                    type="button"
                    className="btn-glow-outline"
                    onClick={() => router.push("/admin/posts")}
                >
                    <i className="bi bi-x-lg"></i>
                    انصراف
                </button>
            </div>
        </form>
    );
}