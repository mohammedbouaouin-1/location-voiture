import api from './api';

const API_URL = '/api/users';

export const updateProfile = async (userData) => {
    const response = await api.put(`${API_URL}/profile`, userData);
    return response.data;
};

const userService = {
    updateProfile
};

export default userService;
