import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000'
});

// Funkcje do sterowania loaderem zostaną wstrzyknięte w App.js
export const setupInterceptors = (setLoading) => {
    api.interceptors.request.use((config) => {
        setLoading(true);
        return config;
    }, (error) => {
        setLoading(false);
        return Promise.reject(error);
    });

    api.interceptors.response.use((response) => {
        setLoading(false);
        return response;
    }, (error) => {
        setLoading(false);
        return Promise.reject(error);
    });
};

export default api;