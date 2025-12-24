import React, { useState } from 'react';
import api from '../api/api'; // ASSUMES YOUR API CONFIGURATION FILE

function ContactInfo() {
    const [showDetails, setShowDetails] = useState(false);
    const [contactData, setContactData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchContactDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch data from the same API endpoint the admin uses
            const res = await api.get('/contact'); 
            
            // Transform the data structure (teamMember1, teamMember2, etc.) into a clean array
            const rawData = res.data;
            const members = [
                rawData.teamMember1,
                rawData.teamMember2,
                rawData.teamMember3,
            ].filter(member => member && member.name && member.email); // Only show members with a name AND email

            setContactData(members);

        } catch (err) {
            console.error("Failed to fetch public contact info:", err);
            setError('Contact information is currently unavailable.');
        } finally {
            setLoading(false);
        }
    };

    const toggleDetails = () => {
        // Only fetch data if the details are about to be shown (and we haven't fetched them successfully yet)
        if (!showDetails && !contactData && !loading) {
            fetchContactDetails();
        }
        setShowDetails(!showDetails);
    };

    return (
        <div className="public-contact-container" style={{ padding: '10px', textAlign: 'center' }}>
            <button 
                onClick={toggleDetails}
                style={{ 
                    padding: '8px 15px', 
                    backgroundColor: '#17a2b8', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '1em'
                }}
            >
                {showDetails ? 'Hide Contact Info' : 'Show Contact Info'}
            </button>

            {/* Conditional Rendering: Show details only when showDetails is true */}
            {showDetails && (
                <div style={{ 
                    marginTop: '15px', 
                    border: '1px solid #17a2b8', 
                    padding: '15px', 
                    backgroundColor: '#e9f7f9', 
                    borderRadius: '5px',
                    maxWidth: '400px',
                    margin: '15px auto',
                    textAlign: 'left'
                }}>
                    <h3>Team Contact Information</h3>
                    
                    {loading && <p>Loading team contact details...</p>}
                    
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    
                    {/* Display the list of contact members */}
                    {contactData && contactData.length > 0 ? (
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                            {contactData.map((member, index) => (
                                <li key={index} style={{ marginBottom: '10px' }}>
                                    <strong>Name:</strong> {member.name}<br/>
                                    <strong>Email:</strong> <a href={`mailto:${member.email}`}>{member.email}</a>
                                </li>
                            ))}
                        </ul>
                    ) : (!loading && !error) ? (
                        <p>No contact information has been set by the admin yet.</p>
                    ) : null}
                </div>
            )}
        </div>
    );
}

export default ContactInfo;