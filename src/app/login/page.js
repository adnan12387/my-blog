"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "خطا در ورود");
            }

            // موفق - برو به صفحه اصلی
            router.push("/");
            router.refresh();
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
                        <i className="bi bi-box-arrow-in-left"></i>
                    </div>
                    <h1 className="auth-title">ورود به حساب</h1>
                    <p className="auth-subtitle">خوش برگشتی! لطفاً وارد شو.</p>
                </div>

                {error && (
                    <div className="form-error">
                        <i className="bi bi-exclamation-triangle"></i>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
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
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-glow w-100"
                        disabled={loading}
                        style={{ width: "100%", justifyContent: "center" }}
                    >
                        {loading ? (
                            <>
                                <i className="bi bi-hourglass-split"></i>
                                در حال ورود...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-box-arrow-in-left"></i>
                                ورود
                            </>
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        حساب نداری؟{" "}
                        <Link href="/register">ثبت‌نام کن</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}