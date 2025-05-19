import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAtivo } from '../../services/api';
import setaEsquerda from '../../assets/seta-esquerda.png'
import './index.css';
import { differenceInMonths, addMonths, format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const gerarDadosRendimento = (ativo) => {
    const inicio = new Date(ativo.data_emissao);
    const fim = new Date(ativo.data_vencimento);
    const meses = differenceInMonths(fim, inicio);

    let taxaMensal;
    switch (ativo.tipo_juros.toLowerCase()) {
        case 'pré-fixado':
            taxaMensal = ativo.taxa_rentabilidade / 100;
            break;
        case 'pós-fixado':
            taxaMensal = 0.007;
            break;
        case 'híbrido':
            taxaMensal = 0.003 + 0.005;
            break;
        default:
            taxaMensal = 0.005;
    }

    const dados = [];
    for (let i = 0; i <= meses; i++) {
        const data = addMonths(inicio, i);
        const rendimento = ativo.valor_unitario * Math.pow(1 + taxaMensal, i);
        dados.push({
            mes: format(data, 'MMM/yyyy'),
            valor: Number(rendimento.toFixed(2))
        });
    }

    return dados;
};

const AtivoDetalhado = () => {
    const { id } = useParams();
    const [ativo, setAtivo] = useState(null);
    const [rendimento, setRendimento] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAtivo = async () => {
            try {
                const data = await getAtivo(id);
                setAtivo(data);
                const dadosRendimento = gerarDadosRendimento(data);
                setRendimento(dadosRendimento);
            } catch (err) {
                console.error("Erro ao buscar ativo:", err);
                setError("Erro ao carregar os dados do ativo.");
            } finally {
                setLoading(false);
            }
        };

        fetchAtivo();
    }, [id]);

    if (loading) return <p>Carregando ativo...</p>;
    if (error) return <p>{error}</p>;
    if (!ativo) return <p>Nenhum ativo encontrado.</p>;

    return (
        <section className="ativo-detalhado">
            <div className="ativo-card">
                <h1>{ativo.nome}</h1>
                <p><strong>Tipo:</strong> {ativo.tipo}</p>
                <p><strong>Emissor:</strong> {ativo.emissor}</p>
                <p><strong>Tipo de Negociação:</strong> {ativo.tipo_negociacao}</p>
                <p><strong>Valor Unitário:</strong> R$ {Number(ativo.valor_unitario).toFixed(2)}</p>
                <p><strong>Taxa de Rentabilidade:</strong> {ativo.taxa_rentabilidade}%</p>
                <p><strong>Tipo de Juros:</strong> {ativo.tipo_juros}</p>
                <p><strong>Rendimento Esperado:</strong> R$ {Number(ativo.rendimento_esperado).toFixed(2)}</p>
                <p><strong>Liquidez:</strong> {ativo.liquidez}</p>
                <p><strong>Data de Emissão:</strong> {new Date(ativo.data_emissao).toLocaleDateString()}</p>
                <p><strong>Data de Vencimento:</strong> {new Date(ativo.data_vencimento).toLocaleDateString()}</p>
                <p><strong>Isento de Impostos:</strong> {ativo.isento_impostos ? "Sim" : "Não"}</p>
                <p><strong>Status:</strong> {ativo.status}</p>
            </div>

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

            <button className="voltar-btn" onClick={() => navigate('/listar-ativos')}>
                <img src={setaEsquerda} alt="Voltar" />
            </button>
        </section>
    );
};

export default AtivoDetalhado;
