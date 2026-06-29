import { useEffect, useState } from "react";
import { getHistory } from "../services/historyService";
import ReviewModal from "../component/ReviewModal";
import { deleteHistory } from "../services/historyService";
import { toast } from "react-toastify";
import "../styles/History.css";
import HistoryCard from "../component/HistoryCard";
import { LuSearch, LuFileText } from "react-icons/lu";
import DeleteModal from "../component/DeleteModal";
import { LuArrowLeft } from "react-icons/lu";
import {useNavigate} from "react-router-dom"

function History() {
    const [history, setHistory] = useState([]);
    const [selectedReview, setSelectedReview] = useState(null);
    const [search, setSearch] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedHistoryId, setSelectedHistoryId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate=useNavigate();
    const reviewsPerPage = 5;

    const handleDeleteClick = (id) => {
        setSelectedHistoryId(id);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        try {
            await deleteHistory(selectedHistoryId);

            setHistory((prev) =>
                prev.filter(
                    (item) => item._id !== selectedHistoryId
                )
            );

            toast.success("History deleted successfully!");

            setShowDeleteModal(false);

            setSelectedHistoryId(null);

        } catch (error) {
            console.log(error);

            toast.error("Failed to delete history.");
        }
    };

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await getHistory();
                setHistory(data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchHistory();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const filteredHistory = history.filter((item) => {
        let query = search.toLowerCase().trim();

        if (query === "c++") query = "cpp";

        return (
            item.language?.toLowerCase().includes(query) ||
            item.code?.toLowerCase().includes(query)
        );
    });

    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;

    const currentReviews = filteredHistory.slice(
        indexOfFirstReview,
        indexOfLastReview
    );

    const totalPages = Math.ceil(
        filteredHistory.length / reviewsPerPage
    );

    return (
        <div className="history-container">
            <div className="history-header">
                <div className="history-left-header">
                    <button
                        className="back-btn"
                        onClick={() => navigate("/dashboard")}
                    >
                        <LuArrowLeft size={22} />
                    </button>
                    <div className="history-info">
                        <h1 className="history-title">
                            Review History
                        </h1>

                        <p className="history-count">
                            {filteredHistory.length} Review
                            {filteredHistory.length !== 1 ? "s" : ""} Found:
                        </p>
                    </div>
                </div>

                <div className="history-actions">
                    <input
                        type="text"
                        placeholder="Search language or code..."
                        className="history-search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {filteredHistory.length === 0 ? (
                <div className="empty-history">
                    <h2 className="empty-history-title">
                        {search ? (
                            <>
                                <LuSearch className="empty-icon" />
                                No matching reviews found
                            </>
                        ) : (
                            <>
                                <LuFileText className="empty-icon" />
                                No review history yet
                            </>
                        )}
                    </h2>

                    <p>
                        {search
                            ? "Try searching with a different keyword."
                            : "Generate your first AI review to see it here."}
                    </p>
                </div>
            ) : (
                currentReviews.map((item) => (
                    <HistoryCard
                        key={item._id}
                        history={item}
                        onDelete={handleDeleteClick}
                        onView={(history) =>
                            setSelectedReview(history.review)
                        }
                    />
                ))
            )}
            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() =>
                            setCurrentPage((prev) => prev - 1)
                        }
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>

                    <span>
                        Page {currentPage} of {totalPages || 1}
                    </span>

                    <button
                        onClick={() =>
                            setCurrentPage((prev) => prev + 1)
                        }
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}
            {selectedReview && (
                <ReviewModal
                    review={selectedReview}
                    onClose={() =>
                        setSelectedReview(null)
                    }
                />
            )}
            <DeleteModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onDelete={handleDelete}
                />
        </div>
    );
}

export default History;