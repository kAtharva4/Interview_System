import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Welcome from './pages/Welcome';
import Aptitude from './pages/Aptitude';
import Technical from './pages/Technical';
import HRInterview from './pages/HRInterview';
import GroupDiscussion from './pages/GroupDiscussion';
import Bookmarks from './pages/Bookmarks';
import Login from './pages/Login';
import Coding from './pages/Coding';
import Dashboard from './pages/Dashboard';
import ChatWidget from './components/ChatWidget';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './style.css';
function App() {
  return (
    <Router>
      <ThemeProvider>
        <LanguageProvider>
          <div className="container">
            <Navbar />
            <ToastContainer />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Welcome />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route
                path="/aptitude"
                element={
                  <PrivateRoute>
                    <Aptitude />
                  </PrivateRoute>
                }
              />
              <Route
                path="/technical"
                element={
                  <PrivateRoute>
                    <Technical />
                  </PrivateRoute>
                }
              />
              <Route
                path="/hr-interview"
                element={
                  <PrivateRoute>
                    <HRInterview />
                  </PrivateRoute>
                }
              />
              <Route
                path="/group-discussion"
                element={
                  <PrivateRoute>
                    <GroupDiscussion />
                  </PrivateRoute>
                }
              />
              <Route
                path="/bookmarks"
                element={
                  <PrivateRoute>
                    <Bookmarks />
                  </PrivateRoute>
                }
              />
              <Route
                path="/coding"
                element={
                  <PrivateRoute>
                    <Coding />
                  </PrivateRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
            </Routes>
            <ChatWidget />
          </div>
        </LanguageProvider>
      </ThemeProvider>
    </Router>
  );
}
export default App;