import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Upload, FileText, Briefcase, BarChart3,
  History, Download, User, Settings, LogOut, Sun, Moon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import AppLogo from '../UI/AppLogo';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/upload',    icon: Upload,           label: 'Upload Resume' },
  { path: '/analysis',  icon: FileText,         label: 'Analysis' },
  { path: '/job-match', icon: Briefcase,        label: 'Job Match' },
  { path: '/skill-gap', icon: BarChart3,        label: 'Skill Gap' },
  { path: '/history',   icon: History,          label: 'History' },
  { path: '/reports',   icon: Download,         label: 'Reports' },
];

const bottomItems = [
  { path: '/profile',  icon: User,     label: 'Profile' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside
      style={{
        width: 'var(--sidebar-w)',
        background: 'var(--sidebar-bg)',
        backdropFilter: 'blur(24px) saturate(200%)',
        WebkitBackdropFilter: 'blur(24px) saturate(200%)',
        borderRight: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
      }}
      className="min-h-screen flex flex-col fixed left-0 top-0 z-30 transition-colors duration-200"
    >
      {/* Brand Header with Custom App Logo */}
      <div className="px-4 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--blue-light)', border: '1px solid var(--border)' }}
          >
            <AppLogo size={24} />
          </div>
          <div>
            <p className="text-base font-bold" style={{ color: 'var(--text)', letterSpacing: '-0.3px' }}>Hirely</p>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        <p
          className="text-xs font-semibold uppercase tracking-wider px-2 mb-2"
          style={{ color: 'var(--text-subtle)', fontSize: '10.5px' }}
        >
          Menu
        </p>
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => isActive ? 'sidebar-item-active' : 'sidebar-item'}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}

        <p
          className="text-xs font-semibold uppercase tracking-wider px-2 mb-2 mt-5"
          style={{ color: 'var(--text-subtle)', fontSize: '10.5px' }}
        >
          Account
        </p>
        {bottomItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => isActive ? 'sidebar-item-active' : 'sidebar-item'}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer controls: Single Theme Switch Button */}
      <div className="px-3 py-3 space-y-2.5" style={{ borderTop: '1px solid var(--border)' }}>
        {/* Single Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer"
          style={{
            background: 'var(--blue-light)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
          }}
        >
          <div className="flex items-center gap-2">
            {theme === 'dark' ? (
              <Moon className="w-3.5 h-3.5" style={{ color: 'var(--blue)' }} />
            ) : (
              <Sun className="w-3.5 h-3.5" style={{ color: 'var(--orange)' }} />
            )}
            <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
          </div>
          <span
            className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded"
            style={{ background: 'var(--card-bg)', color: 'var(--blue)' }}
          >
            Switch
          </span>
        </button>

        {/* User Info */}
        <div className="flex items-center gap-2.5 px-1 pt-1">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ background: 'var(--blue)' }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{user?.name}</p>
            <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full btn-ghost"
          style={{ color: 'var(--red)', justifyContent: 'flex-start', borderRadius: '8px', padding: '6px 10px' }}
        >
          <LogOut className="w-4 h-4" />
          <span className="text-xs font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
