import React, { useState, useEffect, useCallback } from 'react';
import BookCard from '../components/BookCard';
import AdminContactForm from '../components/AdminContactForm'; // Component for Requirement #5
import api from '../api/api';
import './AdminPanel.css'; // Assuming you will create this CSS file

const AdminPanel = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookForm, setBookForm] = useState({ title: '', author: '', description: '' });
    const [bookFile, setBookFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [fetchError, setFetchError] = useState(null);

    const fetchBooks = useCallback(async () => {
        setLoading(true);
        setFetchError(null);
        try {
            const res = await api.get('/books');
            setBooks(res.data);
        } catch (err) {
            setFetchError('Failed to fetch books for admin view.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    // Handlers for New Book Form
    const handleBookChange = (e) => {
        setBookForm({ ...bookForm, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setBookFile(e.target.files[0]);
    };

    const handleBookSubmit = async (e) => {
        e.preventDefault();
        if (!bookFile) {
            alert('Please select a book file (PDF, EPUB, etc.).');
            return;
        }

        setUploading(true);
        
        // Use FormData for file uploads
        const formData = new FormData();
        formData.append('title', bookForm.title);
        formData.append('author', bookForm.author);
        formData.append('description', bookForm.description);
        formData.append('bookFile', bookFile); // Matches the field name in backend bookController.js

        try {
            await api.post('/books', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('Book added successfully!');
            setBookForm({ title: '', author: '', description: '' });
            setBookFile(null);
            fetchBooks(); // Refresh list
        } catch (error) {
            alert(`Failed to add book: ${error.response?.data?.message || 'Server error'}`);
        } finally {
            setUploading(false);
        }
    };

    // Handler for deletion success from BookCard
    const handleBookDelete = (bookId) => {
        setBooks(prevBooks => prevBooks.filter(book => book._id !== bookId));
    };

    return (
        <div className="admin-panel-container">
            <h1>Admin Panel</h1>
            
            {/* 1. Add New Book (Requirement #3) */}
            <div className="admin-section add-book-section">
                <h2>Add New Book</h2>
                <form onSubmit={handleBookSubmit} className="add-book-form">
                    <input name="title" value={bookForm.title} onChange={handleBookChange} placeholder="Title" required />
                    <input name="author" value={bookForm.author} onChange={handleBookChange} placeholder="Author" required />
                    <textarea name="description" value={bookForm.description} onChange={handleBookChange} placeholder="Description (Optional)"></textarea>
                    <input type="file" onChange={handleFileChange} required />
                    <button type="submit" disabled={uploading}>
                        {uploading ? 'Uploading...' : 'Add Book'}
                    </button>
                </form>
            </div>
            
            {/* 2. Update Contact Info (Requirement #5) */}
            <div className="admin-section contact-info-section">
                <h2>Update Team Contact Info</h2>
                <AdminContactForm />
            </div>

            {/* 3. Manage/Delete Existing Books (Requirement #3) */}
            <div className="admin-section manage-books-section">
                <h2>Manage Books ({books.length})</h2>
                {loading && <p>Loading books...</p>}
                {fetchError && <p className="error">{fetchError}</p>}
                <div className="book-list">
                    {books.map(book => (
                        <BookCard 
                            key={book._id} 
                            book={book} 
                            isAdminView={true} 
                            onDeleteBook={handleBookDelete}
                            onWishlistUpdate={() => {}} // No need for wishlist update logic here
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;