import React from 'react';
import MuiButton, { ButtonProps } from '@mui/material/Button';
import './styles.css';

const Button: React.FC<ButtonProps> = (props) => <MuiButton {...props} />;

export default Button;
