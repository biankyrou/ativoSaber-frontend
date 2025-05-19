import React, { useState, useEffect } from 'react';  
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; 
import './index.css';

const CadastroAtivo = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nome: '',
        usuario: '', // começa vazio
        emissor: '',
        tipo: '',
        valor_unitario: '',
        tipo_negociacao: 'bolsa',
        tipo_juros: 'prefixado',
        taxa_rentabilidade: '',
        data_vencimento: '',
        data_emissao: '',
        isento_impostos: false,
        liquidez: 'diaria',
        status: 'ativo',
    });

    useEffect(() => {
        if (user?.email) {
            setFormData(prev => ({ ...prev, usuario: user.email }));
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('access_token');

        if (!token) {
            alert('Você precisa estar autenticado para cadastrar um ativo.');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/ativos/criar/', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('Ativo cadastrado com sucesso!');

                // Limpa só os campos do formulário (não mexe no usuário)
                setFormData(prevState => ({
                    ...prevState,
                    nome: '',
                    emissor: '',
                    tipo: '',
                    valor_unitario: '',
                    taxa_rentabilidade: '',
                    data_emissao: '',
                    data_vencimento: '',
                    isento_impostos: false,
                    tipo_negociacao: 'bolsa',
                    tipo_juros: 'prefixado',
                    liquidez: 'diaria',
                    status: 'ativo',
                }));
            } else {
                const errorData = await response.json();
                alert(`Erro no cadastro: ${errorData.mensagem || 'Verifique os dados e tente novamente.'}`);
            }
        } catch (error) {
            alert('Erro ao conectar com o servidor. Tente novamente mais tarde.');
        }
    };

    // Função só para navegação na lista, sem submit do form
    const handleListarAtivos = (e) => {
        e.preventDefault(); // evita submit do form
        navigate('/listar-ativos');
    };

    return (
        <section className="cadastro-ativo">
            <div className="container-cadastro">
                <h2 className="cadastro-title">Cadastre seu ativo</h2>
                <p className="educativo-texto">💡 Cada ativo tem características únicas! Aprenda sobre eles enquanto cadastra o seu.</p>
                <form className="cadastro-form" onSubmit={handleSubmit}>
                    <div className="tooltip-container">
                        <label>Nome do ativo</label>
                        <input 
                            type="text" 
                            name="nome" 
                            placeholder="Dê um nome legal para o seu ativo!" 
                            required 
                            onChange={handleChange} 
                            value={formData.nome}
                        />
                        <div className="tooltip tooltip-right">💡 O nome do ativo ajuda a identificar sua categoria e emissor.</div>
                    </div>

                    <select name="tipo" required onChange={handleChange} value={formData.tipo}>
                        <option value="">Selecione o tipo</option>
                        <option value="renda_fixa_bancaria">Renda Fixa Bancária</option>
                        <option value="titulos_publicos">Títulos Públicos</option>
                        <option value="debentures_creditos">Debêntures e Créditos</option>
                    </select>

                    <input 
                        type="text" 
                        name="emissor" 
                        placeholder="Emissor (Banco, Governo, etc.)" 
                        onChange={handleChange} 
                        value={formData.emissor}
                    />

                    <select name="tipo_negociacao" required onChange={handleChange} value={formData.tipo_negociacao}>
                        <option value="bolsa">Bolsa</option>
                        <option value="balcao">Balcão</option>
                    </select>

                    <input 
                        type="number" 
                        name="valor_unitario" 
                        placeholder="Valor Unitário (R$)" 
                        required 
                        onChange={handleChange} 
                        value={formData.valor_unitario}
                    />

                    <input 
                        type="number" 
                        name="taxa_rentabilidade" 
                        placeholder="Taxa de Rentabilidade (%)" 
                        required 
                        onChange={handleChange} 
                        value={formData.taxa_rentabilidade}
                    />

                    <select name="tipo_juros" required onChange={handleChange} value={formData.tipo_juros}>
                        <option value="prefixado">Prefixado</option>
                        <option value="posfixado">Pós-fixado</option>
                        <option value="hibrido">Híbrido</option>
                    </select>

                    <input 
                        type="date" 
                        name="data_emissao" 
                        required 
                        onChange={handleChange} 
                        value={formData.data_emissao}
                    />

                    <input 
                        type="date" 
                        name="data_vencimento" 
                        required 
                        onChange={handleChange} 
                        value={formData.data_vencimento}
                    />

                    <select name="liquidez" required onChange={handleChange} value={formData.liquidez}>
                        <option value="diaria">Diária</option>
                        <option value="apos_vencimento">Após Vencimento</option>
                    </select>

                    <label>
                        <input 
                            type="checkbox" 
                            name="isento_impostos" 
                            onChange={handleChange} 
                            checked={formData.isento_impostos}
                        /> Isento de Impostos
                    </label>

                    <select name="status" required onChange={handleChange} value={formData.status}>
                        <option value="ativo">Ativo</option>
                        <option value="resgatado">Resgatado</option>
                        <option value="vencido">Vencido</option>
                    </select>

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
