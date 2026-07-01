import express from "express";//will create server and APIs
import dotenv from "dotenv";//to read variables from .env file
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";//all authentication routes are in route folder
import cors from "cors";
import reviewRoutes from "./routes/reviewRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";
import forgotPasswordRoutes from "./routes/forgotPasswordRoutes.js";

dotenv.config();//node.js can't read env variable automatically

console.log("SERVER API KEY:", process.env.GEMINI_API_KEY);

const app = express();//means create one express application

app.use(cors());
app.use(express.json());//app.use is like installing feature 
 
connectDB();

app.use("/api/auth",authRoutes);//register the route
app.use("/api/review", reviewRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/auth", forgotPasswordRoutes);

app.get("/", (req, res) => {
    res.send("Server Running");
});

const PORT = process.env.PORT || 5000;


//it starts the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});