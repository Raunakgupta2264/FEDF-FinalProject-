import PropTypes from 'prop-types';
import './EmptyState.css';

const EmptyState = ({ message = 'No articles found.' }) => {
    return (
        <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p className="empty-message">{message}</p>
        </div>
    );
};

EmptyState.propTypes = {
    message: PropTypes.string,
};

export default EmptyState;
