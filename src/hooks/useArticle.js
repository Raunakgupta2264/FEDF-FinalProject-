import { useState, useEffect, useCallback } from 'react';
import { getArticleById } from '../data/articleCache';
import { mockArticles } from '../data/mockData';

const useArticle = (articleId) => {
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchArticle = useCallback(async () => {
        if (!articleId) return;

        setLoading(true);
        setError(null);
        try {
            // Small delay for UX consistency
            await new Promise((resolve) => setTimeout(resolve, 300));

            // Try the live article cache first (populated by useNews)
            let foundArticle = getArticleById(articleId);

            // Fallback to mock data
            if (!foundArticle) {
                foundArticle = mockArticles.find((a) => a.id === articleId);
            }

            if (!foundArticle) {
                throw new Error('Article not found');
            }

            setArticle(foundArticle);
        } catch (err) {
            setError(err.message || 'Failed to fetch article');
        } finally {
            setLoading(false);
        }
    }, [articleId]);

    useEffect(() => {
        fetchArticle();
    }, [fetchArticle]);

    return { article, loading, error, refetch: fetchArticle };
};

export default useArticle;
