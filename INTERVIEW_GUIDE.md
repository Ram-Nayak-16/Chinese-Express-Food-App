# 🥢 Chinese Express Food App - Placement Interview Guide

This guide is designed to help you prepare for your college placement interviews and project reviews. It breaks down the entire project's architecture, key files, database design, and features into simple, easy-to-understand explanations.

---

## 1. Project Overview & Architecture
This application is built using the **MERN Stack**, which stands for:
*   **M (MongoDB):** A NoSQL database used to store users, menu items, reviews, and orders as flexible documents.
*   **E (Express.js):** A lightweight backend web application framework for Node.js to manage routing and server logic.
*   **R (React):** A frontend JavaScript library for building responsive, single-page user interfaces.
*   **N (Node.js):** A JavaScript runtime environment that executes JS code on the server side.

### How Data Flows (MERN Architecture)
1.  **Frontend (React):** The user browses food items, adds them to the cart, and clicks "Checkout". React makes HTTP API requests using **Axios**.
2.  **API Gateway / Server (Node/Express):** `server.js` listens for incoming requests on `/api/...` routes, runs security middleware (JWT check), and calls the corresponding controller function.
3.  **Controllers (Database Queries):** Controller functions query **MongoDB** using the Mongoose ODM (Object Document Mapper).
4.  **Response:** MongoDB returns the data, the controller packages it as JSON, and sends it back to the React frontend, which updates the UI.

---

## 2. Key Backend Files & Code Explanations

### 📁 `backend/server.js` (The Entry Point)
*   **What it does:** Starts our server, connects to MongoDB, and registers API endpoints.
*   **Key concept:** It configures **CORS** (Cross-Origin Resource Sharing) so our frontend running on port 5173 can safely talk to the backend running on port 5000.
*   **How to explain it:** *"This is the starting point of our backend. It loads environment variables, starts the Express server, enables JSON request reading, registers the routes (Users, Food, Reviews, Payments), and serves static React production builds."*

### 📁 `backend/config/db.js` (Database Connection & Seeding)
*   **What it does:** Connects Mongoose to the MongoDB database.
*   **Special feature:** If no remote MongoDB URL is found, it automatically starts a local in-memory database and seeds it with default food menu items (Burger, Biryani, Noodles) and an admin user.
*   **How to explain it:** *"This file connects our app to MongoDB. To make it user-friendly, I added an auto-seeding script inside `db.js`. If the database is empty when the server starts, it automatically creates a default Admin user and inserts the starting menu items so the website is immediately populated."*

### 📁 `backend/middleware/authMiddleware.js` (Route Protection)
*   **What it does:** Restricts routes so only logged-in users (or admins) can access them.
*   **How it works:** It looks for a `Bearer <token>` inside the HTTP Authorization request header. It decodes the JSON Web Token (JWT) using our secret key. If valid, it attaches the user data to `req.user` and allows the request to continue.
*   **How to explain it:** *"This middleware protects secure routes (like placing an order). It extracts the JWT token sent from the client, decodes it to find the user's ID, and attaches the user's details to the request. If the token is invalid or missing, it blocks the request with a 401 Unauthorized status."*

### 📁 `backend/controllers/authController.js` (User & OTP Logic)
*   **What it does:** Manages registration, login, and email verification.
*   **Key features:**
    *   **Password Hashing:** Uses `bcryptjs` (implemented in the User model) to secure passwords.
    *   **Simple OTP Generation:** Generates a 6-digit random code: `Math.floor(100000 + Math.random() * 900000)`.
    *   **Email Sending:** Uses Nodemailer (`sendEmail` utility) to email verification codes.
*   **How to explain it:** *"This file handles auth. For registration, we create an unverified user and email them a 6-digit OTP code using Nodemailer. For login, we compare their entered password with the hashed password in the database. If correct, we generate a JWT token containing their ID."*

### 📁 `backend/controllers/paymentController.js` (Razorpay & COD Orders)
*   **What it does:** Handles order placement and payments.
*   **Key features:**
    *   **Razorpay Integration:** Creates a secure transaction order on Razorpay servers.
    *   **Cash on Delivery:** Skips Razorpay setup and directly saves the order to MongoDB.
    *   **Payment Verification:** Verifies signatures using SHA-256 hashes:
        `crypto.createHmac('sha256', secret).update(order_id + '|' + payment_id).digest('hex')`
*   **How to explain it:** *"This controller processes both Online and Cash on Delivery orders. For online, we request a transaction ID from Razorpay and verify the payment signature using Node's crypto library. For COD, we save the order directly. In both cases, a new Order document is saved to our database with status `isPaid: false`."*

### 📁 `backend/controllers/foodController.js` (Menu Operations)
*   **What it does:** Handles fetching, updating, creating, and deleting menu items.
*   **Key concept:** Supports case-insensitive searching using MongoDB `$regex`.
*   **How to explain it:** *"This controller handles our CRUD operations for food items. If a search query is passed in the URL (e.g. `?keyword=ramen`), we run a MongoDB find query with a case-insensitive regex pattern matching the name. Otherwise, we fetch the complete list."*

---

## 3. Database Schema Design (Mongoose Models)

Interviewers love to ask about database modeling. Here is how your data is structured:

*   **USER:** Stores client profile data (name, email, hashed password, verification status, and OTP codes).
*   **FOOD:** Stores menu details (name, price, description, category, count in stock).
*   **ORDER:** Stores cart list, pricing summaries (GST, delivery charges, subtotal), payment types (online/COD), and verification properties.
*   **REVIEW:** Stores ratings (1 to 5 stars) and textual comments linked to verified users.

---

## 4. Top 10 Placement Interview Questions & Answers

### Q1: What is a JSON Web Token (JWT) and how do you use it?
**Answer:** *"A JSON Web Token (JWT) is a secure way of transmitting information between a client and a server as a JSON object. In our app, once a user logs in successfully, the server signs a token containing the user's database ID using a secret key and sends it to the frontend. The frontend saves this token in local storage and attaches it to the Authorization header of every secure API request. The backend middleware decodes it to verify the user's identity."*

### Q2: Why do you store passwords as hashes instead of plain text, and how does Bcrypt work?
**Answer:** *"Storing plain text passwords is a massive security risk in case the database is compromised. We use Bcrypt to hash passwords. Bcrypt is a one-way hashing function that uses salt (random characters added to the password) and multiple work rounds to create a secure, un-reversible hash. During login, we use `bcrypt.compare()` to compare the entered plain password against the saved hash."*

### Q3: How did you implement real-time order tracking in this project?
**Answer:** *"For this college-level project, I simulated real-time tracking on the frontend using React hooks. When an order is completed, the user is redirected to the `/order-tracker/:id` page. We fetch the order details from the database, then use a React `useEffect` with a `setInterval` timer. Every 15 seconds, the tracker advances the state through stages (Order Confirmed ➔ Preparing ➔ Out for Delivery ➔ Arrived), triggers toast alerts, and updates an estimated time counter (ETA). This gives a realistic tracking experience like Swiggy or Zomato without requiring complex WebSockets."*

### Q4: What is Mongoose, and why did you use it instead of the native MongoDB driver?
**Answer:** *"Mongoose is an Object Document Mapper (ODM) for MongoDB and Node.js. It allows us to define strict schemas with validations (like min/max values or required fields) for our database collections, which MongoDB does not enforce out-of-the-box. It also simplifies writing queries, relations, and model methods like password matching."*

### Q5: How do you verify Razorpay payments on the backend to prevent fraud?
**Answer:** *"To prevent user fraud (like tampering with payment statuses), we use Razorpay signature verification. Once the user pays on the frontend, Razorpay returns a `payment_id`, `order_id`, and `signature`. The frontend sends these to our backend. Our backend creates a HMAC-SHA256 signature using the string `<order_id>|<payment_id>` and our private Razorpay Secret key. If our generated signature matches the signature returned by Razorpay, the payment is verified and marked as paid in the database."*

### Q6: How does the "Search" functionality work on both frontend and backend?
**Answer:** *"On the frontend, we use a Search Context to sync the search input in the Navbar. When a user types, we trigger an Axios request to `/api/food?keyword=<search_term>`. On the backend, our controller extracts this keyword and queries MongoDB using `$regex: keyword` with `$options: 'i'` (which makes it case-insensitive). The database returns matching foods which React displays on the homepage."*

### Q7: What is CORS, and why did you configure it?
**Answer:** *"CORS stands for Cross-Origin Resource Sharing. By default, web browsers block frontend code on one domain (e.g. local port 5173) from making requests to a backend on another domain (e.g. local port 5000) for security. We configured the `cors` package in `server.js` to allow safe, credentials-based requests between our React frontend and our Express server."*

### Q8: What happens when two users add items to the cart at the same time? How is state managed?
**Answer:** *"Cart state is managed client-side using React's **Context API** (`CartContext.jsx`). The cart state is saved in the browser's LocalStorage. This means each user has a completely isolated cart stored locally in their browser. Only when they proceed to checkout do they send a request to the backend to create an order."*

### Q9: How do you handle errors on the backend so the application doesn't crash?
**Answer:** *"We wrap all database calls and asynchronous operations in standard `try-catch` blocks. If an operation fails (e.g. database connection is lost or validation fails), the `catch` block intercepts the error, logs it, and returns an appropriate HTTP error status (like 400 for Bad Request or 500 for Server Error) along with a JSON error message instead of crashing the Node process."*

### Q10: What are the main differences between SQL (Relational) and MongoDB (NoSQL) databases?
**Answer:** *"SQL databases are table-based and use schemas with rigid columns and foreign-key relations. MongoDB is a document-based NoSQL database that stores data as JSON-like documents. MongoDB is highly scalable, supports fast queries, and is dynamic, allowing us to change the structure of documents (like adding new properties to a Food or Order item) without needing migration scripts."*
