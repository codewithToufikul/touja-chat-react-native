const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const cors = require("cors");
const jwt = require("jsonwebtoken");
const port = 5000;

const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

mongoose
  .connect(
    "mongodb+srv://touja-chat:WI9jTyZ5dAu0vpjr@cluster0.ivo4yuq.mongodb.net/"
  )
  .then(() => {
    console.log("Connected to MongoDB successfully!");
  })
  .catch((err) => {
    console.log("Error connecting to the database!", err);
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/", (req, res) => {
  res.send("hello");
});

const User = require("./models/user");
const Message = require("./models/message");

//endpoint for registration of the user

app.post("/users", (req, res) => {
  console.log("Request received at /register"); // Log for debugging
  const { name, email, password, image } = req.body;
  const newUser = new User({ name, email, password, image });
  newUser
    .save()
    .then(() => {
      res.status(200).json({ message: "User registered successfully" });
    })
    .catch((err) => {
      console.error("Error registering user:", err);
      res.status(500).json({ message: "Error registering the user!" });
    });
});

// jwt

const createToken = (userId) => {
    const payload = {
      userId: userId,
    };
  
    const token = jwt.sign(payload, "Q$r2K6W8n!jCW%Zk", { expiresIn: "1h" });
  
    return token;
  };

//   login verify endpoint

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(404)
      .json({ message: "Email and the password are required" });
  }

  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.password !== password) {
      return res.status(404).json({ message: "Invalid Password!" });
    }
    const token = createToken(user._id);
    res.status(200).json({ token });

  }).catch((error) => {
    console.log("error in finding the user", error);
    res.status(500).json({ message: "Internal server Error!" });
  });
});
