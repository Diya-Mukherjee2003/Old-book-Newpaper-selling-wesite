// routes/authRoute.js
import express from 'express';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Auth check route
router.get('/check', isAuthenticated, (req, res) => {
    res.status(200).json({
        success: true,
        loggedIn: true,
        user: req.user
    });
});

export default router;
