import { useState } from 'react';
import { useToast } from '../Toast/ToastContext';
import './ShareModal.css';

const ShareModal = ({ article, onClose }) => {
    const [copied, setCopied] = useState(false);
    const toast = useToast();
    const url = window.location.href;
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(article.title);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            toast.success('Link copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error('Failed to copy link');
        }
    };

    const shareLinks = [
        {
            name: 'Twitter / X',
            icon: '𝕏',
            className: 'share-btn--twitter',
            url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
        },
        {
            name: 'WhatsApp',
            icon: '💬',
            className: 'share-btn--whatsapp',
            url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
        },
        {
            name: 'LinkedIn',
            icon: '💼',
            className: 'share-btn--linkedin',
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
        },
        {
            name: 'Email',
            icon: '✉️',
            className: 'share-btn--email',
            url: `mailto:?subject=${encodedTitle}&body=Check%20out%20this%20article:%20${encodedUrl}`,
        },
    ];

    return (
        <div className="share-overlay" onClick={onClose}>
            <div className="share-modal" onClick={(e) => e.stopPropagation()}>
                <div className="share-modal-header">
                    <h3>Share Article</h3>
                    <button className="share-modal-close" onClick={onClose} aria-label="Close">
                        ×
                    </button>
                </div>

                <div className="share-buttons">
                    {shareLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`share-btn ${link.className}`}
                            onClick={onClose}
                        >
                            <span className="share-btn-icon">{link.icon}</span>
                            {link.name}
                        </a>
                    ))}
                </div>

                <div className="share-copy-section">
                    <input
                        type="text"
                        value={url}
                        readOnly
                        className="share-url-input"
                        aria-label="Article URL"
                    />
                    <button className="share-copy-btn" onClick={handleCopy}>
                        {copied ? '✓ Copied' : '📋 Copy'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;
