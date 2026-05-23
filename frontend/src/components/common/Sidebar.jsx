import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const navItems = [
  { path: '/',             label: 'Dashboard',    icon: '📊' },
  { path: '/patients',     label: 'Patients',     icon: '🧑‍⚕️' },
  { path: '/doctors',      label: 'Doctors',      icon: '👨‍⚕️' },
  { path: '/appointments', label: 'Appointments', icon: '📅' },
  { path: '/billing',      label: 'Billing',      icon: '💳' },
];

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const initials = user?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">🏥</div>
        <div>
          <h2>HMS</h2>
          <p>Hospital Management</p>
        </div>
      </div>
      <nav className="sidebar-nav">
        <div className="nav-section-title">Main Menu</div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <span className="nav-item-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">{initials}</div>
          <div className="user-info">
            <strong>{user?.fullName}</strong>
            <span>{user?.role}</span>
          </div>
        </div>
        <button className="btn-logout" onClick={handleLogout}>
          Sign Out
        </button>
      </div>
    </div>
  );
}
