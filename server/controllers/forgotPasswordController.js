import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";
import bcrypt from "bcryptjs";

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();
        user.otp = otp;
        user.otpExpiry = Date.now() + 5 * 60 * 1000;
        await user.save();
        await sendEmail(
            user.email,
            "Password Reset OTP",
            `Your OTP is ${otp}. It is valid for 5 minutes.`
        );
        res.status(200).json({
            message: "OTP sent successfully",
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Something went wrong",
        });
    }
};

export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (user.otp !== otp) {
            return res.status(400).json({
                message: "Invalid OTP",
            });
        }

        if (user.otpExpiry < Date.now()) {
            return res.status(400).json({
                message: "OTP has expired",
            });
        }
        user.isOtpVerified = true;
        await user.save();
        res.status(200).json({
            message: "OTP verified successfully",
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Something went wrong",
        });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        if (!user.isOtpVerified) {
            return res.status(400).json({
                message: "Please verify OTP first",
            });
        }


        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        user.passwordUpdated = true;
        user.isOtpVerified = false;

        // Clear OTP
        user.otp = undefined;
        user.otpExpiry = undefined;

        await user.save();

        res.status(200).json({
            message: "Password reset successfully",
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Something went wrong",
        });
    }
};