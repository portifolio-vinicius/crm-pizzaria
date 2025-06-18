import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';
import './Loading.css';

export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'circular' | 'linear' | 'dots' | 'spinner';
  text?: string;
  fullScreen?: boolean;
  color?: 'primary' | 'secondary' | 'inherit';
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  variant = 'circular',
  text,
  fullScreen = false,
  color = 'primary',
  className = '',
}) => {
  const classes = [
    'loading',
    `loading--${size}`,
    `loading--${variant}`,
    `loading--${color}`,
    fullScreen && 'loading--fullscreen',
    className
  ].filter(Boolean).join(' ');

  const getSizeValue = () => {
    switch (size) {
      case 'sm': return 20;
      case 'md': return 32;
      case 'lg': return 48;
      case 'xl': return 64;
      default: return 32;
    }
  };

  const renderLoadingContent = () => {
    switch (variant) {
      case 'circular':
        return (
          <CircularProgress 
            size={getSizeValue()} 
            className="loading__spinner"
          />
        );
        
      case 'dots':
        return (
          <div className="loading__dots">
            <div className="loading__dot"></div>
            <div className="loading__dot"></div>
            <div className="loading__dot"></div>
          </div>
        );
        
      case 'spinner':
        return (
          <div className="loading__custom-spinner">
            <div className="loading__spinner-ring"></div>
          </div>
        );
        
      default:
        return (
          <CircularProgress 
            size={getSizeValue()} 
            className="loading__spinner"
          />
        );
    }
  };

  const content = (
    <div className="loading__content">
      {renderLoadingContent()}
      {text && (
        <Typography 
          variant="body2" 
          className="loading__text"
        >
          {text}
        </Typography>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className={classes}>
        <div className="loading__backdrop" />
        {content}
      </div>
    );
  }

  return (
    <Box className={classes}>
      {content}
    </Box>
  );
};

export default Loading;
