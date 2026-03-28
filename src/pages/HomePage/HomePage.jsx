import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ArticleCard from '../../components/ArticleCard/ArticleCard';
import useNews from '../../hooks/useNews';
import SkeletonLoader from '../../components/SkeletonLoader/SkeletonLoader';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import { categories } from '../../data/mockData';
import { useReadingHistory } from '../../context/ReadingHistoryContext';
import { mockArticles } from '../../data/mockData';
import './HomePage.css';

/* ── Scroll-triggered animation hook ── */
const useScrollAnimation = () => {
    const ref = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            const elements = ref.current?.querySelectorAll('.animate-on-scroll');
            if (!elements?.length) return;

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('is-visible');
                        }
                    });
                },
                { threshold: 0.05, rootMargin: '50px 0px 0px 0px' }
            );

            elements.forEach((el) => {
                el.classList.add('scroll-observed');
                observer.observe(el);
            });

            return () => observer.disconnect();
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    return ref;
};

const HomePage = () => {
    const { news, loading, error, refetch } = useNews('all');
    const [animateHero, setAnimateHero] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);
    const { history, isRead } = useReadingHistory();
    const pageRef = useScrollAnimation();

    useEffect(() => {
        const timer = setTimeout(() => setAnimateHero(true), 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!loading && news.length > 0) {
            setLastUpdated(new Date());
        }
    }, [loading, news]);

    if (loading) return (
        <div className="home-page">
            <section className="hero-section hero-visible">
                <div className="hero-bg-shapes">
                    <div className="hero-shape hero-shape-1"></div>
                    <div className="hero-shape hero-shape-2"></div>
                    <div className="hero-shape hero-shape-3"></div>
                </div>
                <div className="container hero-content" style={{ opacity: 1, transform: 'none' }}>
                    <span className="hero-badge">⚡ Your Trusted News Source</span>
                    <h1 className="hero-title">
                        Stay Informed,<br />
                        <span className="hero-gradient-text">Stay Ahead</span>
                    </h1>
                    <p className="hero-subtitle">
                        Curated news from around the world, powered by intelligent insights
                        and personalized reading experiences.
                    </p>
                </div>
            </section>
            <div className="container">
                <section className="featured-section">
                    <div className="section-header">
                        <h2>🔥 Featured Stories</h2>
                        <p className="section-subtitle">Top picks curated just for you</p>
                    </div>
                    <SkeletonLoader count={3} />
                </section>
            </div>
        </div>
    );

    if (error) return <ErrorMessage message={error} onRetry={refetch} />;

    const featuredNews = news.slice(0, 3);
    const latestNews = news.slice(3, 9);

    // Recently read articles
    const recentlyRead = history
        .slice(0, 4)
        .map((item) => mockArticles.find((a) => a.id === item.id))
        .filter(Boolean);

    return (
        <div className="home-page page-transition-enter" ref={pageRef}>
            {/* ── Hero Section ── */}
            <section className={`hero-section ${animateHero ? 'hero-visible' : ''}`}>
                <div className="hero-bg-shapes">
                    <div className="hero-shape hero-shape-1"></div>
                    <div className="hero-shape hero-shape-2"></div>
                    <div className="hero-shape hero-shape-3"></div>
                </div>
                <div className="container hero-content">
                    <span className="hero-badge">⚡ Your Trusted News Source</span>
                    <h1 className="hero-title">
                        Stay Informed,<br />
                        <span className="hero-gradient-text">Stay Ahead</span>
                    </h1>
                    <p className="hero-subtitle">
                        Curated news from around the world, powered by intelligent insights
                        and personalized reading experiences.
                    </p>
                    <div className="hero-stats">
                        <div className="hero-stat">
                            <span className="hero-stat-number">{news.length}+</span>
                            <span className="hero-stat-label">Articles</span>
                        </div>
                        <div className="hero-stat">
                            <span className="hero-stat-number">{categories.length - 1}</span>
                            <span className="hero-stat-label">Categories</span>
                        </div>
                        <div className="hero-stat">
                            <span className="hero-stat-number">
                                {lastUpdated
                                    ? lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                    : '—'}
                            </span>
                            <span className="hero-stat-label">Last Updated</span>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container">
                {/* ── Featured Stories ── */}
                <section className="featured-section animate-on-scroll">
                    <div className="section-header">
                        <h2>🔥 Featured Stories</h2>
                        <p className="section-subtitle">Top picks curated just for you</p>
                    </div>
                    <div className="article-grid featured-grid">
                        {featuredNews.map((article) => (
                            <ArticleCard key={article.id} article={article} featured />
                        ))}
                    </div>
                </section>

                {/* ── Category Chips ── */}
                <section className="categories-section animate-on-scroll">
                    <div className="section-header">
                        <h2>📂 Explore Categories</h2>
                        <p className="section-subtitle">Discover news by topic</p>
                    </div>
                    <div className="category-chips">
                        {categories.slice(1).map((cat) => (
                            <Link key={cat.id} to={`/category/${cat.id}`} className={`category-chip category-chip--${cat.id}`}>
                                <span className="chip-icon">{cat.icon}</span>
                                <span>{cat.name}</span>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* ── Recently Read ── */}
                {recentlyRead.length > 0 && (
                    <section className="recently-read-section animate-on-scroll">
                        <div className="section-header">
                            <h2>📖 Continue Reading</h2>
                            <p className="section-subtitle">Pick up where you left off</p>
                        </div>
                        <div className="article-grid">
                            {recentlyRead.map((article) => (
                                <ArticleCard key={article.id} article={article} />
                            ))}
                        </div>
                    </section>
                )}

                {/* ── Latest News ── */}
                {latestNews.length > 0 && (
                    <section className="latest-section animate-on-scroll">
                        <div className="section-header">
                            <h2>📰 Latest News</h2>
                            <p className="section-subtitle">Fresh updates from around the globe</p>
                        </div>
                        <div className="article-grid">
                            {latestNews.map((article) => (
                                <ArticleCard key={article.id} article={article} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default HomePage;
