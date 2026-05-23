import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        let user = null;
        try {
            if (savedUser && savedUser !== 'undefined') {
                user = JSON.parse(savedUser);
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage:", error);
            localStorage.removeItem('user');
        }
        if (token && user) {
            setCurrentUser(user);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/api/auth/login', { email, password });
        const { token, ...user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setCurrentUser(user);
        return user;
    };

    const register = async (userData) => {
        const response = await api.post('/api/auth/register', userData);
        const { token, ...user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setCurrentUser(user);
        return user;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setCurrentUser(null);
    };

    const updateUser = (userData) => {
        const updatedUser = { ...currentUser, ...userData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
    };

    const value = {
        currentUser,
        login,
        register,
        logout,
        updateUser,
        isAdmin: currentUser?.role === 'admin'
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
