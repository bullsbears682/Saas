import React from 'react';

interface LoadingSpinnerProps {
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ text = 'Loading...' }) => {
  return (
    <div className="flex items-center justify-center">
      <div className="loading-spinner"></div>
      <span className="text-gray-600">{text}</span>
    </div>
  );
};