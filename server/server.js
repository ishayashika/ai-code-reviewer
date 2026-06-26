import express from "express";//will create server and APIs
import dotenv from "dotenv";//to read variables from .env file
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";//all authentication routes are in route folder

dotenv.config();//node.js can't read env variable automatically
//so this line reads .env and load all the variables into process.env

const app = express();//means create one express application

//by default express doesn't understand json so we write the 
// below line of code to tell express that whenever json data 
// comes from client side, convert it into js object
app.use(express.json());//app.use is like installing feature 
// in our app like install json parsing

//wrote db connection code inside db.js file. so instead of 
//writing mongodb.connect(...), we simply import connectDB() 
// which means "go to db.js and connect to mongodb" 
connectDB();

app.use("/api/auth",authRoutes);//register the route

app.get("/", (req, res) => {
    res.send("Server Running");
});

const PORT = process.env.PORT || 5000;


//it starts the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});