import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Wishlist from './pages/Wishlist';
import BookDetails from './pages/BookDetails';
import AdminPanel from './pages/AdminPanel';

// Components
import Header from './components/Header';
import ContactInfo from './components/ContactInfo'; // <-- IMPORTED HERE

// --- Helper Component for Protected Routes ---
const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { isAuthenticated, user, isLoading } = useAuth();

    if (isLoading) {
        return <div style={{textAlign: 'center', padding: '50px'}}>Loading user data...</div>; 
    }

    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }

    if (adminOnly && (!user || !user.isAdmin)) {
        return <Navigate to="/dashboard" />;
    }

    return children;
};
// ------------------------------------------

const AppContent = () => {
    useAuth(); 

    return (
        <>
            <Header />
            <main style={{ padding: '20px', minHeight: '80vh' }}>
                <Routes>
                    <Route path="/" element={<Home />} /> 
                    
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

                    <Route 
                        path="/admin" 
                        element={<ProtectedRoute adminOnly={true}><AdminPanel /></ProtectedRoute>} 
                    />

                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </main>
            
            {/* The public contact button is placed in the footer */}
            <footer style={{borderTop: '1px solid #ddd', marginTop: '20px', paddingTop: '10px', textAlign: 'center'}}>
                <ContactInfo /> {/* <-- RENDERED HERE */}
            </footer>
        </>
    );
};

const App = () => (
    <Router>
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    </Router>
);

export default App;