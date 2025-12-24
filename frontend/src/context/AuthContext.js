import React, { createContext, useReducer } from 'react';
import api from '../api/api';

// Initial state: try to load user from localStorage
const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    isAuthenticated: !!JSON.parse(localStorage.getItem('user')),
    isLoading: false,
    error: null,
};

// Reducer function to handle state changes
const authReducer = (state, action) => {
    switch (action.type) {
        case 'START_LOADING':
            return { ...state, isLoading: true, error: null };
        case 'LOGIN_SUCCESS':
        case 'REGISTER_SUCCESS':
            localStorage.setItem('user', JSON.stringify(action.payload));
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            };
        case 'LOGOUT':
            localStorage.removeItem('user');
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            };
        case 'AUTH_FAIL':
            localStorage.removeItem('user');
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export const AuthContext = createContext(initialState);

// Provider component
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Register User
    const register = async (userData) => {
        dispatch({ type: 'START_LOADING' });
        try {
            const res = await api.post('/auth/register', userData);
            dispatch({ type: 'REGISTER_SUCCESS', payload: res.data });
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            dispatch({ type: 'AUTH_FAIL', payload: message });
        }
    };

    // Login User
    const login = async (userData) => {
        dispatch({ type: 'START_LOADING' });
        try {
            const res = await api.post('/auth/login', userData);
            dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            dispatch({ type: 'AUTH_FAIL', payload: message });
        }
    };

    // Logout User
    const logout = () => {
        dispatch({ type: 'LOGOUT' });
    };

    // Context value
    const value = {
        ...state,
        register,
        login,
        logout,
        dispatch
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for consuming the context
export const useAuth = () => {
    return React.useContext(AuthContext);
};