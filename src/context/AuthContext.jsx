import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

const defaultPreferences = {
    favoriteCategories: [],
    fontSize: 'medium', // small, medium, large
    compactView: false,
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('newsread_user');
        return saved ? JSON.parse(saved) : null;
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem('newsread_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('newsread_user');
        }
    }, [user]);

    const login = (userData) => {
        setUser({
            name: userData.name || userData.email.split('@')[0],
            email: userData.email,
            avatar: userData.name
                ? userData.name.charAt(0).toUpperCase()
                : userData.email.charAt(0).toUpperCase(),
            joinedAt: new Date().toISOString(),
            preferences: defaultPreferences,
        });
    };

    const logout = () => {
        setUser(null);
    };

    const updatePreferences = (newPrefs) => {
        setUser((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                preferences: { ...(prev.preferences || defaultPreferences), ...newPrefs },
            };
        });
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            isLoggedIn: !!user,
            updatePreferences,
            preferences: user?.preferences || defaultPreferences,
        }}>
            {children}
        </AuthContext.Provider>
    );
};
