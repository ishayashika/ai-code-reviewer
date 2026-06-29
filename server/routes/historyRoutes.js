import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { deleteHistory } from "../controllers/historyController.js";
import {
    saveHistory,
    getHistory,
} from "../controllers/historyController.js";

const router = express.Router();

router.post("/", protect, saveHistory);
router.get("/", protect, getHistory);
router.delete("/:id", protect, deleteHistory);

export default router;