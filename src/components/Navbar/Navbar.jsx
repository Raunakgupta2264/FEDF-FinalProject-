import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { categories, mockArticles } from '../../data/mockData';
import { useTheme } from '../../context/ThemeContext';
import { useBookmarks } from '../../context/BookmarkContext';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const { theme, toggleTheme } = useTheme();
    const { bookmarks } = useBookmarks();
    const { user, isLoggedIn, logout } = useAuth();
    const searchRef = useRef(null);
    const navigate = useNavigate();

    // Close search dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setSearchOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query.trim().length > 0) {
            const filtered = mockArticles.filter(
                (a) =>
                    a.title.toLowerCase().includes(query.toLowerCase()) ||
                    a.summary.toLowerCase().includes(query.toLowerCase()) ||
                    a.category.toLowerCase().includes(query.toLowerCase())
            );
            setSearchResults(filtered.slice(0, 5));
            setSearchOpen(true);
        } else {
            setSearchResults([]);
            setSearchOpen(false);
        }
    };

    const handleResultClick = (articleId) => {
        setSearchQuery('');
        setSearchOpen(false);
        setMenuOpen(false);
        navigate(`/article/${articleId}`);
    };

    return (
        <nav className="navbar" role="navigation" aria-label="Main Navigation">
            <div className="container navbar-content">
                <Link to="/" className="navbar-brand">
                    <span className="brand-icon">⚡</span>
                    <span className="brand-text">NewsRead</span>
                </Link>

                <div className={`navbar-center ${menuOpen ? 'open' : ''}`}>
                    <ul className="navbar-links">
                        <li>
                            <NavLink
                                to="/"
                                className={({ isActive }) => isActive ? 'active' : ''}
                                end
                                onClick={() => setMenuOpen(false)}
                            >
                                Home
                            </NavLink>
                        </li>
                        {categories.slice(1).map((category) => (
                            <li key={category.id}>
                                <NavLink
                                    to={`/category/${category.id}`}
                                    className={({ isActive }) => isActive ? 'active' : ''}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    {category.name}
                                </NavLink>
                            </li>
                        ))}
                        <li>
                            <NavLink
                                to="/explore"
                                className={({ isActive }) => isActive ? 'active' : ''}
                                onClick={() => setMenuOpen(false)}
                            >
                                🌐 3D Explorer
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/bookmarks"
                                className={({ isActive }) => isActive ? 'active' : ''}
                                onClick={() => setMenuOpen(false)}
                            >
                                Saved {bookmarks.length > 0 && <span className="bookmark-count">{bookmarks.length}</span>}
                            </NavLink>
                        </li>
                    </ul>
                </div>

                <div className="navbar-actions">
                    <div className="search-wrapper" ref={searchRef}>
                        <div className="search-box">
                            <span className="search-icon">🔍</span>
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                onFocus={() => searchQuery.trim() && setSearchOpen(true)}
                                className="search-input"
                                aria-label="Search articles"
                            />
                        </div>
                        {searchOpen && searchResults.length > 0 && (
                            <div className="search-dropdown" role="listbox" aria-live="polite">
                                {searchResults.map((article) => (
                                    <button
                                        key={article.id}
                                        className="search-result"
                                        onClick={() => handleResultClick(article.id)}
                                    >
                                        <span className="search-result-category">{article.category}</span>
                                        <span className="search-result-title">{article.title}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                        {searchOpen && searchQuery.trim() && searchResults.length === 0 && (
                            <div className="search-dropdown">
                                <div className="search-no-results">No articles found</div>
                            </div>
                        )}
                    </div>

                    <button
                        className="theme-toggle"
                        onClick={toggleTheme}
                        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                    >
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>

                    {isLoggedIn ? (
                        <div className="user-menu">
                            <div className="user-avatar" title={user.name}>
                                {user.avatar}
                            </div>
                            <button
                                className="logout-btn"
                                onClick={logout}
                                title="Sign out"
                            >
                                ↪
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="login-nav-btn">
                            Sign In
                        </Link>
                    )}

                    <button
                        className={`hamburger ${menuOpen ? 'open' : ''}`}
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                        aria-expanded={menuOpen}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
