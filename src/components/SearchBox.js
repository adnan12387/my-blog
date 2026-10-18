"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function SearchBox() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);
    const boxRef = useRef(null);

    // فوکوس روی input وقتی باز شد
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // بستن با کلیک بیرون
    useEffect(() => {
        function handleClickOutside(e) {
            if (boxRef.current && !boxRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // بستن با ESC
    useEffect(() => {
        function handleEsc(e) {
            if (e.key === "Escape") setIsOpen(false);
        }
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, []);

    // جستجو با تاخیر
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                if (res.ok) {
                    const data = await res.json();
                    setResults(data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    function handleSubmit(e) {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
            setIsOpen(false);
            setQuery("");
            setResults([]);
        }
    }

    return (
        <div className="search-box-wrap" ref={boxRef}>
            <button
                className="search-toggle-btn"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="جستجو"
            >
                <i className={`bi ${isOpen ? "bi-x-lg" : "bi-search"}`}></i>
            </button>

            {isOpen && (
                <div className="search-panel">
                    <form onSubmit={handleSubmit}>
                        <div className="search-input-wrap">
                            <i className="bi bi-search"></i>
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="جستجو در پست‌ها..."
                                className="search-input"
                            />
                            {query && (
                                <button
                                    type="button"
                                    onClick={() => setQuery("")}
                                    className="search-clear"
                                >
                                    <i className="bi bi-x"></i>
                                </button>
                            )}
                        </div>
                    </form>

                    {/* نتایج زنده */}
                    {query.trim() && (
                        <div className="search-results">
                            {loading ? (
                                <div className="search-loading">
                                    <i className="bi bi-hourglass-split"></i>
                                    در حال جستجو...
                                </div>
                            ) : results.length === 0 ? (
                                <div className="search-empty">
                                    <i className="bi bi-emoji-frown"></i>
                                    نتیجه‌ای پیدا نشد
                                </div>
                            ) : (
                                <>
                                    {results.map((post) => (
                                        <a
                                            key={post.id}
                                            href={`/posts/${post.id}`}
                                            className="search-result-item"
                                            onClick={() => {
                                                setIsOpen(false);
                                                setQuery("");
                                                setResults([]);
                                            }}
                                        >
                                            <i className={`bi ${post.tag}`}></i>
                                            <div>
                                                <div className="search-result-title">{post.title}</div>
                                                <div className="search-result-excerpt">
                                                    {post.excerpt}
                                                </div>
                                            </div>
                                        </a>
                                    ))}
                                    <button
                                        type="button"
                                        className="search-view-all"
                                        onClick={handleSubmit}
                                    >
                                        مشاهده همه نتایج
                                        <i className="bi bi-arrow-left"></i>
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}