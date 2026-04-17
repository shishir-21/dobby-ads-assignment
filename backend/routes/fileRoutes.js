import express from "express";
import { protect } from "../middleware/auth.js";
import upload from "../config/cloudinary.js";
import File from "../models/File.js";

const router = express.Router();

router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    const { name, folderId } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: "No image provided" });
    }

    const file = await File.create({
      name: name || req.file.originalname,
      url: req.file.path,
      size: req.file.size || 0,
      folderId: folderId || null,
      userId: req.user._id,
    });

    res.status(201).json(file);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
