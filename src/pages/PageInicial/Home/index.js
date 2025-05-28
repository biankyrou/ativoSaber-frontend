import React from 'react';
import './index.css';
import { Link } from 'react-router-dom';
import imagemHome from '../../../assets/imagem-home.png';
import { useAuth } from '../../../contexts/AuthContext'; 

const Home = () => {
    const { user } = useAuth(); 

    return (
        <section id="inicio" className="home">
            <div className="container-home">
                <div className="home-texto">
                    <h2 className="home-subtitle">MERCADO FINANCEIRO | EDUCAÇÃO</h2>
                    <h1 className="home-title">Ativo Saber</h1>
                    <p className="home-description">
                        Ativo Saber é uma plataforma interativa para cadastrar e gerenciar ativos financeiros 
                        enquanto aprende sobre o mercado, simulando o funcionamento de um banco na prática.
                    </p>

                    {user && (
                        <button className="cadastro-home-btn">
                            <Link to="/cadastro-ativo" className="cadastro-link">CADASTRE SEU ATIVO</Link>
                        </button>
                    )}
                </div>
                <div className="home-imagem">
                    <img src={imagemHome} alt="Imagem sobre ativos financeiros" />
                </div>
            </div>
        </section>
    );
};

export default Home;
