import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useArticle from '../../hooks/useArticle';
import Loader from '../../components/Loader/Loader';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import { useBookmarks } from '../../context/BookmarkContext';
import { useReadingHistory } from '../../context/ReadingHistoryContext';
import { useToast } from '../../components/Toast/ToastContext';
import ReadingProgressBar from '../../components/ReadingProgressBar/ReadingProgressBar';
import RelatedArticles from '../../components/RelatedArticles/RelatedArticles';
import ShareModal from '../../components/ShareModal/ShareModal';
import './ArticleReader.css';

const ArticleReader = () => {
    const { articleId } = useParams();
    const { article, loading, error, refetch } = useArticle(articleId);
    const { toggleBookmark, isBookmarked } = useBookmarks();
    const { markAsRead } = useReadingHistory();
    const toast = useToast();
    const [showShareModal, setShowShareModal] = useState(false);

    // Mark article as read when loaded
    useEffect(() => {
        if (article) {
            markAsRead(article.id);
        }
    }, [article, markAsRead]);

    const handleBookmarkToggle = () => {
        toggleBookmark(article.id);
        if (isBookmarked(article.id)) {
            toast.info('Removed from saved articles');
        } else {
            toast.success('Article saved to bookmarks!');
        }
    };

    if (loading) return <Loader message="Loading article..." />;
    if (error) return <ErrorMessage message={error} onRetry={refetch} />;
    if (!article) return <ErrorMessage message="Article not found" onRetry={refetch} />;

    const bookmarked = isBookmarked(article.id);

    return (
        <>
            <ReadingProgressBar />
            <article className="article-reader container page-transition-enter">
                <header className="reader-header">
                    <Link to={`/category/${article.category}`} className={`reader-category cat-badge-${article.category}`}>
                        {article.category}
                    </Link>
                    <h1 className="reader-title">{article.title}</h1>
                    <div className="reader-meta">
                        <span className="reader-source">
                            {article.author ? `By ${article.author}` : article.source}
                        </span>
                        <span className="reader-date">
                            {new Date(article.publishedAt).toLocaleDateString(undefined, {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </span>
                        {article.readingTime && (
                            <span className="reader-reading-time">⏱ {article.readingTime} min read</span>
                        )}
                    </div>
                    <div className="reader-actions">
                        <button
                            className={`reader-action-btn ${bookmarked ? 'bookmarked' : ''}`}
                            onClick={handleBookmarkToggle}
                        >
                            {bookmarked ? '★ Saved' : '☆ Save'}
                        </button>
                        <button className="reader-action-btn" onClick={() => setShowShareModal(true)}>
                            📤 Share
                        </button>
                    </div>
                </header>

                <div className="reader-image">
                    <img src={article.imageUrl} alt={article.title} />
                </div>

                <div className="reader-content">
                    <p className="reader-summary">{article.summary}</p>
                    <div className="reader-body">
                        {article.content.split('\n\n').map((paragraph, index) => (
                            <p key={index} className={index === 0 ? 'reader-first-paragraph' : ''}>
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </div>

                <div className="reader-footer">
                    <Link to="/" className="back-link">← Back to Home</Link>
                    <span className="reader-footer-source">Published by {article.source}</span>
                </div>

                <RelatedArticles currentArticleId={article.id} category={article.category} />
            </article>

            {showShareModal && (
                <ShareModal article={article} onClose={() => setShowShareModal(false)} />
            )}
        </>
    );
};

export default ArticleReader;
