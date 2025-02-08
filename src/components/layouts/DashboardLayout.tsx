'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname() || '';

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className={`d-flex flex-column flex-shrink-0 p-3 bg-dark text-white ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`} style={{ width: sidebarCollapsed ? '80px' : '280px', height: '100vh', transition: 'width 0.3s' }}>
        <div className="d-flex align-items-center mb-3">
          <span className="fs-4">{!sidebarCollapsed && 'HR System'}</span>
          <button 
            className="btn btn-link text-white ms-auto p-0" 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <i className={`bi bi-chevron-${sidebarCollapsed ? 'right' : 'left'}`}></i>
          </button>
        </div>
        <hr />
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            <Link 
              href="/dashboard" 
              className={`nav-link text-white ${pathname === '/dashboard' ? 'active' : ''}`}
            >
              <i className="bi bi-speedometer2 me-2"></i>
              {!sidebarCollapsed && 'Dashboard'}
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              href="/employees" 
              className={`nav-link text-white ${pathname === '/employees' ? 'active' : ''}`}
            >
              <i className="bi bi-people me-2"></i>
              {!sidebarCollapsed && 'Employees'}
            </Link>
          </li>
          {user?.role === 'ADMIN' && (
            <li>
              <Link 
                href="/employee/new" 
                className={`nav-link text-white ${pathname === '/employee/new' ? 'active' : ''}`}
              >
                <i className="bi bi-person-plus me-2"></i>
                {!sidebarCollapsed && 'Add Employee'}
              </Link>
            </li>
          )}
        </ul>
        <hr />
        <div className="dropdown">
          <a href="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
            <img src={`https://ui-avatars.com/api/?name=${user?.name}&background=random`} alt="" width="32" height="32" className="rounded-circle me-2" />
            {!sidebarCollapsed && (
              <strong>{user?.name}</strong>
            )}
          </a>
          <ul className="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
            <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
          </ul>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-grow-1 bg-light">
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
          <div className="container-fluid">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">Home</li>
              <li className="breadcrumb-item active">{pathname.split('/')[1] || 'Dashboard'}</li>
            </ol>
          </div>
        </nav>

        {children}
      </div>

      <style jsx>{`
        .sidebar-collapsed .nav-link {
          padding: 0.5rem;
          text-align: center;
        }
        .sidebar-collapsed .nav-link i {
          margin: 0 !important;
        }
      `}</style>
    </div>
  );
};