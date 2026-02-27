// src/components/KPIBox/KPIBox.jsx
import React from 'react';
import './KPIBox.css';

const KPIBox = ({ title, value }) => {
  return (
    <div className="kpi-box">
      <div className="kpi-title">{title}</div>
      <div className="kpi-value">{value}</div>
    </div>
  );
};

export default KPIBox;