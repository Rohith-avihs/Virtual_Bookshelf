import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/api'; // ASSUMES YOUR API CONFIGURATION FILE
// import './AdminContactForm.css'; // Optional CSS

const AdminContactForm = () => {
    const [contact, setContact] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');

    const fetchContact = useCallback(async () => {
        try {
            const res = await api.get('/contact');
            setContact(res.data);
        } catch (err) {
            // Initialize with an empty structure if data is not found on the backend
             setContact({
                teamMember1: { name: '', email: '' },
                teamMember2: { name: '', email: '' },
                teamMember3: { name: '', email: '' },
            });
            setError('Failed to load existing contact info. Starting with blank fields.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchContact();
    }, [fetchContact]);

    const handleChange = (e, memberKey, field) => {
        setContact(prev => ({
            ...prev,
            [memberKey]: {
                ...prev[memberKey],
                [field]: e.target.value,
            },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setMessage('');

        try {
            const updatePayload = {
                teamMember1: contact.teamMember1,
                teamMember2: contact.teamMember2,
                teamMember3: contact.teamMember3,
            };
            
            const res = await api.put('/contact', updatePayload);
            // Optionally, refresh state with the response data
            setContact(res.data.contact || updatePayload); 
            setMessage(res.data.message || 'Contact information updated successfully!');
        } catch (err) {
            setError(err.response?.data?.message || 'Update failed.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <p>Loading contact info...</p>;
    if (!contact) return <p className="error">Error: Could not initialize form data.</p>;

    return (
        <form onSubmit={handleSubmit} className="contact-form">
            <h2>Update Public Contact Information</h2>
            
            {message && <p className="success-message" style={{color: 'green', fontWeight: 'bold'}}>{message}</p>}
            {error && <p className="error-message" style={{color: 'red', fontWeight: 'bold'}}>{error}</p>}

            {['teamMember1', 'teamMember2', 'teamMember3'].map((key, index) => (
                <div key={key} className="member-group" style={{marginBottom: '20px', border: '1px solid #ddd', padding: '15px', borderRadius: '4px'}}>
                    <h4>Team Member {index + 1}</h4>
                    <div style={{marginBottom: '10px'}}>
                        <label style={{display: 'block', marginBottom: '5px'}}>Name:</label>
                        <input
                            type="text"
                            placeholder="Name"
                            value={contact[key]?.name || ''} 
                            onChange={(e) => handleChange(e, key, 'name')}
                            required
                            style={{width: '100%', padding: '8px', boxSizing: 'border-box'}}
                        />
                    </div>
                    <div style={{marginBottom: '10px'}}>
                        <label style={{display: 'block', marginBottom: '5px'}}>Email:</label>
                        <input
                            type="email"
                            placeholder="Email"
                            value={contact[key]?.email || ''}
                            onChange={(e) => handleChange(e, key, 'email')}
                            required
                            style={{width: '100%', padding: '8px', boxSizing: 'border-box'}}
                        />
                    </div>
                </div>
            ))}
            
            <button 
                type="submit" 
                disabled={isSubmitting}
                style={{padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px'}}
            >
                {isSubmitting ? 'Saving...' : 'Update Contact Info'}
            </button>
        </form>
    );
};

export default AdminContactForm;