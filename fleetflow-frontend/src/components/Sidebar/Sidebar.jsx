// src/components/Sidebar/Sidebar.jsx
import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Truck, Map, Wrench, Receipt, Users, BarChart3, LogOut 
} from 'lucide-react';
import logo from '../../assets/logo.png';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: 'Loading...', role: '' });

  // Fetch the logged-in user from LocalStorage when the Sidebar loads
  useEffect(() => {
    const storedUser = localStorage.getItem('fleetflow_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('fleetflow_user'); // Clear session
    navigate('/'); // Send back to login screen
  };

  const menuItems = [
    { path: '/dashboard', name: 'Dashboard', icon: <LayoutDashboard className="nav-icon" /> },
    { path: '/registry', name: 'Vehicle Registry', icon: <Truck className="nav-icon" /> },
    { path: '/dispatch', name: 'Trip Dispatcher', icon: <Map className="nav-icon" /> },
    { path: '/maintenance', name: 'Maintenance', icon: <Wrench className="nav-icon" /> },
    { path: '/expenses', name: 'Trip & Expense', icon: <Receipt className="nav-icon" /> },
    { path: '/performance', name: 'Performance', icon: <Users className="nav-icon" /> },
    { path: '/analytics', name: 'Analytics', icon: <BarChart3 className="nav-icon" /> },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src={logo} alt="FleetFlow Logo" className="sidebar-logo" />
        FleetFlow
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* NEW: User Profile and Sign Out Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user-info">
          <div className="user-avatar">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <span className="user-name">{user.username.split('@')[0]}</span>
            <span className="user-role">{user.role}</span>
          </div>
        </div>
        
        <button className="sidebar-signout" onClick={handleSignOut}>
          <LogOut size={18} />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;