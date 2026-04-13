# 📘 Chinese Express Food App - Technology & Study Guide

This document outlines **what frameworks and libraries** are used in this project, **why** they were chosen, and the **exact concepts** you must study to answer interview questions confidently.

---

## 1. The Core Tech Stack & Frameworks Used

This project is built using the **MERN Stack**. Here is the breakdown of the primary frameworks and libraries:

| Layer | Technology | What it is | Why we used it |
| :--- | :--- | :--- | :--- |
| **Database** | **MongoDB** | NoSQL Document Database | To store data as JSON-like documents (Users, Foods, Orders), which matches JavaScript objects perfectly. |
| **DB Library** | **Mongoose** | ODM (Object Document Mapper) | To define strict schemas (structure) for MongoDB collections and write clean database queries. |
| **Backend** | **Node.js** | JS Runtime Environment | To execute JavaScript code on the server side (outside the browser). |
| **Backend** | **Express.js** | Web Framework for Node.js | To handle HTTP requests (GET, POST), configure routes, and build REST APIs. |
| **Frontend** | **React.js (Vite)** | Frontend UI Library | To build a fast, single-page user interface (SPA) using reusable components. |
| **Styling** | **Tailwind CSS** | Utility-First CSS Framework | To style the frontend quickly using pre-defined utility classes directly in our HTML/JSX. |

---

## 2. Key Libraries (Dependencies) You Must Know

Interviewers will ask, *"What libraries did you install, and why?"* Here is your cheat sheet:

### Backend Libraries
1.  **`bcryptjs` (Hashing):** Used to securely hash user passwords so they are never stored in plain text.
2.  **`jsonwebtoken` (JWT):** Used to generate secure authorization tokens when a user signs in.
3.  **`dotenv`:** Used to load secure environment configurations (like port numbers and secret keys) from a `.env` file.
4.  **`cors`:** Allows the React frontend (running on port 5173) to securely communicate with the Express backend (running on port 5000).
5.  **`razorpay`:** Official SDK used to communicate with Razorpay servers to initiate payment requests.

### Frontend Libraries
1.  **`axios`:** An HTTP client used to send requests (GET, POST) from React to our backend APIs.
2.  **`react-router-dom`:** Handles page navigation on the client side (e.g., routing from Home to Cart to Tracker without page reloads).
3.  **`lucide-react`:** A library of clean, modern icons (e.g., Cart icons, Lock icons, Pizza icons).
4.  **`react-hot-toast`:** Displays beautiful, animated alert notifications on the screen (e.g., "Welcome back!", "Added to cart!").

---

## 3. What You MUST Study (Core Concepts)

Prepare these exact topics before your interview:

### 🌐 Frontend (React.js) Concepts
*   **Components & Props:** Learn how React applications are broken down into small, reusable UI blocks (Components) and how data is passed down to them (Props).
*   **React Hooks:**
    *   `useState()`: Used to store and update local variables (like search inputs or active filters) within a component.
    *   `useEffect()`: Used to handle side-effects (like fetching the food menu when the page first loads, or running the order tracking timer).
    *   `useContext()`: Used to share global states (like cart items or user login info) across many different pages without passing props manually.
*   **State vs Props:** Remember: *State* is local data owned and modified by the component itself. *Props* are read-only variables passed down from a parent component.

### ⚙️ Backend (Node/Express) Concepts
*   **REST APIs:** Learn what HTTP methods represent:
    *   `GET`: Fetch data (e.g., Get food list).
    *   `POST`: Submit new data (e.g., Register a user or create an order).
    *   `PUT`/`PATCH`: Update existing data.
    *   `DELETE`: Remove data.
*   **Express Middleware:** Explain that middleware functions are functions that have access to the request object (`req`), response object (`res`), and the `next` function in the application's request-response cycle. Our `protect` middleware is a prime example.
*   **MVC Pattern (Model-View-Controller):** Our backend is organized using MVC:
    *   *Model:* Defines the data structure (`models/User.js`).
    *   *Controller:* Contains the business logic (`controllers/authController.js`).
    *   *View:* Managed by our React frontend.

### 💽 Database (MongoDB/Mongoose) Concepts
*   **SQL vs NoSQL:**
    *   *SQL (MySQL, PostgreSQL):* Relational databases using tables, columns, rows, and rigid structures.
    *   *NoSQL (MongoDB):* Document-based databases storing data as JSON/BSON documents. Schema-less and highly flexible.
*   **Mongoose Schemas:** How Mongoose validates data types, defaults, and relations using ObjectIds.

---

## 4. How to Answer: "What is the Tech Stack of your Project?"

**Example Placement Interview Answer:**
> *"My project, Chinese Express, is built on the **MERN Stack**. 
> For the database, I used **MongoDB** with **Mongoose** as the ODM to manage our collections. 
> The backend server is built using **Node.js** and **Express.js**, which handles authentication, database operations, and integrates with the **Razorpay API** for payments. 
> The user interface is a single-page application built using **React.js** (bundled with Vite) and styled with **Tailwind CSS**. 
> We use **JSON Web Tokens (JWT)** for session management and **Bcrypt** for hashing user passwords to maintain security."*
