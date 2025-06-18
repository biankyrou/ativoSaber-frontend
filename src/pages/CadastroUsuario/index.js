import React, { useState } from 'react';
import axios from 'axios';
import './index.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const CadastroUsuario = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleCadastro = async (e) => {
    e.preventDefault();

    if (nome.length < 4) {
      setMensagem('O nome deve ter pelo menos 4 caracteres.');
      return;
    }

    if (senha.length < 6) {
      setMensagem('A senha deve ter ao menos 6 caracteres.');
      return;
    }

    try {
      const resposta = await axios.get(`${process.env.REACT_APP_API_URL}/checar-email/`, {
        params: { email }
      });

      if (resposta.data.existe) {
        setMensagem('Este email já está cadastrado.');
        return;
      }

      await axios.post(`${process.env.REACT_APP_API_URL}/usuarios/`, {
        nome,
        email,
        password: senha,
      });

      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Usuário cadastrado com sucesso!',
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
        background: '#CBE1D4',
        color: '#17631b',
        iconColor: '#2e7d32',
        customClass: {
          popup: 'swal2-toast-green',
        }
      });

      setNome('');
      setEmail('');
      setSenha('');
      setMensagem('');
    } catch (error) {
      MySwal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'Erro ao cadastrar usuário.',
        showConfirmButton: false,
        timer: 3000,
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
        <h2>Cadastre-se</h2>
        <form onSubmit={handleCadastro}>
          <label>Nome:</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />

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

          <button type="submit">Cadastrar</button>
        </form>
        {mensagem && <p style={{ color: 'red' }}>{mensagem}</p>}
      </div>
    </section>
  );
};

export default CadastroUsuario;
