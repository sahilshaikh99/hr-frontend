'use client';

import React, { useEffect, useState } from 'react';
import { Employee } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { isAdmin } from '@/utils/auth';
import Link from 'next/link';

interface ApiResponse {
  success: boolean;
  data: Employee[];
}

export const EmployeeList = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const authData = localStorage.getItem('authData');
  const { token } = authData ? JSON.parse(authData) : { token: '' };

  const isUserAdmin = isAdmin(user);

  const handleDelete = async (id: string) => {
    if (!isUserAdmin) return;
    
    if (!window.confirm('Are you sure you want to delete this employee?')) {
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/employees/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setEmployees(prevEmployees => prevEmployees.filter(emp => emp._id !== id));
        alert('Employee deleted successfully');
      } else {
        throw new Error(data.message || 'Failed to delete employee');
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('Failed to delete employee');
    }
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/employees`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const { success, data }: ApiResponse = await response.json();
          if (success && Array.isArray(data)) {
            setEmployees(data);
          }
        }
      } catch (error) {
        console.error('Failed to fetch employees:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [token]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header bg-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Employee List</h5>
        {isUserAdmin && (
          <Link href="/employee/new" className="btn btn-primary btn-sm">
            <i className="bi bi-plus-lg me-1"></i>
            Add Employee
          </Link>
        )}
      </div>
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Position</th>
              <th>Department</th>
              {isUserAdmin && <th>Salary</th>}
              {isUserAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee._id}>
                <td>
                  <div className="d-flex align-items-center">
                    <img 
                      src={`https://ui-avatars.com/api/?name=${employee.name}&background=random`}
                      className="rounded-circle me-2"
                      width="32"
                      height="32"
                      alt={employee.name}
                    />
                    <div>
                      <div className="fw-bold">{employee.name}</div>
                      <div className="text-muted small">{employee.email}</div>
                    </div>
                  </div>
                </td>
                <td>{employee.email}</td>
                <td>{employee.position}</td>
                <td>{employee.department}</td>
                {isUserAdmin && (
                  <td>${employee.salary.toLocaleString()}</td>
                )}
                {isUserAdmin && (
                  <td>
                    <div className="btn-group btn-group-sm">
                      <Link
                        href={`/employee/${employee._id}/edit`}
                        className="btn btn-outline-primary"
                        title="Edit"
                      >
                        <i className="bi bi-pencil"></i>
                      </Link>
                      <button
                        onClick={() => handleDelete(employee._id)}
                        className="btn btn-outline-danger"
                        title="Delete"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 