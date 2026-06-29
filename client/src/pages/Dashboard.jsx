import { useNavigate } from "react-router-dom";
import { useEffect,useState } from "react";
import api from "../services/api";
import { reviewCode } from "../services/reviewService";
import "../styles/Dashboard.css";
import Header from "../component/Header";
import CodeEditor from "../component/CodeEditor";
import ReviewPanel from "../component/ReviewPanel";
import { toast } from "react-toastify";
import { saveHistory } from "../services/historyService";
import "../styles/Header.css";

function Dashboard(){
    const [code, setCode] = useState("");
    const [review, setReview] = useState("");
    const [loading, setLoading] = useState(false);
    const [language, setLanguage] = useState("javascript");
    const navigate=useNavigate();
    const [user,setUser]=useState(
        JSON.parse(localStorage.getItem("user"))
    );
    const handleReview = async () => {
            if (!code.trim()) {
                toast.warning("Please write some code first.");
                return;
            }
        try {
            setLoading(true);

            const data = await reviewCode(code,language);

            setReview(data.review);
            await saveHistory({
                language,
                code,
                review: data.review,
            });
            console.log("4. History saved");
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };
    const handleLogout=()=>{
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.info("Logged out successfully!");
        navigate("/");
    }
    useEffect(()=>{
        const fetchProfile=async()=>{
            try{
                const token=localStorage.getItem("token");
                const response=await api.get("/auth/profile",{
                    headers:{
                        Authorization:`Bearer ${token}`,
                    },
                });
                setUser(response.data.user);
            }catch(error){
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/");
            }
            
        };
        fetchProfile();
    },[navigate]);
    return (
        <div className="dashboard">
            <Header
                user={user}
                loading={loading}
                handleReview={handleReview}
                handleLogout={handleLogout}
            />
            <div className="editor-review-container">
                {/* Left Panel */}
                <CodeEditor
                    code={code}
                    setCode={setCode}
                    language={language}
                    setLanguage={setLanguage}
                />

                {/* Right Panel */}
                    <ReviewPanel
                        loading={loading}
                        review={review}
                    />
            </div>
        </div>
    );
}
export default Dashboard;