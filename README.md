# Smart Interview Assistant

This project is a comprehensive full-stack web application designed to help users prepare for different types of interviews. The application is built using a React frontend and a Node.js/Express backend, with MongoDB serving as the database.

## Features

- **User Authentication:** Supports secure user registration and login, including seamless integration with Google OAuth.
- **Personalized Learning:** Users can track their progress and bookmark questions for later review.
- **Diverse Content:** Provides dedicated sections to practice for:
    - Aptitude Tests
    - Coding Challenges
    - Technical Interviews
    - HR Interviews
    - Group Discussions
- **Interactive Interface:** A user-friendly interface powered by React provides a smooth and engaging experience, with features like real-time notifications.
- **PDF Generation:** Allows users to generate PDF documents, presumably for saving study materials or mock interview transcripts.

## Technologies Used

**Frontend:**
- React
- `react-router-dom` for navigation
- `axios` for API calls
- `react-toastify` for user notifications
- `jspdf` for PDF generation

**Backend:**
- Node.js & Express
- Mongoose for MongoDB object modeling
- `bcrypt` for password hashing
- `jsonwebtoken` for secure token-based authentication
- `passport` and `passport-google-oauth20` for authentication strategies
- `express-session` for session management

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites
- Node.js (v18 or higher recommended)
- npm
- A running instance of MongoDB

### Installation

1.  Clone the repository:
    ```bash
    git clone [https://github.com/your-username/smart_interview_assistant.git](https://github.com/your-username/smart_interview_assistant.git)
    cd smart_interview_assistant
    ```

2.  Set up the backend:
    Navigate to the `S_interview_backend` directory, install dependencies, and configure your environment variables.
    ```bash
    cd S_interview_backend
    npm install
    ```
    Create a `.env` file in this directory and add your database connection string, JWT secret, and other sensitive information.

3.  Set up the frontend:
    Navigate to the `Interview_prep_main` directory, install dependencies, and start the development server.
    ```bash
    cd ../Interview_prep_main
    npm install
    npm start
    ```

### Running the Application

1.  Start the backend server from the `S_interview_backend` directory:
    ```bash
    npm start
    ```

2.  Start the frontend development server from the `Interview_prep_main` directory:
    ```bash
    npm start
    ```

The application should now be accessible at `http://localhost:3000` in your web browser.
