import { NavLink } from 'react-router-dom';
import { useBookmarks } from '../../context/BookmarkContext';
import './BottomNav.css';

const BottomNav = () => {
    const { bookmarks } = useBookmarks();

    return (
        <nav className="bottom-nav" aria-label="Bottom Navigation">
            <div className="bottom-nav-items">
                <NavLink
                    to="/"
                    end
                    className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
                >
                    <span className="bottom-nav-icon">🏠</span>
                    <span>Home</span>
                </NavLink>
                <NavLink
                    to="/search"
                    className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
                >
                    <span className="bottom-nav-icon">🔍</span>
                    <span>Search</span>
                </NavLink>
                <NavLink
                    to="/explore"
                    className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
                >
                    <span className="bottom-nav-icon">🌐</span>
                    <span>Explore</span>
                </NavLink>
                <NavLink
                    to="/bookmarks"
                    className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
                >
                    <span className="bottom-nav-icon">🔖</span>
                    <span>Saved</span>
                    {bookmarks.length > 0 && (
                        <span className="bottom-nav-badge">{bookmarks.length}</span>
                    )}
                </NavLink>
                <NavLink
                    to="/login"
                    className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
                >
                    <span className="bottom-nav-icon">👤</span>
                    <span>Profile</span>
                </NavLink>
            </div>
        </nav>
    );
};

export default BottomNav;
