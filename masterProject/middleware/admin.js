import User from "../models/user.js";

export const isAdmin = async (req, res, next) => { 

    try {

        const {userId} = req.user;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!(user.role === "admin")) {
            return res.status(403).json({ message: "Access denied" });
        }
        next();
    } catch (error) {
        res.status(403).json({ message: error.message });
    }
};

