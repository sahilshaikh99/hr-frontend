'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Employee } from '@/types';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { EmployeeForm } from '@/components/employee/EmployeeForm';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';

export default function EditEmployeePage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  const authData = localStorage.getItem('authData');
  const { token } = authData ? JSON.parse(authData) : { token: '' };

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/employees/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const { success, data } = await response.json();
          if (success) {
            setEmployee(data);
          } else {
            throw new Error('Failed to fetch employee');
          }
        } else {
          throw new Error('Failed to fetch employee');
        }
      } catch (error) {
        console.error('Failed to fetch employee:', error);
        router.push('/employees');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id, router, token]);

  if (loading) {
    return (
      <ProtectedRoute requireAdmin>
        <DashboardLayout>
          <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (!employee) return null;

  return (
    <ProtectedRoute requireAdmin>
      <DashboardLayout>
        <div className="container-fluid py-4">
          <div className="card">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h4 className="mb-0">Edit Employee</h4>
            </div>
            <div className="card-body">
              <EmployeeForm employee={employee} isEdit />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
} 