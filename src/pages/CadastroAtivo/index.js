import React, { useState, useEffect } from 'react';  
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; 
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import './index.css';

const MySwal = withReactContent(Swal);

const CadastroAtivo = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

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

    useEffect(() => {
        if (user?.email) {
            setFormData(prev => ({ ...prev, usuario: user.email }));
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Resetar o indexador quando muda tipo_juros para prefixado
        if (name === 'tipo_juros' && value === 'prefixado') {
            setFormData({
                ...formData,
                [name]: value,
                indexador: '',
                percentual_sobre_indexador: '',
            });
        } else {
            setFormData({
                ...formData,
                [name]: type === 'checkbox' ? checked : value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('access_token');

        if (!token) {
            alert('Você precisa estar autenticado para cadastrar um ativo.');
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
            const response = await fetch('http://127.0.0.1:8000/api/ativos/criar/', {
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
                    data_vencimento: '',
                    data_emissao: '',
                    possuiImposto: false,
                    aliquotaImposto: '',
                    liquidez: 'diaria',
                });
            } else {
                const errorData = await response.json();
                alert(`Erro no cadastro: ${errorData.mensagem || 'Verifique os dados e tente novamente.'}`);
            }
        } catch (error) {
            alert('Erro ao conectar com o servidor. Tente novamente mais tarde.');
        }
    };

    const handleListarAtivos = (e) => {
        e.preventDefault();
        navigate('/listar-ativos');
    };

    return (
        <section className="cadastro-ativo">
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
                    />
                    <div className="tooltip tooltip-right">💡 O nome do ativo ajuda a identificar sua categoria e emissor. Dê um nome que facilite sua identificação, como o nome do produto ou um apelido que faça sentido para você.</div>
                </div>

                <div className="campo-container tooltip-container">
                    <label htmlFor="tipo">Tipo do ativo</label>
                    <select id="tipo" name="tipo" required onChange={handleChange} value={formData.tipo}>
                    <option value="">Selecione o tipo</option>
                    <option value="renda_fixa_bancaria">Renda Fixa Bancária (CDB, LCI, LCA)</option>
                    <option value="titulos_publicos">Títulos Públicos (Tesouro Direto)</option>
                    <option value="debentures_creditos">Debêntures e Créditos (Debêntures, CRI, CRA)</option>
                    </select>
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
                    <select id="tipo_negociacao" name="tipo_negociacao" required onChange={handleChange} value={formData.tipo_negociacao}>
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
                    />
                    <div className="tooltip tooltip-right">💡 O nome do ativo ajuda a identificar sua categoria e emissor.</div>
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
                    />
                    <div className="tooltip tooltip-right">💡 O nome do ativo ajuda a identificar sua categoria e emissor.</div>
                </div>

                <div className="campo-container tooltip-container">
                    <label htmlFor="tipo_juros">Tipo de Juros</label>
                    <select id="tipo_juros" name="tipo_juros" required onChange={handleChange} value={formData.tipo_juros}>
                    <option value="prefixado">Prefixado</option>
                    <option value="posfixado">Pós-fixado</option>
                    <option value="hibrido">Híbrido</option>
                    </select>
                    <div className="tooltip tooltip-right">💡 O nome do ativo ajuda a identificar sua categoria e emissor.</div>
                </div>

                {(formData.tipo_juros === 'posfixado' || formData.tipo_juros === 'hibrido') && (
                    <div className="campo-container">
                    <label htmlFor="indexador">Indexador</label>
                    <select 
                        id="indexador"
                        name="indexador" 
                        required 
                        onChange={handleChange} 
                        value={formData.indexador}
                    >
                        <option value="">Selecione o indexador</option>
                        <option value="CDI">CDI</option>
                        <option value="IPCA">IPCA</option>
                        <option value="IGPM">IGPM</option>
                        <option value="SELIC">SELIC</option>
                    </select>
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
                        required 
                        onChange={handleChange} 
                        value={formData.taxa_fixa}
                    />
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
                        required 
                        onChange={handleChange} 
                        value={formData.percentual_sobre_indexador}
                    />
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
                    />
                    <div className="tooltip tooltip-right">💡 O nome do ativo ajuda a identificar sua categoria e emissor.</div>
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
                    />
                    <div className="tooltip tooltip-right">💡 O nome do ativo ajuda a identificar sua categoria e emissor.</div>
                </div>

                <div className="campo-container tooltip-container">
                    <label htmlFor="liquidez">Liquidez</label>
                    <select id="liquidez" name="liquidez" required onChange={handleChange} value={formData.liquidez}>
                    <option value="diaria">Diária</option>
                    <option value="apos_vencimento">Após Vencimento</option>
                    </select>
                    <div className="tooltip tooltip-right">💡 O nome do ativo ajuda a identificar sua categoria e emissor.</div>
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
                    <div className="tooltip tooltip-right">💡 O nome do ativo ajuda a identificar sua categoria e emissor.</div>
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
                        />
                    </div>
                )}

                <div className="button-container">
                    <button type="submit" className="cadastro-btn">Cadastrar</button>
                    <button className="listar-ativos-btn" onClick={handleListarAtivos}>Listar Ativos</button>
                </div>
                </form>

            </div>
        </section>
    );
};

export default CadastroAtivo;
