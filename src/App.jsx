import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { BookmarkProvider } from './context/BookmarkContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/Toast/ToastContext';
import { ReadingHistoryProvider } from './context/ReadingHistoryContext';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import Navbar from './components/Navbar/Navbar';
import NewsTicker from './components/NewsTicker/NewsTicker';
import Footer from './components/Footer/Footer';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import BottomNav from './components/BottomNav/BottomNav';
import ToastContainer from './components/Toast/Toast';
import HomePage from './pages/HomePage/HomePage';
import CategoryPage from './pages/CategoryPage/CategoryPage';
import ArticleReader from './pages/ArticleReader/ArticleReader';
import BookmarksPage from './pages/BookmarksPage/BookmarksPage';
import Explore3DPage from './pages/Explore3DPage/Explore3DPage';
import LoginPage from './pages/LoginPage/LoginPage';
import SearchPage from './pages/SearchPage/SearchPage';
import ErrorMessage from './components/ErrorMessage/ErrorMessage';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BookmarkProvider>
          <ReadingHistoryProvider>
            <ToastProvider>
              <ErrorBoundary>
                <Router>
                  <div className="app">
                    <a href="#main-content" className="skip-to-content">
                      Skip to content
                    </a>
                    <Navbar />
                    <NewsTicker />
                    <main id="main-content">
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/category/:categoryName" element={<CategoryPage />} />
                        <Route path="/article/:articleId" element={<ArticleReader />} />
                        <Route path="/explore" element={<Explore3DPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/bookmarks" element={<BookmarksPage />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/404" element={<ErrorMessage message="Page not found" />} />
                        <Route path="*" element={<Navigate to="/404" replace />} />
                      </Routes>
                    </main>
                    <Footer />
                    <ScrollToTop />
                    <BottomNav />
                    <ToastContainer />
                  </div>
                </Router>
              </ErrorBoundary>
            </ToastProvider>
          </ReadingHistoryProvider>
        </BookmarkProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
