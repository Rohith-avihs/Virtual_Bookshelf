import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css'; // Assuming you will create this CSS file

const Home = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const { login, register, isAuthenticated, isLoading, error } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to dashboard if already authenticated
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { email, password, name } = formData;

        if (isRegister) {
            register({ name, email, password });
        } else {
            login({ email, password });
        }
    };

    // If already logged in, show nothing or a redirection message
    if (isAuthenticated) {
        return null; 
    }

    return (
        <div className="home-container">
            <h1>{isRegister ? 'Register Account' : 'User Login'}</h1>
            <form onSubmit={handleSubmit} className="auth-form">
                {error && <p className="error-message">{error}</p>}
                
                {isRegister && (
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                )}
                
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Processing...' : isRegister ? 'Register' : 'Login'}
                </button>
            </form>
            
            <p className="switch-link">
                {isRegister ? 'Already have an account?' : "Don't have an account?"}
                <button type="button" onClick={() => {
                    setIsRegister(!isRegister);
                    setFormData({ name: '', email: '', password: '' }); // Clear form on switch
                }}>
                    {isRegister ? 'Login Here' : 'Register Here'}
                </button>
            </p>
        </div>
    );
};

export default Home;