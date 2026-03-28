import { useState } from 'react';
import { Link } from 'react-router-dom';
import { categories } from '../../data/mockData';
import './Footer.css';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email.trim()) {
            setSubscribed(true);
            setEmail('');
            setTimeout(() => setSubscribed(false), 3000);
        }
    };

    return (
        <footer className="site-footer">
            <div className="container">
                <div className="footer-grid">
                    {/* Brand */}
                    <div className="footer-brand-col">
                        <Link to="/" className="footer-brand">
                            <span className="footer-brand-icon">⚡</span>
                            <span className="footer-brand-text">NewsRead</span>
                        </Link>
                        <p className="footer-brand-desc">
                            Your premium news aggregation platform. Stay informed with curated
                            articles across technology, business, health, and more.
                        </p>
                        <div className="footer-socials">
                            <a href="#" className="footer-social-link" aria-label="Twitter">𝕏</a>
                            <a href="#" className="footer-social-link" aria-label="GitHub">⌘</a>
                            <a href="#" className="footer-social-link" aria-label="LinkedIn">in</a>
                            <a href="#" className="footer-social-link" aria-label="RSS">⊛</a>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="footer-col">
                        <h4>Categories</h4>
                        <ul className="footer-links">
                            {categories.slice(1).map((cat) => (
                                <li key={cat.id}>
                                    <Link to={`/category/${cat.id}`}>
                                        {cat.icon} {cat.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div className="footer-col">
                        <h4>Platform</h4>
                        <ul className="footer-links">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/explore">3D Explorer</Link></li>
                            <li><Link to="/bookmarks">Saved Articles</Link></li>
                            <li><Link to="/search">Search</Link></li>
                            <li><Link to="/login">Sign In</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="footer-col footer-newsletter">
                        <h4>Newsletter</h4>
                        <p>Get the top stories delivered to your inbox every morning.</p>
                        {subscribed ? (
                            <p style={{ color: '#4ade80', fontWeight: 600, fontSize: '0.85rem' }}>
                                ✓ Subscribed successfully!
                            </p>
                        ) : (
                            <form className="newsletter-form" onSubmit={handleSubscribe}>
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="newsletter-input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    aria-label="Email for newsletter"
                                />
                                <button type="submit" className="newsletter-btn">Subscribe</button>
                            </form>
                        )}
                    </div>
                </div>

                <div className="footer-bottom">
                    <span>© {new Date().getFullYear()} NewsRead. All rights reserved.</span>
                    <div className="footer-bottom-links">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                        <a href="#">Contact</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
