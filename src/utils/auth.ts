import { User } from '@/types';

export const isAdmin = (user: User | null): boolean => {
  console.log('isAdmin check for user:', user);
  return user?.role === 'ADMIN';
}; 