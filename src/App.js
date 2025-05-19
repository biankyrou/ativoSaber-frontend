import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/header/index.js';
import PageInicial from './pages/PageInicial/index.js';
import CadastroAtivo from './pages/CadastroAtivo/index.js';
import ListarAtivos from './pages/DashboardAtivo/index.js';
import CadastroUsuario from './pages/CadastroUsuario/index.js';
import Login from './pages/Login/index.js';
import AtivoDetalhado from './pages/AtivoDetalhado/index.js';

import { AuthProvider } from './contexts/AuthContext.js';
import { useAuth } from './contexts/AuthContext';

// Componente de rota protegida
const PrivateRoute = ({ element }) => {
  const { user } = useAuth();
  return user ? element : <Login />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header /> {/* Header sempre visível */}
        <Routes>
          <Route path="/" element={<PageInicial />} />
          <Route path="/cadastro-ativo" element={<PrivateRoute element={<CadastroAtivo />} />} />
          <Route path="/listar-ativos" element={<PrivateRoute element={<ListarAtivos />} />} />
          <Route path="/register" element={<CadastroUsuario />} />
          <Route path="/login" element={<Login />} />
          <Route path="/ativos/:id" element={<AtivoDetalhado />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
