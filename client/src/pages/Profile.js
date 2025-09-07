import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const Spinner = () => <div className="spinner"></div>;

const Profile = () => {
  const { user, token } = useAuth();
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyBooks = async () => {
      try {
        const config = { headers: { 'x-auth-token': token } };
        const res = await axios.get('http://localhost:5000/api/users/borrowed', config);
        setBorrowedBooks(res.data);
      } catch (error) {
        toast.error("Could not fetch your borrowed books.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchMyBooks();
    }
  }, [token]);

  if (loading) return <Spinner />;

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      <p><strong>Username:</strong> {user?.username}</p>
      <p><strong>Role:</strong> {user?.role}</p>

      <hr />

      <h3 className="profile-section-title">My Borrowed Books</h3>
      {borrowedBooks.length > 0 ? (
        <ul className="book-list-profile">
          {borrowedBooks.map(book => (
            <li key={book._id}>
              <Link to={`/books/${book._id}`}>{book.title}</Link> by {book.author}
              
              {/* --- THIS IS THE FIX --- */}
              {/* Only show the date if it exists */}
              {book.dueDate ? (
                <span>Due: {new Date(book.dueDate).toLocaleDateString()}</span>
              ) : (
                <span>No due date</span>
              )}

            </li>
          ))}
        </ul>
      ) : (
        <p>You have not borrowed any books.</p>
      )}
    </div>
  );
};

export default Profile;