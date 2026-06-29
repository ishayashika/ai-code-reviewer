import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        language: {
            type: String,
            required: true,
        },

        code: {
            type: String,
            required: true,
        },

        review: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("History", historySchema);