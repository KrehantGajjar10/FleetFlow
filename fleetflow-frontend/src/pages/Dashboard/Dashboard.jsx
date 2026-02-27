// src/pages/Dashboard/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import KPIBox from '../../components/KPIBox/KPIBox';
import StatusPill from '../../components/StatusPill/StatusPill';
import { fetchDashboardStats, fetchActiveTrips } from '../../services/api'; // UPDATED
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const statsData = await fetchDashboardStats();
      const tripsData = await fetchActiveTrips();
      setStats(statsData);
      setTrips(tripsData);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) return <div>Loading Dashboard Data...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-toolbar">
        <div className="search-filters">
          <input type="text" className="search-input" placeholder="Search bar..." />
          <button className="filter-btn">Group by</button>
          <button className="filter-btn">Filter</button>
          <button className="filter-btn">Sort by...</button>
        </div>
        <div className="action-buttons">
          <button className="btn-secondary">+ New Trip</button>
          <button className="btn-secondary">+ New Vehicle</button>
        </div>
      </div>

      <div className="kpi-grid">
        <KPIBox title="Active Fleet" value={stats.activeFleet} />
        <KPIBox title="Maintenance Alert" value={stats.maintenanceAlerts} />
        <KPIBox title="Pending Cargo" value={stats.pendingCargo} />
        <KPIBox title="Utilization Rate" value={stats.utilizationRate} />
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Trip ID</th>
              <th>Vehicle</th>
              <th>Driver</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip) => (
              <tr key={trip.id}>
                <td>{trip.id}</td>
                <td>{trip.vehicle}</td>
                <td>{trip.driver}</td>
                <td><StatusPill status={trip.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Dashboard;