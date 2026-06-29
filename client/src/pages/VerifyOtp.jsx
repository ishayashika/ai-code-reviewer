import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyOtp } from "../services/authService";
import { toast } from "react-toastify";
import "../styles/Auth.css";

function VerifyOtp() {
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const email = sessionStorage.getItem("resetEmail");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const data = await verifyOtp(email, otp);

            toast.success(data.message);

            navigate("/reset-password");

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
                    Verify OTP
                </h1>

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >
                    <input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Verifying..."
                            : "Verify OTP"}
                    </button>

                </form>

            </div>
        </div>
    );
}

export default VerifyOtp;