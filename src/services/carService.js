import api from './api';

const API_URL = '/api/cars';

export const getCars = async (params = {}) => {
    // Transformer les paramètres en query string
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`${API_URL}${query ? `?${query}` : ''}`);
    return response.data;
};

export const getCarById = async (id) => {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
};

export const createCar = async (carData) => {
    // can be JSON or FormData
    const response = await api.post(API_URL, carData);
    return response.data;
};

export const updateCar = async (id, carData) => {
    // can be JSON or FormData
    const response = await api.put(`${API_URL}/${id}`, carData);
    return response.data;
};

export const deleteCar = async (id) => {
    const response = await api.delete(`${API_URL}/${id}`);
    return response.data;
};

const carService = {
    getCars,
    getCarById,
    createCar,
    updateCar,
    deleteCar
};

export default carService;
