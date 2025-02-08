'use client';

import React, { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Employee } from '@/types';

interface DashboardStats {
  totalEmployees: number;
  departmentCounts: { [key: string]: number };
  averageSalary: number;
  salaryByDepartment: { [key: string]: number };
  recentHires: Employee[];
}

interface ApiResponse {
  success: boolean;
  data: Employee[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    departmentCounts: {},
    averageSalary: 0,
    salaryByDepartment: {},
    recentHires: []
  });

  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const authData = localStorage.getItem('authData');
      const parsedAuthData = authData ? JSON.parse(authData) : null;
      setToken(parsedAuthData?.token || '');
    }
  }, []);

  useEffect(() => {
    if (!token) return;

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
            const departmentCounts: { [key: string]: number } = {};
            const salaryByDepartment: { [key: string]: number } = {};
            const departmentEmployees: { [key: string]: number } = {};

            data.forEach(employee => {
              departmentCounts[employee.department] = (departmentCounts[employee.department] || 0) + 1;
              salaryByDepartment[employee.department] = (salaryByDepartment[employee.department] || 0) + employee.salary;
              departmentEmployees[employee.department] = (departmentEmployees[employee.department] || 0) + 1;
            });

            Object.keys(salaryByDepartment).forEach(dept => {
              salaryByDepartment[dept] = Math.round(salaryByDepartment[dept] / departmentEmployees[dept]);
            });

            const averageSalary = Math.round(
              data.reduce((acc, emp) => acc + emp.salary, 0) / data.length
            );

            const recentHires = [...data]
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 5);

            setStats({
              totalEmployees: data.length,
              departmentCounts,
              averageSalary,
              salaryByDepartment,
              recentHires
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [token]);

  if (loading) {
    return (
      <ProtectedRoute>
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

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="container-fluid py-4">
          {/* Overview Stats */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-sm-6 col-xl-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-muted mb-0">Total Employees</h5>
                  <h2 className="mt-2 mb-0">{stats.totalEmployees}</h2>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-muted mb-0">Average Salary</h5>
                  <h2 className="mt-2 mb-0">${stats.averageSalary.toLocaleString()}</h2>
                </div>
              </div>
            </div>
          </div>

          {/* Department Stats */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-lg-6">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white">
                  <h5 className="card-title mb-0">Employees by Department</h5>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Department</th>
                          <th>Employees</th>
                          <th>Avg. Salary</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(stats.departmentCounts).map(([dept, count]) => (
                          <tr key={dept}>
                            <td>{dept}</td>
                            <td>{count}</td>
                            <td>${stats.salaryByDepartment[dept].toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Hires */}
            <div className="col-12 col-lg-6">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white">
                  <h5 className="card-title mb-0">Recent Hires</h5>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Department</th>
                          <th>Position</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.recentHires.map(employee => (
                          <tr key={employee._id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <img 
                                  src={`https://ui-avatars.com/api/?name=${employee.name}&background=random`}
                                  className="rounded-circle me-2"
                                  width="24"
                                  height="24"
                                  alt={employee.name}
                                />
                                {employee.name}
                              </div>
                            </td>
                            <td>{employee.department}</td>
                            <td>{employee.position}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
