import { Link } from 'react-router-dom';
import { mockArticles } from '../../data/mockData';
import './NewsTicker.css';

const NewsTicker = () => {
    const trendingArticles = mockArticles.filter((a) => a.trending);
    const allHeadlines = [...trendingArticles, ...mockArticles.slice(0, 5)];

    // Duplicate for seamless loop
    const items = [...allHeadlines, ...allHeadlines];

    return (
        <div className="news-ticker">
            <div className="ticker-inner ticker-pause">
                <span className="ticker-label">🔴 Trending</span>
                <div className="ticker-track">
                    <div
                        className="ticker-content"
                        style={{ '--ticker-speed': `${items.length * 4}s` }}
                    >
                        {items.map((article, i) => (
                            <Link
                                key={`${article.id}-${i}`}
                                to={`/article/${article.id}`}
                                className="ticker-item"
                            >
                                <span className="ticker-dot" />
                                {article.title}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsTicker;
