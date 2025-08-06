const User = require("../models/User");
const UserProgress=require("../models/UserProgress")
const jwt = require("jsonwebtoken");

// 🔹 Register New User
exports.registerUser = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  if (!firstname || !lastname || !email || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const newUser = new User({
      firstname,
      lastname,
      email,
      password, // Do not manually hash; Mongoose middleware will do it
    });

    await newUser.save();

    res.status(201).json({
      _id: newUser._id,
      firstname: newUser.firstname,
      email: newUser.email,
      token: newUser.generateToken(),
    });
  } catch (error) {
    console.error("Error in Registration:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    res.status(200).json({
      _id: user._id,
      firstname: user.firstname,
      email: user.email,
      token: user.generateToken(),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// 🔹 Get User Profile (Protected)
exports.getUserProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-hashedPassword -salt");
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};
