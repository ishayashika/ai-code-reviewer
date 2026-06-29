import {reviewAI} from "../services/aiService.js"
export const reviewCode=async (req,res)=>{
    try{
        const {code,language}=req.body;
        if(!code){
            return res.status(400).json({
                message:"Code is required",
            });
        }
        const review=await reviewAI(code,language);
        return res.status(200).json({
            review,
        });
    }catch (error) {
         console.error("Gemini Error:", JSON.stringify(error, null, 2));

        res.status(500).json({
            message: error.message,
            error: error,
        });
    }
}