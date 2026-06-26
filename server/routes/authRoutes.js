import express from "express";
import { loginUser, registerUser } from "../controllers/authController.js";

const router=express.Router();//create a router

router.post("/register",registerUser);//creates a POST API 
// endpoint for user registration. When a client sends a POST 
// request to /register, Express calls the registerUser 
// controller function to handle the request

router.post("/login",loginUser);
export default router;