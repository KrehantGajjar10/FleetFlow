// src/pages/Maintenance/Maintenance.jsx
import React, { useState, useEffect } from 'react';
import StatusPill from '../../components/StatusPill/StatusPill';
import { fetchMaintenanceLogs, fetchVehicles, createServiceLog } from '../../services/api'; // UPDATED
import './Maintenance.css';

const Maintenance = () => {
  const [logs, setLogs] = useState([]);
  const [allVehicles, setAllVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ vehicleId: '', issue: '', date: '', cost: '' });

  const loadData = async () => {
    setLoading(true);
    const logsData = await fetchMaintenanceLogs();
    const vehiclesData = await fetchVehicles();
    setLogs(logsData);
    setAllVehicles(vehiclesData);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCreateService = async (e) => {
    e.preventDefault();
    await createServiceLog(formData);
    setIsModalOpen(false);
    setFormData({ vehicleId: '', issue: '', date: '', cost: '' });
    loadData(); 
  };

  return (
    <div className="maintenance-container">
      <div className="registry-toolbar">
        <div className="search-filters"><input type="text" className="search-input" placeholder="Search logs..." /></div>
        <div className="action-buttons"><button className="btn-secondary" onClick={() => setIsModalOpen(true)}>+ Create New Service</button></div>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead><tr><th>Log ID</th><th>Vehicle</th><th>Issue/Service</th><th>Date</th><th>Cost</th><th>Status</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan="6" style={{textAlign: 'center'}}>Loading...</td></tr> : (
              logs.map((log) => (
                <tr key={log.id}><td>{log.id}</td><td>{log.vehicle}</td><td>{log.issue}</td><td>{log.date}</td><td>{log.cost}</td><td><StatusPill status={log.status === 'New' ? 'Pending' : log.status} /></td></tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>New Service</h2>
            <form onSubmit={handleCreateService}>
              <div className="form-grid">
                <div className="form-group full-width"><label>Vehicle Name</label>
                  <select name="vehicleId" value={formData.vehicleId} onChange={handleInputChange} required>
                    <option value="">-- Select a Vehicle --</option>
                    {allVehicles.map(v => <option key={v.id} value={v.id}>{v.plate} - {v.model} ({v.status})</option>)}
                  </select>
                </div>
                <div className="form-group full-width"><label>Issue/Service</label><input type="text" name="issue" value={formData.issue} onChange={handleInputChange} required /></div>
                <div className="form-group"><label>Date</label><input type="date" name="date" value={formData.date} onChange={handleInputChange} required /></div>
                <div className="form-group"><label>Estimated Cost (k)</label><input type="number" name="cost" value={formData.cost} onChange={handleInputChange} /></div>
              </div>
              <div className="modal-actions"><button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button><button type="submit" className="btn-save">Create</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Maintenance;