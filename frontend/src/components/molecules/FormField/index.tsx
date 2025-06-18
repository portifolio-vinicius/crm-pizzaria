import React from 'react';
import { FormControl, FormLabel, FormHelperText, Box } from '@mui/material';
import Input from '../../atoms/Input';
import './FormField.css';

export interface FormFieldProps {
  label?: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  children?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  orientation?: 'vertical' | 'horizontal';
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  error = false,
  helperText,
  children,
  className = '',
  size = 'md',
  fullWidth = true,
  orientation = 'vertical',
}) => {
  const classes = [
    'form-field',
    `form-field--${size}`,
    `form-field--${orientation}`,
    error && 'form-field--error',
    fullWidth && 'form-field--full-width',
    className
  ].filter(Boolean).join(' ');

  return (
    <FormControl 
      className={classes}
      error={error}
      fullWidth={fullWidth}
    >
      {label && (
        <FormLabel className="form-field__label">
          {label}
          {required && (
            <span className="form-field__required">*</span>
          )}
        </FormLabel>
      )}
      
      <Box className="form-field__input-container">
        {children}
      </Box>
      
      {helperText && (
        <FormHelperText className="form-field__helper-text">
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default FormField;
