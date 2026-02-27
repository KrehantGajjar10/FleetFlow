// src/components/StatusPill/StatusPill.jsx
import React from 'react';
import './StatusPill.css';

const StatusPill = ({ status }) => {
  // Map the status string to a CSS class
  const getStatusClass = (statusStr) => {
    switch (statusStr.toLowerCase()) {
      case 'on trip': return 'on-trip';
      case 'available': return 'available';
      case 'in shop': return 'in-shop';
      case 'pending': return 'pending';
      default: return 'available';
    }
  };

  return (
    <span className={`status-pill ${getStatusClass(status)}`}>
      {status}
    </span>
  );
};

export default StatusPill;