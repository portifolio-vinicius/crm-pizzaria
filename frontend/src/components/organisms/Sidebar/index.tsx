import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import './Sidebar.css';

export interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  children?: SidebarItem[];
  badge?: string | number;
  disabled?: boolean;
}

export interface SidebarProps {
  items: SidebarItem[];
  collapsed?: boolean;
  onToggle?: () => void;
  className?: string;
  brand?: {
    name: string;
    logo?: React.ReactNode;
    path?: string;
  };
}

const Sidebar: React.FC<SidebarProps> = ({
  items,
  collapsed = false,
  onToggle,
  className = '',
  brand
}) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const isActive = (item: SidebarItem): boolean => {
    if (item.path) {
      return location.pathname === item.path;
    }
    
    if (item.children) {
      return item.children.some(child => isActive(child));
    }
    
    return false;
  };

  const renderItem = (item: SidebarItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const active = isActive(item);

    if (item.path) {
      return (
        <Link
          key={item.id}
          to={item.path}
          className={`sidebar__item sidebar__item--level-${level} ${
            active ? 'sidebar__item--active' : ''
          } ${item.disabled ? 'sidebar__item--disabled' : ''}`}
        >
          {item.icon && (
            <span className="sidebar__item-icon">
              {item.icon}
            </span>
          )}
          {!collapsed && (
            <>
              <span className="sidebar__item-label">{item.label}</span>
              {item.badge && (
                <span className="sidebar__item-badge">{item.badge}</span>
              )}
            </>
          )}
        </Link>
      );
    }

    return (
      <div key={item.id} className="sidebar__group">
        <button
          className={`sidebar__item sidebar__item--level-${level} sidebar__item--group ${
            active ? 'sidebar__item--active' : ''
          } ${item.disabled ? 'sidebar__item--disabled' : ''}`}
          onClick={() => !collapsed && toggleExpanded(item.id)}
          disabled={item.disabled}
        >
          {item.icon && (
            <span className="sidebar__item-icon">
              {item.icon}
            </span>
          )}
          {!collapsed && (
            <>
              <span className="sidebar__item-label">{item.label}</span>
              {item.badge && (
                <span className="sidebar__item-badge">{item.badge}</span>
              )}
              {hasChildren && (
                <span className={`sidebar__item-chevron ${isExpanded ? 'sidebar__item-chevron--expanded' : ''}`}>
                  <ChevronRight />
                </span>
              )}
            </>
          )}
        </button>
        
        {hasChildren && !collapsed && isExpanded && (
          <div className="sidebar__children">
            {item.children!.map(child => renderItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''} ${className}`}>
      {brand && (
        <div className="sidebar__brand">
          {brand.path ? (
            <Link to={brand.path} className="sidebar__brand-link">
              {brand.logo && (
                <span className="sidebar__brand-logo">
                  {brand.logo}
                </span>
              )}
              {!collapsed && (
                <span className="sidebar__brand-name">{brand.name}</span>
              )}
            </Link>
          ) : (
            <>
              {brand.logo && (
                <span className="sidebar__brand-logo">
                  {brand.logo}
                </span>
              )}
              {!collapsed && (
                <span className="sidebar__brand-name">{brand.name}</span>
              )}
            </>
          )}
        </div>
      )}

      <nav className="sidebar__nav">
        {items.map(item => renderItem(item))}
      </nav>

      {onToggle && (
        <button
          className="sidebar__toggle"
          onClick={onToggle}
          aria-label={collapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      )}
    </aside>
  );
};

export default Sidebar;
