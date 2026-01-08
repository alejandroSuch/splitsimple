import { useState } from 'react';
import './ShareLink.css';

const ShareLink = ({ groupId }) => {
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/splitsimple/#/group/${groupId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error copying to clipboard:', err);
    }
  };

  return (
    <div className="share-link-container">
      <div className="share-link-box">
        <input
          type="text"
          value={shareUrl}
          readOnly
          className="share-link-input"
        />
        <button onClick={handleCopy} className="btn-copy">
          {copied ? '✓ Copiado' : '📋 Copiar'}
        </button>
      </div>
      <p className="share-link-hint">
        Comparte este link para que otros puedan ver y agregar gastos
      </p>
    </div>
  );
};

export default ShareLink;
