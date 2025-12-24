import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import ReviewList from '../components/ReviewList'; // We'll create this next
import './BookDetails.css'; // Assuming you will create this CSS file

const SOCKET_SERVER_URL = 'http://localhost:5000'; // Matches the backend server

const BookDetails = () => {
    const { id: bookId } = useParams();
    const { user } = useAuth();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Chat State (Requirement #9)
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const messagesEndRef = useRef(null); // Ref for auto-scrolling

    // Auto-scroll chat window
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // --- Book and Review Fetching ---
    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const res = await api.get(`/books/${bookId}`);
                setBook(res.data);
            } catch (err) {
                setError('Failed to fetch book details.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchBookDetails();
    }, [bookId]);


    // --- Socket.IO Chat Setup (Requirement #9) ---
    useEffect(() => {
        if (!user || !bookId) return;

        // 1. Connect the socket
        const newSocket = io(SOCKET_SERVER_URL);
        setSocket(newSocket);

        // 2. Join the chat room for this specific book
        newSocket.emit('joinBookChat', bookId);

        // 3. Listen for incoming messages
        newSocket.on('receiveMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        // 4. Clean up on unmount
        return () => {
            newSocket.disconnect();
        };
    }, [bookId, user]); // Re-run if bookId or user changes

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (chatInput.trim() === '' || !socket || !user) return;

        const messageData = {
            bookId,
            user: user.name, // Display the user's name
            message: chatInput.trim(),
        };

        // Send message to the server
        socket.emit('sendMessage', messageData);

        // Clear input
        setChatInput('');
    };
    // ---------------------------------------------


    if (loading) return <div className="loading">Loading book details...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!book) return <div className="error">Book not found.</div>;

    // Construct the full URL for viewing the book file
    const bookUrl = `${SOCKET_SERVER_URL}/uploads${book.filePath}`;


    return (
        <div className="book-details-container">
            <div className="book-content-area">
                <h1>{book.title}</h1>
                <p className="book-author">by {book.author}</p>
                <p className="book-description">{book.description || 'No description available.'}</p>
                <p className="wishlist-count">Wishlisted by: {book.wishlistCount} users</p>

                {/* View Book Link (Requirement #4, #8) */}
                <a 
                    href={bookUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="button view-book-button"
                >
                    View Book File
                </a>

                {/* Book File Viewer (Optional: Could use an iframe for embedded PDF viewer) */}
                <div className="book-viewer">
                    {/* For simplicity, we just provide the link above. An embedded viewer requires more setup. */}
                    {/* <iframe src={bookUrl} title={`${book.title} viewer`} width="100%" height="600px"></iframe> */}
                </div>

                {/* Review Section (Requirement #7) */}
                <ReviewList bookId={bookId} />
            </div>

            {/* Online Chat Box (Requirement #9) */}
            <div className="online-chat-box">
                <h2>Live Book Discussion ({book.title})</h2>
                <div className="chat-messages">
                    {messages.length === 0 && <p className="no-messages">Start the conversation!</p>}
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.user === user.name ? 'own' : 'other'}`}>
                            <strong>{msg.user}:</strong> {msg.message}
                            <span className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSendMessage} className="chat-input-form">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        disabled={!socket}
                        required
                    />
                    <button type="submit" disabled={!socket || chatInput.trim() === ''}>Send</button>
                </form>
            </div>
        </div>
    );
};

export default BookDetails;