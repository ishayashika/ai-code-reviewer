import {
    SiJavascript,
    SiPython,
    SiCplusplus,
    SiC
} from "react-icons/si";
import { FaJava, FaRegCalendarAlt } from "react-icons/fa";

function HistoryCard({ history, onDelete, onView }) {
    const getLanguageIcon = (language) => {
        switch (language?.toLowerCase()) {
            case "javaScript":
                return <SiJavascript color="#F7DF1E" />;

            case "python":
                return <SiPython color="#3776AB" />;

            case "java":
                return <FaJava color="#f89820" />;

            case "cpp":
            case "c++":
                return <SiCplusplus color="#00599C" />;

            case "c":
                return <SiC color="#A8B9CC"/>;

            default:
                return "</>";
        }
    };

    return (
        <div className="history-card">
            <div className="history-left">
                <div className="language-icon">
                    {getLanguageIcon(history.language)}
                </div>

                <span className="language-name">
                    {history.language}
                </span>
            </div>

            <div className="history-middle">
                <p className="history-date">
                    <FaRegCalendarAlt />{" "}
                    {new Date(history.createdAt).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                    })}
                </p>

                <pre>
                    {history.code?.length > 220
                    ? (history.code || "").substring(0, 220) + "..."
                    : history.code}
                </pre>
            </div>

            <div className="history-right">
                <span className="status-badge">
                    ✔ Completed
                </span>

                <button
                    className="view-btn"
                    onClick={() => onView(history)}
                >
                    View Review
                </button>

                <button
                    className="delete-btn"
                    onClick={() => onDelete(history._id)}
                >
                    Delete
                </button>
            </div>
        </div>
    );
}

export default HistoryCard;