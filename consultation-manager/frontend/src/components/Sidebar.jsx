import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const protectedItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/clients', label: 'Clients', icon: '👥' },
  { to: '/consultations', label: 'Consultations', icon: '💬' },
  { to: '/recordings', label: 'Recordings', icon: '🎥' },
];

const adminItems = [
  { to: '/admin', label: 'Admin', icon: '⚙️' },
];

export default function Sidebar() {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <>
      <button
        className="sidebar-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle sidebar"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <span className="sidebar-brand">🎙 ConsultHub</span>
        </div>

        <nav className="sidebar-nav">
          {isAuthenticated && !isAdmin && protectedItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
          {isAuthenticated && isAdmin && adminItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {isAuthenticated && (
          <div className="sidebar-footer">
            <button type="button" className="sidebar-logout" onClick={handleLogout}>
              <span className="sidebar-icon">🚪</span>
              <span>Logout</span>
            </button>
          </div>
        )}
      </aside>

      {isOpen && (
        <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />
      )}
    </>
  );
}
