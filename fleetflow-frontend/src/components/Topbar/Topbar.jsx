// src/components/Topbar/Topbar.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import './Topbar.css';

const Topbar = () => {
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname.replace('/', '');
    return path.charAt(0).toUpperCase() + path.slice(1) || 'Dashboard';
  };

  return (
    <header className="topbar">
      <div className="topbar-title">{getPageTitle()}</div>
    </header>
  );
};

export default Topbar;