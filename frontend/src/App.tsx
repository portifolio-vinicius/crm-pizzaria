import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './features/Home';
import Profile from './features/Profile';
import MainLayout from './layouts/MainLayout';

const App: React.FC = () => (
  <Router>
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </MainLayout>
  </Router>
);

export default App;
