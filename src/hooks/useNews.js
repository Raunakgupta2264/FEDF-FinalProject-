import { useState, useEffect, useCallback } from 'react';
import { mockArticles } from '../data/mockData';
import { setArticleCache } from '../data/articleCache';

const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2';

/**
 * Normalize a NewsAPI article into the shape our components expect.
 * Falls back gracefully when fields are missing.
 */
const normalizeArticle = (raw, index) => ({
    id: String(index + 1),
    title: raw.title || 'Untitled',
    summary: raw.description || raw.title || '',
    content: raw.content || raw.description || '',
    category: '', // NewsAPI top-headlines doesn't return category per article
    source: raw.source?.name || 'Unknown',
    author: raw.author || '',
    publishedAt: raw.publishedAt || new Date().toISOString(),
    readingTime: Math.max(2, Math.ceil((raw.content?.length || 500) / 1000)),
    imageUrl: raw.urlToImage || 'https://images.unsplash.com/photo-1504711434969-e33886168d5c?w=600&h=400&fit=crop',
    trending: index < 3, // Mark top 3 articles as trending
    url: raw.url || '#',
});

const useNews = (category = 'all') => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchNews = useCallback(async () => {
        setLoading(true);
        setError(null);

        // ── Fallback to mock data if API key is not configured ──
        if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
            console.warn('⚠️ VITE_NEWS_API_KEY is not set. Using mock data.');
            let filteredNews = mockArticles;
            if (category && category !== 'all') {
                filteredNews = mockArticles.filter(
                    (article) => article.category === category.toLowerCase()
                );
            }
            setNews(filteredNews);
            setArticleCache(filteredNews);
            setLoading(false);
            return;
        }

        // ── Fetch from NewsAPI ──
        try {
            const endpoint =
                category === 'all'
                    ? `${BASE_URL}/top-headlines?country=us&apiKey=${API_KEY}`
                    : `${BASE_URL}/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`;

            console.log('📡 Fetching news from:', endpoint.replace(API_KEY, '***'));

            const response = await fetch(endpoint);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message || `API Error: ${response.status} ${response.statusText}`
                );
            }

            const data = await response.json();

            if (data.status !== 'ok') {
                throw new Error(data.message || 'NewsAPI returned an error');
            }

            // Filter out articles with "[Removed]" title (NewsAPI sometimes returns these)
            const validArticles = (data.articles || []).filter(
                (a) => a.title && a.title !== '[Removed]'
            );

            const normalized = validArticles.map(normalizeArticle);
            setNews(normalized);
            setArticleCache(normalized);
        } catch (err) {
            console.error('❌ News fetch error:', err.message);
            setError(err.message || 'Failed to fetch news');
        } finally {
            setLoading(false);
        }
    }, [category]);

    useEffect(() => {
        fetchNews();
    }, [fetchNews]);

    return { news, loading, error, refetch: fetchNews };
};

export default useNews;
