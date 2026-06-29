import { useNavigate } from "react-router-dom";
import "../styles/Header.css";
import { LuSparkles, LuHistory, LuLogOut } from "react-icons/lu";
import { PiHandWaving } from "react-icons/pi";

function Header({
    user,
    loading,
    handleReview,
    handleLogout,
}) {
    const userName =
    user?.name?.charAt(0).toUpperCase() +
    user?.name?.slice(1);

    const navigate = useNavigate();
    return (
        <div className="header-container">

            <div className="dashboard-header">

                <div className="user-info">
                    <h2><PiHandWaving className="welcome-icon" /> Welcome, {userName}</h2>

                    <p>
                        Write better code with AI-powered reviews
                    </p>
                </div>

                <div className="button-group">

                    <button
                        onClick={handleReview}
                        disabled={loading}
                        className="review-btn"
                    >
                        <LuSparkles />

                        {loading ? "Reviewing..." : "Review Code"}
                    </button>

                    <button
                        onClick={() => navigate("/history")}
                        className="history-btn"
                    >
                        <LuHistory />
                        History
                    </button>

                    <button
                        onClick={handleLogout}
                        className="logout-btn"
                    >
                        <LuLogOut />
                        Logout
                    </button>

                </div>

            </div>

            <div className="title-section">

                <h1 className="dashboard-title">
                    AI Code Reviewer
                </h1>

                <p className="dashboard-subtitle">
                    Get instant AI-powered feedback on your code
                </p>

            </div>

        </div>
    );
}

export default Header;