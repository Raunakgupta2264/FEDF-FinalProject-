import { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useBookmarks } from '../../context/BookmarkContext';
import { useReadingHistory } from '../../context/ReadingHistoryContext';
import './ArticleCard.css';

const categoryColorMap = {
    technology: 'var(--cat-technology)',
    business: 'var(--cat-business)',
    health: 'var(--cat-health)',
    science: 'var(--cat-science)',
    sports: 'var(--cat-sports)',
    entertainment: 'var(--cat-entertainment)',
};

const ArticleCard = memo(({ article, featured = false }) => {
    const [imgError, setImgError] = useState(false);
    const { toggleBookmark, isBookmarked } = useBookmarks();
    const { isRead } = useReadingHistory();
    const bookmarked = isBookmarked(article.id);
    const read = isRead(article.id);

    const handleImageError = () => setImgError(true);
    const catColor = categoryColorMap[article.category] || 'var(--category-accent)';

    return (
        <article className={`article-card ${featured ? 'article-card--featured' : ''} animate-child`}>
            <div className="article-image">
                {!imgError ? (
                    <img
                        src={article.imageUrl}
                        alt={article.title}
                        loading="lazy"
                        onError={handleImageError}
                    />
                ) : (
                    <div className="article-image-fallback">
                        <span className="fallback-icon">📰</span>
                    </div>
                )}
                {/* Image hover overlay */}
                <div className="article-image-overlay">
                    <span className="overlay-category" style={{ background: catColor }}>
                        {article.category}
                    </span>
                    <Link to={`/article/${article.id}`} className="overlay-read-btn">
                        Read Article →
                    </Link>
                </div>
                {article.trending && (
                    <span className="trending-badge">🔥 Trending</span>
                )}
                {read && (
                    <span className="article-read-indicator">✓ Read</span>
                )}
                <button
                    className={`bookmark-btn ${bookmarked ? 'bookmarked' : ''}`}
                    onClick={(e) => {
                        e.preventDefault();
                        toggleBookmark(article.id);
                    }}
                    aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark article'}
                    title={bookmarked ? 'Remove bookmark' : 'Save article'}
                >
                    {bookmarked ? '★' : '☆'}
                </button>
            </div>
            <div className="article-content">
                <div className="article-content-top">
                    <span className="article-category" style={{ color: catColor }}>
                        {article.category}
                    </span>
                    {article.readingTime && (
                        <span className="article-reading-time">⏱ {article.readingTime} min read</span>
                    )}
                </div>
                <h3 className="article-title">
                    <Link to={`/article/${article.id}`}>{article.title}</Link>
                </h3>
                <p className="article-summary">{article.summary}</p>
                <div className="article-footer">
                    <div className="article-meta">
                        <span className="article-source">{article.source}</span>
                        <time dateTime={article.publishedAt}>
                            {new Date(article.publishedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                            })}
                        </time>
                    </div>
                    <Link to={`/article/${article.id}`} className="read-more">
                        Read More →
                    </Link>
                </div>
            </div>
        </article>
    );
});

ArticleCard.propTypes = {
    article: PropTypes.shape({
        id: PropTypes.string.isRequired,
        imageUrl: PropTypes.string,
        category: PropTypes.string,
        title: PropTypes.string.isRequired,
        summary: PropTypes.string,
        source: PropTypes.string,
        publishedAt: PropTypes.string,
        readingTime: PropTypes.number,
        trending: PropTypes.bool,
    }).isRequired,
    featured: PropTypes.bool,
};

ArticleCard.displayName = 'ArticleCard';

export default ArticleCard;
