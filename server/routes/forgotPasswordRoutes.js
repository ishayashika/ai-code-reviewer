import express from "express";
import { forgotPassword, verifyOTP, resetPassword} from "../controllers/forgotPasswordController.js";
console.log("Forgot Password Routes Loaded");
const router = express.Router();
router.get("/test", (req, res) => {
    res.json({
        message: "Forgot password route working",
    });
});
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);


export default router;