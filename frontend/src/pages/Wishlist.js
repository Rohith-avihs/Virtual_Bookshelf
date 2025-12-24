import React, { useState, useEffect, useCallback } from 'react';
import BookCard from '../components/BookCard';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import './Wishlist.css'; // Assuming you will create this CSS file

const Wishlist = () => {
    const [wishlistBooks, setWishlistBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth(); // Needed to confirm user context

    const fetchWishlist = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get('/wishlist');
            setWishlistBooks(res.data);
            
            // Update the local user object's wishlist array for BookCard checks
            if (user) {
                user.wishlist = res.data.map(book => book._id);
            }
        } catch (err) {
            setError('Failed to fetch wishlist.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    // Handler to remove book from the local list after the API call (Requirement #2, #6)
    const handleWishlistUpdate = (bookId, added) => {
        if (!added) {
            // If the book was removed, filter it out of the displayed list
            setWishlistBooks(prevBooks => prevBooks.filter(book => book._id !== bookId));
        }
        // Since the BookCard also updates the book's wishlistCount, no need to update the global list here,
        // but we need to update the user's local wishlist array for BookCard logic.
        if (user) {
            user.wishlist = user.wishlist.filter(id => id !== bookId);
        }
        // NOTE: The count update on the book list will happen in the Dashboard, this component only displays the user's list.
    };

    if (loading) return <div className="loading">Loading Wishlist...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="wishlist-container">
            <h1>Your Virtual Wishlist</h1>
            {wishlistBooks.length === 0 ? (
                <p>Your wishlist is currently empty. Add some books from the Dashboard!</p>
            ) : (
                <div className="book-list">
                    {wishlistBooks.map(book => (
                        <BookCard 
                            key={book._id} 
                            book={book} 
                            onWishlistUpdate={handleWishlistUpdate}
                            isAdminView={false}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;