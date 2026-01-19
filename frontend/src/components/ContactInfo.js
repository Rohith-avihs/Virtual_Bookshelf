import React from 'react';
import { useNavigate } from 'react-router-dom';

function ContactInfo() {
    const navigate = useNavigate();

    return (
        <button
            className="nav-item"
            onClick={() => navigate('/contact')}

            style={{
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                padding: '6px 12px',
                fontSize: '1em'
            }}
        >
            Contact Us
        </button>
    );
}

export default ContactInfo;
