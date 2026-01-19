import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Import Global Styles
import './index.css';
import './Components.css'; 

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Wishlist from './pages/Wishlist';
import BookDetails from './pages/BookDetails';
import AdminPanel from './pages/AdminPanel';
import ContactPage from './pages/ContactPage';


// Components
import Header from './components/Header';
import ContactInfo from './components/ContactInfo';

/**
 * Helper Component for Protected Routes
 * Redirects unauthorized users and handles admin-only pages.
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { isAuthenticated, user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading your bookshelf...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }

    if (adminOnly && (!user || !user.isAdmin)) {
        return <Navigate to="/dashboard" />;
    }

    return children;
};

/**
 * AppContent Component
 * Contains the actual layout and route definitions.
 */
const AppContent = () => {
    return (
        <div className="app-container">
            <Header />
            
            <main className="main-content">
                <Routes>
                    {/* Public Route */}
                    <Route path="/" element={<Home />} /> 
                    
                    {/* Protected User Routes */}
                    <Route 
                        path="/dashboard" 
                        element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
                    />

                    <Route 
                        path="/wishlist" 
                        element={<ProtectedRoute><Wishlist /></ProtectedRoute>} 
                    />
                    
                    <Route 
                        path="/book/:id" 
                        element={<ProtectedRoute><BookDetails /></ProtectedRoute>} 
                    />

                    {/* Admin Specific Route */}
                    <Route 
                        path="/admin" 
                        element={<ProtectedRoute adminOnly={true}><AdminPanel /></ProtectedRoute>} 
                    />
                    <Route path="/contact" element={<ContactPage />} />


                    {/* Fallback Catch-all */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </main>
            
            <footer className="footer-container">
                <ContactInfo />
                <p className="footer-copy">© 2026 Virtual Bookshelf. Built for Readers.</p>
            </footer>
        </div>
    );
};

/**
 * Root App Component
 * Wraps everything in Router and Auth Context.
 */
const App = () => (
    <Router>
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    </Router>
);

export default App;
