import React, { useState } from 'react';
import axios from 'axios';
import './index.css';

const CadastroUsuario = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleCadastro = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/usuarios/', {
        nome,
        email,
        password: senha,
      });
      setMensagem('Usuário cadastrado com sucesso!');
      setNome('');
      setEmail('');
      setSenha('');
    } catch (error) {
      setMensagem('Erro ao cadastrar usuário.');
      console.error(error);
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
        {mensagem && <p>{mensagem}</p>}
      </div>
    </section>
  );
};

export default CadastroUsuario;
