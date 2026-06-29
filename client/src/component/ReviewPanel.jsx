import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "react-toastify";
import { LuSparkles, LuCopy, LuFileCode2  } from "react-icons/lu";
import "../styles/ReviewPanel.css";

function ReviewPanel({ loading, review }) {
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(review);
            toast.success("Review copied successfully!");
        } catch (err) {
            toast.error("Failed to copy review.");
        }
    };
    return (
        <div className="review-panel">
            <div className="review-header">

                <h2>
                    <LuSparkles />
                    <span>AI Review</span>
                </h2>

                <button
                    className="copy-btn"
                    onClick={handleCopy}
                    disabled={!review}
                >
                    <LuCopy />
                    <span>Copy</span>
                </button>

            </div>

            {loading ? (
                <div className="loading-review">
                    <h3>🤖 Reviewing your code...</h3>

                    <p>
                        AI is analyzing your code quality and generating suggestions.
                    </p>
                </div>
            ) : review ? (
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        code({ inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || "");

                            return !inline && match ? (
                                <SyntaxHighlighter
                                    style={oneDark}
                                    language={match[1]}
                                    PreTag="div"
                                    {...props}
                                >
                                    {String(children).replace(/\n$/, "")}
                                </SyntaxHighlighter>
                            ) : (
                                <code className={className} {...props}>
                                    {children}
                                </code>
                            );
                        },
                    }}
                >
                    {review}
                </ReactMarkdown>
            ) : (
                <div className="empty-review">

                    <LuFileCode2 className="empty-review-icon"/>

                    <h3>No Review Yet</h3>

                    <p>
                        Paste your code into the editor and click
                        <strong> Review Code </strong>
                        to receive AI-powered feedback.
                    </p>

                </div>
            )}
        </div>
    );
}

export default ReviewPanel;
