import { LuTrash2 } from "react-icons/lu"; 
function DeleteModal({ isOpen, onClose, onDelete }) {
    if (!isOpen) return null;

    return (
        <div className="delete-modal-overlay">
            <div className="delete-modal">
                <h2><LuTrash2 /> Delete Review</h2>

                <p>
                    Are you sure you want to delete this review?
                    <br />
                    This action cannot be undone.
                </p>

                <div className="delete-modal-buttons">
                    <button
                        className="cancel-btn"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button
                        className="confirm-delete-btn"
                        onClick={onDelete}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteModal;