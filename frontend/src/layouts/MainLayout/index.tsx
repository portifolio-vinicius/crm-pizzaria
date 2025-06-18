import React from 'react';
import Header from '../../components/organisms/Header';
import './styles.css';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="main-layout">
      <Header />
      <div className="main-container">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
