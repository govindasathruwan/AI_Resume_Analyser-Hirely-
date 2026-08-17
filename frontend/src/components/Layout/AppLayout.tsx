import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const AppLayout = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden transition-colors duration-200" style={{ background: 'var(--bg)' }}>
      <Sidebar />
      <main
        className="flex-1 h-screen overflow-y-auto"
        style={{ marginLeft: 'var(--sidebar-w)' }}
      >
        <div className="p-6 md:p-8 max-w-6xl mx-auto animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
