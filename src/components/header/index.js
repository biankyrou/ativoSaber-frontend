import React from 'react';
import './index.css';
import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';  // importa o contexto

const Header = () => {
    const { user, logout } = useAuth();  

    return (
        <header className="header">
            <div className="logo-container">
                <img src={logo} alt="Logo" className="logo" />
                <h1>
                    <Link to="/" className="home-link">Ativo Saber</Link>
                </h1>
            </div>

            <nav className="nav-center">
                <a href="#inicio">Início</a>
                <a href="#guia">Guia</a>
                <a href="#contato">Contato</a>
            </nav>

            <div className="auth-buttons">
                {user ? (
                    <>
                        <span className="welcome-msg">Olá, {user.nome}</span>
                        <button onClick={logout} className="logout-btn">DESLOGAR</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="login-btn">LOGIN</Link>
                        <Link to="/register" className="register-btn">REGISTRAR</Link>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
