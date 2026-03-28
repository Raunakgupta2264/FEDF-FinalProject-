import PropTypes from 'prop-types';
import './Loader.css';

const Loader = ({ message = 'Loading...' }) => {
    return (
        <div className="loader-container">
            <div className="spinner"></div>
            <p>{message}</p>
        </div>
    );
};

Loader.propTypes = {
    message: PropTypes.string,
};

export default Loader;
