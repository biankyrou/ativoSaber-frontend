import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import scrollIcon from '../../assets/seta-para-baixo.png';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import './index.css'; 

const MySwal = withReactContent(Swal);

const CadastroAtivo = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const formEndRef = useRef(null);

    const [formData, setFormData] = useState({
        nome: '',
        usuario: '',
        emissor: '',
        tipo: '',
        valor_unitario: '',
        quantidade: '',
        tipo_negociacao: 'bolsa',
        tipo_juros: 'prefixado',
        indexador: '',
        taxa_fixa: '',
        percentual_sobre_indexador: '',
        data_vencimento: '',
        data_emissao: '',
        possuiImposto: false,
        aliquotaImposto: '',
        liquidez: 'diaria',
    });

    const [fieldErrors, setFieldErrors] = useState({});

    const scrollToBottom = () => {
        formEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (user?.email) {
            setFormData(prev => ({ ...prev, usuario: user.email }));
        }
    }, [user]);

    const validateField = (name, value, currentFormData = formData) => {
        let error = '';
        switch (name) {
            case 'nome':
                if (!value.trim()) error = 'O nome do ativo é obrigatório.';
                else if (value.trim().length < 3) error = 'O nome deve ter pelo menos 3 caracteres.';
                break;
            case 'tipo':
                if (!value) error = 'O tipo do ativo deve ser selecionado.';
                break;
            case 'valor_unitario':
                const vu = Number(value);
                if (isNaN(vu) || vu <= 0) error = 'Valor unitário deve ser um número válido maior que zero.';
                break;
            case 'quantidade':
                const qtd = Number(value);
                if (isNaN(qtd) || qtd <= 0) error = 'Quantidade deve ser um número válido maior que zero.';
                break;
            case 'taxa_fixa':
                if ((currentFormData.tipo_juros === 'prefixado' || currentFormData.tipo_juros === 'hibrido') && (value === '' || Number(value) < 0)) {
                    error = 'Taxa fixa anual deve ser informada e ser maior ou igual a zero.';
                }
                break;
            case 'indexador':
                if ((currentFormData.tipo_juros === 'posfixado' || currentFormData.tipo_juros === 'hibrido') && !value) {
                    error = 'Indexador deve ser selecionado.';
                }
                break;
            case 'percentual_sobre_indexador':
                if ((currentFormData.tipo_juros === 'posfixado' || currentFormData.tipo_juros === 'hibrido') && (value === '' || Number(value) < 0)) {
                    error = 'Percentual sobre indexador deve ser informado e maior ou igual a zero.';
                }
                break;
            case 'data_emissao':
                if (!value) {
                    error = 'Data de emissão deve ser informada.';
                } else if (value && currentFormData.data_vencimento && new Date(value) >= new Date(currentFormData.data_vencimento)) {
                    error = 'Data de emissão deve ser anterior à data de vencimento.';
                }
                break;
            case 'data_vencimento':
                if (!value) {
                    error = 'Data de vencimento deve ser informada.';
                } else {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0); 

                    if (new Date(value) < today) {
                        error = 'Data de vencimento não pode ser no passado.';
                    } else if (currentFormData.data_emissao && new Date(currentFormData.data_emissao) >= new Date(value)) {
                        error = 'Data de vencimento deve ser posterior à data de emissão.';
                    }
                }
                break;
            case 'aliquotaImposto':
                if (currentFormData.possuiImposto) {
                    if (value === '') error = 'Informe a alíquota do imposto.';
                    else {
                        const aliquota = Number(value);
                        if (isNaN(aliquota) || aliquota < 0 || aliquota > 100) error = 'Alíquota do imposto deve estar entre 0 e 100%.';
                    }
                }
                break;
            default:    
                break;
        }
        return error;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setFormData(prev => {
            const updatedFormData = {
                ...prev,
                [name]: newValue
            };

            if (name === 'tipo_juros' && newValue === 'prefixado') {
                updatedFormData.indexador = '';
                updatedFormData.percentual_sobre_indexador = '';
                setFieldErrors(prevErrors => ({
                    ...prevErrors,
                    indexador: '',
                    percentual_sobre_indexador: '',
                }));
            }

            setFieldErrors(prevErrors => ({
                ...prevErrors,
                [name]: validateField(name, newValue, updatedFormData),
               
                ...(name === 'data_emissao' || name === 'data_vencimento' ? {
                    data_emissao: validateField('data_emissao', updatedFormData.data_emissao, updatedFormData),
                    data_vencimento: validateField('data_vencimento', updatedFormData.data_vencimento, updatedFormData),
                } : {}),
              
                ...(name === 'possuiImposto' ? {
                    aliquotaImposto: validateField('aliquotaImposto', updatedFormData.aliquotaImposto, updatedFormData),
                } : {}),
              
                ...(name === 'tipo_juros' ? {
                    indexador: validateField('indexador', updatedFormData.indexador, updatedFormData),
                    percentual_sobre_indexador: validateField('percentual_sobre_indexador', updatedFormData.percentual_sobre_indexador, updatedFormData),
                    taxa_fixa: validateField('taxa_fixa', updatedFormData.taxa_fixa, updatedFormData),
                } : {}),
            }));

            return updatedFormData;
        });
    };

    const validateForm = () => {
        const errors = [];
        const currentFieldErrors = {};

        Object.keys(formData).forEach(name => {
            const error = validateField(name, formData[name], formData);
            if (error) {
                errors.push(error);
                currentFieldErrors[name] = error;
            }
        });
        setFieldErrors(currentFieldErrors);
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (validationErrors.length > 0) {
            MySwal.fire({
                icon: 'error',
                title: 'Erro no cadastro',
                html: validationErrors.map(err => `<p>${err}</p>`).join(''),
                confirmButtonColor: '#d33',
            });
            return;
        }

        const token = localStorage.getItem('access_token');

        if (!token) {
            MySwal.fire({
                icon: 'warning',
                title: 'Autenticação Necessária',
                text: 'Você precisa estar autenticado para cadastrar um ativo.',
                confirmButtonColor: '#ffc107',
            });
            return;
        }

        const payload = {
            ...formData,
            aliquotaImposto: formData.possuiImposto && formData.aliquotaImposto !== ''
                ? parseFloat(formData.aliquotaImposto)
                : null,
            valor_unitario: parseFloat(formData.valor_unitario),
            quantidade: formData.quantidade ? parseFloat(formData.quantidade) : null,
            taxa_fixa: parseFloat(formData.taxa_fixa),
            indexador: (formData.tipo_juros === 'prefixado') ? null : formData.indexador,
            percentual_sobre_indexador: (formData.tipo_juros === 'prefixado') ? null : parseFloat(formData.percentual_sobre_indexador),
        };


        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/ativos/criar/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                MySwal.fire({
                    title: 'Sucesso!',
                    text: 'Ativo cadastrado com sucesso!',
                    icon: 'success',
                    confirmButtonColor: '#3E846B',
                    confirmButtonText: 'OK',
                    background: '#f0f0f0',
                    color: '#333',
                });

                setFormData({
                    nome: '',
                    usuario: user?.email || '',
                    emissor: '',
                    tipo: '',
                    valor_unitario: '',
                    quantidade: '',
                    tipo_negociacao: 'bolsa',
                    tipo_juros: 'prefixado',
                    indexador: '',
                    taxa_fixa: '',
                    percentual_sobre_indexador: '',
                    data_vencimento: '',
                    data_emissao: '',
                    possuiImposto: false,
                    aliquotaImposto: '',
                    liquidez: 'diaria',
                });
                setFieldErrors({}); 

            } else {
                const errorData = await response.json();
                MySwal.fire({
                    icon: 'error',
                    title: 'Erro no cadastro',
                    html: `<p>${errorData.message || errorData.detail || 'Verifique os dados e tente novamente.'}</p>`,
                    confirmButtonColor: '#d33',
                });
            }
        } catch (error) {
            MySwal.fire({
                icon: 'error',
                title: 'Erro de Conexão',
                text: 'Erro ao conectar com o servidor. Tente novamente mais tarde.',
                confirmButtonColor: '#d33',
            });
        }
    };

    const handleListarAtivos = (e) => {
        e.preventDefault();
        navigate('/listar-ativos');
    };

    const valorInvestido =
        parseFloat(formData.valor_unitario || 0) * parseFloat(formData.quantidade || 0);

    return (
        <section className="cadastro-ativo">
            <div className="button-rolagem-fim">
                <img
                    src={scrollIcon}
                    alt="Rolar para o final"
                    className="scroll-bottom-img"
                    onClick={scrollToBottom}
                    style={{ cursor: 'pointer' }}
                />
            </div>
            <div className="container-cadastro">
                <h2 className="cadastro-title">Cadastre seu ativo</h2>
                <p className="educativo-texto">💡 Cada ativo tem características únicas! Aprenda sobre eles enquanto cadastra o seu.</p>
                <form className="cadastro-form" onSubmit={handleSubmit}>

                    <div className="campo-container tooltip-container">
                        <label htmlFor="nome">Nome do ativo</label>
                        <input
                            id="nome"
                            type="text"
                            name="nome"
                            placeholder="Dê um nome legal para o seu ativo!"
                            required
                            onChange={handleChange}
                            value={formData.nome}
                            onBlur={() => setFieldErrors(prev => ({ ...prev, nome: validateField('nome', formData.nome) }))}
                            className={fieldErrors.nome ? 'input-error' : ''}
                        />
                        {fieldErrors.nome && <p className="error-message">{fieldErrors.nome}</p>}
                        <div className="tooltip tooltip-right">💡 O nome do ativo ajuda a identificar sua categoria e emissor. Dê um nome que facilite sua identificação, como o nome do produto ou um apelido que faça sentido para você.</div>
                    </div>

                    <div className="campo-container tooltip-container">
                        <label htmlFor="tipo">Tipo do ativo</label>
                        <select
                            id="tipo"
                            name="tipo"
                            required
                            onChange={handleChange}
                            value={formData.tipo}
                            onBlur={() => setFieldErrors(prev => ({ ...prev, tipo: validateField('tipo', formData.tipo) }))}
                            className={fieldErrors.tipo ? 'input-error' : ''}
                        >
                            <option value="">Selecione o tipo</option>
                            <option value="renda_fixa_bancaria">Renda Fixa Bancária (CDB, LCI, LCA)</option>
                            <option value="titulos_publicos">Títulos Públicos (Tesouro Direto)</option>
                            <option value="debentures_creditos">Debêntures e Créditos (Debêntures, CRI, CRA)</option>
                        </select>
                        {fieldErrors.tipo && <p className="error-message">{fieldErrors.tipo}</p>}
                        <div className="tooltip tooltip-right">💡 Essas são as categorias mais populares de ativos de Renda Fixa.</div>
                    </div>

                    <div className="campo-container tooltip-container">
                        <label htmlFor="emissor">Emissor</label>
                        <input
                            id="emissor"
                            type="text"
                            name="emissor"
                            placeholder="Emissor (Banco, Governo, etc.)"
                            onChange={handleChange}
                            value={formData.emissor}
                        />
                        <div className="tooltip tooltip-right">💡 Informe quem está emitindo o ativo — pode ser um banco, uma cooperativa de crédito, uma empresa ou o governo. No geral, títulos públicos são do governo; renda fixa bancária é de bancos ou cooperativas; e debêntures, CRIs e CRAs vêm de empresas.</div>
                    </div>

                    <div className="campo-container tooltip-container">
                        <label htmlFor="tipo_negociacao">Tipo de negociação</label>
                        <select
                            id="tipo_negociacao"
                            name="tipo_negociacao"
                            required
                            onChange={handleChange}
                            value={formData.tipo_negociacao}
                        >
                            <option value="bolsa">Bolsa</option>
                            <option value="balcao">Balcão</option>
                        </select>
                        <div className="tooltip tooltip-right">💡 Indica onde o ativo é negociado. Na Bolsa, há mais transparência, segurança e facilidade para comprar e vender. No Balcão, as negociações são feitas diretamente entre investidores e instituições, de forma privada.</div>
                    </div>

                    <div className="campo-container tooltip-container">
                        <label htmlFor="valor_unitario">Valor Unitário (R$)</label>
                        <input
                            id="valor_unitario"
                            type="number"
                            step="0.01"
                            name="valor_unitario"
                            placeholder="Valor Unitário de cada ativo (R$)"
                            required
                            onChange={handleChange}
                            value={formData.valor_unitario}
                            min="0.01"
                            onBlur={() => setFieldErrors(prev => ({ ...prev, valor_unitario: validateField('valor_unitario', formData.valor_unitario) }))}
                            className={fieldErrors.valor_unitario ? 'input-error' : ''}
                        />
                        {fieldErrors.valor_unitario && <p className="error-message">{fieldErrors.valor_unitario}</p>}
                        <div className="tooltip tooltip-right">💡 É valor de um único ativo no momento da emissão.</div>
                    </div>

                    <div className="campo-container tooltip-container">
                        <label htmlFor="quantidade">Quantidade</label>
                        <input
                            id="quantidade"
                            type="number"
                            step="0.01"
                            name="quantidade"
                            placeholder="Quantidade de ativos"
                            required
                            onChange={handleChange}
                            value={formData.quantidade}
                            min="0.01"
                            onBlur={() => setFieldErrors(prev => ({ ...prev, quantidade: validateField('quantidade', formData.quantidade) }))}
                            className={fieldErrors.quantidade ? 'input-error' : ''}
                        />
                        {fieldErrors.quantidade && <p className="error-message">{fieldErrors.quantidade}</p>}
                        <div className="tooltip tooltip-right">💡 Quantidade de unidades do ativo que você emitiu. Esse valor será multiplicado pelo valor unitário para calcular o total investido</div>
                    </div>

                    <div className="campo-container">
                        <label>Valor Investido (R$)</label>
                        <input
                            type="text"
                            readOnly
                            value={valorInvestido.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                            })}
                            className="campo-calculado"
                        />
                    </div>

                    <div className="campo-container tooltip-container">
                        <label htmlFor="tipo_juros">Tipo de Juros</label>
                        <select
                            id="tipo_juros"
                            name="tipo_juros"
                            required
                            onChange={handleChange}
                            value={formData.tipo_juros}
                        >
                            <option value="prefixado">Prefixado</option>
                            <option value="posfixado">Pós-fixado</option>
                            <option value="hibrido">Híbrido</option>
                        </select>
                        <div className="tooltip tooltip-right">
                            💡 Escolha como os juros do ativo são aplicados:
                            <strong> Prefixado</strong> (taxa fixa),
                            <strong> Pós-fixado</strong> (varia conforme um índice), ou
                            <strong> Híbrido</strong> (parte fixa + parte indexada).
                        </div>

                    </div>

                    {(formData.tipo_juros === 'posfixado' || formData.tipo_juros === 'hibrido') && (
                        <div className="campo-container">
                            <label htmlFor="indexador">Indexador</label>
                            <select
                                id="indexador"
                                name="indexador"
                                required={formData.tipo_juros === 'posfixado' || formData.tipo_juros === 'hibrido'}
                                onChange={handleChange}
                                value={formData.indexador}
                                onBlur={() => setFieldErrors(prev => ({ ...prev, indexador: validateField('indexador', formData.indexador) }))}
                                className={fieldErrors.indexador ? 'input-error' : ''}
                            >
                                <option value="">Selecione o indexador</option>
                                <option value="CDI">CDI</option>
                                <option value="IPCA">IPCA</option>
                                <option value="IGPM">IGPM</option>
                                <option value="SELIC">SELIC</option>
                            </select>
                            {fieldErrors.indexador && <p className="error-message">{fieldErrors.indexador}</p>}
                        </div>
                    )}

                    {(formData.tipo_juros === 'prefixado' || formData.tipo_juros === 'hibrido') && (
                        <div className="campo-container">
                            <label htmlFor="taxa_fixa">Taxa Fixa Anual (%)</label>
                            <input
                                id="taxa_fixa"
                                type="number"
                                step="0.01"
                                name="taxa_fixa"
                                placeholder="Taxa Fixa Anual (%)"
                                required={formData.tipo_juros === 'prefixado' || formData.tipo_juros === 'hibrido'}
                                onChange={handleChange}
                                value={formData.taxa_fixa}
                                min="0"
                                onBlur={() => setFieldErrors(prev => ({ ...prev, taxa_fixa: validateField('taxa_fixa', formData.taxa_fixa) }))}
                                className={fieldErrors.taxa_fixa ? 'input-error' : ''}
                            />
                            {fieldErrors.taxa_fixa && <p className="error-message">{fieldErrors.taxa_fixa}</p>}
                        </div>
                    )}

                    {(formData.tipo_juros === 'posfixado' || formData.tipo_juros === 'hibrido') && (
                        <div className="campo-container">
                            <label htmlFor="percentual_sobre_indexador">Percentual sobre indexador (%)</label>
                            <input
                                id="percentual_sobre_indexador"
                                type="number"
                                step="0.01"
                                name="percentual_sobre_indexador"
                                placeholder="Percentual sobre indexador (%)"
                                required={formData.tipo_juros === 'posfixado' || formData.tipo_juros === 'hibrido'}
                                onChange={handleChange}
                                value={formData.percentual_sobre_indexador}
                                min="0"
                                onBlur={() => setFieldErrors(prev => ({ ...prev, percentual_sobre_indexador: validateField('percentual_sobre_indexador', formData.percentual_sobre_indexador) }))}
                                className={fieldErrors.percentual_sobre_indexador ? 'input-error' : ''}
                            />
                            {fieldErrors.percentual_sobre_indexador && <p className="error-message">{fieldErrors.percentual_sobre_indexador}</p>}
                        </div>
                    )}

                    <div className="campo-container tooltip-container">
                        <label htmlFor="data_emissao">Data de Emissão</label>
                        <input
                            id="data_emissao"
                            type="date"
                            name="data_emissao"
                            required
                            onChange={handleChange}
                            value={formData.data_emissao}
                            onBlur={() => setFieldErrors(prev => ({ ...prev, data_emissao: validateField('data_emissao', formData.data_emissao) }))}
                            className={fieldErrors.data_emissao ? 'input-error' : ''}
                        />
                        {fieldErrors.data_emissao && <p className="error-message">{fieldErrors.data_emissao}</p>}
                        <div className="tooltip tooltip-right">
                            💡 Data em que o ativo foi emitido.
                            É a referência inicial para cálculo de rendimento e prazos.
                        </div>
                    </div>

                    <div className="campo-container tooltip-container">
                        <label htmlFor="data_vencimento">Data de Vencimento</label>
                        <input
                            id="data_vencimento"
                            type="date"
                            name="data_vencimento"
                            required
                            onChange={handleChange}
                            value={formData.data_vencimento}
                            onBlur={() => setFieldErrors(prev => ({ ...prev, data_vencimento: validateField('data_vencimento', formData.data_vencimento) }))}
                            className={fieldErrors.data_vencimento ? 'input-error' : ''}
                        />
                        {fieldErrors.data_vencimento && <p className="error-message">{fieldErrors.data_vencimento}</p>}
                        <div className="tooltip tooltip-right">
                            💡 Data em que o ativo vence.
                            Após essa data, o valor investido é devolvido e o rendimento total é encerrado.
                        </div>
                    </div>

                    <div className="campo-container tooltip-container">
                        <label htmlFor="liquidez">Liquidez</label>
                        <select
                            id="liquidez"
                            name="liquidez"
                            required
                            onChange={handleChange}
                            value={formData.liquidez}
                        >
                            <option value="diaria">Diária</option>
                            <option value="apos_vencimento">Após Vencimento</option>
                        </select>
                        <div className="tooltip tooltip-right">
                            💡 Define quando você pode resgatar seu investimento:
                            <strong> Diária</strong> permite saques antes do vencimento,
                            enquanto <strong> Após Vencimento</strong> exige esperar até o final do prazo.
                        </div>
                    </div>

                    <div className="checkbox-container tooltip-container">
                        <label>
                            <input
                                type="checkbox"
                                name="possuiImposto"
                                onChange={handleChange}
                                checked={formData.possuiImposto}
                            /> Possui Imposto
                        </label>
                        <div className="tooltip tooltip-right">
                            💡 Marque se o ativo está sujeito à tributação. Isso impacta o cálculo do rendimento líquido.
                        </div>
                    </div>

                    {formData.possuiImposto && (
                        <div className="campo-container">
                            <label htmlFor="aliquotaImposto">Alíquota do imposto (%)</label>
                            <input
                                id="aliquotaImposto"
                                type="number"
                                step="0.01"
                                name="aliquotaImposto"
                                placeholder="Alíquota do imposto (%)"
                                onChange={handleChange}
                                value={formData.aliquotaImposto}
                                min="0"
                                max="100"
                                required={formData.possuiImposto}
                                onBlur={() => setFieldErrors(prev => ({ ...prev, aliquotaImposto: validateField('aliquotaImposto', formData.aliquotaImposto) }))}
                                className={fieldErrors.aliquotaImposto ? 'input-error' : ''}
                            />
                            {fieldErrors.aliquotaImposto && <p className="error-message">{fieldErrors.aliquotaImposto}</p>}
                        </div>
                    )}

                    <div className="button-container">
                        <button type="submit" className="cadastro-btn">Cadastrar</button>
                        <button className="listar-ativos-btn" onClick={handleListarAtivos}>Listar Ativos</button>
                    </div>
                    <div ref={formEndRef}></div>
                </form>
            </div>
        </section>
    );
};

export default CadastroAtivo;