'use client';

import React from 'react';
import Link from 'next/link';

export const AddEmployeeButton = () => {
  return (
    <Link
      href="/employee/new"
      className="btn btn-primary"
    >
      Add Employee
    </Link>
  );
}; 