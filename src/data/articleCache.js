/**
 * Simple in-memory article cache.
 * useNews stores fetched articles here so useArticle can look them up by id.
 */
let articleCache = [];

export const setArticleCache = (articles) => {
    articleCache = articles;
};

export const getArticleById = (id) => {
    return articleCache.find((a) => a.id === id) || null;
};

export const getArticleCache = () => articleCache;
