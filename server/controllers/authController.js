import User from "../models/User.js";//to interact with users table
import bcrypt from "bcryptjs";//to hash the user's pass 
import jwt from "jsonwebtoken";
// before storing in db

export const registerUser=async(req,res)=>{

    try{
        const{name,email,password}=req.body;
        if(!name || !email || !password){
            return res.status(400).json({
                message:"All fields are required"
            });
        }

        //no duplicate account can be created
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({//400 bad req
                message:"User already exists"
            });
        }

        //10 is the salt rounds, higher the no., more secure
        const hashedPassword=await bcrypt.hash(password,10);
        const user=await User.create({
            name,
            email,
            password:hashedPassword,
        });

        //201 means new resource created in users table successfully
        return res.status(201).json({
            message:"User registered successfully",
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
            },
        });
    }catch(error){
        console.error(error);
        res.status(500).json({
            message:"Server Error"
        });
    }
    

}

export const loginUser=async(req,res)=>{
    try{
        //extracting data from req body
        const {email,password}=req.body;//no need of name as its already saved in db 
        // when user get registered
        if(!email || !password){//validation
            return res.status(400).json({
                message:"Email and Password are required",
            });
        }
        //find the user
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message:"Invalid email or password"
            });
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({
                message:"Invalid email or password"
            });
        }

        const token=jwt.sign(
            {id:user._id},//id never change, faster db queries,smaller token
            process.env.JWT_SECRET,
            {
                expiresIn:"7d",
            }
        );

        return res.status(200).json({
            message:"Login successful",
            token,
            user:{
                id:user._id,//we use . here as user is an obj
                name:user.name,
                email:user.email,
            },
        })
    }catch(error){
        console.error(error);
        return res.status(500).json({
            message:"Server Error",
        }); 
    }
    
}


export const getProfile=async(req,res)=>{
    try{
        return res.status(200).json({
            message:"Profile fetched successfully",
            user:{
                id:req.user._id,
                name:req.user.name,
                email:req.user.email,
            },
        });
    }catch(error){
        console.error(error);
        return res.status(500).json({
            message:"Server Error",
        });
    }
}