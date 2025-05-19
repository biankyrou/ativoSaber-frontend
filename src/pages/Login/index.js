import React, { useState } from 'react';
import axios from 'axios';
import './index.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; 

const LoginUsuario = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/token/', {
        email,
        password: senha,
      });

      const { access, refresh } = response.data;

      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      const payload = JSON.parse(atob(access.split('.')[1]));
      const userData = {
        id: payload.user_id,
        email: payload.email,
        nome: payload.nome, 
      };

      setUser(userData);

      setMensagem('Login realizado com sucesso!');
      setEmail('');
      setSenha('');

      navigate('/');
    } catch (error) {
      setMensagem('Erro ao fazer login. Verifique suas credenciais.');
      console.error(error);
    }
  };

  return (
    <section className="form-container">
      <div className="container-usuario">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Senha:</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          <button type="submit">Entrar</button>
        </form>
        {mensagem && <p>{mensagem}</p>}
      </div>
    </section>
  );
};

export default LoginUsuario;
