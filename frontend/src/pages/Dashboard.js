import React, { useState, useEffect, useCallback } from 'react';
import BookCard from '../components/BookCard';
import api from '../api/api';
import './Dashboard.css'; // Assuming you will create this CSS file
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // Requirement #10

    const fetchBooks = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get('/books');
            setBooks(res.data);
            
            // Update local user object's wishlist for easy reference in BookCard
            if (user && user._id) {
                 const wishlistRes = await api.get('/wishlist');
                 // Create an array of book IDs for quick lookup in BookCard
                 const wishlistIds = wishlistRes.data.map(book => book._id);
                 user.wishlist = wishlistIds;
            }

        } catch (err) {
            setError('Failed to fetch books. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    // Handler for wishlist state updates from BookCard (Requirement #6)
    const handleWishlistUpdate = (bookId, added) => {
        setBooks(prevBooks => 
            prevBooks.map(book => {
                if (book._id === bookId) {
                    return { 
                        ...book, 
                        wishlistCount: book.wishlistCount + (added ? 1 : -1) 
                    };
                }
                return book;
            })
        );
    };

    // Filter logic for search (Requirement #10)
    const filteredBooks = books.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="loading">Loading Virtual Bookshelf...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="dashboard-container">
            <h1>All Books</h1>
            
            {/* Search Box (Requirement #10) */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search by title or author..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {filteredBooks.length === 0 && <p>No books found matching your search criteria.</p>}

            <div className="book-list">
                {filteredBooks.map(book => (
                    <BookCard 
                        key={book._id} 
                        book={book} 
                        onWishlistUpdate={handleWishlistUpdate}
                        isAdminView={false} // Dashboard is for all users
                        onDeleteBook={fetchBooks} // Admin deletion in the AdminPanel will call fetchBooks
                    />
                ))}
            </div>
        </div>
    );
};

export default Dashboard;