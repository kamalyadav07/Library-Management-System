// client/src/pages/Library.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Book from '../components/Book';
import BorrowedBook from '../components/BorrowedBook';

// A component for the add book form
const AddBookForm = ({ onBookAdded }) => {
    const { token } = useAuth();
    const [formData, setFormData] = useState({ title: '', author: '', isbn: '' });

    const { title, author, isbn } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const config = { headers: { 'x-auth-token': token } };
            await axios.post('http://localhost:5000/api/books', formData, config);
            alert('Book added successfully!');
            setFormData({ title: '', author: '', isbn: '' }); // Clear form
            onBookAdded(); // Refresh the book list
        } catch (err) {
            console.error(err.response.data);
            alert('Error adding book.');
        }
    };

    return (
        <form onSubmit={onSubmit} className="auth-form add-book-form">
            <h3>Add a New Book</h3>
            <input type="text" name="title" placeholder="Title" value={title} onChange={onChange} required />
            <input type="text" name="author" placeholder="Author" value={author} onChange={onChange} required />
            <input type="text" name="isbn" placeholder="ISBN" value={isbn} onChange={onChange} required />
            <button type="submit">Add Book</button>
        </form>
    );
};

const Library = () => {
  const { user } = useAuth();
  const [availableBooks, setAvailableBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAllBooks = async () => {
    try {
      const availableRes = await axios.get('http://localhost:5000/api/books');
      setAvailableBooks(availableRes.data);
      const borrowedRes = await axios.get('http://localhost:5000/api/books/borrowed');
      setBorrowedBooks(borrowedRes.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    fetchAllBooks();
  }, []);

  // This is the corrected filter logic
  const filteredBooks = availableBooks.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {user && user.role === 'Admin' && <AddBookForm onBookAdded={fetchAllBooks} />}

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by title or author..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="book-list">
        <h2>Available Books</h2>
        <ul>
          {filteredBooks.map(book => (
            <Book key={book._id} book={book} onUpdate={fetchAllBooks} />
          ))}
        </ul>
      </div>

      <div className="book-list borrowed-list">
        <h2>Borrowed Books</h2>
        <ul>
          {borrowedBooks.map(book => (
            <BorrowedBook key={book._id} book={book} onUpdate={fetchAllBooks} />
          ))}
        </ul>
      </div>
    </>
  );
};

export default Library;