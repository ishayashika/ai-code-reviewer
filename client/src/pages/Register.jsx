import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Register(){
    const [name,setName]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const passwordRules = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    const isPasswordValid =
        passwordRules.length &&
        passwordRules.uppercase &&
        passwordRules.lowercase &&
        passwordRules.number &&
        passwordRules.special;

    
    const [error,setError]=useState("");
    const navigate=useNavigate();
    const handleSubmit=async(e)=>{
        e.preventDefault();
        if (!isPasswordValid) {
            toast.error("Please create a stronger password.");
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }
        try{
            const response=await api.post("/auth/register",{
            name,
            email,
            password,
            });
            toast.success("Registration successful!");
            console.log(response.data);
            setError("");
            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            navigate("/");
        }catch(error){
            const message = error.response?.data?.message || "Registration failed";
            setError(message);
            toast.error(message);
        }    
    };
    return (
    <div className="auth-container">
        <div className="auth-card">
            <h3 className="auth-title">AI Code Reviewer</h3>
            <h4 className="auth-subtitle">
                Create Your Account
            </h4>
            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="field-group">
                    <label>
                        Name <span className="required">*</span>
                    </label>
                    <input type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e)=>setName(e.target.value)}
                        required
                    />
                </div>
                <div className="field-group">
                    <label>
                        Email <span className="required">*</span>
                    </label>
                    <input type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
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
                        />

                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </button>
                    </div>

                    {password && (
                        <p className={isPasswordValid ? "password-valid" : "password-invalid"}>
                            Password should be at least 8 characters and include an uppercase letter,
                            lowercase letter, number and special character.
                        </p>
                    )}
                </div>

                <div className="field-group">
                    <label>
                        Confirm Password <span className="required">*</span>
                    </label>
                    <div className="password-container">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />

                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                        >
                            {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                        </button>
                    </div>

                    {confirmPassword && (
                        <p
                            className={
                                password === confirmPassword
                                    ? "password-valid"
                                    : "password-invalid"
                            }
                        >
                            {password === confirmPassword
                                ? "✓ Passwords match"
                                : "✗ Passwords do not match"}
                        </p>
                    )}
                </div>
                <button type="submit" className="register-btn">Register</button>
                <div className="auth-footer">
                    Already have an account?{" "}
                    <Link to="/">Login</Link>
                </div>
            </form>
        </div>
    </div>
    )
}
export default Register;