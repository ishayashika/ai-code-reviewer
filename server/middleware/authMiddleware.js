import jwt from "jsonwebtoken";
import User from "../models/User.js";
export const protect=async(req,res,next)=>{
    try{
        // Q. Why do we use req.headers.authorization?
        // Ans: req.headers.authorization is used to read the Authorization header 
        // sent by the client. It usually contains the JWT in the format Bearer 
        // <token>, which the backend verifies before allowing access to protected 
        // routes.
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
        // Q. Why do we write req.user = user?
        // Ans: After verifying the JWT and fetching the user from the database, we 
        // attach the user object to the request. This allows all subsequent middleware
        //  and controllers to access the authenticated user's information without 
        // querying the database again.
        req.user=user;
        // Q. What happens if you forget to call next() in middleware?
        // Ans: If the middleware neither sends a response nor calls next(), the 
        // request remains pending because Express doesn't know whether to continue to
        //  the next middleware/controller or finish the request.
        next();
    }catch(error){
        console.error(error);
        return res.status(401).json({
            message:"Not authorized, invalid token",
        });
    }
    
}
// Q. The server creates a token. But how does it verify that token on future requests?
// Ans: imagine, user login-> get the token->open dashboard->backend receive the token
// ->??? ->dashboard open. "???" is jwt middleware(protected route). jwt middleware 
// checks whether the req is coming from logged-in user or not
// Q. What is Bearer Token?
// Ans: A Bearer Token is an access token sent in the Authorization header. It is 
// standard authentication scheme defined by HTTP
// Q. What is a Protected Route?
// Ans: A protected route is an API that only logged-in users can access.
// Q. How does req.user become available inside the controller?
// Ans: The JWT middleware verifies the token, fetches the authenticated user from 
// MongoDB, and attaches the user object to the request using req.user = user. Since 
// Express passes the same request object to the next middleware or controller, 
// req.user becomes available inside the controller.
// Q. Why don't you query the database again in getProfile()?
// Ans: The JWT middleware already verified the token and fetched the authenticated 
// user from MongoDB. It attached the user to req.user, so querying the database again
//  would be unnecessary and would add extra overhead.
// Q. Why is middleware placed before the controller?
// Ans: Express executes route handlers from left to right. The authentication 
// middleware must run first to verify the JWT. Only after successful verification 
// does it call next(), allowing the controller to execute.