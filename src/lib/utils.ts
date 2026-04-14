import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    Fiction: 'bg-purple-100 text-purple-800',
    'Non-Fiction': 'bg-blue-100 text-blue-800',
    Science: 'bg-green-100 text-green-800',
    History: 'bg-amber-100 text-amber-800',
    Technology: 'bg-cyan-100 text-cyan-800',
    Biography: 'bg-pink-100 text-pink-800',
    Mystery: 'bg-gray-100 text-gray-800',
    Romance: 'bg-red-100 text-red-800',
  };
  return colors[category] || 'bg-gray-100 text-gray-800';
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    AVAILABLE: 'bg-green-100 text-green-800',
    BORROWED: 'bg-yellow-100 text-yellow-800',
    PENDING: 'bg-blue-100 text-blue-800',
    APPROVED: 'bg-emerald-100 text-emerald-800',
    REJECTED: 'bg-red-100 text-red-800',
    RETURNED: 'bg-gray-100 text-gray-800',
    OVERDUE: 'bg-orange-100 text-orange-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}
