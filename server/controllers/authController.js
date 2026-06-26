import User from "../models/User.js";//to interact with users table
import bcrypt from "bcryptjs";//to hash the user's pass 
import jwt from "jsonwebtoken";
// before storing in db


//we use async here as db operation takes time like in api 
// call, reading data, db query
export const registerUser=async(req,res)=>{
    //if mongodb crashes or bcrypt.hash() fails, server will
    //  crash as there is no error handling. so will write db
    //  operation inside a try-catch block. with try-catch, 
    // 500 internal server error will be shown
    try{
        const{name,email,password}=req.body;
        if(!name || !email || !password){//if all field's 
            // data is not given by user then 400 status code
            //  error will show
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
        const user=await User.create({//User.create() is a 
            // shortcut that creates a new document and saves
            //  it to MongoDB in one step. "new User()" only 
            // creates the document in memory. To store it in
            //  the database, we must call user.save()
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

//flow
// Client
//    │
//    ▼
// Receive name, email, password
//    │
//    ▼
// Validate input
//    │
//    ▼
// Check duplicate email
//    │
//    ▼
// Hash password
//    │
//    ▼
// Create user in MongoDB
//    │
//    ▼
// Return 201 Created


export const loginUser=async(req,res)=>{
    try{
        const {email,password}=req.body;//no need of name as its already saved in db when user get registered
        if(!email || !password){
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
                id:user._id,
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

// Frontend

// ↓

// POST /api/auth/login

// ↓

// Controller

// ↓

// Find User using Email

// ↓

// Compare Password

// ↓

// Generate JWT

// ↓

// Return Token