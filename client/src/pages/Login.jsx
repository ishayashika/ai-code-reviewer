import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login(){
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [error,setError]=useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate=useNavigate();
    const handleSubmit=async(e)=>{
            e.preventDefault();
            try{
                const response=await api.post("/auth/login",{
                email,
                password,
                });
                console.log(response.data);
                localStorage.setItem("token", response.data.token);
                localStorage.setItem(
                    "user",
                    JSON.stringify(response.data.user)
                );
                setError("");
                setEmail("");
                setPassword("");
                toast.success("Login successful!");
                navigate("/dashboard");
            }catch(error){
                const message = error.response?.data?.message || "Login failed";
                setError(message);
                toast.error(message);
            }  
    };
    return(
        <div className="auth-container">
            <div className="auth-card">
                <h3 className="auth-title">AI Code Reviewer</h3>
                <h4 className="auth-subtitle">
                    Login Your Account
                </h4>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="field-group">
                        <label>
                            Email <span className="required">*</span>
                        </label>
                        <input type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e)=>{
                                setEmail(e.target.value);
                                setError("");
                            }}
                        />
                    </div>
                    <div className="field-group">
                        <label>
                            Password <span className="required">*</span>
                        </label>
                        <div className="password-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEye /> : <FaEyeSlash />}
                            </button>
                        </div>
                    </div>
                    <div className="forgot-password">
                        <Link to="/forgot-password">
                            Forgot Password?
                        </Link>
                    </div>
                    <button type="submit" className="login-btn">Login</button>
                    <div className="auth-footer">
                        Don't have an account?{" "}
                        <Link to="/register">Register</Link>
                    </div>
                </form>
            </div>
        </div>
    ) 
}
export default Login;