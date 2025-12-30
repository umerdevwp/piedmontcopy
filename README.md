# PiedmontCopy - Digital Printing & Design Platform

PiedmontCopy is a modern, full-stack web application designed for a professional printing and design service. It features a sleek, user-friendly interface, a robust order management system, and a dynamic theme customization engine.

## 🚀 Tech Stack

### Frontend
- **React 19 (Vite)**: High-performance UI library.
- **TypeScript**: Ensuring type safety and better developer experience.
- **Tailwind CSS**: Modern utility-first styling for a sleek, responsive design.
- **Zustand**: Lightweight, efficient state management.
- **Lucide React**: Beautiful icons for a premium look.
- **Sonner**: High-quality toast notifications.
- **Fabric.js**: Powering the integrated design tool.

### Backend
- **Express.js**: Fast, unopinionated, minimalist web framework for Node.js.
- **Prisma ORM**: Next-generation database toolkit for PostgreSQL/MySQL.
- **PostgreSQL/MySQL**: Robust relational database management.
- **JWT (JSON Web Tokens)**: Secure authentication and authorization.
- **Bcrypt.js**: Industry-standard password hashing.
- **Multer**: Handling multi-part form data for file uploads.
- **Helmet**: Enhancing security by setting various HTTP headers.

## ✨ Key Features
- **Premium Checkout Overhaul**: A professional, multi-step checkout experience.
- **Sandbox Mode**: Toggleable testing environment for secure order flow validation.
- **Dynamic Theme System**: Site-wide customization of primary/accent colors via the Admin Panel.
- **Admin Dashboard**: Comprehensive management of orders, products, services, and users.
- **Interactive Design Tool**: Integrated editor for custom print designs.

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or later)
- npm or yarn
- A running PostgreSQL or MySQL instance

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/umerdevwp/piedmontcopy.git
   cd piedmontcopy
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   # Create a .env file based on .env.example and configure DATABASE_URL
   npx prisma generate
   npx prisma migrate dev
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

## 📜 License
Internal project for PiedmontCopy.
