import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import './ReviewList.css'; // Assuming you will create this CSS file

const ReviewList = ({ bookId }) => {
    const { isAuthenticated, user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviewText, setReviewText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [reviewError, setReviewError] = useState(null);

    const fetchReviews = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get(`/reviews/${bookId}`);
            setReviews(res.data);
        } catch (err) {
            console.error('Failed to fetch reviews:', err);
        } finally {
            setLoading(false);
        }
    }, [bookId]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!reviewText.trim()) return;

        setIsSubmitting(true);
        setReviewError(null);

        try {
            const res = await api.post(`/reviews/${bookId}`, { text: reviewText.trim() });
            
            // Add the new review to the list immediately
            setReviews(prevReviews => [res.data.review, ...prevReviews]); 
            setReviewText('');
        } catch (err) {
            setReviewError(err.response?.data?.message || 'Failed to submit review.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const hasUserReviewed = reviews.some(review => review.user._id === user?._id);

    return (
        <div className="review-section">
            <h3>User Reviews ({reviews.length})</h3>
            
            {/* Review Submission Form */}
            {isAuthenticated && !hasUserReviewed ? (
                <form onSubmit={handleReviewSubmit} className="add-review-form">
                    <textarea
                        placeholder="Write your review here..."
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        required
                        rows="4"
                    ></textarea>
                    {reviewError && <p className="error-message">{reviewError}</p>}
                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Posting...' : 'Post Review'}
                    </button>
                </form>
            ) : isAuthenticated && hasUserReviewed ? (
                <p className="reviewed-message">Thank you! You have already reviewed this book.</p>
            ) : (
                <p>Please log in to post a review.</p>
            )}

            {/* Review List Display */}
            <div className="reviews-list">
                {loading ? (
                    <p>Loading reviews...</p>
                ) : reviews.length === 0 ? (
                    <p>No reviews yet. Be the first to review this book!</p>
                ) : (
                    reviews.map(review => (
                        <div key={review._id} className="review-item">
                            <p className="review-text">{review.text}</p>
                            <p className="review-meta">
                                - by <strong>{review.user.name}</strong> 
                                on {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ReviewList;