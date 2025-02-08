'use client';

import React, { useState } from 'react';
import { Employee } from '@/types';
import { useRouter } from 'next/navigation';

interface EmployeeFormProps {
  employee?: Employee;
  isEdit?: boolean;
}

interface FormErrors {
  [key: string]: string;
}

interface EmployeeFormData extends Omit<Employee, '_id' | 'createdAt' | 'updatedAt'> {
  name: string;
  email: string;
  position: string;
  department: string;
  salary: number;
}

const INITIAL_FORM_DATA: EmployeeFormData = {
  name: '',
  email: '',
  position: '',
  department: '',
  salary: 0,
};

const DEPARTMENTS = [
  'Engineering',
  'Marketing',
  'Sales',
  'Human Resources',
  'Finance',
  'Operations',
  'IT',
  'Customer Support'
];

export const EmployeeForm = ({ employee, isEdit = false }: EmployeeFormProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState<EmployeeFormData>({
    ...INITIAL_FORM_DATA,
    ...employee,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const authData = localStorage.getItem('authData');
  const { token } = authData ? JSON.parse(authData) : { token: '' };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Name must be less than 50 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Position validation
    if (!formData.position.trim()) {
      newErrors.position = 'Position is required';
    } else if (formData.position.length < 2) {
      newErrors.position = 'Position must be at least 2 characters long';
    }

    // Department validation
    if (!formData.department) {
      newErrors.department = 'Please select a department';
    }

    // Salary validation
    if (formData.salary <= 0) {
      newErrors.salary = 'Salary must be greater than 0';
    } else if (formData.salary > 1000000) {
      newErrors.salary = 'Salary cannot exceed 1,000,000';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const url = isEdit 
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/employees/${employee?._id}`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/employees`;
      
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save employee');
      }

      router.push('/employees');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to save employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {submitError && (
        <div className="alert alert-danger" role="alert">
          {submitError}
        </div>
      )}

      <div className="row g-3">
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter employee name"
              required
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name}</div>
            )}
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email <span className="text-danger">*</span>
            </label>
            <input
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              required
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="position" className="form-label">
              Position <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className={`form-control ${errors.position ? 'is-invalid' : ''}`}
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="Enter position"
              required
            />
            {errors.position && (
              <div className="invalid-feedback">{errors.position}</div>
            )}
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="department" className="form-label">
              Department <span className="text-danger">*</span>
            </label>
            <select
              className={`form-select ${errors.department ? 'is-invalid' : ''}`}
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            >
              <option value="">Select department</option>
              {DEPARTMENTS.map(dept => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            {errors.department && (
              <div className="invalid-feedback">{errors.department}</div>
            )}
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="salary" className="form-label">
              Salary <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text">$</span>
              <input
                type="number"
                className={`form-control ${errors.salary ? 'is-invalid' : ''}`}
                id="salary"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="Enter salary"
                min="0"
                step="0.01"
                required
              />
              {errors.salary && (
                <div className="invalid-feedback">{errors.salary}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-end gap-2 mt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="btn btn-outline-secondary"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              {isEdit ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            isEdit ? 'Update Employee' : 'Create Employee'
          )}
        </button>
      </div>
    </form>
  );
}; 