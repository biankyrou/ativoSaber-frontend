import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

const GuiaDeUso = () => {
  const navigate = useNavigate();

  const handleRoadmapClick = () => {
    navigate('/roadmap');
  };

  return (
    <section id="guia" className="guia-uso">
      <div className="container-guia">
        <h2 className="guia-title">Guia de Uso</h2>
        <p className="guia-description">
          Aqui você aprenderá como utilizar a plataforma Ativo Saber para cadastrar e gerenciar seus ativos financeiros.
        </p>
        <ul className="guia-list">
          <li>✅ Crie sua conta e faça login.</li>
          <li>✅ Cadastre seus ativos financeiros.</li>
          <li>✅ Acompanhe o rendimento dos ativos.</li>
          <li>✅ Explore os conteúdos educativos sobre investimentos.</li>
        </ul>

        {/* Botão de ação - Roadmap */}
        <button className="roadmap-btn" onClick={handleRoadmapClick}>
          🚀 Explorar Roadmap
        </button>
      </div>
    </section>
  );
};

export default GuiaDeUso;
