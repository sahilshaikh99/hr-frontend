'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { EmployeeList } from '@/components/employee/EmployeeList';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';

export default function EmployeesPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="container-fluid py-4">
          <div className="card">
            <div className="card-header">
              <h4 className="mb-0">Employee Management</h4>
            </div>
            <div className="card-body p-0">
              <EmployeeList />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
} 