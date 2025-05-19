import React from 'react';
import './index.css';

const Contato = () => {
    return (
        <section id="contato" className="contato">
            <div className="container-contato">
                <h2 className="contato-title">Contato</h2>
                <p className="contato-description">
                    Tem dúvidas ou ideias para melhorar o site? Entre em contato comigo!
                </p>
                <div className="contato-info">
                    <p>📩 Email: bianca.carvalio0@gmail.com</p>
                    <p>📞 Telefone: (16) XXXX-XXXX</p>
                </div>
            </div>
        </section>
    );
};

export default Contato;
