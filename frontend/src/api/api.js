import axios from 'axios';

// Create a custom instance of Axios
const api = axios.create({
    // Set the base URL to your running backend server API
    baseURL: 'http://localhost:5000/api', 
    headers: {
        'Content-Type': 'application/json',
    },
    // We are using headers for JWT, but keeping this for standard practice
    withCredentials: true, 
});

// Request Interceptor: Attach the JWT token to every request that goes out
api.interceptors.request.use(
    (config) => {
        // Get user object (which contains the token) from Local Storage
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user ? user.token : null;

        if (token) {
            // Set the Authorization header (Bearer token format)
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;