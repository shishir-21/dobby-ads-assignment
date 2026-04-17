import express from "express";
import { protect } from "../middleware/auth.js";
import Folder from "../models/Folder.js";
import File from "../models/File.js";

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const { name, parentId } = req.body;
    const folder = await Folder.create({
      name,
      parentId: parentId || null,
      userId: req.user._id,
    });
    res.status(201).json(folder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", protect, async (req, res) => {
  try {
    const { parentId } = req.query;
    const query = { userId: req.user._id, parentId: parentId || null };
    
    const folders = await Folder.find(query);
    const files = await File.find({ folderId: parentId || null, userId: req.user._id });
    
    res.json({ folders, files });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const calculateFolderSize = async (folderId) => {
  let size = 0;
  
  // Get all files in this folder
  const files = await File.find({ folderId });
  size += files.reduce((acc, file) => acc + (file.size || 0), 0);
  
  // Get all child folders
  const childFolders = await Folder.find({ parentId: folderId });
  
  // Recursively calculate sizes
  for (const childFolder of childFolders) {
    size += await calculateFolderSize(childFolder._id);
  }
  
  return size;
};

router.get("/:id/size", protect, async (req, res) => {
  try {
    const folderId = req.params.id;
    const folder = await Folder.findOne({ _id: folderId, userId: req.user._id });
    
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }
    
    const size = await calculateFolderSize(folder._id);
    res.json({ size });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
