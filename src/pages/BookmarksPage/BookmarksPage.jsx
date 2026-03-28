import ArticleCard from '../../components/ArticleCard/ArticleCard';
import EmptyState from '../../components/EmptyState/EmptyState';
import { useBookmarks } from '../../context/BookmarkContext';
import { mockArticles } from '../../data/mockData';
import './BookmarksPage.css';

const BookmarksPage = () => {
    const { bookmarks } = useBookmarks();
    const savedArticles = mockArticles.filter((a) => bookmarks.includes(a.id));

    return (
        <div className="bookmarks-page container">
            <header className="bookmarks-header">
                <h1>★ Saved Articles</h1>
                <p>
                    {savedArticles.length > 0
                        ? `You have ${savedArticles.length} saved article${savedArticles.length > 1 ? 's' : ''}`
                        : 'Your reading list is empty'}
                </p>
            </header>

            {savedArticles.length > 0 ? (
                <div className="article-grid">
                    {savedArticles.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                </div>
            ) : (
                <EmptyState message="No saved articles yet. Click the ☆ icon on any article to save it here!" />
            )}
        </div>
    );
};

export default BookmarksPage;
