# SmartCart – Professional E-Commerce Platform

A full-stack, production-ready e-commerce application built with the MERN stack (MongoDB, Express, React, Node.js).

## 🚀 Features

- **Storefront**: Responsive product browsing with search and categories.
- **Cart System**: Real-time cart management saved across sessions.
- **Authentication**: Secure JWT-based authentication (Login/Register).
- **Orders**: Secure checkout process and order history.
- **Admin Panel**: Backend infrastructure for managing products and viewing orders.
- **Professional UI**: Built with Tailwind CSS, Lucide icons, and Shadcn/UI.

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Motion (Animations)
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB Atlas (Mongoose ODM)
- **Security**: JWT (JSON Web Tokens), Bcrypt.js (Password Hashing)

## 📁 Folder Structure

```text
/server          # Backend source code
  /controllers   # Request handlers
  /models        # Mongoose data schemas
  /routes        # API endpoint definitions
  /middleware    # Auth & Admin protectors
  /utils         # Helper functions
/src             # Frontend source code
  /components    # UI Components (Layout, Auth, Cart)
  /lib           # Utility functions
  App.tsx        # Main application logic
```

## 📝 Setup Instructions

1. **Environment Variables**:
   Update your `.env.example` with your MongoDB URI and a random secret key for JWT.

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Production Build**:
   ```bash
   npm run build
   npm start
   ```

## 🌟 Resume-Ready Improvements

- **Scalable Architecture**: Separated concerns using Controllers and Routes.
- **Type Safety**: Fully typed with TypeScript on both Frontend and Backend.
- **Modern UI**: Implemented glassmorphism and motion-based layout transitions.
- **State Persistence**: Cart and User sessions persist via LocalStorage and Database.
