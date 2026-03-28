import { useParams } from 'react-router-dom';
import ArticleCard from '../../components/ArticleCard/ArticleCard';
import useNews from '../../hooks/useNews';
import Loader from '../../components/Loader/Loader';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import EmptyState from '../../components/EmptyState/EmptyState';
import { categories } from '../../data/mockData';
import './CategoryPage.css';

const CategoryPage = () => {
    const { categoryName } = useParams();
    const { news, loading, error, refetch } = useNews(categoryName);

    const categoryTitle = categories.find((c) => c.id === categoryName)?.name || 'News';

    if (loading) return <Loader message={`Loading ${categoryTitle} news...`} />;
    if (error) return <ErrorMessage message={error} onRetry={refetch} />;

    return (
        <div className="category-page container">
            <header className="category-header">
                <h1>{categoryTitle}</h1>
                <p>Latest updates and stories from the world of {categoryTitle.toLowerCase()}.</p>
            </header>

            {news.length > 0 ? (
                <div className="article-grid">
                    {news.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                </div>
            ) : (
                <EmptyState message={`No articles found in ${categoryTitle}.`} />
            )}
        </div>
    );
};

export default CategoryPage;
