import React from 'react';
import './index.css';
import logo from '../../assets/logo.png';
import { Link, useLocation } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const isHome = location.pathname === '/';

    return (
        <header className="header">
            <div className="logo-container">
                <img src={logo} alt="Logo" className="logo" />
                <h1>
                    <Link to="/" className="home-link">Ativo Saber</Link>
                </h1>
            </div>

            <nav className="nav-center">
                {isHome ? (
                    <>
                        <a href="#inicio">Início</a>
                        <a href="#guia">Guia</a>
                        <a href="#contato">Contato</a>
                    </>
                ) : (
                    <>
                        <HashLink smooth to="/#inicio">Início</HashLink>
                        <HashLink smooth to="/#guia">Guia</HashLink>
                        <HashLink smooth to="/#contato">Contato</HashLink>
                    </>
                )}
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
