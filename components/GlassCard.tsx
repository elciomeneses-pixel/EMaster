
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`glass rounded-2xl p-4 transition-all duration-300 ${className} ${onClick ? 'cursor-pointer active:scale-95' : ''}`}
    >
      {children}
    </div>
  );
};
