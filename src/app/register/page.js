"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (form.password !== form.confirmPassword) {
            setError("رمز عبور با تکرارش یکسان نیست");
            return;
        }

        if (form.password.length < 6) {
            setError("رمز عبور باید حداقل ۶ کاراکتر باشه");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    password: form.password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "خطا در ثبت‌نام");
            }

            // موفق - برو به لاگین
            router.push("/login");
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    }

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-icon">
                        <i className="bi bi-person-plus"></i>
                    </div>
                    <h1 className="auth-title">ساخت حساب جدید</h1>
                    <p className="auth-subtitle">به وبلاگ ما بپیوند!</p>
                </div>

                {error && (
                    <div className="form-error">
                        <i className="bi bi-exclamation-triangle"></i>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">نام</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="نام و نام خانوادگی"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">ایمیل</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">رمز عبور</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="حداقل ۶ کاراکتر"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">تکرار رمز عبور</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="دوباره رمز رو وارد کن"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-glow"
                        disabled={loading}
                        style={{ width: "100%", justifyContent: "center" }}
                    >
                        {loading ? (
                            <>
                                <i className="bi bi-hourglass-split"></i>
                                در حال ثبت‌نام...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-check-circle"></i>
                                ثبت‌نام
                            </>
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        حساب داری؟{" "}
                        <Link href="/login">وارد شو</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}