import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import folderRoutes from "./routes/folderRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/files", fileRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
