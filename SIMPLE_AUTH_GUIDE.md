# 🔒 MERN Food Delivery - Simple Authentication System Guide

This guide describes the clean, beginner-friendly Email and Password authentication system built for the Chinese Express application. It is structured to help you explain the concepts clearly in SDE-1 / fresher placement interviews.

---

## 1. Directory Folder Structure

Here is the clean folder structure showing the exact files responsible for authentication:

```text
Chinese-Express-Food-App/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB Connection
│   ├── controllers/
│   │   └── authController.js     # Signup, Login, and Profile Controllers
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT Token verification guard
│   ├── models/
│   │   └── User.js               # Mongoose schema & password hashing pre-save hook
│   ├── routes/
│   │   └── authRoutes.js         # /signup, /login, and /profile routes
│   └── server.js                 # App Entry point & namespace mount
│
└── frontend/
    └── src/
        ├── context/
        │   └── AuthContext.jsx   # Context API for sharing auth state globally
        ├── pages/
        │   ├── Login.jsx         # Email & Password sign-in form
        │   ├── Register.jsx      # New account registration form
        │   └── Checkout.jsx      # Protected route check & placing order
```

---

## 2. Required npm Packages

These are the standard, production-ready packages installed in the backend for authentication:
1.  **`express`:** Web framework for handling routes and requests.
2.  **`mongoose`:** ODM to structure and interact with MongoDB collections.
3.  **`bcryptjs`:** Cryptographic library used to salt and hash user passwords securely.
4.  **`jsonwebtoken` (JWT):** Generates and verifies cryptographic session tokens.

---

## 3. Backend Source Code

### A. User Schema with Hashing Hook (`backend/models/User.js`)
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
  },
  { timestamps: true } // Creates "createdAt" automatically
);

// Method to verify if password matches
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// pre-save hook: Hash password automatically before storing in MongoDB
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', userSchema);
```

### B. Auth Controller (`backend/controllers/authController.js`)
```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// POST /api/auth/signup
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/login
const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/auth/profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({ _id: user._id, name: user.name, email: user.email });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, authUser, getUserProfile };
```

---

## 4. JWT Authorization Middleware (`backend/middleware/authMiddleware.js`)

This guard parses and validates incoming authentication tokens before resolving secure API requests:

```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Extract JWT token from "Authorization: Bearer <token>" header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Select all fields except password
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
```

---

## 5. Frontend React Code

### A. Auth Context API Provider (`frontend/src/context/AuthContext.jsx`)
```javascript
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null
  );

  useEffect(() => {
    if (user) {
      localStorage.setItem('userInfo', JSON.stringify(user));
    } else {
      localStorage.removeItem('userInfo');
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      setUser(data);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await axios.post('/api/auth/signup', { name, email, password });
      setUser(data);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Signup failed' };
    }
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

---

## 6. API Testing Examples

You can test these endpoints using `cURL` or Postman:

### 1. Sign Up a New User
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name": "Saurabh Singh", "email": "saurabh@example.com", "password": "password123"}'
```

### 2. Log In
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "saurabh@example.com", "password": "password123"}'
```

### 3. Fetch Protected Profile (Include Token received from Sign In)
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## 7. Step-by-Step Flow Explanation (Interview Script)

When an interviewer asks you to **"Explain your authentication architecture"**, use this step-by-step script:

1.  **State Management (Context API):**
    > *"I used React’s Context API to manage the global authentication state. When the app loads, it checks if user information (including the token) is saved in the browser’s `localStorage`. If it exists, the user remains logged in automatically."*
2.  **Unprotected Browsing:**
    > *"Any guest can browse food items and add them to their cart without logging in. All cart logic is managed locally in React state."*
3.  **Checkout Guard:**
    > *"When the user clicks 'Place Order', our Checkout page runs a `useEffect` check. If the global `user` state is empty, we display a warning and redirect them to `/login?redirect=/checkout`. By passing the return path as a query parameter, we make sure they return back to Checkout automatically after logging in."*
4.  **Bcrypt Hashing on Signup:**
    > *"When a new user signs up, their details are sent to `/api/auth/signup`. We use a Mongoose pre-save middleware hook that intercepts the user document before it hits the database. We generate a salt, hash the plain password using Bcrypt, and store the hash. We never store plain text passwords."*
5.  **Token Issuance:**
    > *"Upon successful login or signup, the backend generates a JSON Web Token (JWT) signed with a private secret key. This token is returned in the JSON response, and the frontend saves it in `localStorage` for future requests."*
6.  **Protected Requests:**
    > *"To access protected backend resources (like placing an order or retrieving a profile), the frontend adds an `Authorization: Bearer <token>` header to the request. The backend middleware decodes the token, extracts the user ID, verifies it against the database, and attaches the user profile details directly to the request object (`req.user`) before resolving the controller."*
