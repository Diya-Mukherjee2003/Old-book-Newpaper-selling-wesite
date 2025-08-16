import jwt from 'jsonwebtoken';

export const generateCookie = (user, res, statusCode, message) => {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "10m" });

    res.status(statusCode)
        .cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "None",
            maxAge: 600000
        })
        .json({ success: true, message });
};
