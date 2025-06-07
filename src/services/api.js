import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAtivo = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/ativos/${id}/`, {
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar ativo:", error.response?.data || error.message);
        throw error.response?.data || new Error('Erro ao buscar ativo');
    }
};


export const listarAtivos = async () => {
    try {
        const response = await axios.get(`${API_URL}/ativos/`, {
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar ativos:", error.response?.data || error.message);
        throw error.response?.data || new Error('Erro ao buscar ativos');
    }
};

export const criarAtivo = async (ativoData) => {
    try {
        const response = await axios.post(`${API_URL}/ativos/criar/`, ativoData, {
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao criar ativo:", error.response?.data || error.message);
        throw error.response?.data || new Error('Erro ao criar ativo');
    }
};

export const deletarAtivo = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/ativos/deletar/${id}/`, {
            headers: getAuthHeaders(),
        });
        console.log("Ativo deletado com sucesso.");
        return response.data;
    } catch (error) {
        console.error("Erro ao deletar ativo:", error.response?.data || error.message);
        throw error.response?.data || new Error('Erro ao deletar ativo');
    }
};



