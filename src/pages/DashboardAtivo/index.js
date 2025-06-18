import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { listarAtivos, deletarAtivo } from '../../services/api';
import setaEsquerda from '../../assets/seta-esquerda.png';
import './index.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const formatarTipo = (tipo) => {
    const map = {
        renda_fixa_bancaria: 'Renda Fixa Bancária',
        titulos_publicos: 'Títulos Públicos',
        debentures_creditos: 'Debêntures e Créditos',
    };
    return map[tipo] || tipo;
};

const formatarNegociacao = (tipo) => {
    const map = {
        bolsa: 'Bolsa',
        balcao: 'Balcão',
    };
    return map[tipo] || tipo;
};

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
        MySwal.fire({
            text: "Tem certeza que deseja excluir este ativo?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3E846B',
            cancelButtonColor: '#e77368',
            confirmButtonText: 'Sim, excluir!',
            cancelButtonText: 'Cancelar',
            background: '#fefefe',
            color: '#333',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deletarAtivo(id);
                    setAtivos(ativos.filter(ativo => ativo.id !== id));
                    MySwal.fire({
                        title: 'Excluído!',
                        text: 'O ativo foi excluído com sucesso.',
                        icon: 'success',
                        confirmButtonColor: '#3E846B',
                    });
                } catch (err) {
                    MySwal.fire({
                        title: 'Erro!',
                        text: 'Erro ao excluir o ativo.',
                        icon: 'error',
                        confirmButtonColor: '#e77368',
                    });
                    console.error("Erro:", err);
                }
            }
        });
    };

    if (loading) return <p>Carregando ativos...</p>;
    if (error) return <p>{error}</p>;

    return (
        <section className="lista-ativos">
            <div className="container-lista">
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
                                    <strong>{ativo.nome}</strong> - {formatarTipo(ativo.tipo)} - 
                                    {' R$ '}
                                    {Number(ativo.valor_investido).toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL',
                                        minimumFractionDigits: 2
                                    })}
                                </div>
                                <div className="button-group">
                                    <Link 
                                        to={`/ativos/${ativo.id}`} 
                                        className="detalhes-btn"
                                    >
                                        Ver detalhes
                                    </Link>
                                    <Link 
                                        to={`/avaliar/${ativo.id}`} 
                                        className="avaliar-btn"
                                    >
                                        Avaliar
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
