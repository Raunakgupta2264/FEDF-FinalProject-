import { createContext, useContext, useState, useCallback } from 'react';

const ReadingHistoryContext = createContext();

export const useReadingHistory = () => {
    const context = useContext(ReadingHistoryContext);
    if (!context) throw new Error('useReadingHistory must be used within ReadingHistoryProvider');
    return context;
};

export const ReadingHistoryProvider = ({ children }) => {
    const [history, setHistory] = useState(() => {
        try {
            const saved = localStorage.getItem('newsread-reading-history');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const saveToStorage = (items) => {
        try {
            localStorage.setItem('newsread-reading-history', JSON.stringify(items));
        } catch {
            // localStorage unavailable
        }
    };

    const markAsRead = useCallback((articleId) => {
        setHistory((prev) => {
            if (prev.some((item) => item.id === articleId)) {
                // Move to front (most recent)
                const updated = [
                    { id: articleId, readAt: new Date().toISOString() },
                    ...prev.filter((item) => item.id !== articleId),
                ];
                saveToStorage(updated);
                return updated;
            }
            const updated = [
                { id: articleId, readAt: new Date().toISOString() },
                ...prev,
            ].slice(0, 50); // Keep last 50
            saveToStorage(updated);
            return updated;
        });
    }, []);

    const isRead = useCallback(
        (articleId) => history.some((item) => item.id === articleId),
        [history]
    );

    const clearHistory = useCallback(() => {
        setHistory([]);
        saveToStorage([]);
    }, []);

    return (
        <ReadingHistoryContext.Provider value={{ history, markAsRead, isRead, clearHistory }}>
            {children}
        </ReadingHistoryContext.Provider>
    );
};
