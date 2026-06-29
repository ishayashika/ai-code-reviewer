import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../services/authService";
import { toast } from "react-toastify";
import "../styles/Auth.css";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const data = await forgotPassword(email);

            toast.success(data.message);

            sessionStorage.setItem("resetEmail", email);

            navigate("/verify-otp");

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
                    Forgot Password
                </h1>

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >
                    <div className="field-group">
                    <label>
                        Email <span className="required">*</span>
                    </label>
                    <input
                        type="email"
                        placeholder="Enter your registered email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Sending..."
                            : "Send OTP"}
                    </button>
                </form>

            </div>
        </div>
    );
}

export default ForgotPassword;