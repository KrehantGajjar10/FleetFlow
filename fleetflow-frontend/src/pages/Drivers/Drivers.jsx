// src/pages/Drivers/Drivers.jsx
import React, { useState, useEffect } from 'react';
import { fetchDrivers, updateDriverStatus, addDriver } from '../../services/api'; // UPDATED
import './Drivers.css';

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', licenseNumber: '', expiryDate: '' });

  const loadDrivers = async () => {
    setLoading(true);
    const data = await fetchDrivers();
    setDrivers(data);
    setLoading(false);
  };

  useEffect(() => { loadDrivers(); }, []);

  const handleStatusChange = async (id, newStatus) => {
    await updateDriverStatus(id, newStatus);
    loadDrivers(); 
  };

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddDriver = async (e) => {
    e.preventDefault();
    await addDriver(formData);
    setIsModalOpen(false);
    setFormData({ name: '', licenseNumber: '', expiryDate: '' });
    loadDrivers(); 
  };

  const isExpired = (expiryDate) => { return new Date(expiryDate) < new Date(); };

  return (
    <div className="drivers-container">
      <div className="registry-toolbar">
        <div className="search-filters"><input type="text" className="search-input" placeholder="Search drivers..." /></div>
        <div className="action-buttons"><button className="btn-secondary" onClick={() => setIsModalOpen(true)}>+ Add Driver</button></div>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead><tr><th>Name</th><th>License</th><th>Expiry</th><th>Completion Rate</th><th>Safety Score</th><th>Complaints</th><th>Duty Status</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan="7" style={{textAlign: 'center'}}>Loading...</td></tr> : (
              drivers.map((driver) => {
                const expired = isExpired(driver.expiry_date);
                return (
                  <tr key={driver.id} style={{ backgroundColor: expired ? '#fef2f2' : 'transparent' }}>
                    <td style={{ fontWeight: '600' }}>{driver.name}</td><td>{driver.license_number}</td>
                    <td>{driver.expiry_date}{expired && <span className="expired-warning">Expired - Locked</span>}</td>
                    <td>{driver.completion_rate}%</td><td style={{ color: parseInt(driver.safety_score) > 80 ? 'var(--success)' : 'inherit' }}>{driver.safety_score}%</td>
                    <td>{driver.complaints}</td>
                    <td>
                      {driver.status === 'On Trip' ? <span style={{ fontWeight: '600', color: '#1e40af' }}>On Trip</span> : (
                        <select className="status-select" value={driver.status} onChange={(e) => handleStatusChange(driver.id, e.target.value)}>
                          <option value="On Duty">On Duty</option><option value="Off Duty">Off Duty (Break)</option><option value="Suspended">Suspended</option>
                        </select>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New Driver</h2>
            <form onSubmit={handleAddDriver}>
              <div className="form-grid">
                <div className="form-group"><label>Full Name</label><input type="text" name="name" value={formData.name} onChange={handleInputChange} required /></div>
                <div className="form-group"><label>License Number</label><input type="text" name="licenseNumber" value={formData.licenseNumber} onChange={handleInputChange} required /></div>
                <div className="form-group"><label>License Expiry Date</label><input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleInputChange} required /></div>
              </div>
              <div className="modal-actions"><button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button><button type="submit" className="btn-save">Save Driver</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Drivers;