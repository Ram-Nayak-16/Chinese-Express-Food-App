# 🥢 Chinese Express — Full-Stack Food Delivery App

Chinese Express is a complete, interview-ready full-stack web application built using the **MERN (MongoDB, Express, React, Node.js)** stack. This project is structured with clean, beginner-friendly programming patterns designed specifically to be easily explained during fresher and SDE-1 placement interviews.

---

## 🚀 Key Features

*   🔐 **Simple Authentication**: Pure Email and Password registration and login. Uses **Bcryptjs** for secure password hashing and **JSON Web Tokens (JWT)** for session validation. No complex email OTP redirects, making the code clean and explainable.
*   🛵 **Live Order Tracker**: A custom-built tracking interface that simulates a real-time order delivery flow (Order Confirmed ➔ Kitchen Preparing ➔ Out for Delivery ➔ Arrived) using React timers and animated progress steppers.
*   🍔 **Interactive Food Menu**: Browse food items by category, add items to the cart, and search the catalog using case-insensitive database queries.
*   💳 **Secure Checkout**: Integrates the **Razorpay Payment Gateway** (supporting UPI, Cards, and QR codes) and Cash on Delivery. Includes server-side signature verification using HMAC-SHA256 to prevent payment spoofing.
*   ⭐ **Reviews & Feedback**: Allows authenticated customers to leave reviews and 5-star ratings for menu items.
*   🎨 **Modern responsive UI**: Beautiful UI built with Tailwind CSS, Lucide React icons, and React Hot Toast notifications.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React (Vite), Tailwind CSS, Context API, Axios, Lucide React |
| **Backend** | Node.js, Express 5, JWT, BcryptJS, Path-To-Regexp |
| **Database** | MongoDB & Mongoose ODM |
| **Payments** | Razorpay Node SDK |

---

## 📂 Project Structure

```text
Chinese-Express-Food-App/
├── backend/
│   ├── config/db.js              # Connection & Auto-seeding script
│   ├── controllers/              # Request handlers (auth, food, payment, review)
│   ├── middleware/               # Route protectors & JWT verification
│   ├── models/                   # Mongoose Schemas (User, Food, Order, Review)
│   ├── routes/                   # Router endpoints
│   └── server.js                 # App Entry Point & Static Asset Server
│
└── frontend/
    └── src/
        ├── context/              # Global Context Providers (Auth, Cart, Search)
        ├── pages/                # Screen views (Home, Cart, Checkout, Login, Signup, OrderTracker)
        └── components/           # Reusable UI widgets
```

---

## ⚙️ Getting Started Locally

### Prerequisites
*   Node.js (v18 or higher)
*   A remote MongoDB connection string (or it will automatically spin up a local in-memory database!)

### Installation & Run

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Ram-Nayak-16/Chinese-Express-Food-App.git
    cd Chinese-Express-Food-App
    ```

2.  **Setup Environment Variables:**
    Create a file named `.env` inside the `backend` folder and add:
    ```env
    PORT=5000
    JWT_SECRET=your_super_secret_jwt_key
    NODE_ENV=production
    ```

3.  **Install dependencies and build the frontend:**
    ```bash
    # Install backend packages
    cd backend && npm install
    
    # Install frontend packages
    cd ../frontend && npm install
    
    # Build React application
    npm run build
    ```

4.  **Start the server:**
    Go back to the root folder and run:
    ```bash
    npm start
    ```
    Open your browser and navigate to **`http://localhost:5000`** to view the application!

---

## 🎓 Placement & Interview Resources
We have created dedicated, comprehensive placement study guides inside the root directory to help you prepare for your technical rounds:
*   📄 **[INTERVIEW_GUIDE.md](INTERVIEW_GUIDE.md):** Summarizes core functions and answers the top 10 most common interview questions on this project.
*   📄 **[PROJECT_DEEP_EXPLANATION.md](PROJECT_DEEP_EXPLANATION.md):** An exhaustive handbook mapping the full request-response lifecycle and database architectures.
*   📄 **[SIMPLE_AUTH_GUIDE.md](SIMPLE_AUTH_GUIDE.md):** Walkthrough and testing commands for the clean Email & Password auth flow.
*   📄 **[STUDY_GUIDE.md](STUDY_GUIDE.md):** Revision notes on React Hooks, Express routing, and NoSQL query optimizations.

---

