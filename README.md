#  Dobby Drive — Full Stack File Manager

A full-stack web application that allows users to register, log in, create folders, and upload images. Built using modern technologies and deployed on cloud platforms.

---

##  Live Links

* 🔗 Frontend: https://dobby-ads-assignment-one.vercel.app
* 🔗 Backend API: https://dobby-ads-assignment-93c4.onrender.com/api

---

##  Features

* 🔐 User Authentication (Register / Login)
* 📁 Create folders
* 🖼 Upload images (Cloudinary)
* 📂 View files inside folders
* 🔄 Persistent storage using MongoDB
* 🌍 Fully deployed (Vercel + Render)

---

##  Tech Stack

### Frontend (`/frontend`)

* React (Vite)
* Axios
* CSS

### Backend (`/backend`)

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication

### Cloud Services

* MongoDB Atlas (Database)
* Cloudinary (Image Storage)
* Vercel (Frontend Hosting)
* Render (Backend Hosting)

---

##  Project Structure

```bash
dobby-ads-assignment/
│
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── index.js
│   └── mcp.js
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── dist/
│   ├── index.html
│   ├── vite.config.js
│   └── vercel.json
│
├── .gitignore
├── package.json
└── README.md
```

---

##  Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

### Frontend (`frontend/.env`)

```env
VITE_API_URL=https://dobby-ads-assignment-93c4.onrender.com/api
```

---

##  Local Setup

### 1️ Clone Repository

```bash
git clone https://github.com/your-username/dobby-ads-assignment.git
cd dobby-ads-assignment
```

---

### 2️ Run Backend

```bash
cd backend
npm install
npm run dev
```

---

### 3️ Run Frontend

```bash
cd frontend
npm install
npm run dev
```

---

##  API Endpoints

### Auth

* POST `/api/auth/register`
* POST `/api/auth/login`

### Folders

* POST `/api/folders`
* GET `/api/folders`

### Files

* POST `/api/files/upload`
* GET `/api/files`

---

##  Testing Flow

1. Register a new user
2. Login
3. Create a folder
4. Upload an image
5. Refresh dashboard

---

##  Issues Faced & Fixes

*  CORS errors → Fixed via backend configuration
*  API route mismatch → Added `/api` prefix
*  Vercel routing issue → Added `vercel.json`
*  Environment mismatch → Centralized `VITE_API_URL`

---

##  Future Improvements

* Delete files/folders
* Folder hierarchy (nested folders)
* Search functionality
* Drag & drop uploads

---

##  Author

**Shishir Mathur**
B.Tech CSE (Data Science)

---

##  Final Note

This project demonstrates real-world full-stack development including deployment, debugging, and API integration.

---
