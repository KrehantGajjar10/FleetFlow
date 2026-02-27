// src/pages/VehicleRegistry/VehicleRegistry.jsx
import React, { useState, useEffect } from 'react';
import StatusPill from '../../components/StatusPill/StatusPill';
import { fetchVehicles, addVehicle, retireVehicle } from '../../services/api'; // UPDATED
import './VehicleRegistry.css';

const VehicleRegistry = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ licensePlate: '', maxPayload: '', initialOdometer: '', type: '', model: '' });

  const loadVehicles = async () => {
    setLoading(true);
    const data = await fetchVehicles();
    setVehicles(data);
    setLoading(false);
  };

  useEffect(() => { loadVehicles(); }, []);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSaveVehicle = async (e) => {
    e.preventDefault();
    await addVehicle(formData);
    setIsModalOpen(false);
    setFormData({ licensePlate: '', maxPayload: '', initialOdometer: '', type: '', model: '' });
    loadVehicles(); 
  };

  const handleRetire = async (id) => {
    if (window.confirm("Are you sure you want to mark this vehicle as Out of Service?")) {
      await retireVehicle(id);
      loadVehicles();
    }
  };

  return (
    <div className="registry-container">
      <div className="registry-toolbar">
        <div className="search-filters">
          <input type="text" className="search-input" placeholder="Search vehicles..." />
          <button className="filter-btn">Group by</button>
          <button className="filter-btn">Filter</button>
        </div>
        <div className="action-buttons">
          <button className="btn-secondary" onClick={() => setIsModalOpen(true)}>+ New Vehicle</button>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>NO</th><th>Plate</th><th>Model</th><th>Type</th><th>Capacity</th><th>Odometer</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan="8" style={{textAlign: 'center'}}>Loading...</td></tr> : (
              vehicles.map((v, index) => (
                <tr key={v.id}>
                  <td>{index + 1}</td><td>{v.plate}</td><td>{v.model}</td><td>{v.type}</td>
                  <td>{v.capacity}</td><td>{v.odometer}</td><td><StatusPill status={v.status} /></td>
                  <td>{v.status !== 'Out of Service' ? <button className="retire-btn" onClick={() => handleRetire(v.id)}>X</button> : <span>-</span>}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>New Vehicle Registration</h2>
            <form onSubmit={handleSaveVehicle}>
              <div className="form-grid">
                <div className="form-group full-width"><label>License Plate</label><input type="text" name="licensePlate" value={formData.licensePlate} onChange={handleInputChange} required /></div>
                <div className="form-group"><label>Model / Year</label><input type="text" name="model" value={formData.model} onChange={handleInputChange} required /></div>
                <div className="form-group"><label>Type</label>
                  <select name="type" value={formData.type} onChange={handleInputChange} required>
                    <option value="">Select Type...</option><option value="Mini">Mini</option><option value="Van">Van</option><option value="Truck">Truck</option><option value="Trailer">Trailer</option>
                  </select>
                </div>
                <div className="form-group"><label>Max Payload (Tons)</label><input type="number" name="maxPayload" value={formData.maxPayload} onChange={handleInputChange} required /></div>
                <div className="form-group"><label>Initial Odometer</label><input type="number" name="initialOdometer" value={formData.initialOdometer} onChange={handleInputChange} required /></div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-save">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default VehicleRegistry;