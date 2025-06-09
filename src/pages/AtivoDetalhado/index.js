import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAtivo } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import setaEsquerda from '../../assets/seta-esquerda.png';
import axios from 'axios';
import { differenceInMonths, addMonths, format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import './index.css';

const solicitarResgate = async (id, dataResgate) => {
    const token = localStorage.getItem('access_token');  // <-- Buscando direto do localStorage

    if (!token) {
        throw new Error('Usuário não autenticado.');
    }

    try {
        const params = { data_resgate: dataResgate };
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/ativos/${id}/solicitar_resgate/`, {
            params,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erro no resgate:', error);
        throw error.response?.data?.erro || 'Erro ao solicitar resgate';
    }
};


const gerarDadosRendimento = (ativo) => {
    const inicio = new Date(ativo.data_emissao);
    const fim = new Date(ativo.data_vencimento);
    const meses = differenceInMonths(fim, inicio);

    const valorInicial = ativo.valor_investido;
    const valorFinal = ativo.rendimento_esperado;

    if (!valorInicial || !valorFinal || meses <= 0) {
        return [];
    }

    const taxaMensal = Math.pow(valorFinal / valorInicial, 1 / meses) - 1;

    if (isNaN(taxaMensal)) {
        return [];
    }

    const dados = [];
    for (let i = 0; i <= meses; i++) {
        const data = addMonths(inicio, i);
        const rendimento = valorInicial * Math.pow(1 + taxaMensal, i);
        dados.push({
            mes: format(data, 'MMM/yyyy'),
            valor: Number(rendimento.toFixed(2)),
        });
    }

    return dados;
};

const AtivoDetalhado = () => {
    const { id } = useParams();
    const { user, token } = useAuth(); 
    const [ativo, setAtivo] = useState(null);
    const [rendimento, setRendimento] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [resultadoResgate, setResultadoResgate] = useState(null);
    const [erroResgate, setErroResgate] = useState(null);
    const [loadingResgate, setLoadingResgate] = useState(false);
    const [dataResgate, setDataResgate] = useState('');

    useEffect(() => {
        const fetchAtivo = async () => {
            try {
                const data = await getAtivo(id);
                setAtivo(data);
                const dadosRendimento = gerarDadosRendimento(data);
                setRendimento(dadosRendimento);
            } catch (err) {
                setError("Erro ao carregar os dados do ativo.");
            } finally {
                setLoading(false);
            }
        };

        fetchAtivo();
    }, [id]);

    const handleSolicitarResgate = async () => {
        if (!dataResgate) {
            setErroResgate('Por favor, informe a data do resgate.');
            return;
        }

        setLoadingResgate(true);
        setErroResgate(null);
        setResultadoResgate(null);

        try {
            const resultado = await solicitarResgate(id, dataResgate, token);
            setResultadoResgate(resultado);
        } catch (err) {
            setErroResgate(err);
        } finally {
            setLoadingResgate(false);
        }
    };

    if (loading) return <p>Carregando ativo...</p>;
    if (error) return <p>{error}</p>;
    if (!ativo) return <p>Nenhum ativo encontrado.</p>;

    const formatarTaxaRentabilidade = (ativo) => {
        if (ativo.tipo_juros === 'prefixado') {
            return `${ativo.taxa_fixa}% (Prefixado)`;
        } else if (ativo.tipo_juros === 'posfixado') {
            return `${ativo.percentual_sobre_indexador}% (Pós-fixado)`;
        } else if (ativo.tipo_juros === 'hibrido') {
            return `${ativo.taxa_fixa}% + ${ativo.percentual_sobre_indexador}% (Híbrido)`;
        } else {
            return 'N/A';
        }
    };


    return (
        <section className="ativo-detalhado">
             <div className="conteudo-centralizado">
                <div className="ativo-card">
                    <h1>{ativo.nome}</h1>
                    <p><strong>Tipo:</strong> {ativo.tipo}</p>
                    <p><strong>Emissor:</strong> {ativo.emissor}</p>
                    <p><strong>Tipo de Negociação:</strong> {ativo.tipo_negociacao}</p>
                    <p><strong>Valor Unitário:</strong> R$ {Number(ativo.valor_unitario).toFixed(2)}</p>
                    <p><strong>Quantidade:</strong> {Number(ativo.quantidade)}</p>
                    <p><strong>Valor Investido:</strong> R$ {Number(ativo.valor_investido).toFixed(2)}</p>
                    <p><strong>Taxa de Rentabilidade:</strong> {formatarTaxaRentabilidade(ativo)}</p>
                    <p><strong>Tipo de Juros:</strong> {ativo.tipo_juros}</p>
                    <p><strong>Rendimento Esperado:</strong> R$ {Number(ativo.rendimento_esperado).toFixed(2)}</p>
                    <p><strong>Liquidez:</strong> {ativo.liquidez}</p>
                    <p><strong>Data de Emissão:</strong> {new Date(ativo.data_emissao).toLocaleDateString()}</p>
                    <p><strong>Data de Vencimento:</strong> {new Date(ativo.data_vencimento).toLocaleDateString()}</p>
                    <p><strong>Possui Imposto:</strong> {ativo.possuiImposto ? "Sim" : "Não"}
                        {ativo.possuiImposto && (
                            <> - Alíquota: {ativo.aliquotaImposto}%</>
                        )}
                    </p>
                </div>
                <div className="lado-direito">
                    <div className="grafico-rendimento">
                        <h2>Projeção de Rendimento</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={rendimento}>
                                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                                <XAxis dataKey="mes" />
                                <YAxis />
                                <Tooltip formatter={(value) => `R$ ${value}`} />
                                <Line type="monotone" dataKey="valor" stroke="#8884d8" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {ativo.liquidez === 'diaria' && (
                        <div className="resgate-container">
                            <h3>Solicitar Resgate</h3>
                            <div className="resgate-form-resultado">
                                <div className="resgate-form">
                                        <label>
                                            Data do Resgate:
                                            <input 
                                                type="date" 
                                                value={dataResgate} 
                                                onChange={(e) => setDataResgate(e.target.value)} 
                                                min={ativo.data_emissao} 
                                                max={ativo.data_vencimento} 
                                                />
                                        </label>
                                        <button onClick={handleSolicitarResgate} disabled={loadingResgate}>
                                            {loadingResgate ? 'Calculando...' : 'Solicitar Resgate'}
                                        </button>
                                    </div>
                                    {resultadoResgate && (
                                        <div className="resultado-resgate">
                                            <h4>Resultado do Resgate</h4>
                                            <p>Valor Acumulado: R$ {resultadoResgate.valor_acumulado?.toFixed(2)}</p>
                                            <p>Dias Corridos: {resultadoResgate.dias_corridos}</p>
                                            <p>Rendimento: R$ {resultadoResgate.rendimento?.toFixed(2)}</p>
                                        </div>
                                    )}

                                    {erroResgate && <p className="erro-resgate">{erroResgate}</p>}
                               
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <button className="voltar-btn" onClick={() => navigate('/listar-ativos')}>
                <img src={setaEsquerda} alt="Voltar" />
            </button>
        </section>
    );
};

export default AtivoDetalhado;
