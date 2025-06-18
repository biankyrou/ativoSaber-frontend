import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAtivo } from '../../services/api';
import setaEsquerda from '../../assets/seta-esquerda.png';
import './index.css';

const AvaliadorQuiz = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ativo, setAtivo] = useState(null);
    const [respostas, setRespostas] = useState({
        objetivo: '',
        risco: '',
        prefere_isencao: false,
        precisa_resgatar_antes: false,
        prazo_investimento: '',
        tolerancia_oscilacao: '',
        conhecimento_mercado: '',
    });
    const [resultado, setResultado] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    
    const calculatePeriodInYears = (startDate, endDate) => {
        if (!startDate || !endDate) return null;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays / 365.25; 
    };

    useEffect(() => {
        const fetchAtivo = async () => {
            try {
                const data = await getAtivo(id);
                
                if (data.data_emissao && data.data_vencimento) {
                    const calculatedPeriod = calculatePeriodInYears(data.data_emissao, data.data_vencimento);
                    setAtivo({ ...data, periodo_em_anos: calculatedPeriod }); 
                } else {
                    setAtivo(data);
                    console.warn('Datas de emissão ou vencimento ausentes para cálculo do período em anos.');
                }
            } catch (err) {
                console.error('Erro ao buscar ativo:', err);
                setError('Não foi possível carregar os detalhes do ativo.');
            }
        };

        fetchAtivo();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setRespostas((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const avaliarInvestimentoFrontend = () => {
        let score = 0;
        const alertas = [];
        let recomendacao = "";

        if (!ativo) {
            alertas.push("Dados do ativo não disponíveis para avaliação.");
            return { score: 0, alertas: alertas, recomendacao: "Não foi possível avaliar o ativo." };
        }

        const valorUnitario = parseFloat(ativo.valor_unitario);
        const quantidade = parseInt(ativo.quantidade);
        const periodoEmAnos = parseFloat(ativo.periodo_em_anos); 
        const rendimentoEsperado = parseFloat(ativo.rendimento_esperado);

        const isCalculable = Number.isFinite(valorUnitario) && Number.isFinite(quantidade) &&
                             Number.isFinite(periodoEmAnos) && Number.isFinite(rendimentoEsperado) &&
                             valorUnitario > 0 && quantidade > 0 && periodoEmAnos > 0;

        if (respostas.objetivo === 'inflação') {
            if (ativo.indexador !== 'IPCA' && ativo.indexador !== 'IGPM') {
                alertas.push("Este ativo não protege contra inflação.");
                score -= 1;
            } else {
                score += 1;
            }
        } else if (respostas.objetivo === 'liquidez') {
            if (ativo.liquidez !== 'diaria') {
                alertas.push("Este ativo não tem liquidez diária.");
                score -= 1;
            } else {
                score += 1;
            }
        } else if (respostas.objetivo === 'renda') {
            if (ativo.tipo_juros !== 'prefixado') {
                alertas.push("Este ativo pode não gerar renda previsível.");
                score -= 1;
            } else {
                score += 1;
            }
        } else if (respostas.objetivo === 'crescimento') {
        
            if (periodoEmAnos && periodoEmAnos < 5) {
                alertas.push("Este ativo pode não ser ideal para crescimento de capital a longo prazo devido ao seu prazo curto.");
                score -= 1;
            } else if (ativo.liquidez === 'diaria') {
                alertas.push("Este ativo é de liquidez diária, o que pode não se alinhar com um objetivo de crescimento a longo prazo.");
                score -= 0.5;
            } else {
                score += 1;
            }
        }

        if (respostas.risco === 'baixo') {
            const ativosComMaiorRisco = ['debentures_creditos', 'ações', 'fundos_imobiliarios', 'derivativos'];
            if (ativosComMaiorRisco.includes(ativo.tipo)) {
                alertas.push("Este ativo pode ter mais risco do que seu perfil conservador sugere.");
                score -= 1;
            } else {
                score += 1;
            }
        } else if (respostas.risco === 'medio') {
            const ativosMuitoConservadores = ['CDB', 'LCI', 'LCA', 'tesouro_selic'];
            const ativosMuitoAgressivos = ['derivativos', 'ações_agressivas'];

            if (ativosMuitoConservadores.includes(ativo.tipo)) {
                alertas.push("Este ativo é muito conservador para um perfil moderado. Pode haver opções com melhor rentabilidade para você.");
                score -= 0.5;
            } else if (ativosMuitoAgressivos.includes(ativo.tipo)) {
                alertas.push("Este ativo pode ser muito agressivo para um perfil moderado. Considere opções com menor volatilidade.");
                score -= 1;
            } else {
                score += 1;
            }
        } else if (respostas.risco === 'alto') {
            const ativosDeBaixoRisco = ['CDB', 'LCI', 'LCA', 'tesouro_direto_selic', 'tesouro_direto_prefixado'];
            if (ativosDeBaixoRisco.includes(ativo.tipo)) {
                alertas.push("Este ativo pode ser conservador demais para um perfil de risco alto. Você pode estar perdendo oportunidades de maior rentabilidade.");
                score -= 1;
            } else {
                score += 1;
            }
        }

        if (respostas.prefere_isencao && ativo.possuiImposto) {
            alertas.push("Este ativo é tributado (não possui isenção de imposto de renda).");
            score -= 1;
        } else if (respostas.prefere_isencao && !ativo.possuiImposto) {
            score += 1;
        }

        if (respostas.precisa_resgatar_antes && ativo.liquidez !== 'diaria') {
            alertas.push("Este ativo não pode ser resgatado antes do vencimento sem perdas ou com baixa liquidez.");
            score -= 1;
        } else if (respostas.precisa_resgatar_antes && ativo.liquidez === 'diaria') {
            score += 1;
        }

        if (isCalculable) {
            const valorInvestidoInicial = valorUnitario * quantidade;
            const benchmarkTaxaAnual = 0.12; 
            const benchmarkTotal = valorInvestidoInicial * Math.pow(1 + benchmarkTaxaAnual, periodoEmAnos);

            if (rendimentoEsperado > benchmarkTotal) {
                score += 1;
            } else {
                alertas.push(`A rentabilidade esperada (${rendimentoEsperado.toFixed(2)}) pode estar abaixo do benchmark (${benchmarkTotal.toFixed(2)}) para o período.`);
                score -= 1;
            }
        } else {
            alertas.push("Dados de rentabilidade do ativo incompletos ou inválidos para avaliação.");
        }

        if (respostas.prazo_investimento === 'curto_prazo') {
            if (periodoEmAnos && periodoEmAnos > 2) { // Curto prazo: idealmente até 2 anos
                alertas.push("O prazo de vencimento do ativo é longo para seu objetivo de curto prazo.");
                score -= 1;
            } else {
                score += 1;
            }
        } else if (respostas.prazo_investimento === 'medio_prazo') {
            if (periodoEmAnos && (periodoEmAnos < 3 || periodoEmAnos > 7)) { // Médio prazo: 3 a 7 anos
                alertas.push("O prazo de vencimento do ativo não se alinha ao seu objetivo de médio prazo.");
                score -= 1;
            } else {
                score += 1;
            }
        } else if (respostas.prazo_investimento === 'longo_prazo') {
            if (periodoEmAnos && periodoEmAnos < 7) { // Longo prazo: mais de 7 anos
                alertas.push("O prazo de vencimento do ativo é curto para seu objetivo de longo prazo.");
                score -= 1;
            } else {
                score += 1;
            }
        }

        const ativosVolateis = ['ações', 'fundos_imobiliarios', 'derivativos', 'criptomoedas'];
        const ativosEstaveis = ['CDB', 'LCI', 'LCA', 'tesouro_selic'];

        if (respostas.tolerancia_oscilacao === 'baixa') {
            if (ativosVolateis.includes(ativo.tipo)) {
                alertas.push("Este ativo possui alta volatilidade, o que não se alinha à sua baixa tolerância à oscilação.");
                score -= 1;
            } else {
                score += 1;
            }
        } else if (respostas.tolerancia_oscilacao === 'media') {
            if (ativosVolateis.includes(ativo.tipo) && !ativosEstaveis.includes(ativo.tipo)) {
                 if (ativo.tipo === 'ações' || ativo.tipo === 'derivativos') {
                     alertas.push("Este ativo pode ter mais oscilação do que um perfil moderado idealmente busca.");
                     score -= 0.5;
                 } else {
                     score += 1;
                 }
            } else if (ativosEstaveis.includes(ativo.tipo)) {
                alertas.push("Este ativo é muito estável para sua tolerância média à oscilação. Pode haver oportunidades em ativos com um pouco mais de risco.");
                score -= 0.5;
            } else {
                score += 1;
            }
        } else if (respostas.tolerancia_oscilacao === 'alta') {
            if (ativosEstaveis.includes(ativo.tipo)) {
                alertas.push("Este ativo possui baixa volatilidade, o que pode ser conservador demais para sua alta tolerância à oscilação.");
                score -= 1;
            } else {
                score += 1;
            }
        }

        const ativosComplexos = ['ações', 'derivativos', 'fundos_complexos', 'criptomoedas', 'debêntures_incentivadas'];

        if (respostas.conhecimento_mercado === 'pouco') {
            if (ativosComplexos.includes(ativo.tipo)) {
                alertas.push("Este ativo exige um maior conhecimento do mercado do que você indicou possuir. Busque entender melhor antes de investir.");
                score -= 1;
            } else {
                score += 1;
            }
        } else if (respostas.conhecimento_mercado === 'moderado') {
            if (ativo.tipo === 'derivativos' || ativo.tipo === 'fundos_complexos') {
                alertas.push("Este ativo pode ser um pouco complexo para seu nível de conhecimento moderado.");
                score -= 0.5;
            } else {
                score += 1;
            }
        } else if (respostas.conhecimento_mercado === 'muito') {
            score += 1;
        }

        if (score >= 6) {
            recomendacao = "Este investimento parece muito adequado para você! Há uma forte compatibilidade com seus objetivos e perfil.";
        } else if (score >= 3) {
            recomendacao = "Este investimento pode ser uma boa opção, mas preste atenção aos alertas e considere se eles são aceitáveis para você.";
        } else {
            recomendacao = "Este investimento **provavelmente não é o mais indicado** para você no momento. Avalie outras opções que se alinhem melhor ao seu perfil e objetivos com base nos pontos de atenção.";
        }

        return { score, alertas, recomendacao };
    };

    const handleAvaliarClick = () => {
        setLoading(true);
        setError(null);
        setResultado(null);

        setTimeout(() => {
            const result = avaliarInvestimentoFrontend();
            setResultado(result);
            setLoading(false);
        }, 500);
    };

    return (
        <div className="avaliador-page-wrapper">
            <div className="avaliador-quiz-container">
                <h1 className="avaliador-title">Avaliar Ativo</h1>
                {error && <p className="educativo-texto-av" style={{ color: 'red' }}>{error}</p>}

                {ativo ? (
                    <>
                        <p className="educativo-texto-av">
                            Você está avaliando: <strong>{ativo.nome}</strong> - {ativo.tipo}
                        </p>
                        
                        <div className="quiz-form">
                            {/* Pergunta 1: Objetivo */}
                            <div className="campo-container-av">
                                <label htmlFor="objetivo-select">Qual seu principal objetivo com este investimento?</label>
                                <select id="objetivo-select" name="objetivo" value={respostas.objetivo} onChange={handleChange}>
                                    <option value="">Selecione</option>
                                    <option value="inflação">Proteger da inflação (manter poder de compra)</option>
                                    <option value="liquidez">Ter alta liquidez (dinheiro disponível a qualquer momento)</option>
                                    <option value="renda">Gerar renda previsível (receber juros/dividendos)</option>
                                    <option value="crescimento">Crescimento de capital a longo prazo</option>
                                </select>
                            </div>

                            {/* Pergunta 2: Risco */}
                            <div className="campo-container-av">
                                <label htmlFor="risco-select">Qual seu perfil de risco em investimentos?</label>
                                <select id="risco-select" name="risco" value={respostas.risco} onChange={handleChange}>
                                    <option value="">Selecione</option>
                                    <option value="baixo">Baixo (conservador)</option>
                                    <option value="medio">Médio (moderado)</option>
                                    <option value="alto">Alto (arrojado/agressivo)</option>
                                </select>
                            </div>

                            {/* Pergunta 3: Prazo de Investimento  */}
                            <div className="campo-container-av">
                                <label htmlFor="prazo-investimento-select">Por quanto tempo você pretende manter este investimento?</label>
                                <select id="prazo-investimento-select" name="prazo_investimento" value={respostas.prazo_investimento} onChange={handleChange}>
                                    <option value="">Selecione</option>
                                    <option value="curto_prazo">Curto prazo (até 3 anos)</option>
                                    <option value="medio_prazo">Médio prazo (3 a 7 anos)</option>
                                    <option value="longo_prazo">Longo prazo (mais de 7 anos)</option>
                                </select>
                            </div>

                            {/* Pergunta 4: Tolerância à Oscilação  */}
                            <div className="campo-container-av">
                                <label htmlFor="tolerancia-oscilacao-select">Qual sua tolerância a flutuações e perdas temporárias no valor do investimento?</label>
                                <select id="tolerancia-oscilacao-select" name="tolerancia_oscilacao" value={respostas.tolerancia_oscilacao} onChange={handleChange}>
                                    <option value="">Selecione</option>
                                    <option value="baixa">Baixa (prefiro estabilidade)</option>
                                    <option value="media">Média (aceito alguma oscilação)</option>
                                    <option value="alta">Alta (sou tranquilo com grandes flutuações)</option>
                                </select>
                            </div>

                            {/* Pergunta 5: Conhecimento do Mercado  */}
                            <div className="campo-container-av">
                                <label htmlFor="conhecimento-mercado-select">Qual seu nível de conhecimento sobre o mercado de investimentos?</label>
                                <select id="conhecimento-mercado-select" name="conhecimento_mercado" value={respostas.conhecimento_mercado} onChange={handleChange}>
                                    <option value="">Selecione</option>
                                    <option value="pouco">Pouco (estou começando)</option>
                                    <option value="moderado">Moderado (tenho alguma experiência)</option>
                                    <option value="muito">Muito (sou experiente e busco estratégias avançadas)</option>
                                </select>
                            </div>

                            {/* Checkbox 1: Isenção de imposto */}
                            <div className="checkbox-container-av">
                                <label>
                                    <input 
                                        type="checkbox" 
                                        name="prefere_isencao" 
                                        checked={respostas.prefere_isencao} 
                                        onChange={handleChange} 
                                    />
                                    Prefere investimentos com isenção de imposto de renda?
                                </label>
                            </div>

                            {/* Checkbox 2: Resgate antecipado */}
                            <div className="checkbox-container-av">
                                <label>
                                    <input 
                                        type="checkbox" 
                                        name="precisa_resgatar_antes" 
                                        checked={respostas.precisa_resgatar_antes} 
                                        onChange={handleChange} 
                                    />
                                    Pode precisar resgatar o valor antes do vencimento?
                                </label>
                            </div>

                            <div className="button-container-av">
                                <button 
                                    className="avaliar-btn-av" 
                                    onClick={handleAvaliarClick} 
                                    disabled={loading || !respostas.objetivo || !respostas.risco || !respostas.prazo_investimento || !respostas.tolerancia_oscilacao || !respostas.conhecimento_mercado}
                                >
                                    {loading ? 'Avaliando...' : 'Avaliar Ativo'}
                                </button>
                            </div>
                        </div>

                        {resultado && (
                            <div className="resultado-container-av">
                                <h3>Resultado da Avaliação</h3>
                                <p><strong>Pontuação de Compatibilidade:</strong> {resultado.score}</p>
                                <p><strong>Recomendação:</strong> {resultado.recomendacao}</p>
                                {resultado.alertas.length > 0 ? (
                                    <>
                                        <h4>Pontos de Atenção:</h4>
                                        <ul>
                                            {resultado.alertas.map((a, i) => (
                                                <li key={i}>{a}</li>
                                            ))}
                                        </ul>
                                    </>
                                ) : (
                                    <p className="success-message">Nenhum alerta. Este ativo parece muito adequado para você!</p>
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <p className="educativo-texto-av">Carregando ativo...</p>
                )}
            </div>
            <button className="voltar-btn" onClick={() => navigate('/listar-ativos')}>
                            <img src={setaEsquerda} alt="Voltar" />
            </button>
        </div>
    );
};

export default AvaliadorQuiz;