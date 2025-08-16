import jwt from 'jsonwebtoken';
import { User } from '../Model/userModel.js';

export const isAuthenticated = async (req, res, next) => {
    console.log('🍪 All cookies received:', req.cookies);
    console.log('🔑 Token cookie specifically:', req.cookies?.token);
    console.log('📋 Raw cookie header:', req.headers.cookie);
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded);

        req.user = await User.findById(decoded._id);
        console.log("👤 User found:", req.user);

        if (!req.user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }

        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};
