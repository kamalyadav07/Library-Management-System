# Full-Stack Library Management System

This is a comprehensive, feature-rich library management system built from the ground up as a full-stack MERN application. It was initially developed as a take-home assignment for a Full Stack Developer role and was later expanded to include numerous advanced, professional-grade features to showcase a wide range of web development skills.



---
## Live Demo

**(Optional: Add a link to your deployed application here if you choose to deploy it.)**

---
## Features

### Core Functionality
- **Book Management**: Admins can add new books to the library catalogue.
- **Borrowing System**: Logged-in users can borrow available books and return them.
- **User Authentication**: Secure user registration and login system using JSON Web Tokens (JWT).
- **Role-Based Access Control**: Differentiates between 'Admin' and 'Member' roles, restricting sensitive actions to admins.

### Advanced Features
- **📊 Admin Dashboard**: A dedicated, admin-only dashboard displaying real-time library statistics (total books, borrowed books, overdue books, total users).
- **⏩ Pagination**: The main book list is paginated to efficiently handle a large number of books, improving performance and scalability.
- **🗓️ Due Dates & Overdue Tracking**: Borrowed books are automatically assigned a due date. Overdue books are visually highlighted in the UI.
- **⭐️ Book Details & Reviews**: Each book has its own dedicated page with more details. Logged-in users can submit a 5-star rating and a written review.
- **📖 User Profiles & History**: Users have a profile page that shows their details and a list of all books they have currently borrowed.
- **🔎 Advanced Search & Filtering**: A powerful search interface that allows filtering by text, category, and sorting by title or author.
- **🌙 Light/Dark Mode Toggle**: A theme toggler for an enhanced and modern user experience.
- **✨ Modern UX**: The application includes loading spinners for data fetching and professional toast notifications for user feedback, avoiding disruptive browser alerts.

---
## Technology Stack

- **Frontend**: React, React Router, Axios, `jwt-decode`, `react-toastify`
- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT), bcryptjs
- **Development**: Concurrently, Nodemon

---
## Setup and Installation

### Prerequisites
- Node.js and npm
- MongoDB Atlas account (or a local MongoDB instance)

### Backend Setup
1.  Navigate to the server directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `/server` directory and add your environment variables:
    ```
    MONGO_URI=<your_mongodb_connection_string>
    JWT_SECRET=<your_jwt_secret_key>
    ```
4.  (Optional) Seed the database with 50+ books:
    ```bash
    npm run data:import
    ```
5.  Start the backend server:
    ```bash
    npm start
    ```
   The server will run on **http://localhost:5000**.

### Frontend Setup
1.  Open a new terminal and navigate to the client directory:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the frontend application:
    ```bash
    npm start
    ```
   The application will open on **http://localhost:3000**.

---
## API Documentation

The API endpoints are documented in the `API-Documentation.postman_collection.json` file located in the project's root directory. This collection can be imported into Postman to test all available routes.
