import api from './api';

export const getDashboardStats = async (period = '7j') => {
    const response = await api.get(`/api/dashboard/stats?period=${period}`);
    return response.data;
};


export const getUsers = async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/api/users${query ? `?${query}` : ''}`);
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await api.delete(`/api/users/${id}`);
    return response.data;
};

export const updateUser = async (id, userData) => {
    const response = await api.put(`/api/users/${id}`, userData);
    return response.data;
};

const dashboardService = {
    getDashboardStats,
    getUsers,
    deleteUser,
    updateUser
};

export default dashboardService;
