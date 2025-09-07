import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Spinner = () => <div className="spinner"></div>;

const BookDetails = () => {
  const { id } = useParams();
  const { user, token } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  // Wrap fetchBook in useCallback
  const fetchBook = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/books/${id}`);
      setBook(res.data);
    } catch (error) {
      toast.error('Could not load book details.');
    } finally {
      setLoading(false);
    }
  }, [id]); // It depends on 'id', so we list it here

  // Add fetchBook to the dependency array
  useEffect(() => {
    fetchBook();
  }, [fetchBook]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      return toast.warn('Please select a rating.');
    }
    try {
      const config = { headers: { 'x-auth-token': token } };
      await axios.post(`http://localhost:5000/api/books/${id}/reviews`, { rating, comment }, config);
      toast.success('Review submitted!');
      setRating(0);
      setComment('');
      fetchBook(); // Refresh book data to show the new review
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Error submitting review.');
    }
  };

  if (loading) return <Spinner />;
  if (!book) return <h2>Book not found.</h2>;

  return (
    <div className="book-details-container">
      <Link to="/" className="back-link"> &larr; Back to Library</Link>
      <h2>{book.title}</h2>
      <p className="book-details-author">by {book.author}</p>
      <div className="book-details-info">
        <p><strong>ISBN:</strong> {book.isbn}</p>
        <p><strong>Status:</strong> {book.isAvailable ? 'Available' : (book.dueDate ? `Borrowed (Due: ${new Date(book.dueDate).toLocaleDateString()})` : 'Borrowed')}</p>
        <p><strong>Added On:</strong> {new Date(book.createdAt).toLocaleDateString()}</p>
      </div>

      <hr />

      <div className="reviews-section">
        <h3>Reviews</h3>
        {book.reviews.length === 0 && <p>No reviews yet.</p>}
        <div className="review-list">
          {book.reviews.map(review => (
            <div key={review._id} className="review-item">
              <strong>{review.username}</strong>
              <p>Rating: {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</p>
              <p>{review.comment}</p>
            </div>
          ))}
        </div>

        {user && (
          <form onSubmit={submitReview} className="review-form">
            <h4>Write a Review</h4>
            <select value={rating} onChange={(e) => setRating(e.target.value)} required>
              <option value="0">Select Rating</option>
              <option value="1">1 - Poor</option>
              <option value="2">2 - Fair</option>
              <option value="3">3 - Good</option>
              <option value="4">4 - Very Good</option>
              <option value="5">5 - Excellent</option>
            </select>
            <textarea
              rows="4"
              placeholder="Your comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            ></textarea>
            <button type="submit">Submit</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookDetails;