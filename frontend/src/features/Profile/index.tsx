import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '../../components/atoms/Button';
import { useAuth } from '../../hooks/useAuth';
import './styles.css';

const Profile: React.FC = () => {
  const { token, role, login, logout } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <div className="profile-page">
      {token ? (
        <div>
          <p>Token: {token}</p>
          {role && <p>Role: {role}</p>}
          <Button variant="contained" onClick={logout}>
            Logout
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <TextField
            label="Usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" type="submit">
            Login
          </Button>
        </form>
      )}
    </div>
  );
};

export default Profile;
