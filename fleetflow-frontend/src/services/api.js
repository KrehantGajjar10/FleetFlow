// src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});

// --- DASHBOARD ---
export const fetchDashboardStats = async () => {
  const res = await API.get('/dashboard/stats');
  return res.data;
};

export const fetchActiveTrips = async () => {
  const res = await API.get('/dashboard/active-trips');
  return res.data;
};

// --- VEHICLE REGISTRY ---
export const fetchVehicles = async () => {
  const res = await API.get('/vehicles/');
  return res.data.map(v => ({
    ...v,
    capacity: `${v.capacity_kg / 1000} tonn`
  }));
};

export const addVehicle = async (vehicleData) => {
  const payload = {
    licensePlate: vehicleData.licensePlate,
    model: vehicleData.model,
    type: vehicleData.type,
    maxPayload: parseInt(vehicleData.maxPayload),
    initialOdometer: parseInt(vehicleData.initialOdometer)
  };
  const res = await API.post('/vehicles/', payload);
  return res.data;
};

export const retireVehicle = async (id) => {
  const res = await API.put(`/vehicles/${id}/retire`);
  return res.data;
};

// --- DRIVERS ---
export const fetchDrivers = async () => {
  const res = await API.get('/drivers/');
  return res.data;
};

export const updateDriverStatus = async (id, newStatus) => {
  const res = await API.put(`/drivers/${id}/status`, { status: newStatus });
  return res.data;
};

export const addDriver = async (driverData) => {
  const payload = {
    name: driverData.name,
    license_number: driverData.licenseNumber,
    expiry_date: driverData.expiryDate
  };
  const res = await API.post('/drivers/', payload);
  return res.data;
};

// --- TRIP DISPATCHER ---
export const fetchAvailableResources = async () => {
  const res = await API.get('/trips/available-resources');
  
  const vehicles = res.data.vehicles.map(v => ({
    ...v, capacity: `${v.capacity_kg} kg` 
  }));
  const drivers = res.data.drivers;
  const trips = res.data.trips.map(t => ({
    ...t, fleetType: `Vehicle ID: #${t.vehicle_id}` 
  }));
  
  return { vehicles, drivers, trips };
};

export const createTrip = async (tripData) => {
  try {
    const payload = {
      vehicleId: parseInt(tripData.vehicleId),
      driverId: parseInt(tripData.driverId),
      cargoWeight: parseInt(tripData.cargoWeight),
      origin: tripData.origin,
      destination: tripData.destination,
      estimatedFuelCost: parseFloat(tripData.estimatedFuelCost)
    };
    const res = await API.post('/trips/dispatch', payload);
    return res.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data.detail;
    }
    throw "An error occurred while dispatching the trip.";
  }
};

// --- MAINTENANCE ---
export const fetchMaintenanceLogs = async () => {
  const res = await API.get('/maintenance/');
  return res.data.map(log => ({
    ...log,
    vehicle: log.vehicle_name,
    cost: log.cost ? `${log.cost}k` : 'TBD'
  }));
};

export const createServiceLog = async (logData) => {
  const payload = {
    vehicleId: parseInt(logData.vehicleId),
    issue: logData.issue,
    date: logData.date,
    cost: parseFloat(logData.cost || 0)
  };
  const res = await API.post('/maintenance/', payload);
  return res.data;
};

// --- EXPENSES ---
export const fetchExpenses = async () => {
  const res = await API.get('/expenses/');
  return res.data.map(e => ({
    id: e.id,
    tripId: e.trip_id,
    driverName: e.driver_name,
    distance: `${e.distance_km} km`,
    fuelExpense: `${e.fuel_cost}k`,
    miscExpense: `${e.misc_expense}k`,
    status: e.status
  }));
};

export const addExpenseLog = async (expenseData) => {
  const payload = {
    tripId: parseInt(expenseData.tripId),
    distance: parseInt(expenseData.distance),
    fuelCost: parseFloat(expenseData.fuelCost),
    miscExpense: parseFloat(expenseData.miscExpense),
    driverName: expenseData.driverName || null
  };
  const res = await API.post('/expenses/', payload);
  return res.data;
};

// --- ANALYTICS ---
export const fetchAnalyticsData = async () => {
  const res = await API.get('/analytics/data');
  return res.data;
};