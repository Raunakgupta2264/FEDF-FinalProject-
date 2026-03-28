import { createContext, useContext, useState, useCallback } from 'react';

const BookmarkContext = createContext();

export const useBookmarks = () => {
    const context = useContext(BookmarkContext);
    if (!context) throw new Error('useBookmarks must be used within BookmarkProvider');
    return context;
};

export const BookmarkProvider = ({ children }) => {
    const [bookmarks, setBookmarks] = useState(() => {
        try {
            const saved = localStorage.getItem('newsread-bookmarks');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const saveToStorage = (items) => {
        try {
            localStorage.setItem('newsread-bookmarks', JSON.stringify(items));
        } catch {
            // localStorage unavailable
        }
    };

    const toggleBookmark = useCallback((articleId) => {
        setBookmarks((prev) => {
            const next = prev.includes(articleId)
                ? prev.filter((id) => id !== articleId)
                : [...prev, articleId];
            saveToStorage(next);
            return next;
        });
    }, []);

    const isBookmarked = useCallback(
        (articleId) => bookmarks.includes(articleId),
        [bookmarks]
    );

    const clearAll = useCallback(() => {
        setBookmarks([]);
        saveToStorage([]);
    }, []);

    const exportBookmarks = useCallback(() => {
        return JSON.stringify(bookmarks, null, 2);
    }, [bookmarks]);

    return (
        <BookmarkContext.Provider value={{ bookmarks, toggleBookmark, isBookmarked, clearAll, exportBookmarks }}>
            {children}
        </BookmarkContext.Provider>
    );
};
