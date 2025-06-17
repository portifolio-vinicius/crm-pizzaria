import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './features/Home';
import Profile from './features/Profile';
import PrivateRoute from './routes/PrivateRoute';
import MainLayout from './layouts/MainLayout';

const App: React.FC = () => (
  <Router>
    <MainLayout>
      <Routes>
        <Route
          path="/"
          element={(
            <PrivateRoute role="ADMIN">
              <Home />
            </PrivateRoute>
          )}
        />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </MainLayout>
  </Router>
);

export default App;
