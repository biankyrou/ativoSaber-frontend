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
      <h2 className="guia-title">🌿Guia de Uso</h2>
      <ul className="guia-list">
        <li>✨ Crie sua conta e faça seu login.</li>
        <li>🌟 Cadastre ativos financeiros enquanto aprende sobre o mercado.</li>
        <li>📈 Acompanhe e visualize o rendimento dos seus ativos de forma prática.</li>
        <li>📚 Explore conteúdos educativos que ajudam você a entender melhor o mercado financeiro.</li>
      </ul>

      {/* Botão de ação - Roadmap */}
      <button className="roadmap-btn" onClick={handleRoadmapClick}>
        🚀 Explorar o Roadmap
      </button>
    </div>
  </section>
);

};

export default GuiaDeUso;
