import PropTypes from 'prop-types';
import './ErrorMessage.css';

const ErrorMessage = ({ message, onRetry }) => {
    return (
        <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h3 className="error-title">Oops! Something went wrong.</h3>
            <p className="error-message">{message}</p>
            {onRetry && (
                <button onClick={onRetry} className="retry-button">
                    Try Again
                </button>
            )}
        </div>
    );
};

ErrorMessage.propTypes = {
    message: PropTypes.string.isRequired,
    onRetry: PropTypes.func,
};

export default ErrorMessage;
