"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ICONS = [
    { value: "bi-folder", label: "پوشه" },
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
    { value: "bi-gear", label: "تنظیمات" },
    { value: "bi-lightbulb", label: "ایده" },
    { value: "bi-star", label: "ستاره" },
];

const COLORS = [
    "#7c5cff",
    "#ff5c9d",
    "#00c9ff",
    "#92fe9d",
    "#f857a6",
    "#ff5858",
    "#667eea",
    "#764ba2",
    "#f093fb",
    "#f5576c",
    "#4facfe",
    "#00f2fe",
    "#fa709a",
    "#fee140",
    "#30cfd0",
];

export default function CategoryForm({ initialData = null, isEdit = false }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        name: initialData?.name || "",
        slug: initialData?.slug || "",
        color: initialData?.color || "#7c5cff",
        icon: initialData?.icon || "bi-folder",
    });

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    function generateSlug(name) {
        const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim();
        setForm((prev) => ({ ...prev, slug }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (!form.name.trim()) {
            setError("نام اجباریه");
            return;
        }
        if (!form.slug.trim()) {
            setError("Slug اجباریه");
            return;
        }

        setLoading(true);

        try {
            const url = isEdit
                ? `/api/categories/${initialData.id}`
                : "/api/categories";
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

            router.push("/admin/categories");
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
                        نام دسته‌بندی <span className="required">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={(e) => {
                            handleChange(e);
                            if (!isEdit) generateSlug(e.target.value);
                        }}
                        className="form-input"
                        placeholder="مثلاً: برنامه‌نویسی"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">
                        Slug <span className="required">*</span>
                    </label>
                    <input
                        type="text"
                        name="slug"
                        value={form.slug}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="مثلاً: programming"
                        dir="ltr"
                    />
                    <small className="form-hint">
                        Slug توی URL استفاده می‌شه (فقط حروف انگلیسی، عدد و خط تیره)
                    </small>
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">آیکون</label>
                <div className="icon-picker">
                    {ICONS.map((icon) => (
                        <button
                            key={icon.value}
                            type="button"
                            onClick={() => setForm((prev) => ({ ...prev, icon: icon.value }))}
                            className={`icon-option ${form.icon === icon.value ? "active" : ""}`}
                            title={icon.label}
                        >
                            <i className={`bi ${icon.value}`}></i>
                        </button>
                    ))}
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">رنگ</label>
                <div className="color-picker">
                    {COLORS.map((color) => (
                        <button
                            key={color}
                            type="button"
                            onClick={() => setForm((prev) => ({ ...prev, color }))}
                            className={`color-option ${form.color === color ? "active" : ""}`}
                            style={{ background: color }}
                            title={color}
                        />
                    ))}
                </div>
                <div className="color-preview-wrapper">
                    <span>رنگ انتخاب شده:</span>
                    <div
                        className="color-preview-large"
                        style={{ background: form.color }}
                    >
                        <i className={`bi ${form.icon}`}></i>
                    </div>
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
                            {isEdit ? "ذخیره تغییرات" : "ساخت دسته‌بندی"}
                        </>
                    )}
                </button>

                <button
                    type="button"
                    className="btn-glow-outline"
                    onClick={() => router.push("/admin/categories")}
                >
                    <i className="bi bi-x-lg"></i>
                    انصراف
                </button>
            </div>
        </form>
    );
}
