import React, { useState, useCallback } from 'react';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import Input from '../../atoms/Input';
import Button from '../../atoms/Button';
import './SearchField.css';

export interface SearchFieldProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
  className?: string;
  showSearchButton?: boolean;
  showClearButton?: boolean;
  debounceMs?: number;
}

const SearchField: React.FC<SearchFieldProps> = ({
  placeholder = 'Pesquisar...',
  value: controlledValue,
  onChange,
  onSearch,
  onClear,
  size = 'md',
  fullWidth = false,
  autoFocus = false,
  disabled = false,
  className = '',
  showSearchButton = false,
  showClearButton = true,
  debounceMs = 300,
}) => {
  const [internalValue, setInternalValue] = useState(controlledValue || '');
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout>();

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const classes = [
    'search-field',
    `search-field--${size}`,
    fullWidth && 'search-field--full-width',
    disabled && 'search-field--disabled',
    className
  ].filter(Boolean).join(' ');

  const debouncedSearch = useCallback((searchValue: string) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      onSearch?.(searchValue);
    }, debounceMs);

    setDebounceTimer(timer);
  }, [debounceTimer, debounceMs, onSearch]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    
    onChange?.(newValue);
    
    if (onSearch && debounceMs > 0) {
      debouncedSearch(newValue);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onSearch?.(value);
    }
  };

  const handleSearchClick = () => {
    onSearch?.(value);
  };

  const handleClear = () => {
    const newValue = '';
    
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    
    onChange?.(newValue);
    onClear?.();
    onSearch?.(newValue);
  };

  const startIcon = <SearchIcon className="search-field__search-icon" />;
  
  const endIcon = showClearButton && value ? (
    <ClearIcon 
      className="search-field__clear-icon" 
      onClick={handleClear}
      style={{ cursor: 'pointer' }}
    />
  ) : undefined;

  return (
    <div className={classes}>
      <Input
        value={value}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        size={size}
        fullWidth={fullWidth}
        autoFocus={autoFocus}
        disabled={disabled}
        startIcon={startIcon}
        endIcon={endIcon}
        className="search-field__input"
      />
      
      {showSearchButton && (
        <Button
          variant="primary"
          size={size}
          onClick={handleSearchClick}
          disabled={disabled}
          className="search-field__button"
          icon={<SearchIcon />}
        >
          Buscar
        </Button>
      )}
    </div>
  );
};

export default SearchField;
