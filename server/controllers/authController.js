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
        // Q. how do we know password matches?
        // Ans: first parameter is "password" that user typed. sec parameter is 
        // "user.password" which is the hashed password stored in mongodb. so bcrypt 
        // will compare the pass and return result as true/false. we do not write it 
        // as "password===user.password" as they are completly diff strings and will 
        // always return false.
        // Q. Why do we write "await" before bcrypt.compare()?
        // Ans: As bcrypt.compare() is async fun that return promise. so if we don't 
        // write await then it will not return expected output instead it will return 
        // promise obj.
        if(!isMatch){
            return res.status(400).json({
                message:"Invalid email or password"
            });
        }

        // Q. After the password matches, how does the server remember that the user is 
        // logged in?
        // Ans: The server doesn't actually remember the user. Instead, it gives the 
        // user a JWT after successful login. The user sends that JWT with every 
        // request. Whenever the server receives it, it verifies the token and 
        // identifies the user. That's how authentication works.
        // Q. Why doesn't the server remember the login?
        // Ans: JWT is stateless authentication. The server doesn't store login sessions.
        //  The token itself contains the information needed to identify the user, and 
        // the server only verifies its signature using the secret key
        // Q. What is jwt.sign()?
        // Ans: jwt.sign(payload, secretKey, options). Payload(user_id) is the info 
        // which we want to store inside the token. SecretKey which is stored in .env 
        // file is used to digitally sign the token. optional setting like expiration time.
        // Q. Can users read the data inside a JWT?
        // Ans: Yes, jwt is encoded not encrypted. encode(Base64) changes data into another 
        // format whereas encrypt(RSA) change the data into unreadable form for security.
        // Q. Use of JWT_SECRET?
        // Ans: to sign the token and to verify the token which is coming from client 
        // side
        //Q. Can someone create a fake JWT if they know the payload?
        // Ans: No. Even if someone knows the payload, they cannot generate a valid JWT
        //  without the server's secret key. The signature is created using the payload
        //  and the secret key, and the server verifies that signature before trusting 
        // the token.
        const token=jwt.sign(
            {id:user._id},//id never change, faster db queries,smaller token
            process.env.JWT_SECRET,
            {
                expiresIn:"7d",
            }
        );
        // Q. Why do we return the token?
        //Ans: Because the frontend (React) will save it and send it back with future 
        // requests to access protected routes
        // Q. Why return both token and user?
        // Ans: The token is used for authentication in future requests. The user object 
        // is used by the frontend to display information like the user's name and email 
        // immediately after login.
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