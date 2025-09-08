import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const Spinner = () => <div className="spinner"></div>;

const AddBookForm = ({ onBookAdded }) => {
    const { token } = useAuth();
    const [formData, setFormData] = useState({ title: '', author: '', isbn: '', category: 'Fiction' });
    const { title, author, isbn, category } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const config = { headers: { 'x-auth-token': token } };
            // Use environment variable for API URL
            await axios.post(`${process.env.REACT_APP_API_URL}/api/books`, formData, config);
            toast.success('Book added successfully!');
            setFormData({ title: '', author: '', isbn: '', category: 'Fiction' });
            onBookAdded();
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Error adding book.');
        }
    };

    return (
        <form onSubmit={onSubmit} className="auth-form add-book-form">
            <h3>Add a New Book</h3>
            <input type="text" name="title" placeholder="Title" value={title} onChange={onChange} required />
            <input type="text" name="author" placeholder="Author" value={author} onChange={onChange} required />
            <input type="text" name="isbn" placeholder="ISBN" value={isbn} onChange={onChange} required />
            <select name="category" value={category} onChange={onChange}>
                <option value="Fiction">Fiction</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="Science">Science</option>
                <option value="History">History</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Biography">Biography</option>
            </select>
            <button type="submit">Add Book</button>
        </form>
    );
};

const Book = ({ book, onUpdate }) => {
  const { token } = useAuth();
  const handleBorrow = async () => {
    if (window.confirm(`Are you sure you want to borrow "${book.title}"?`)) {
      const config = { headers: { 'x-auth-token': token } };
      try {
        // Use environment variable for API URL
        await axios.put(`${process.env.REACT_APP_API_URL}/api/books/${book._id}/borrow`, null, config);
        toast.info(`You borrowed "${book.title}"`);
        onUpdate();
      } catch (error) {
        toast.error('You must be logged in to borrow a book.');
      }
    }
  };

  return (
    <li className="book-item">
      <div>
        <Link to={`/books/${book._id}`} className="book-title-link">
          <strong>{book.title}</strong>
        </Link> by {book.author}
        <span className="book-isbn"> (ISBN: {book.isbn})</span>
      </div>
      <button onClick={handleBorrow}>Borrow</button>
    </li>
  );
};

const BorrowedBook = ({ book, onUpdate }) => {
  const { token } = useAuth();
  const handleReturn = async () => {
    if (window.confirm(`Are you sure you want to return "${book.title}"?`)) {
      const config = { headers: { 'x-auth-token': token } };
      try {
        // Use environment variable for API URL
        await axios.put(`${process.env.REACT_APP_API_URL}/api/books/${book._id}/return`, null, config);
        toast.success(`You returned "${book.title}"`);
        onUpdate();
      } catch (error) {
        toast.error(error.response?.data?.msg || 'Error returning book.');
      }
    }
  };

  let isOverdue = false;
  let formattedDueDate = '';
  if (book.dueDate) {
    isOverdue = new Date(book.dueDate) < new Date();
    formattedDueDate = new Date(book.dueDate).toLocaleDateString();
  }

  return (
    <li className={`book-item ${isOverdue ? 'overdue' : ''}`}>
      <div>
        <Link to={`/books/${book._id}`} className="book-title-link">
          <strong>{book.title}</strong>
        </Link> by {book.author}
        {book.dueDate && (
          <span className="book-due-date">Due: {formattedDueDate}</span>
        )}
      </div>
      <button onClick={handleReturn} className="return-btn">Return</button>
    </li>
  );
};

const Library = () => {
  const { user, token } = useAuth();
  const [availableBooks, setAvailableBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    searchQuery: '',
    category: 'All',
    sortBy: 'title_asc',
  });

  const fetchAvailableBooks = useCallback(async (page, currentFilters) => {
    try {
      const params = new URLSearchParams({
        page,
        search: currentFilters.searchQuery,
        category: currentFilters.category,
        sort: currentFilters.sortBy,
      });
      // Use environment variable for API URL
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/books?${params.toString()}`);
      setAvailableBooks(res.data.books);
      setCurrentPage(res.data.currentPage);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      toast.error("Could not fetch available books.");
    }
  }, []);

  const fetchBorrowedBooks = useCallback(async () => {
    if (!token) {
        setBorrowedBooks([]);
        return;
    };
    try {
      const config = { headers: { 'x-auth-token': token } };
      // Use environment variable for API URL
      const borrowedRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/borrowed`, config);
      setBorrowedBooks(borrowedRes.data);
    } catch (error) {
      // No toast here to avoid errors on logout/initial load
    }
  }, [token]);

  const refreshAllData = useCallback(async (page = 1) => {
    setLoading(true);
    await Promise.all([
        fetchAvailableBooks(page, filters),
        fetchBorrowedBooks()
    ]);
    setLoading(false);
  }, [filters, fetchAvailableBooks, fetchBorrowedBooks]);

  useEffect(() => {
    refreshAllData(1);
  }, [refreshAllData]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
        refreshAllData(newPage);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      {user && user.role === 'Admin' && <AddBookForm onBookAdded={() => refreshAllData(1)} />}

      <div className="filter-controls">
        <input
          type="text"
          name="searchQuery"
          placeholder="Search by title or author..."
          value={filters.searchQuery}
          onChange={handleFilterChange}
        />
        <select name="category" value={filters.category} onChange={handleFilterChange}>
          <option value="All">All Categories</option>
          <option value="Fiction">Fiction</option>
          <option value="Non-Fiction">Non-Fiction</option>
          <option value="Science">Science</option>
          <option value="History">History</option>
          <option value="Fantasy">Fantasy</option>
          <option value="Biography">Biography</option>
        </select>
        <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
          <option value="title_asc">Sort by Title (A-Z)</option>
          <option value="title_desc">Sort by Title (Z-A)</option>
          <option value="author_asc">Sort by Author (A-Z)</option>
          <option value="author_desc">Sort by Author (Z-A)</option>
        </select>
      </div>

      <div className="book-list">
        <h2>Available Books</h2>
        {availableBooks.length > 0 ? (
          <ul>
            {availableBooks.map(book => <Book key={book._id} book={book} onUpdate={refreshAllData} />)}
          </ul>
        ) : (
          <p>No available books match your search.</p>
        )}
        
        <div className="pagination">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                Next
            </button>
        </div>
      </div>
      
      <div className="book-list borrowed-list">
        <h2>Borrowed Books</h2>
        {borrowedBooks.length > 0 ? (
          <ul>
            {borrowedBooks.map(book => (
              <BorrowedBook key={book._id} book={book} onUpdate={refreshAllData} />
            ))}
          </ul>
        ) : (
          <p>You have not borrowed any books.</p>
        )}
      </div>
    </>
  );
};

export default Library;