import React from 'react';
import MuiButton, { ButtonProps as MuiButtonProps } from '@mui/material/Button';
import { CircularProgress } from '@mui/material';
import './Button.css';

export interface ButtonProps extends Omit<MuiButtonProps, 'size' | 'variant'> {
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'outlined' | 'text' | 'danger' | 'success';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children,
  className = '',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'start',
  size = 'md',
  variant = 'primary',
  fullWidth = false,
  ...props 
}) => {
  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth && 'btn--full-width',
    loading && 'btn--loading',
    disabled && 'btn--disabled',
    className
  ].filter(Boolean).join(' ');

  // Map custom variants to MUI variants
  const getMuiVariant = () => {
    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'danger':
      case 'success':
        return 'contained';
      case 'outlined':
        return 'outlined';
      case 'text':
        return 'text';
      default:
        return 'contained';
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <span className="btn__content">
          <CircularProgress 
            size={size === 'sm' ? 14 : size === 'lg' || size === 'xl' ? 18 : 16} 
            className="btn__loading-spinner"
          />
          <span className="btn__loading-text">{children}</span>
        </span>
      );
    }

    if (icon) {
      return (
        <span className="btn__content">
          {iconPosition === 'start' && <span className="btn__icon btn__icon--start">{icon}</span>}
          <span className="btn__text">{children}</span>
          {iconPosition === 'end' && <span className="btn__icon btn__icon--end">{icon}</span>}
        </span>
      );
    }

    return children;
  };

  return (
    <MuiButton 
      {...props}
      disabled={disabled || loading}
      className={classes}
      variant={getMuiVariant()}
    >
      {renderContent()}
    </MuiButton>
  );
};

export default Button;
