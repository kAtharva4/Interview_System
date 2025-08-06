const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // ✅ Import CORS
const app = express();
const authRoutes = require("./routes/authRoutes");
const answerRoutes=require("./routes/answerRoutes")
require("dotenv").config();
const saveQuestion=require("./routes/saveQuestions")
const session = require('express-session');
const passport = require('passport');
require('./config/passport');
const port = 8000;

// ✅ Enable CORS
app.use(cors({
  origin: "http://localhost:3000", // allow your frontend
  credentials: true                // allow cookies if needed
}));

app.use(express.json());
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
mongoose
  .connect(
    `mongodb+srv://chourikar31:${process.env.MONGO_PASSWORD}@cluster0.ac0teqc.mongodb.net/smart_interview?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

  app.use("/api/auth", authRoutes);
  app.use("/api/save", saveQuestion);
  app.use("/ans", answerRoutes);
  
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
