// src/pages/Expenses/Expenses.jsx
import React, { useState, useEffect } from 'react';
import StatusPill from '../../components/StatusPill/StatusPill';
import { fetchExpenses, fetchAvailableResources, addExpenseLog } from '../../services/api'; // UPDATED
import './Expenses.css';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ tripId: '', driverName: '', distance: '', fuelCost: '', miscExpense: '' });

  const loadData = async () => {
    setLoading(true);
    const expensesData = await fetchExpenses();
    const resources = await fetchAvailableResources();
    setExpenses(expensesData);
    setTrips(resources.trips);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddExpense = async (e) => {
    e.preventDefault();
    await addExpenseLog(formData);
    setIsModalOpen(false);
    setFormData({ tripId: '', driverName: '', distance: '', fuelCost: '', miscExpense: '' });
    loadData(); 
  };

  return (
    <div className="expenses-container">
      <div className="registry-toolbar">
        <div className="search-filters"><input type="text" className="search-input" placeholder="Search expenses..." /></div>
        <div className="action-buttons"><button className="btn-secondary" onClick={() => setIsModalOpen(true)}>+ New Expense</button></div>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead><tr><th>Trip ID</th><th>Driver</th><th>Distance</th><th>Fuel Expense</th><th>Misc. Expense</th><th>Status</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan="6" style={{textAlign: 'center'}}>Loading...</td></tr> : (
              expenses.map((exp) => (
                <tr key={exp.id}><td>{exp.tripId}</td><td>{exp.driverName}</td><td>{exp.distance}</td><td>{exp.fuelExpense}</td><td>{exp.miscExpense}</td><td><StatusPill status={exp.status} /></td></tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add an Expense</h2>
            <form onSubmit={handleAddExpense}>
              <div className="form-grid">
                <div className="form-group full-width"><label>Trip ID</label>
                  <select name="tripId" value={formData.tripId} onChange={handleInputChange} required>
                    <option value="">-- Select a Trip --</option>
                    {trips.map(t => <option key={t.id} value={t.id}>Trip #{t.id} ({t.origin} to {t.destination})</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Driver Name (Override)</label><input type="text" name="driverName" value={formData.driverName} onChange={handleInputChange} /></div>
                <div className="form-group"><label>Distance (km)</label><input type="number" name="distance" value={formData.distance} onChange={handleInputChange} required /></div>
                <div className="form-group"><label>Fuel Cost (k)</label><input type="number" name="fuelCost" value={formData.fuelCost} onChange={handleInputChange} required /></div>
                <div className="form-group"><label>Misc Expense (k)</label><input type="number" name="miscExpense" value={formData.miscExpense} onChange={handleInputChange} required /></div>
              </div>
              <div className="modal-actions"><button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button><button type="submit" className="btn-save">Create</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Expenses;