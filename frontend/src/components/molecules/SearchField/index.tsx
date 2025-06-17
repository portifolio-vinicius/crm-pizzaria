import React from 'react';
import TextField from '@mui/material/TextField';
import './styles.css';

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const SearchField: React.FC<Props> = ({ label, value, onChange }) => (
  <TextField
    className="search-field"
    label={label}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    variant="outlined"
    size="small"
  />
);

export default SearchField;
