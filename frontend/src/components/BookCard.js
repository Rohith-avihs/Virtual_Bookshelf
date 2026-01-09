import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import './BookCard.css';

const BookCard = ({ book, onWishlistUpdate, isAdminView, onDeleteBook }) => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    
    // Check if the current book is in the user's wishlist
    const isInWishlist = user?.wishlist?.includes(book._id);

    // Handle adding/removing from wishlist
    const handleWishlistToggle = async () => {
        if (!user) return alert('Please log in to manage your wishlist.');
        setIsLoading(true);
        
        const endpoint = isInWishlist ? `/wishlist/remove/${book._id}` : `/wishlist/add/${book._id}`;
        
        try {
            await api.put(endpoint);
            // Notify parent to update local state so the UI reflects the change immediately
            onWishlistUpdate(book._id, !isInWishlist); 
        } catch (error) {
            console.error('Wishlist update failed:', error);
            alert(`Error: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle admin book deletion
    const handleDelete = async () => {
        if (!window.confirm(`Permanently delete "${book.title}"?`)) return;
        
        setIsLoading(true);
        try {
            await api.delete(`/books/${book._id}`);
            onDeleteBook(book._id);
        } catch (error) {
            console.error('Book deletion failed:', error);
            alert(`Deletion failed: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="book-card">
            <div className="book-card-header">
                <h3 className="book-title">{book.title}</h3>
                <span className="wishlist-badge">
                    {book.wishlistCount} {book.wishlistCount === 1 ? 'save' : 'saves'}
                </span>
            </div>
            
            <p className="book-author">by {book.author}</p>
            
            <div className="book-card-body">
                <Link to={`/book/${book._id}`} className="btn-view-details">
                    View Details
                </Link>
            </div>

            <div className="book-card-footer">
                {user && !isAdminView && (
                    <button 
                        onClick={handleWishlistToggle} 
                        disabled={isLoading}
                        className={`btn-wishlist ${isInWishlist ? 'is-active' : ''}`}
                    >
                        {isLoading ? 'Processing...' : isInWishlist ? '★ In Wishlist' : '☆ Add to Wishlist'}
                    </button>
                )}
                
                {user?.isAdmin && isAdminView && (
                    <button 
                        onClick={handleDelete} 
                        disabled={isLoading}
                        className="btn-admin-delete"
                    >
                        {isLoading ? 'Deleting...' : 'Delete Book'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default BookCard;
