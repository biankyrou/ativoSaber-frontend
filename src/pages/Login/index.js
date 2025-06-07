import React, { useState } from 'react';
import axios from 'axios';
import './index.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; 
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const LoginUsuario = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/token/`, {
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
      MySwal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',  
          title: 'Erro ao fazer login. Verifique suas credenciais.',
          showConfirmButton: false,
          timer: 4000,
          timerProgressBar: true,
          background: '#d6e7d1',  
          color: '#17631b',       
          iconColor: '#3E846B',   
          });
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
