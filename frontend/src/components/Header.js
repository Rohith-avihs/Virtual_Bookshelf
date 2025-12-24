import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css'; // Assuming you will create this CSS file

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const onLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="header-container">
            <div className="logo">
                <Link to={user ? '/dashboard' : '/'}>Virtual Bookshelf</Link>
            </div>
            <nav className="nav-links">
                {user ? (
                    <>
                        {user.isAdmin && (
                            <Link to="/admin" className="nav-item">Admin Panel</Link>
                        )}
                        <Link to="/dashboard" className="nav-item">Books</Link>
                        <Link to="/wishlist" className="nav-item">Wishlist</Link>
                        <span className="nav-welcome">Welcome, {user.name.split(' ')[0]}</span>
                        <button onClick={onLogout} className="nav-button logout">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/" className="nav-item">Login/Register</Link>
                        {/* We will add a link to a general "Contact Us" page later */}
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header;