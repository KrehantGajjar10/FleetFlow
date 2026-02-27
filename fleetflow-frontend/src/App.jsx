// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import VehicleRegistry from './pages/VehicleRegistry/VehicleRegistry';
import TripDispatcher from './pages/TripDispatcher/TripDispatcher';
import Maintenance from './pages/Maintenance/Maintenance';
import Expenses from './pages/Expenses/Expenses';
import Drivers from './pages/Drivers/Drivers';
import Analytics from './pages/Analytics/Analytics';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/registry" element={<VehicleRegistry />} />
          <Route path="/dispatch" element={<TripDispatcher />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/performance" element={<Drivers />} />
          <Route path="/analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;