# Dobby Drive - Full-Stack Cloud Storage Assignment

Dobby Drive is a full-stack, scalable cloud storage application similar to Google Drive, built as part of the Backend Developer assignment. It allows users to securely manage their files and seamlessly organize them into nested folders. 

## 🚀 Live Links
- **Frontend (Vercel):** [Live Application](https://dobby-ads-assignment-one.vercel.app)
- **Backend API (Render):** [API Endpoint](https://dobby-ads-assignment-93c4.onrender.com)

---

## 🌟 Key Features
- **Secure Authentication:** JWT-based user login and registration system. State protected routes.
- **Nested Folder Structure:** Infinite levels of folder nesting just like a real file system.
- **Image Uploads:** Robust multipart file uploads securely hosted on Cloudinary.
- **Dynamic Size Profiling:** Recursive and automatic calculation of folder sizes displaying exact payload metrics.
- **Deployment Ready:** Vercel frontend properly configured for dynamic SPA routing with full CORS coverage and environment configuration linked securely to Render.

---

## 🛠️ Tech Stack

### Frontend
- **React.js** (Vite)
- **React Router DOM**
- **Axios** (Configured with Centralized Interceptors)
- **Vanilla CSS** (Vibrant UI mapped to sleek dark themes)
- **Lucide Icons**

### Backend
- **Node.js** & **Express.js**
- **MongoDB** (Atlas) & **Mongoose**
- **JWT** (JSON Web Tokens logic for authentication)
- **Cloudinary** (Secure bucket uploads for visual media)
- **Multer** (File upload pipeline logic)

---

## ⚙️ Quick Start (Local Setup)

To run this application locally, you will need a `.env` in both the `frontend` and `backend` directories. 

**Backend (`/backend/.env`)**
```env
PORT=5000
MONGO_URI=your_mongo_db_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

**Frontend (`/frontend/.env`)**
```env
# Don't forget the /api suffix to streamline endpoint consumption!
VITE_API_URL=http://localhost:5000/api
```

Start up both instances:
```bash
# In /backend
npm install
npm dev

# In /frontend
npm install
npm run dev
```

---

*Thank you for reviewing my assignment! Designed and deployed seamlessly emphasizing edge-case protection, modular code architecture, and a production-ready scaling logic.*
