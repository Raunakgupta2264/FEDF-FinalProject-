import { Link } from 'react-router-dom';
import { mockArticles } from '../../data/mockData';
import './RelatedArticles.css';

const RelatedArticles = ({ currentArticleId, category }) => {
    const related = mockArticles
        .filter((a) => a.id !== currentArticleId && a.category === category)
        .slice(0, 4);

    // If not enough from same category, fill with other articles
    if (related.length < 3) {
        const extras = mockArticles
            .filter((a) => a.id !== currentArticleId && !related.find((r) => r.id === a.id))
            .slice(0, 4 - related.length);
        related.push(...extras);
    }

    if (related.length === 0) return null;

    return (
        <section className="related-articles">
            <div className="section-header">
                <h2>📖 Related Articles</h2>
                <p className="section-subtitle">More stories you might enjoy</p>
            </div>
            <div className="related-grid">
                {related.map((article) => (
                    <Link
                        key={article.id}
                        to={`/article/${article.id}`}
                        className="related-card"
                    >
                        <div className="related-card-image">
                            <img src={article.imageUrl} alt={article.title} loading="lazy" />
                        </div>
                        <div className="related-card-content">
                            <span className="related-card-category">{article.category}</span>
                            <span className="related-card-title">{article.title}</span>
                            <span className="related-card-meta">
                                {article.source} · {article.readingTime} min read
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default RelatedArticles;
