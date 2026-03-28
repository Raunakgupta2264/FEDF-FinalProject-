import './SkeletonLoader.css';

const SkeletonCard = () => (
    <div className="skeleton-card">
        <div className="skeleton-image" />
        <div className="skeleton-content">
            <div className="skeleton-line skeleton-line--tag" />
            <div className="skeleton-line skeleton-line--title" />
            <div className="skeleton-line skeleton-line--title-short" />
            <div className="skeleton-line skeleton-line--text" />
            <div className="skeleton-line skeleton-line--text-short" />
            <div className="skeleton-footer">
                <div className="skeleton-line skeleton-line--source" />
                <div className="skeleton-line skeleton-line--btn" />
            </div>
        </div>
    </div>
);

const SkeletonLoader = ({ count = 6 }) => (
    <div className="skeleton-grid">
        {Array.from({ length: count }, (_, i) => (
            <SkeletonCard key={i} />
        ))}
    </div>
);

export default SkeletonLoader;
