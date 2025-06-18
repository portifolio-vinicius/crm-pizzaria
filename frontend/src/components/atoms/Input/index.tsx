import React, { forwardRef } from 'react';
import { TextField, TextFieldProps, InputAdornment } from '@mui/material';
import './Input.css';

export interface InputProps extends Omit<TextFieldProps, 'size' | 'variant'> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outlined' | 'filled' | 'standard';
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLDivElement, InputProps>(({
  className = '',
  size = 'md',
  variant = 'outlined',
  startIcon,
  endIcon,
  error = false,
  helperText,
  fullWidth = false,
  ...props
}, ref) => {
  const classes = [
    'input',
    `input--${size}`,
    `input--${variant}`,
    error && 'input--error',
    fullWidth && 'input--full-width',
    className
  ].filter(Boolean).join(' ');

  const InputProps = {
    ...props.InputProps,
    startAdornment: startIcon && (
      <InputAdornment position="start" className="input__icon input__icon--start">
        {startIcon}
      </InputAdornment>
    ),
    endAdornment: endIcon && (
      <InputAdornment position="end" className="input__icon input__icon--end">
        {endIcon}
      </InputAdornment>
    ),
  };

  return (
    <TextField
      ref={ref}
      {...props}
      className={classes}
      variant={variant}
      error={error}
      helperText={helperText}
      fullWidth={fullWidth}
      InputProps={InputProps}
    />
  );
});

Input.displayName = 'Input';

export default Input;
