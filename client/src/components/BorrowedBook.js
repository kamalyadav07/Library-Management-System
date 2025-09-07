import React from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const BorrowedBook = ({ book, onUpdate }) => {
  const { token } = useAuth();

  const handleReturn = async () => {
    // Show a confirmation dialog before proceeding
    if (window.confirm(`Are you sure you want to return "${book.title}"?`)) {
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      
      try {
        await axios.put(`http://localhost:5000/api/books/${book._id}/return`, null, config);
        onUpdate(); // Refresh both lists
      } catch (error) {
        console.error("Error returning book:", error);
        alert('You must be logged in to return a book.');
      }
    }
  };

  return (
    <li className="book-item">
      <div>
        <strong>{book.title}</strong> by {book.author}
      </div>
      <button onClick={handleReturn} className="return-btn">Return</button>
    </li>
  );
};

export default BorrowedBook;