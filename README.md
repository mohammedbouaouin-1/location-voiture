# LocaFès — Car Rental App
A modern and feature-rich Car Rental web application built with React, Node.js, Express, and MongoDB, designed to provide a seamless booking experience across desktop and mobile platforms.

## Features

### Authentication
- Email & Password Authentication
- Role-based Access Control (User & Admin)
- Persistent User Sessions

### Car Browsing
- Browse premium car fleet
- Real-time search functionality
- Detailed specifications (fuel type, gearbox, brand, price)
- Real-time availability checks based on overlapping bookings

### Booking & Checkout
- Interactive date-range picker with price calculation
- Stripe Payment Gateway integration for secure checkout
- Automatic PDF invoice generation and download upon successful booking

### Admin Dashboard
- Overview statistics (total revenue, active bookings, total cars, user count)
- Manage car fleet (add, edit, or soft-delete vehicles)
- Track and update booking statuses (pending, confirmed, completed, cancelled)
- Manage user accounts and roles

### User Experience
- Responsive design tailored for all screen sizes (Mobile, Tablet, Desktop)
- Smooth animated transitions powered by Framer Motion
- Instant feedback with React Hot Toast notifications
- Clean and modern aesthetics

---

## Tech Stack
- **React** (Frontend library)
- **Tailwind CSS** (Modern utility-first styling)
- **Framer Motion** (Fluid UI animations)
- **Node.js & Express** (Scalable backend API)
- **MongoDB & Mongoose** (NoSQL database & object modeling)
- **Stripe** (Secure payment processing)
- **jsPDF & jsPDF AutoTable** (Invoice generation)

---

## Architecture
The application follows a MERN stack architecture, utilizing a RESTful API with an MVC (Model-View-Controller) structure on the backend.

---

## Project Statistics
- 10+ Screens / Views
- 30+ JS/JSX Files
- Cross-platform (Mobile & Desktop)
- Clean and Maintainable Codebase

---

## Installation

### Clone the repository:
```bash
git clone https://github.com/mohammedbouaouin-1/location-voiture.git
cd location-voiture
```

### Install & Run Backend:
```bash
cd backend
# Create a .env file and fill in required variables (MONGO_URI, JWT_SECRET, STRIPE_SECRET_KEY, PORT)
npm install
npm run seed  # Seed the database with 20 default cars
npm run dev   # Start development server
```

### Install & Run Frontend:
```bash
cd ..
# Configure .env file at root (REACT_APP_API_URL)
npm install
npm start     # Start React development server
```

---

## Author
**Mohammed Bouaouin**

LinkedIn: [https://www.linkedin.com/in/mohammed-bouaouin-8a9720360](https://www.linkedin.com/in/mohammed-bouaouin-8a9720360)

GitHub: [https://github.com/mohammedbouaouin-1](https://github.com/mohammedbouaouin-1)
