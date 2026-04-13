# 🥢 Chinese Express Food App - Complete Project & Interview Handbook

This document is a comprehensive, deep-dive explanation of the **Chinese Express Food App**. It is designed to prepare you for technical rounds, project reviews, and system design interviews during college placements.

---

## SECTION 1: SYSTEM OVERVIEW & ARCHITECTURE

The application uses a **MERN (MongoDB, Express, React, Node.js)** architecture. Below is a detailed description of how the system functions from the moment a user loads the webpage to when their order is placed.

### The Full Request-Response Lifecycle
1. **Loading the App (Client-side):**
   * The client browser makes a request for static assets (HTML, CSS, JS). In a production environment, the Express server serves these from `frontend/dist`.
   * React mounts on the browser. The `App.jsx` wrapper sets up global Context Providers: `AuthProvider` (auth state), `CartProvider` (cart state), and `SearchProvider` (search queries).

2. **Fetching Food Items (Frontend to Backend):**
   * The `Home.jsx` component uses React's `useEffect` hook to call `axios.get('/api/food')`.
   * The request hits `backend/server.js`, matches the path `/api/food`, and gets routed to `backend/routes/foodRoutes.js`.
   * The route executes the `getFoods` controller function in `backend/controllers/foodController.js`.
   * The controller calls `Food.find(query)` to fetch documents from MongoDB and returns them as a JSON response.
   * React receives the response, updates its state via `setFoods(data.foods)`, and renders the menu cards.

3. **User Checkout & Razorpay Payment (Transactional Cycle):**
   * The user clicks "Checkout" in `Cart.jsx` and goes to `Checkout.jsx`.
   * **Step A (Backend Order Creation):** The frontend sends cart and billing details to `/api/payment/order`. The backend generates a database record with `isPaid: false` and triggers the Razorpay SDK to create an official order on Razorpay servers, returning the Razorpay Order ID.
   * **Step B (User Payment):** The frontend opens the Razorpay popup. The user pays.
   * **Step C (Verification):** Razorpay sends a signature response. The frontend sends this signature to `/api/payment/verify`. The backend verifies the HMAC signature using the private secret key. If they match, the backend updates the order status to `isPaid: true` and saves it.
   * **Step D (Redirection & Tracking):** The user is redirected to `/order-tracker/:id` where they watch their order progress in real-time.

---

## SECTION 2: FILE & DIRECTORY WALKTHROUGH

Here is the exact purpose of every critical file in the project, written so you can explain them line-by-line:

### 📁 BACKEND ARCHITECTURE
*   **`server.js`:** The core configuration file. It sets up Express, configures CORS policies, registers router handlers, and serves the static production build of the frontend.
*   **`config/db.js`:** Manages the database connection. Includes an auto-seeder that populates sample data (dishes and an admin account) if MongoDB is empty.
*   **`middleware/authMiddleware.js`:** Contains `protect` (verifies the incoming JWT token in HTTP headers and sets `req.user`) and `admin` (checks if `req.user.isAdmin === true`).
*   **`controllers/authController.js`:** Contains authentication logic. Replaced advanced OTP generation libraries with standard JavaScript random Math functions and handles user profiles and OTP verifications.
*   **`controllers/foodController.js`:** Handles fetching all menu items (including case-insensitive search), fetching individual items by ID, and admin CRUD controls.
*   **`controllers/paymentController.js`:** Integrates the backend with the Razorpay API. Dynamically checks if the order is Cash on Delivery (COD) or Online. If Online, it requests a transaction order and verifies signatures using HMAC SHA-256.
*   **`models/User.js`:** MongoDB schema for users. Includes a pre-save hook that hashes passwords using `bcryptjs` and a schema method `matchPassword` to compare logins.
*   **`models/Food.js`:** Mongoose schema for food items containing name, image, category, price, and stock levels.
*   **`models/Order.js`:** Schema that stores customer reference, items bought, subtotal calculations, payment statuses, and Razorpay transaction IDs.
*   **`utils/emailUtils.js`:** A Nodemailer helper function that configures SMTP connection parameters to send plain text OTP emails.

### 📁 FRONTEND ARCHITECTURE
*   **`src/main.jsx` & `src/App.jsx`:** The entry files that mount React and define client-side URL routes (`react-router-dom`).
*   **`src/context/AuthContext.jsx`:** Wraps the entire application. It manages login and registration API requests and keeps the logged-in user state synchronized across components.
*   **`src/context/CartContext.jsx`:** Manages adding/removing items, quantity adjustments, and calculates tax, delivery fees, and discounts globally.
*   **`src/pages/Home.jsx`:** Renders the landing page, slideshow hero component, search filters, and food grids.
*   **`src/pages/Cart.jsx`:** Shows selected dishes, billing summaries, and links to the checkout page.
*   **`src/pages/Checkout.jsx`:** Offers options for online cards, QR codes, or Cash on Delivery. Launches the Razorpay checkout interface.
*   **`src/pages/OrderTracker.jsx`:** The custom order tracking page. It simulates live delivery statuses using React timers.
*   **`src/components/ui/neon-button.jsx`:** Custom styled button that uses basic conditional logic instead of complex classes variance libraries.

---

## SECTION 3: CORE DATA MODELS (DATABASE SCHEMAS)

Here are the detailed fields of your MongoDB collections:

### 1. User Model (`User.js`)
*   `name` (String, Required): Name of the user.
*   `email` (String, Required, Unique): Email used for auth.
*   `password` (String, Required): Passwords are saved as hashed strings, never in plain text.
*   `isAdmin` (Boolean, Default: false): Distinguishes customers from admins.
*   `isVerified` (Boolean, Default: false): Checks if the email OTP was completed.
*   `otp` (String): Temporary 6-digit OTP code.
*   `otpExpires` (Date): Time stamp when the OTP expires (10 minutes from creation).

### 2. Food Model (`Food.js`)
*   `name` (String, Required)
*   `image` (String, Required): URL link to dish photo.
*   `description` (String, Required)
*   `category` (String, Required): e.g., 'Chinese', 'Indian', 'Burgers'.
*   `price` (Number, Required, Default: 0)
*   `countInStock` (Number, Required, Default: 0)

### 3. Order Model (`Order.js`)
*   `user` (Mongoose Schema ObjectId, Reference: 'User'): Links the order to a customer.
*   `orderItems` (Array): Array of objects containing dish name, qty, image, price, and food ID.
*   `paymentMethod` (String): 'online' or 'cod'.
*   `itemsPrice`, `gstPrice`, `deliveryPrice`, `handlingPrice`, `gatewayPrice`, `discountPrice`, `totalPrice` (Numbers): Full bill breakdown.
*   `isPaid` (Boolean, Default: false): Indicates if the order payment is completed.
*   `paidAt` (Date): Date timestamp of payment.
*   `razorpayOrderId` (String): ID reference matching Razorpay systems.

---

## SECTION 4: 25+ INTERVIEW QUESTIONS WITH DEEP EXPLANATIONS

### 🏛️ CATEGORY A: GENERAL ARCHITECTURE & STACK

#### Q1: Why did you choose the MERN stack for this application?
*   **Deep Explanation:** *"The MERN stack uses JavaScript across the entire development cycle: React on the frontend, Node/Express on the backend, and BSON (Binary JSON) on MongoDB. This unified language stack removes context switching. Node.js uses an asynchronous, event-driven, non-blocking I/O model, making it highly scalable and capable of handling thousands of concurrent requests—ideal for real-time applications like food ordering. MongoDB's schema-less nature matches React's component state structure, allowing us to store nested cart arrays and billing details cleanly without complex SQL tables."*

#### Q2: What is the difference between client-side routing and server-side routing?
*   **Deep Explanation:** *"Server-side routing (like in Express) receives a request URL from the client, processes it, and returns a new document page. In client-side routing (like `react-router-dom` in our app), the server sends only one main page (`index.html`) once. When a user clicks a nav link, React intercept the browser redirect, updates the address bar, and conditionally swaps the current UI component on the page without performing a page reload. This makes transition times feel instant."*

#### Q3: What is the role of the `package.json` file in Node.js?
*   **Deep Explanation:** *"The `package.json` file is the heart of a Node.js project. It holds project metadata (name, version), defines custom scripts (like starting or building the project), and lists project dependencies (production packages like `mongoose`) and devDependencies (development tools like `vite`). It ensures that any developer can run `npm install` and recreate the exact same development environment with identical package versions."*

#### Q4: Why do we use environmental variables (`.env` file) in web applications?
*   **Deep Explanation:** *"Environmental variables keep sensitive configurations (like database connection strings, JWT secrets, and Razorpay private keys) secure. We do not hardcode these keys in our repository, preventing them from being exposed on Github. It also allows us to switch environment parameters (e.g. local test DB vs production database) dynamically without changing the code."*

---

### 🔑 CATEGORY B: AUTHENTICATION, OTP & SECURITY

#### Q5: Walk me through the registration and OTP verification flow in detail.
*   **Deep Explanation:**
    1. *Submission:* The user inputs name, email, and password.
    2. *Validation:* The backend checks if the email already exists in the database. If it exists and is verified, it throws a `400 Bad Request` error.
    3. *Creation:* If new, it creates an unverified user document (`isVerified: false`).
    4. *OTP Code:* The server generates a random 6-digit number using `Math.floor(100000 + Math.random() * 900000)`.
    5. *Database Record:* It stores this OTP and set the expiration time (`otpExpires`) to 10 minutes in the future.
    6. *Nodemailer:* Nodemailer sends the OTP code to the user's email.
    7. *Verification:* The user inputs the OTP. The frontend sends it to `/api/users/verify-otp`. The backend checks if the OTP matches and if `otpExpires > Date.now()`. If valid, it updates the user to `isVerified: true` and issues a JWT token.

#### Q6: How does JWT-based authentication protect routes?
*   **Deep Explanation:** *"When a client makes a request to a protected endpoint (like fetching their profile), they attach their JWT token to the request header: `Authorization: Bearer <token>`. In `authMiddleware.js`, our `protect` middleware intercepts this request. It reads the token, verifies its signature using the secret `process.env.JWT_SECRET`, and extracts the payload (which contains the user's database ID). It then queries MongoDB for that user and appends their user object to `req.user`. Finally, it calls `next()` to pass control to the target controller. If the signature is invalid or has expired, it returns a 401 response."*

#### Q7: What is the difference between Hashing and Encryption?
*   **Deep Explanation:** *"Hashing is a one-way mathematical function. Once a string is hashed (like passwords using Bcrypt), it cannot be decrypted back to its original plain text. The only way to verify a match is to hash the input and compare the hashes. Encryption is a two-way function. It scrambles data into ciphertext, but it can be decrypted back to plain text using a matching key. We hash passwords so that even if database administrators look at the data, they cannot know the user's password."*

#### Q8: What is a Salt in Bcrypt? Why is it important?
*   **Deep Explanation:** *"A salt is random data added to the password input before hashing it. Without a salt, if two users have the same password (e.g., `password123`), their resulting hashes would be identical. An attacker could use pre-computed tables of hashes (Rainbow Tables) to crack passwords. Salting ensures that even if two users choose the same password, they get completely unique hashes."*

#### Q9: Where do you store the JWT token on the frontend, and what are the security trade-offs?
*   **Deep Explanation:** *"In this project, the JWT token is stored in **LocalStorage** using React state synchronization. This is easy to implement and explain for a student project. The trade-off is that LocalStorage is vulnerable to XSS (Cross-Site Scripting) attacks if an attacker runs malicious scripts in the browser. In production apps, storing tokens in `httpOnly` secure Cookies is safer, because JavaScript cannot read them, protecting them from XSS."*

---

### 💳 CATEGORY C: PAYMENTS & RAZORPAY INTEGRATION

#### Q10: Why do we multiply the checkout amount by 100 when sending it to Razorpay?
*   **Deep Explanation:** *"Payment gateways (like Razorpay and Stripe) process amounts in the lowest currency unit (paise for INR, cents for USD) to avoid floating-point math errors. If our total bill is ₹250.50, we multiply it by 100 to get `25050 paise`. Floating-point arithmetic on computers can occasionally cause rounding errors (e.g., `0.1 + 0.2 = 0.30000000000000004`), which is unacceptable for financial transactions."*

#### Q11: Explain how you prevent signature spoofing in payment verification.
*   **Deep Explanation:** *"If verification was done on the client-side, a user could manipulate the browser response to fake a successful payment. To prevent this, Razorpay requires server-side cryptographic verification. Razorpay returns an `order_id`, `payment_id`, and `signature`. Our backend combines the `order_id` and `payment_id` with a vertical bar (`order_id|payment_id`) and hashes it using the HMAC-SHA256 algorithm with our private secret key. If our generated hash matches the signature sent by Razorpay, we know the transaction is genuine."*

#### Q12: How do you handle database failures after a user has paid online?
*   **Deep Explanation:** *"This is a classic payment reconciliation issue. To handle it, we create the order document in the database with status `isPaid: false` **before** opening the Razorpay payment window. Once the payment is verified, we search for that database order and update its status to `true`. If the server crashes during verification, the payment is still completed on Razorpay, but our database order remains `isPaid: false`. During review, we can run reconciliation scripts that check Razorpay's API and update unpaid database orders."*

---

### 🔄 CATEGORY D: STATE MANAGEMENT & REACT FRONTEND

#### Q13: What is the React Context API, and why did you use it instead of Redux?
*   **Deep Explanation:** *"The React Context API provides a way to pass data down the component tree without having to pass props manually at every level (Prop Drilling). For a project of this scale, Context API is cleaner and easier to explain than Redux, which requires boilerplate code (actions, reducers, stores). We created `AuthContext` to share user session data and `CartContext` to share cart updates across the Navbar, Menu cards, Cart, and Checkout pages."*

#### Q14: Explain the difference between `useState` and `useEffect` hooks.
*   **Deep Explanation:**
    *   *`useState`* is used to declare and track local state variables in a functional component. When the state variable updates, React re-renders the component.
    *   *`useEffect`* is used to handle side-effects—actions that interact with the outside world (like fetching data from an API, setting up timers, or reading local storage). It runs after the component renders.

#### Q15: How does the Cart Context prevent data loss when a user refreshes the page?
*   **Deep Explanation:** *"We synchronize the React cart state with the browser's `localStorage`. In `CartContext.jsx`, we initialize the cart state by checking if any data exists in local storage. Whenever a user adds, removes, or modifies items in their cart, we trigger a helper function that updates the state and saves the updated cart array to local storage using `localStorage.setItem('cartItems', JSON.stringify(newCart))`."*

#### Q16: What is the purpose of the `useParams` hook, and where did you use it?
*   **Deep Explanation:** *"The `useParams` hook is provided by `react-router-dom`. It is used to extract dynamic parameters from the current URL path. We used it in `OrderTracker.jsx` to read the dynamic order ID from the URL (`/order-tracker/:id`), allowing us to fetch the correct order details from the database."*

---

### 💽 CATEGORY E: DATABASE & QUERY OPTIMIZATION

#### Q17: What is an Object Document Mapper (ODM)?
*   **Deep Explanation:** *"An ODM (Object Document Mapper) is a library that translates data representation in a database into object representations in application code. Mongoose is the ODM we use to map MongoDB documents to JavaScript objects. It abstracts raw MongoDB queries into readable JavaScript methods like `Food.find()` or `user.save()`."*

#### Q18: How does Mongoose populate references, and what is its SQL equivalent?
*   **Deep Explanation:** *"In MongoDB, collections are separate. In `reviewController.js`, when fetching reviews, we call `.populate('user', 'name email')`. This directs Mongoose to read the `user` ObjectId stored in the Review document, query the User collection for that ID, and replace the ID with the matching user's name and email. In SQL, this is equivalent to performing an `INNER JOIN` between two tables."*

#### Q19: What is the difference between `findById` and `findOne` in Mongoose?
*   **Deep Explanation:**
    *   *`findById(id)`* is a helper query method that specifically searches a collection by its primary key, the `_id` field.
    *   *`findOne(query)`* is a general query method that searches for and returns the first document in the collection that matches any custom filter parameters (e.g. `User.findOne({ email: email })`).

#### Q20: What are MongoDB indexes, and why are they important?
*   **Deep Explanation:** *"Without indexes, if we run a query to find a user by email, MongoDB has to scan every single document in the collection to find a match (Collection Scan). This is slow for large datasets. An index creates a sorted pointer data structure (usually a B-Tree) for a specific field. We mark the `email` field as `unique: true` in our User schema, which automatically creates an index. MongoDB can query the index to find the document instantly."*

---

### 🛠️ CATEGORY F: ERROR HANDLING & DEPLOYMENT

#### Q21: What is the difference between HTTP Status Codes 200, 201, 400, 401, 404, and 500?
*   **Deep Explanation:**
    *   **200 OK:** Request succeeded (e.g., fetched foods successfully).
    *   **201 Created:** Resource successfully created (e.g., added a new review).
    *   **400 Bad Request:** Client sent invalid data (e.g., registration details missing).
    *   **401 Unauthorized:** Missing or invalid authentication token.
    *   **404 Not Found:** Requested resource does not exist.
    *   **500 Internal Server Error:** A backend crash or database connection failure.

#### Q22: How does Node's asynchronous event loop prevent blocking?
*   **Deep Explanation:** *"Node.js runs on a single-thread model. If a database query takes 3 seconds, a multi-threaded server would block a thread waiting for it. Node uses an asynchronous model: it registers the database task with the operating system, passes a callback, and immediately moves to handle other incoming requests. When the database finishes, the callback is added to the Event Loop queue and executed, maximizing server efficiency."*

#### Q23: What does the `process.exit(1)` command do in database connection code?
*   **Deep Explanation:** *"In `db.js`, if the Mongoose database connection fails in the `catch` block, we call `process.exit(1)`. The value `1` tells Node to terminate the application process immediately with an exit code indicating an error. This is important in production because if the database is down, the server cannot function, and it should fail immediately so monitoring scripts can restart it."*

#### Q24: How does Express serve React assets in production vs development?
*   **Deep Explanation:**
    *   *In Development:* The React app runs on a Vite dev server (port 5173) and the Node API runs on port 5000.
    *   *In Production:* We compile React into static files (`npm run build`), which outputs static assets to `frontend/dist`. In `server.js`, we use `express.static` to serve these files directly from Node, hosting the entire MERN stack on a single port.

#### Q25: Why do we use Nodemailer instead of standard HTTP requests to send mail?
*   **Deep Explanation:** *"Web browsers cannot send emails directly. We must route the mail request through an SMTP (Simple Mail Transfer Protocol) server. Nodemailer is a Node.js module that establishes a secure connection to an SMTP server (like Gmail or Mailtrap) using login credentials and transmits the message payload, which is then delivered to the recipient's inbox."*
