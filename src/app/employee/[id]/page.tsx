'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Employee } from '@/types';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';

export default function EmployeeDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { user } = useAuth();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await fetch(`/api/employees/${id}`);
        if (response.ok) {
          const data = await response.json();
          setEmployee(data);
        } else {
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Failed to fetch employee:', error);
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id, router]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!employee) return null;

  return (
    <ProtectedRoute>
      <div className="container py-4">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-0">Employee Information</h4>
              <small className="text-muted">Personal details and information</small>
            </div>
            {user?.role === 'ADMIN' && (
              <button
                onClick={() => router.push(`/employee/${id}/edit`)}
                className="btn btn-primary"
              >
                Edit
              </button>
            )}
          </div>
          <div className="card-body">
            <dl className="row">
              <dt className="col-sm-3">Full name</dt>
              <dd className="col-sm-9">{employee.name}</dd>

              <dt className="col-sm-3">Email</dt>
              <dd className="col-sm-9">{employee.email}</dd>

              <dt className="col-sm-3">Position</dt>
              <dd className="col-sm-9">{employee.position}</dd>

              <dt className="col-sm-3">Department</dt>
              <dd className="col-sm-9">{employee.department}</dd>

              {user?.role === 'ADMIN' && (
                <>
                  <dt className="col-sm-3">Salary</dt>
                  <dd className="col-sm-9">${employee.salary.toLocaleString()}</dd>
                </>
              )}
            </dl>
          </div>
        </div>
        <div className="mt-3">
          <button
            onClick={() => router.push('/dashboard')}
            className="btn btn-secondary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
} 