import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ServiceLink from './ServiceLink';

const publicItems = [{ to: '/', label: 'Home', end: true }];

const protectedItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/clients', label: 'Clients' },
  { to: '/consultations', label: 'Consultations' },
  { to: '/recordings', label: 'Recordings' },
];

const adminItems = [
  { to: '/admin', label: 'Admin' },
];

export default function TopNav() {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="topnav">
      <NavLink to="/" className="topnav-brand">
        <span className="brand-icon">🎙</span>
        <div>
          <strong>ConsultHub</strong>
          <small>Consultation Manager</small>
        </div>
      </NavLink>

      <nav className="topnav-links">
        {!isAdmin && publicItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `topnav-link ${isActive ? 'active' : ''}`}
          >
            {item.label}
          </NavLink>
        ))}
        {isAuthenticated && isAdmin && adminItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `topnav-link ${isActive ? 'active' : ''}`}
          >
            {item.label}
          </NavLink>
        ))}
        {isAuthenticated && !isAdmin && protectedItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `topnav-link ${isActive ? 'active' : ''}`}
          >
            {item.label}
          </NavLink>
        ))}
        {!isAuthenticated && protectedItems.map((item) => (
          <ServiceLink key={item.to} to={item.to} className="topnav-link">
            {item.label}
          </ServiceLink>
        ))}
      </nav>

      <div className="topnav-actions">
        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? '🌙' : '☀️'}
          <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
        </button>

        {isAuthenticated ? (
          <>
            <span className="user-badge">{user?.name}</span>
            <button type="button" className="btn btn-ghost" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="btn btn-primary topnav-cta">
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
