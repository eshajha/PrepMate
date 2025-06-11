import React from 'react';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`bg-white text-gray-900 rounded-2xl shadow-lg p-6 mb-6 ${className}`}>
    {children}
  </div>
);
