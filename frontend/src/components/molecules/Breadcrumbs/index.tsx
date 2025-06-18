import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from '@mui/icons-material';
import './Breadcrumbs.css';

export interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: React.ReactNode;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  homePath?: string;
  separator?: React.ReactNode;
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  showHome = true,
  homePath = '/',
  separator = <ChevronRight />,
  className = ''
}) => {
  const allItems = showHome 
    ? [{ label: 'Home', path: homePath, icon: <Home /> }, ...items]
    : items;

  return (
    <nav className={`breadcrumbs ${className}`} aria-label="Navegação estrutural">
      <ol className="breadcrumbs__list">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          
          return (
            <li key={index} className="breadcrumbs__item">
              {item.path && !isLast ? (
                <Link 
                  to={item.path} 
                  className="breadcrumbs__link"
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.icon && (
                    <span className="breadcrumbs__icon">
                      {item.icon}
                    </span>
                  )}
                  {item.label}
                </Link>
              ) : (
                <span 
                  className={`breadcrumbs__text ${isLast ? 'breadcrumbs__text--current' : ''}`}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.icon && (
                    <span className="breadcrumbs__icon">
                      {item.icon}
                    </span>
                  )}
                  {item.label}
                </span>
              )}
              
              {!isLast && (
                <span className="breadcrumbs__separator" aria-hidden="true">
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
