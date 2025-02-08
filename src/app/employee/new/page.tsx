'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { EmployeeForm } from '@/components/employee/EmployeeForm';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';

export default function NewEmployeePage() {
  return (
    <ProtectedRoute requireAdmin>
      <DashboardLayout>
        <div className="container-fluid py-4">
          <div className="card">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h4 className="mb-0">Add New Employee</h4>
            </div>
            <div className="card-body">
              <EmployeeForm />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
} 