# 🚌 RedBus Clone - Bus Booking System

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222222?style=for-the-badge&logo=github&logoColor=white)

A full-stack bus ticket booking platform inspired by RedBus, featuring user authentication, seat selection, booking management, and PDF ticket generation.

## 🌟 Features

- **User Authentication** (Login/Signup with JWT)
- **Bus Search & Filtering** by route, date, and price
- **Interactive Seat Selection** with real-time availability
- **Booking Management** with confirmation emails
- **PDF Ticket Generation** for downloaded/printed tickets
- **Responsive Design** works on mobile & desktop

## 🚀 Features

- ✅ User Authentication (Signup/Login/Logout)
@@ -12,81 +13,83 @@
- 🖨️ Downloadable/Printable Ticket
- 🔒 AuthContext for Global State Management
- 🌐 Responsive UI with Bootstrap
## live DEMO
https://moonlit-kringle-d7ae4e.netlify.app/

## 🛠️ Tech Stack

**Frontend**  
- React.js (Vite)
- React Router
- Bootstrap 5
- AuthContext API

**Backend**  
- Node.js
- Express.js
- MongoDB with Mongoose
- Bcrypt for password hashing
- CORS for secure API calls

## 📁 Project Structure

```bash
redbus-clone/
│
├── backend/                  # Express backend for API & MongoDB
│   ├── models/               # Mongoose schemas (e.g., User.js, Booking.js)
│   ├── routes/               # Route handlers (e.g., auth.js, bookings.js)
│   └── server.js             # Backend entry point and server setup
│
├── src/                      # React frontend
│   ├── components/           # Reusable UI components (Header, SeatSelector, etc.)
│   ├── context/              # Global state using AuthContext
│   ├── pages/                # Page components (Login, Signup, BookingConfirmation)
│   ├── data/                 # Static data (e.g., busData.js)
│   └── App.jsx               # Root component with routing logic
│
├── .env                      # Environment variables (e.g., MongoDB URI)
├── package.json              # NPM project configuration (frontend or full monorepo)
├── README.md                 # Project documentation
└── vite.config.js            # Vite configuration for frontend
```

## 🌐 Running the App Locally

### 🔧 Backend

```bash
cd backend
npm install
# Add .env file with your MongoDB URI
MONGO_URI=your_mongo_uri
node server.js
```
 ### 💻 Frontend
 ```bash
 cd redbus-clone
npm install
npm run dev
```
App runs at: http://localhost:5000 (Vite frontend)
API runs at: http://localhost:5001 or your backend port

### 📸 Screenshots
![alt text](<Screenshot 2025-05-23 150509.png>)
![alt text](<Screenshot 2025-05-23 150520.png>)
![alt text](<Screenshot 2025-05-23 150616.png>)
![alt text](<Screenshot 2025-05-23 150629.png>)
![alt text](image.png)

### 📌 Future Enhancements
- Payment gateway integration

- Admin panel for adding buses

- OTP/email verification

- Filter by time, price, rating

### 🙌 Author
Made with ❤️ by Bethu Dilip
