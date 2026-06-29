import dotenv from "dotenv";
dotenv.config();
import { GoogleGenAI } from "@google/genai";

export const reviewAI = async (code,language) => {
    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
    });
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
            You are a Senior Software Engineer and Code Reviewer.

            Review the following ${language} code thoroughly.

            Return your response in **Markdown** using exactly the following sections.

            ## Overall Rating
            - Give a rating out of 10.
            - Briefly explain the rating in one sentence.

            ## Summary
            - Give a short 2-3 sentence summary of what the code does.
            - Mention whether the code is logically correct.

            ## Issues
            - List bugs, logical mistakes, code smells, or bad practices.
            - If there are no issues, write:
            - None. The code is logically correct.

            ## Improvements
            - Suggest improvements for readability, maintainability, performance, or coding style.
            - Keep the suggestions beginner-friendly.

            ## Best Practices
            - Mention coding best practices relevant to this code.
            - If the code already follows good practices, mention them.

            ## Complexity Analysis
            - Time Complexity
            - Space Complexity
            - Brief explanation of why.

            ## Optimized Code
            Provide an improved version of the code.
            - Preserve the original functionality.
            - Use clean formatting.
            - Add comments only where they improve understanding.

            ## Final Verdict
            Give one of these:
            - Excellent!
            - Very Good
            - Good
            - Needs Improvement

            Keep the review concise, professional, and easy for beginners to understand.

            Code:
            ${code}
            `
    });
    return response.text;
    
};