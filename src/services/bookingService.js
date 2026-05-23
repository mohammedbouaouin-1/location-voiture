import api from './api';

const API_URL = '/api/bookings';

export const createBooking = async (bookingData) => {
    const response = await api.post(API_URL, bookingData);
    return response.data;
};

export const getMyBookings = async () => {
    const response = await api.get(`${API_URL}/my`);
    return response.data;
};


export const getAllBookings = async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`${API_URL}/admin${query ? `?${query}` : ''}`);
    return response.data;
};

export const updateBookingStatus = async (id, status) => {
    const response = await api.put(`${API_URL}/${id}`, { status });
    return response.data;
};

export const deleteBooking = async (id) => {
    const response = await api.delete(`${API_URL}/${id}`);
    return response.data;
};


export const createPaymentIntent = async (bookingData) => {
    const response = await api.post('/api/stripe/create-payment-intent', bookingData);
    return response.data;
};

const bookingService = {
    createBooking,
    getMyBookings,
    getAllBookings,
    updateBookingStatus,
    deleteBooking,
    createPaymentIntent
};

export default bookingService;
