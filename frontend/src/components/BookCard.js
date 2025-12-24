import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import './BookCard.css'; // Assuming you will create this CSS file

const BookCard = ({ book, onWishlistUpdate, isAdminView, onDeleteBook }) => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const isInWishlist = user?.wishlist?.includes(book._id);

    // Handle adding/removing from wishlist (Requirement #2, #6)
    const handleWishlistToggle = async () => {
        if (!user) return alert('Please log in to manage your wishlist.');
        setIsLoading(true);
        const endpoint = isInWishlist ? `/wishlist/remove/${book._id}` : `/wishlist/add/${book._id}`;
        
        try {
            await api.put(endpoint);
            // Notify parent component (Dashboard/Wishlist) to refresh data
            onWishlistUpdate(book._id, !isInWishlist); 
        } catch (error) {
            console.error('Wishlist update failed:', error);
            alert(`Failed to update wishlist: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle admin book deletion (Requirement #3)
    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete the book: "${book.title}"?`)) return;
        setIsLoading(true);
        try {
            await api.delete(`/books/${book._id}`);
            onDeleteBook(book._id); // Notify parent to remove from list
            alert('Book deleted successfully!');
        } catch (error) {
            console.error('Book deletion failed:', error);
            alert(`Failed to delete book: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="book-card">
            <h3>{book.title}</h3>
            <p className="author">by {book.author}</p>
            
            <div className="book-info">
                <p>Wishlist Count: <strong>{book.wishlistCount}</strong></p>
                {/* Requirements #4 & #8: View Book Button */}
                <Link to={`/book/${book._id}`} className="button view-button">
                    View Book
                </Link>
            </div>

            <div className="book-actions">
                {user && !isAdminView && (
                    <button 
                        onClick={handleWishlistToggle} 
                        disabled={isLoading}
                        className={`button ${isInWishlist ? 'remove' : 'add-wishlist'}`}
                    >
                        {isLoading ? '...' : isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    </button>
                )}
                
                {user?.isAdmin && isAdminView && (
                    <button 
                        onClick={handleDelete} 
                        disabled={isLoading}
                        className="button delete-button"
                    >
                        {isLoading ? '...' : 'Delete Book (Admin)'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default BookCard;