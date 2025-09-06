import React from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // 1. Import the hook

const BorrowedBook = ({ book, onUpdate }) => {
  const { token } = useAuth(); // 2. Get the token from our context

  const handleReturn = async () => {
    // 3. Create a config object with the auth headers
    const config = {
      headers: {
        'x-auth-token': token,
      },
    };
    
    try {
      // 4. Pass the config object with the request
      await axios.put(`http://localhost:5000/api/books/${book._id}/return`, null, config);
      onUpdate(); // Refresh both lists
    } catch (error) {
      console.error("Error returning book:", error);
      alert('You must be logged in to return a book.');
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