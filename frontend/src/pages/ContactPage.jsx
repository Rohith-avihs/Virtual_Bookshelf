import React, { useEffect, useState } from 'react';
import api from '../api/api';

const ContactPage = () => {
    const [contactData, setContactData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContactDetails = async () => {
            try {
                const res = await api.get('/contact');

                const rawData = res.data;
                const members = [
                    rawData.teamMember1,
                    rawData.teamMember2,
                    rawData.teamMember3,
                ].filter(m => m && m.name && m.email);

                setContactData(members);
            } catch (err) {
                setError('Contact information is currently unavailable.');
            } finally {
                setLoading(false);
            }
        };

        fetchContactDetails();
    }, []);

    return (
        <div style={{ maxWidth: '600px', margin: '40px auto' }}>
            <h2>Team Members Details</h2>

            {loading && <p>Loading contact details...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {contactData.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {contactData.map((member, index) => (
                        <li
                            key={index}
                            style={{
                                marginBottom: '15px',
                                padding: '15px',
                                border: '1px solid #ddd',
                                borderRadius: '6px'
                            }}
                        >
                            <strong>{member.name}</strong><br />
                            <a href={`mailto:${member.email}`}>
                                {member.email}
                            </a>
                        </li>
                    ))}
                </ul>
            ) : (!loading && !error) && (
                <p>No contact information available.</p>
            )}
        </div>
    );
};

export default ContactPage;
