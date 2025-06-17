import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './features/Home';
import Profile from './features/Profile';
import Dashboard from './features/Dashboard';
import Clientes from './features/Clientes';
import Produtos from './features/Produtos';
import Pedidos from './features/Pedidos';
import Motoboys from './features/Motoboys';
import Fidelidade from './features/Fidelidade';
import Usuarios from './features/Usuarios';
import PrivateRoute from './routes/PrivateRoute';
import MainLayout from './layouts/MainLayout';

const App: React.FC = () => (
  <Router>
    <MainLayout>
      <Routes>
        {/* Rota pública de login */}
        <Route path="/profile" element={<Profile />} />
        
        {/* Rotas privadas para ADMIN */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute role="ADMIN">
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/clientes"
          element={
            <PrivateRoute role="ADMIN">
              <Clientes />
            </PrivateRoute>
          }
        />
        <Route
          path="/usuarios"
          element={
            <PrivateRoute role="ADMIN">
              <Usuarios />
            </PrivateRoute>
          }
        />
        
        {/* Rotas para ADMIN e ASSISTENTE */}
        <Route
          path="/produtos"
          element={
            <PrivateRoute>
              <Produtos />
            </PrivateRoute>
          }
        />
        <Route
          path="/pedidos"
          element={
            <PrivateRoute>
              <Pedidos />
            </PrivateRoute>
          }
        />
        <Route
          path="/motoboys"
          element={
            <PrivateRoute>
              <Motoboys />
            </PrivateRoute>
          }
        />
        <Route
          path="/fidelidade"
          element={
            <PrivateRoute>
              <Fidelidade />
            </PrivateRoute>
          }
        />
        
        {/* Rota padrão - redireciona para dashboard se logado, senão para home */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/home"
          element={<Home />}
        />
      </Routes>
    </MainLayout>
  </Router>
);

export default App;
