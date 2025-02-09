import React from 'react';

const MessageModal = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="message-modal-backdrop" onClick={onClose}>
      <div className="message-modal" onClick={e => e.stopPropagation()}>
        <h4>Server Message</h4>
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default MessageModal;
