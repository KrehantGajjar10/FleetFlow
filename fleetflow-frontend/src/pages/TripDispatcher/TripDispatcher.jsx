// src/pages/TripDispatcher/TripDispatcher.jsx
import React, { useState, useEffect } from 'react';
import StatusPill from '../../components/StatusPill/StatusPill';
import { fetchAvailableResources, createTrip } from '../../services/api'; // UPDATED
import './TripDispatcher.css';

const TripDispatcher = () => {
  const [trips, setTrips] = useState([]);
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ vehicleId: '', cargoWeight: '', driverId: '', origin: '', destination: '', estimatedFuelCost: '' });

  const loadResources = async () => {
    setLoading(true);
    const data = await fetchAvailableResources();
    setTrips(data.trips);
    setAvailableVehicles(data.vehicles);
    setAvailableDrivers(data.drivers);
    setLoading(false);
  };

  useEffect(() => { loadResources(); }, []);

  const handleInputChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); setError(''); };

  const handleDispatchTrip = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createTrip(formData);
      setIsModalOpen(false);
      setFormData({ vehicleId: '', cargoWeight: '', driverId: '', origin: '', destination: '', estimatedFuelCost: '' });
      loadResources(); 
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="dispatcher-container">
      <div className="registry-toolbar">
        <div className="search-filters">
          <input type="text" className="search-input" placeholder="Search trips..." />
          <button className="filter-btn">Group by</button>
        </div>
        <div className="action-buttons">
          <button className="btn-secondary" onClick={() => setIsModalOpen(true)}>+ New Trip</button>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead><tr><th>Trip ID</th><th>Fleet Type</th><th>Origin</th><th>Destination</th><th>Status</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan="5" style={{textAlign: 'center'}}>Loading...</td></tr> : (
              trips.map((trip) => (
                <tr key={trip.id}><td>{trip.id}</td><td>{trip.fleetType}</td><td>{trip.origin}</td><td>{trip.destination}</td><td><StatusPill status={trip.status} /></td></tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>New Trip Form</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleDispatchTrip}>
              <div className="form-grid">
                <div className="form-group full-width"><label>Select Vehicle</label>
                  <select name="vehicleId" value={formData.vehicleId} onChange={handleInputChange} required>
                    <option value="">-- Choose a Vehicle --</option>
                    {availableVehicles.map(v => <option key={v.id} value={v.id}>{v.plate} - {v.type} (Max: {v.capacity})</option>)}
                  </select>
                </div>
                <div className="form-group full-width"><label>Select Driver</label>
                  <select name="driverId" value={formData.driverId} onChange={handleInputChange} required>
                    <option value="">-- Choose a Driver --</option>
                    {availableDrivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Cargo Weight (Kg)</label><input type="number" name="cargoWeight" value={formData.cargoWeight} onChange={handleInputChange} required /></div>
                <div className="form-group"><label>Estimated Fuel Cost (Rs)</label><input type="number" name="estimatedFuelCost" value={formData.estimatedFuelCost} onChange={handleInputChange} required /></div>
                <div className="form-group"><label>Origin Address</label><input type="text" name="origin" value={formData.origin} onChange={handleInputChange} required /></div>
                <div className="form-group"><label>Destination</label><input type="text" name="destination" value={formData.destination} onChange={handleInputChange} required /></div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-save">Confirm & Dispatch Trip</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default TripDispatcher;