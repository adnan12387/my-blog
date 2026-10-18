"use client";

import { useState, useEffect } from "react";

const SLIDES = [
    {
    image: "/slide1.jpg",
    gradient: "linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.3))",
    },
    {
    image: "/slide2.jpg",
    gradient: "linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.3))",
    },
    {
    image: "/slide3.jpg",
    gradient: "linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.3))",
    },
];

export default function HeroSlider() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % SLIDES.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="hero-slider-wrap">
            {SLIDES.map((slide, index) => (
                <div
                    key={index}
                    className={`hero-slide ${index === current ? "active" : ""}`}
                    style={{
                        backgroundImage: `${slide.gradient}, url('${slide.image}')`,
                    }}
                />
            ))}

            <div className="hero-overlay" />

            <div className="hero-content">
                <span className="badge-accent mb-4 d-inline-block">
                    <i className="bi bi-stars me-1"></i>
                    به وبلاگ من خوش آمدید
                </span>

                <h1 className="hero-title mb-4">
                    اینجا می‌نویسم از
                    <br />
                    <span className="gradient-text">دنیای کد و برنامه‌نویسی</span>
                </h1>

                <p className="hero-description">
                    تجربه‌ها، یادداشت‌ها و چیزهایی که هر روز یاد می‌گیرم رو با تو به اشتراک می‌ذارم.
                </p>

                <a href="#posts" className="btn-glow">
                    <i className="bi bi-arrow-down-circle"></i>
                    شروع به خوندن
                </a>
            </div>


        </section>
    );
}