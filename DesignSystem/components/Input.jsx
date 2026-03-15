import React from 'react';
import { theme } from '../theme';

const Input = ({ 
  label, 
  placeholder, 
  error, 
  startIcon, 
  endIcon, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "w-full border border-[var(--border-default)] bg-[var(--bg-primary)] text-[var(--text-primary)] rounded-md px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[var(--text-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary-bg)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{label}</label>}
      <div className="relative">
        {startIcon && (
          <div className="absolute left-2.5 top-2.5 h-4 w-4 text-[var(--text-secondary)]">
            {startIcon}
          </div>
        )}
        <input
          className={`${baseStyles} ${startIcon ? 'pl-9' : ''} ${endIcon ? 'pr-9' : ''}`}
          placeholder={placeholder}
          style={{ borderRadius: theme.borderRadius.md }}
          {...props}
        />
        {endIcon && (
          <div className="absolute right-2.5 top-2.5 h-4 w-4 text-[var(--text-secondary)]">
            {endIcon}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-[var(--action-danger-text)]">{error}</p>}
    </div>
  );
};

export default Input;
