import React from 'react';
import './index.css';
import Home from './Home/index.js';
import GuiaDeUso from './GuiaUso/index.js';
import Contato from './Contato/index.js';

const PageInicial = () => {
    return (
        <div className="page-inicial">
            <Home />
            <GuiaDeUso />
            <Contato />
        </div>
    );
};

export default PageInicial;