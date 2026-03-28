import { useState, useMemo } from 'react';
import ArticleCard from '../../components/ArticleCard/ArticleCard';
import EmptyState from '../../components/EmptyState/EmptyState';
import { mockArticles, categories } from '../../data/mockData';
import './SearchPage.css';

const SearchPage = () => {
    const [query, setQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const filteredArticles = useMemo(() => {
        let results = mockArticles;

        if (selectedCategory !== 'all') {
            results = results.filter((a) => a.category === selectedCategory);
        }

        if (query.trim()) {
            const q = query.toLowerCase();
            results = results.filter(
                (a) =>
                    a.title.toLowerCase().includes(q) ||
                    a.summary.toLowerCase().includes(q) ||
                    a.source.toLowerCase().includes(q) ||
                    (a.author && a.author.toLowerCase().includes(q))
            );
        }

        return results;
    }, [query, selectedCategory]);

    return (
        <div className="search-page container">
            <header className="search-page-header">
                <h1>🔎 Search Articles</h1>
                <p>Find exactly what you are looking for across all categories</p>
            </header>

            <div className="search-page-input-wrapper">
                <span className="search-page-icon">🔍</span>
                <input
                    type="text"
                    className="search-page-input"
                    placeholder="Search by title, topic, author, or source..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoFocus
                    aria-label="Search articles"
                />
            </div>

            <div className="search-filters">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        className={`search-filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(cat.id)}
                    >
                        {cat.icon} {cat.name}
                    </button>
                ))}
            </div>

            {(query.trim() || selectedCategory !== 'all') && (
                <p className="search-results-info">
                    Found <strong>{filteredArticles.length}</strong> article
                    {filteredArticles.length !== 1 ? 's' : ''}
                    {query.trim() && ` for "${query}"`}
                    {selectedCategory !== 'all' &&
                        ` in ${categories.find((c) => c.id === selectedCategory)?.name || selectedCategory}`}
                </p>
            )}

            {filteredArticles.length > 0 ? (
                <div className="article-grid">
                    {filteredArticles.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                </div>
            ) : (
                query.trim() || selectedCategory !== 'all' ? (
                    <div className="search-no-results-page">
                        <span>🔍</span>
                        <p>No articles found. Try a different search or category.</p>
                    </div>
                ) : (
                    <EmptyState message="Start typing to search articles..." />
                )
            )}
        </div>
    );
};

export default SearchPage;
