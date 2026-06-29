import History from "../models/History.js";

export const saveHistory = async (req, res) => {
    try {
        const { language, code, review } = req.body;

        const history = await History.create({
            user: req.user._id,
            language,
            code,
            review,
        });

        return res.status(201).json(history);
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Server Error",
        });
    }
};

export const getHistory = async (req, res) => {
    try {
        const history = await History.find({
            user: req.user._id,
        }).sort({
            createdAt: -1,
        });

        return res.status(200).json(history);
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Server Error",
        });
    }
};

export const deleteHistory = async (req, res) => {
    try {
        const history = await History.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!history) {
            return res.status(404).json({
                message: "History not found",
            });
        }

        res.status(200).json({
            message: "History deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};