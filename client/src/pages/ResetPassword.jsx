import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { resetPassword } from "../services/authService";
import "../styles/Auth.css";

function ResetPassword() {
    const navigate = useNavigate();

    const email = sessionStorage.getItem("resetEmail");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isPasswordValid) {
            toast.error("Please create a stronger password.");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            const data = await resetPassword(email, password);

            toast.success(data.message);

            sessionStorage.removeItem("resetEmail");

            navigate("/");

        } catch (error) {

            const message =
                error.response?.data?.message ||
                "Something went wrong";

            toast.error(message);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">

                <h1 className="auth-title">
                    Reset Password
                </h1>

                <form className="auth-form" onSubmit={handleSubmit}>

                    <div className="field-group">
                    <label>
                        New Password <span className="required">*</span>
                    </label>
                        <div className="password-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>

                        {password && (
                            <p className={isPasswordValid ? "password-valid" : "password-invalid"}>
                                Password must contain at least 8 characters, uppercase, lowercase, number and special character.
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
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                            />

                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
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

                    <button
                        type="submit"
                        className="register-btn"
                        disabled={loading}
                    >
                        {loading
                            ? "Resetting..."
                            : "Reset Password"}
                    </button>

                </form>

            </div>
        </div>
    );
}

export default ResetPassword;