import jwt from "jsonwebtoken";
import User from "../models/User.js";
export const protect=async(req,res,next)=>{
    try{

        const authHeader=req.headers.authorization;//read authorization header
        // if the client doesn't send any token
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({
                message:"Not authorized, no token",
            });
        }
        console.log(authHeader);
        const token=authHeader.split(" ")[1];//extract token
        const decoded=jwt.verify(token,process.env.JWT_SECRET);//verify jwt
        const user=await User.findById(decoded.id);
        if(!user){
            return res.status(401).json({
                message:"User not found",
            });
        }
        
        req.user=user;
       
        next();
    }catch(error){
        console.error(error);
        return res.status(401).json({
            message:"Not authorized, invalid token",
        });
    }
    
}
