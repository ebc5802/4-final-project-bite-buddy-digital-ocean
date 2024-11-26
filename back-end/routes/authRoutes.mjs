import express from "express";
import * as auth from "./auth.mjs";
import sanitize from "mongo-sanitize";
import bcrypt from 'bcryptjs';
import User from "../models/user.mjs"
import jwt from'jsonwebtoken';

const router = express.Router();
router.use(express.json());


router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  console.log("Request data:", req.body); // Log incoming data

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const savedUser = await User.findOne({ email: email });
    if (savedUser) {
      console.log("User already exists with that email:", email);
      return res
        .status(422)
        .json({ error: "User already exists with that email" });
    }
    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      console.log("User already exists with that username:", username);
      return res.status(422).json({ error: "User already exists with that username" });
    }
    
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      recipes: [],
      activities: [],
    });



    console.log('saved');
    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id, username: newUser.username },
      process.env.SECRET_KEY, 
      { expiresIn: '1h' } 
    );
    console.log(token)
    res.status(201).json({ token });
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).send('Error registering user');
  }
});


router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password)
  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).send('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send('Invalid credentials');
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );
    console.log(token)
    res.json({ token });
  } catch (error) {
    res.status(500).send('Error logging in');
  }
});



export default router;