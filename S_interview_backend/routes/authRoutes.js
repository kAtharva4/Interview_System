const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const passport = require("passport");

const router = express.Router();

// Email/Password Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile); // Protected Route


const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
};

router.get('/dashboard', isLoggedIn, (req, res) => {
  res.send('Welcome ' + req.user.displayName);
});

module.exports = router;
