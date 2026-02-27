// src/components/Layout/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Topbar from '../Topbar/Topbar';
import './MainLayout.css';

const MainLayout = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <div className="page-content">
          {/* Outlet is where the nested page components will render */}
          <Outlet /> 
        </div>
      </div>
    </div>
  );
};

export default MainLayout;