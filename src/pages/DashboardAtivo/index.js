import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { listarAtivos, deletarAtivo } from '../../services/api';
import setaEsquerda from '../../assets/seta-esquerda.png'; 
import './index.css';

const ListaAtivos = () => {
    const [ativos, setAtivos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAtivos = async () => {
            try {
                const data = await listarAtivos();
                if (data) {
                    setAtivos(data);
                } else {
                    setAtivos([]);
                }
            } catch (err) {
                setError("Erro ao buscar ativos");
                console.error("Erro:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAtivos();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Tem certeza que deseja excluir este ativo?")) {
            try {
                await deletarAtivo(id);
                setAtivos(ativos.filter(ativo => ativo.id !== id));
            } catch (err) {
                alert("Erro ao excluir ativo");
                console.error("Erro:", err);
            }
        }
    };

    if (loading) return <p>Carregando ativos...</p>;
    if (error) return <p>{error}</p>;

    return (
        <section className="lista-ativos">
            <div className="container-lista">
                {/* Botão de Voltar */}
                <button className="voltar-btn" onClick={() => navigate('/cadastro-ativo')}>
                    <img src={setaEsquerda} alt="Voltar" />
                </button>

                <h1 className="lista-title">Lista de Ativos</h1>

                {ativos.length === 0 ? (
                    <p className="nenhum-ativo">Nenhum ativo cadastrado.</p>
                ) : (
                    <ul>
                        {ativos.map((ativo) => (
                            <li key={ativo.id}>
                                <div className="ativo-info">
                                    <strong>{ativo.nome}</strong> - {ativo.tipo} - {ativo.valor_unitario} BRL
                                </div>
                                <div className="button-group">
                                    <Link 
                                        to={`/ativos/${ativo.id}`} 
                                        className="detalhes-btn"
                                    >
                                        Ver detalhes
                                    </Link>
                                    <button 
                                        className="delete-btn" 
                                        onClick={() => handleDelete(ativo.id)}
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
};

export default ListaAtivos;
